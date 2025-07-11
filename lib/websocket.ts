import { io, Socket } from 'socket.io-client';

export interface CollaborationEvent {
  type: 'code_change' | 'cursor_move' | 'user_join' | 'user_leave' | 'chat_message' | 'file_save';
  userId: string;
  userName: string;
  roomId: string;
  data: any;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { line: number; ch: number };
  color: string;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  files: string[];
  lastActivity: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private rooms: Map<string, Room> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Handle connection events
    this.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    });

    this.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Handle room events
    this.on('room_joined', (data: { room: Room }) => {
      this.rooms.set(data.room.id, data.room);
      this.emit('room_joined', data);
    });

    this.on('room_left', (data: { roomId: string }) => {
      this.rooms.delete(data.roomId);
      this.emit('room_left', data);
    });

    this.on('user_joined', (data: { roomId: string; user: User }) => {
      const room = this.rooms.get(data.roomId);
      if (room) {
        room.users.push(data.user);
        this.emit('user_joined', data);
      }
    });

    this.on('user_left', (data: { roomId: string; userId: string }) => {
      const room = this.rooms.get(data.roomId);
      if (room) {
        room.users = room.users.filter(u => u.id !== data.userId);
        this.emit('user_left', data);
      }
    });

    // Handle collaboration events
    this.on('code_change', (data: CollaborationEvent) => {
      this.emit('code_change', data);
    });

    this.on('cursor_move', (data: CollaborationEvent) => {
      this.emit('cursor_move', data);
    });

    this.on('chat_message', (data: CollaborationEvent) => {
      this.emit('chat_message', data);
    });

    this.on('file_save', (data: CollaborationEvent) => {
      this.emit('file_save', data);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  connect(token?: string) {
    if (this.socket?.connected) {
      return;
    }

    const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
    this.socket = io(url, {
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'],
      reconnection: false, // We'll handle reconnection manually
    });

    this.setupEventHandlers();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string, user: User) {
    if (!this.socket?.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.socket.emit('join_room', { roomId, user });
  }

  leaveRoom(roomId: string) {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('leave_room', { roomId });
  }

  sendCodeChange(roomId: string, fileId: string, changes: any) {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('code_change', {
      roomId,
      fileId,
      changes,
      timestamp: Date.now(),
    });
  }

  sendCursorMove(roomId: string, cursor: { line: number; ch: number }) {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('cursor_move', {
      roomId,
      cursor,
      timestamp: Date.now(),
    });
  }

  sendChatMessage(roomId: string, message: string) {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('chat_message', {
      roomId,
      message,
      timestamp: Date.now(),
    });
  }

  saveFile(roomId: string, fileId: string, content: string) {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('file_save', {
      roomId,
      fileId,
      content,
      timestamp: Date.now(),
    });
  }

  on(event: string, handler: Function) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);

    // Also set up socket.io event listener
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  off(event: string, handler?: Function) {
    if (handler) {
      const handlers = this.eventHandlers.get(event) || [];
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    } else {
      this.eventHandlers.delete(event);
    }

    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();

// Convenience functions
export const connectWebSocket = (token?: string) => websocketService.connect(token);
export const disconnectWebSocket = () => websocketService.disconnect();
export const joinRoom = (roomId: string, user: User) => websocketService.joinRoom(roomId, user);
export const leaveRoom = (roomId: string) => websocketService.leaveRoom(roomId);
export const sendCodeChange = (roomId: string, fileId: string, changes: any) => 
  websocketService.sendCodeChange(roomId, fileId, changes);
export const sendCursorMove = (roomId: string, cursor: { line: number; ch: number }) => 
  websocketService.sendCursorMove(roomId, cursor);
export const sendChatMessage = (roomId: string, message: string) => 
  websocketService.sendChatMessage(roomId, message);
export const saveFile = (roomId: string, fileId: string, content: string) => 
  websocketService.saveFile(roomId, fileId, content); 