import { 
  User, 
  InsertUser, 
  Session, 
  InsertSession, 
  ActivityLog, 
  InsertActivityLog 
} from "@shared/schema";
import { randomBytes } from "crypto";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByProviderAndEmail(provider: string, email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSession(userId: number): Promise<User | undefined>;
  updateUserToken(userId: number, token: string): Promise<User | undefined>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<void>;
  
  // Activity log methods
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getUserActivityLogs(userId: number): Promise<ActivityLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private usersByUsername: Map<string, number>;
  private usersByProviderEmail: Map<string, number>;
  private sessions: Map<string, Session>;
  private activityLogs: Map<number, ActivityLog>;
  
  currentUserId: number;
  currentSessionId: number;
  currentActivityLogId: number;

  constructor() {
    this.users = new Map();
    this.usersByUsername = new Map();
    this.usersByProviderEmail = new Map();
    this.sessions = new Map();
    this.activityLogs = new Map();
    
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentActivityLogId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const userId = this.usersByUsername.get(username);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }
  
  async getUserByProviderAndEmail(provider: string, email: string): Promise<User | undefined> {
    const key = `${provider}:${email}`;
    const userId = this.usersByProviderEmail.get(key);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
      avatar: null,
      provider: null,
      providerId: null,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      scopes: null,
      metadata: null
    };
    
    this.users.set(id, user);
    this.usersByUsername.set(user.username, id);
    
    if (user.provider && user.email) {
      const key = `${user.provider}:${user.email}`;
      this.usersByProviderEmail.set(key, id);
    }
    
    return user;
  }
  
  async updateUserSession(userId: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      tokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserToken(userId: number, token: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      accessToken: token,
      tokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Session methods
  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    
    this.sessions.set(session.token, session);
    return session;
  }
  
  async getSessionByToken(token: string): Promise<Session | undefined> {
    return this.sessions.get(token);
  }
  
  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }
  
  // Activity log methods
  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentActivityLogId++;
    const log: ActivityLog = {
      ...insertLog,
      id,
      createdAt: new Date(),
      userAgent: insertLog.userAgent ?? null,
      ipAddress: insertLog.ipAddress ?? null
    };
    
    this.activityLogs.set(id, log);
    return log;
  }
  
  async getUserActivityLogs(userId: number): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
