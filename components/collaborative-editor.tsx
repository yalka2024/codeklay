'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Code, 
  Save, 
  Share2, 
  Copy,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  websocketService, 
  User, 
  Room, 
  joinRoom, 
  leaveRoom, 
  sendCodeChange, 
  sendCursorMove, 
  sendChatMessage,
  saveFile
} from '@/lib/websocket';
import { useToast } from '@/hooks/use-toast';

interface CollaborativeEditorProps {
  roomId: string;
  initialCode?: string;
  language?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
}

export function CollaborativeEditor({ 
  roomId, 
  initialCode = '// Start coding here...', 
  language = 'javascript' 
}: CollaborativeEditorProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [code, setCode] = useState(initialCode);
  const [room, setRoom] = useState<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, ch: 0 });
  const [otherCursors, setOtherCursors] = useState<Map<string, { line: number; ch: number; user: User }>>(new Map());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user) return;

    const user: User = {
      id: (session.user as any).id || 'anonymous',
      name: session.user.name || 'Anonymous',
      avatar: session.user.image || undefined,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };

    // Connect to WebSocket
    websocketService.connect();
    setConnected(true);

    // Join room
    joinRoom(roomId, user);

    // Set up event listeners
    const handleRoomJoined = (data: { room: Room }) => {
      setRoom(data.room);
      toast({
        title: 'Joined Room',
        description: `Connected to ${data.room.name}`,
      });
    };

    const handleUserJoined = (data: { roomId: string; user: User }) => {
      if (data.roomId === roomId) {
        setRoom(prev => prev ? { ...prev, users: [...prev.users, data.user] } : null);
        toast({
          title: 'User Joined',
          description: `${data.user.name} joined the room`,
        });
      }
    };

    const handleUserLeft = (data: { roomId: string; userId: string }) => {
      if (data.roomId === roomId) {
        setRoom(prev => prev ? { 
          ...prev, 
          users: prev.users.filter(u => u.id !== data.userId) 
        } : null);
        setOtherCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.delete(data.userId);
          return newCursors;
        });
      }
    };

    const handleCodeChange = (data: any) => {
      if (data.roomId === roomId && data.userId !== user.id) {
        // Apply remote changes (simplified - in real implementation, you'd use operational transforms)
        setCode(prev => {
          // This is a simplified merge - in production, use proper diff/merge
          return data.changes || prev;
        });
      }
    };

    const handleCursorMove = (data: any) => {
      if (data.roomId === roomId && data.userId !== user.id) {
        setOtherCursors(prev => {
          const newCursors = new Map(prev);
          const roomUser = room?.users.find(u => u.id === data.userId);
          if (roomUser) {
            newCursors.set(data.userId, {
              line: data.cursor.line,
              ch: data.cursor.ch,
              user: roomUser,
            });
          }
          return newCursors;
        });
      }
    };

    const handleChatMessage = (data: any) => {
      if (data.roomId === roomId) {
        const message: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random()}`,
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: data.timestamp,
        };
        setChatMessages(prev => [...prev, message]);
      }
    };

    websocketService.on('room_joined', handleRoomJoined);
    websocketService.on('user_joined', handleUserJoined);
    websocketService.on('user_left', handleUserLeft);
    websocketService.on('code_change', handleCodeChange);
    websocketService.on('cursor_move', handleCursorMove);
    websocketService.on('chat_message', handleChatMessage);

    return () => {
      websocketService.off('room_joined', handleRoomJoined);
      websocketService.off('user_joined', handleUserJoined);
      websocketService.off('user_left', handleUserLeft);
      websocketService.off('code_change', handleCodeChange);
      websocketService.off('cursor_move', handleCursorMove);
      websocketService.off('chat_message', handleChatMessage);
      leaveRoom(roomId);
      websocketService.disconnect();
    };
  }, [session, roomId, toast]);

  useEffect(() => {
    // Scroll chat to bottom when new messages arrive
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Send change to other users
    sendCodeChange(roomId, 'main', newCode);
  };

  const handleCursorMove = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    const cursorPosition = textarea.selectionStart;
    const lines = textarea.value.split('\n');
    let line = 1;
    let ch = cursorPosition;
    
    for (let i = 0; i < lines.length; i++) {
      if (ch <= lines[i].length) {
        line = i + 1;
        break;
      }
      ch -= lines[i].length + 1;
    }
    
    setCursorPosition({ line, ch });
    sendCursorMove(roomId, { line, ch });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !session?.user) return;
    
    sendChatMessage(roomId, newMessage);
    setNewMessage('');
  };

  const handleSave = () => {
    saveFile(roomId, 'main', code);
    toast({
      title: 'File Saved',
      description: 'Code has been saved to the workspace',
    });
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: 'Room ID Copied',
      description: 'Share this ID with your team members',
    });
  };

  const getCursorIndicator = (cursor: { line: number; ch: number }, user: User) => {
    return (
      <div
        key={user.id}
        className="absolute w-0.5 h-5 bg-current opacity-80"
        style={{
          color: user.color,
          left: `${cursor.ch * 8}px`,
          top: `${(cursor.line - 1) * 20}px`,
        }}
      >
        <div className="absolute -top-6 left-0 bg-current text-white text-xs px-1 py-0.5 rounded">
          {user.name}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">Collaborative Editor</CardTitle>
              <Badge variant={connected ? 'default' : 'secondary'} className="flex items-center gap-1">
                {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyRoomId}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Room
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          <CardDescription>
            Room: {roomId} • {room?.users.length || 0} users online
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex-1 flex gap-4">
        {/* Main Editor */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat ({chatMessages.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      value={code}
                      onChange={handleCodeChange}
                      onSelect={handleCursorMove}
                      className="font-mono text-sm min-h-[400px] resize-none"
                      placeholder="Start coding here..."
                    />
                    {/* Cursor indicators */}
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from(otherCursors.values()).map(({ line, ch, user }) =>
                        getCursorIndicator({ line, ch }, user)
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col h-[400px]">
                    <ScrollArea className="flex-1 mb-4" ref={chatRef}>
                      <div className="space-y-3">
                        {chatMessages.map((message) => (
                          <div key={message.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.userName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{message.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{message.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Users Panel */}
        <div className="w-64">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Online Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {room?.users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback style={{ backgroundColor: user.color }}>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {otherCursors.has(user.id) ? 'Typing...' : 'Online'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 