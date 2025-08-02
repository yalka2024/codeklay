// Collaboration Context for CodePal
// Provides real-time collaboration features

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  websocketClient, 
  CollaborationUser, 
  CodeUpdate, 
  ChatMessage, 
  FileOperation, 
  ProjectState 
} from '../lib/websocket';

interface CollaborationContextType {
  isConnected: boolean;
  isConnecting: boolean;
  currentProjectId: string | null;
  currentUserId: string | null;
  users: CollaborationUser[];
  chatMessages: ChatMessage[];
  projectState: ProjectState | null;
  connect: (projectId: string, token: string, userId: string) => Promise<void>;
  disconnect: () => void;
  joinProject: (projectId: string) => void;
  leaveProject: () => void;
  sendCodeUpdate: (update: Omit<CodeUpdate, 'userId' | 'timestamp'>) => void;
  sendCursorUpdate: (cursor: CollaborationUser['cursor']) => void;
  sendPresenceUpdate: (presence: CollaborationUser['presence']) => void;
  sendChatMessage: (content: string, type?: ChatMessage['type']) => void;
  sendFileOperation: (operation: Omit<FileOperation, 'userId' | 'timestamp'>) => void;
  requestProjectState: () => void;
  getConnectionStatus: () => {
    connected: boolean;
    connecting: boolean;
    reconnectAttempts: number;
  };
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<CollaborationUser[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [projectState, setProjectState] = useState<ProjectState | null>(null);

  useEffect(() => {
    // Set up event listeners
    const handleConnected = (data: { userId: string; projectId: string }) => {
      setIsConnected(true);
      setIsConnecting(false);
      setCurrentUserId(data.userId);
      setCurrentProjectId(data.projectId);
    };

    const handleDisconnected = (data: { reason: string }) => {
      setIsConnected(false);
      setIsConnecting(false);
      console.log('Disconnected from collaboration:', data.reason);
    };

    const handleUserJoined = (user: CollaborationUser) => {
      setUsers(prev => {
        const existing = prev.find(u => u.id === user.id);
        if (existing) {
          return prev.map(u => u.id === user.id ? user : u);
        }
        return [...prev, user];
      });
    };

    const handleUserLeft = (data: { userId: string; timestamp: Date }) => {
      setUsers(prev => prev.filter(u => u.id !== data.userId));
    };

    const handleCursorUpdate = (data: { userId: string; cursor: CollaborationUser['cursor'] }) => {
      setUsers(prev => prev.map(user => 
        user.id === data.userId 
          ? { ...user, cursor: data.cursor }
          : user
      ));
    };

    const handlePresenceUpdate = (data: { userId: string; presence: CollaborationUser['presence'] }) => {
      setUsers(prev => prev.map(user => 
        user.id === data.userId 
          ? { ...user, presence: data.presence, lastSeen: new Date() }
          : user
      ));
    };

    const handleCodeUpdate = (update: CodeUpdate) => {
      // Handle code updates - this would typically update the editor
      console.log('Code update received:', update);
    };

    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    };

    const handleFileOperation = (operation: FileOperation) => {
      // Handle file operations - this would typically update the file explorer
      console.log('File operation received:', operation);
    };

    const handleProjectState = (state: ProjectState) => {
      setProjectState(state);
      setUsers(state.users);
      setChatMessages(state.chatHistory);
    };

    const handleError = (data: { message: string; code?: string }) => {
      console.error('Collaboration error:', data);
    };

    // Register event handlers
    websocketClient.on('connected', handleConnected);
    websocketClient.on('disconnected', handleDisconnected);
    websocketClient.on('user-joined', handleUserJoined);
    websocketClient.on('user-left', handleUserLeft);
    websocketClient.on('cursor-update', handleCursorUpdate);
    websocketClient.on('presence-update', handlePresenceUpdate);
    websocketClient.on('code-update', handleCodeUpdate);
    websocketClient.on('chat-message', handleChatMessage);
    websocketClient.on('file-operation', handleFileOperation);
    websocketClient.on('project-state', handleProjectState);
    websocketClient.on('error', handleError);

    // Cleanup on unmount
    return () => {
      websocketClient.off('connected', handleConnected);
      websocketClient.off('disconnected', handleDisconnected);
      websocketClient.off('user-joined', handleUserJoined);
      websocketClient.off('user-left', handleUserLeft);
      websocketClient.off('cursor-update', handleCursorUpdate);
      websocketClient.off('presence-update', handlePresenceUpdate);
      websocketClient.off('code-update', handleCodeUpdate);
      websocketClient.off('chat-message', handleChatMessage);
      websocketClient.off('file-operation', handleFileOperation);
      websocketClient.off('project-state', handleProjectState);
      websocketClient.off('error', handleError);
    };
  }, []);

  const connect = async (projectId: string, token: string, userId: string) => {
    setIsConnecting(true);
    try {
      await websocketClient.connect(projectId, token, userId);
    } catch (error) {
      setIsConnecting(false);
      throw error;
    }
  };

  const disconnect = () => {
    websocketClient.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
    setCurrentProjectId(null);
    setCurrentUserId(null);
    setUsers([]);
    setChatMessages([]);
    setProjectState(null);
  };

  const joinProject = (projectId: string) => {
    websocketClient.joinProject(projectId);
  };

  const leaveProject = () => {
    websocketClient.leaveProject();
  };

  const sendCodeUpdate = (update: Omit<CodeUpdate, 'userId' | 'timestamp'>) => {
    websocketClient.sendCodeUpdate(update);
  };

  const sendCursorUpdate = (cursor: CollaborationUser['cursor']) => {
    websocketClient.sendCursorUpdate(cursor);
  };

  const sendPresenceUpdate = (presence: CollaborationUser['presence']) => {
    websocketClient.sendPresenceUpdate(presence);
  };

  const sendChatMessage = (content: string, type: ChatMessage['type'] = 'message') => {
    websocketClient.sendChatMessage(content, type);
  };

  const sendFileOperation = (operation: Omit<FileOperation, 'userId' | 'timestamp'>) => {
    websocketClient.sendFileOperation(operation);
  };

  const requestProjectState = () => {
    websocketClient.requestProjectState();
  };

  const getConnectionStatus = () => {
    return websocketClient.getConnectionStatus();
  };

  const value: CollaborationContextType = {
    isConnected,
    isConnecting,
    currentProjectId,
    currentUserId,
    users,
    chatMessages,
    projectState,
    connect,
    disconnect,
    joinProject,
    leaveProject,
    sendCodeUpdate,
    sendCursorUpdate,
    sendPresenceUpdate,
    sendChatMessage,
    sendFileOperation,
    requestProjectState,
    getConnectionStatus,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
} 