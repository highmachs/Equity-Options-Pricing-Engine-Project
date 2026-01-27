import { users, type User, type InsertUser, optionCalculations, type OptionCalculation, type InsertOptionCalculation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Option Calculations
  saveCalculation(calc: InsertOptionCalculation): Promise<OptionCalculation>;
  getHistory(): Promise<OptionCalculation[]>;
  deleteCalculation(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calculations: Map<number, OptionCalculation>;
  private currentId: number;
  private currentCalcId: number;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.currentId = 1;
    this.currentCalcId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Option Calculations
  async saveCalculation(calc: InsertOptionCalculation): Promise<OptionCalculation> {
    const id = this.currentCalcId++;
    // Add missing properties that might be expected but handled by defaults in memory
    const calculation: OptionCalculation = {
      ...calc,
      id,
      createdAt: new Date(),
      // Ensure all fields from schema are present, even if optional there, they are required in Select type
      // But based on InsertOptionCalculation, some might be missing if they are optional in schema
      // The schema has defaults for isManualSpot quantity etc.
      isManualSpot: calc.isManualSpot ?? false,
      manualSpotPrice: calc.manualSpotPrice ?? null,
      quantity: calc.quantity ?? 1,
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getHistory(): Promise<OptionCalculation[]> {
    return Array.from(this.calculations.values()).sort((a, b) => {
      const timeA = a.createdAt ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt ? b.createdAt.getTime() : 0;
      return timeB - timeA;
    });
  }

  async deleteCalculation(id: number): Promise<void> {
    this.calculations.delete(id);
  }
}

export const storage = new MemStorage();
