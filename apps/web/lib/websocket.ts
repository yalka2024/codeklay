// WebSocket Client for CodePal Real-time Collaboration
// Handles real-time code editing, chat, and presence tracking

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  cursor?: {
    x: number;
    y: number;
    line: number;
    column: number;
  };
  presence: 'online' | 'away' | 'offline';
  lastSeen: Date;
}

export interface CodeUpdate {
  projectId: string;
  filePath: string;
  content: string;
  userId: string;
  timestamp: Date;
  operation: 'insert' | 'delete' | 'replace';
  position?: {
    line: number;
    column: number;
  };
  length?: number;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system' | 'code';
}

export interface FileOperation {
  projectId: string;
  filePath: string;
  operation: 'create' | 'delete' | 'rename' | 'move';
  userId: string;
  timestamp: Date;
  oldPath?: string;
  newPath?: string;
}

export interface ProjectState {
  id: string;
  name: string;
  files: {
    path: string;
    content: string;
    lastModified: Date;
  }[];
  users: CollaborationUser[];
  chatHistory: ChatMessage[];
}

type WebSocketEventMap = {
  'user-joined': CollaborationUser;
  'user-left': { userId: string; timestamp: Date };
  'cursor-update': { userId: string; cursor: CollaborationUser['cursor'] };
  'presence-update': { userId: string; presence: CollaborationUser['presence'] };
  'code-update': CodeUpdate;
  'chat-message': ChatMessage;
  'file-operation': FileOperation;
  'project-state': ProjectState;
  'error': { message: string; code?: string };
  'connected': { userId: string; projectId: string };
  'disconnected': { reason: string };
};

type WebSocketEventHandler<T extends keyof WebSocketEventMap> = (data: WebSocketEventMap[T]) => void;

class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private projectId: string | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<keyof WebSocketEventMap, WebSocketEventHandler<any>[]> = new Map();
  private isConnecting = false;
  private isConnected = false;

  constructor(url: string = 'ws://localhost:3001') {
    this.url = url;
  }

  // Connect to WebSocket server
  async connect(projectId: string, token: string, userId: string): Promise<void> {
    if (this.isConnecting || this.isConnected) {
      return;
    }

    this.isConnecting = true;
    this.projectId = projectId;
    this.token = token;
    this.userId = userId;

    try {
      const wsUrl = `${this.url}/collaboration?projectId=${projectId}&token=${token}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected', { userId, projectId });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.isConnecting = false;
        this.emit('disconnected', { reason: event.reason || 'Connection closed' });

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', { message: 'WebSocket connection error' });
      };

    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect to WebSocket:', error);
      throw error;
    }
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'User disconnected');
      this.socket = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.projectId = null;
    this.token = null;
    this.userId = null;
  }

  // Check if connected
  isConnectedToServer(): boolean {
    return this.isConnected && this.socket?.readyState === WebSocket.OPEN;
  }

  // Send message to server
  private send(event: string, data: any): void {
    if (!this.isConnectedToServer()) {
      console.warn('WebSocket not connected, cannot send message');
      return;
    }

    const message = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.socket!.send(JSON.stringify(message));
  }

  // Handle incoming messages
  private handleMessage(message: any): void {
    const { event, data } = message;
    
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.projectId && this.token && this.userId) {
        this.connect(this.projectId, this.token, this.userId).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  // Event handling
  on<T extends keyof WebSocketEventMap>(event: T, handler: WebSocketEventHandler<T>): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off<T extends keyof WebSocketEventMap>(event: T, handler: WebSocketEventHandler<T>): void {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit<T extends keyof WebSocketEventMap>(event: T, data: WebSocketEventMap[T]): void {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event)!;
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Collaboration methods

  // Join a project
  joinProject(projectId: string): void {
    this.send('join-project', { projectId });
  }

  // Leave a project
  leaveProject(): void {
    this.send('leave-project', { projectId: this.projectId });
  }

  // Send code update
  sendCodeUpdate(update: Omit<CodeUpdate, 'userId' | 'timestamp'>): void {
    this.send('code-update', {
      ...update,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    });
  }

  // Send cursor update
  sendCursorUpdate(cursor: CollaborationUser['cursor']): void {
    this.send('cursor-update', {
      userId: this.userId,
      cursor,
      timestamp: new Date().toISOString(),
    });
  }

  // Send presence update
  sendPresenceUpdate(presence: CollaborationUser['presence']): void {
    this.send('presence-update', {
      userId: this.userId,
      presence,
      timestamp: new Date().toISOString(),
    });
  }

  // Send chat message
  sendChatMessage(content: string, type: ChatMessage['type'] = 'message'): void {
    this.send('chat-message', {
      projectId: this.projectId,
      userId: this.userId,
      content,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  // Send file operation
  sendFileOperation(operation: Omit<FileOperation, 'userId' | 'timestamp'>): void {
    this.send('file-operation', {
      ...operation,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    });
  }

  // Request project state
  requestProjectState(): void {
    this.send('get-project-state', { projectId: this.projectId });
  }

  // Utility methods

  // Get current project ID
  getCurrentProjectId(): string | null {
    return this.projectId;
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.userId;
  }

  // Get connection status
  getConnectionStatus(): {
    connected: boolean;
    connecting: boolean;
    reconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  // Clear all event handlers
  clearEventHandlers(): void {
    this.eventHandlers.clear();
  }

  // Get active users count (if available)
  getActiveUsersCount(): number {
    // This would need to be implemented based on the server's user tracking
    return 0;
  }
}

// Create singleton instance
export const websocketClient = new WebSocketClient();

// Export types
export type {
  CollaborationUser,
  CodeUpdate,
  ChatMessage,
  FileOperation,
  ProjectState,
  WebSocketEventMap,
  WebSocketEventHandler,
}; 