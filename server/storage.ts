import { type ArtistInfo, type TourDate } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getArtistInfo(): Promise<ArtistInfo>;
  getTourDates(): Promise<TourDate[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private artistInfo: ArtistInfo;
  private tourDates: TourDate[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Initialize artist info
    this.artistInfo = {
      id: 1,
      name: "AURA VOX",
      bio: "AURA VOX is the electronic music project of Alex Vega, a producer and performer known for creating immersive audio experiences that blend atmospheric soundscapes with driving beats. Based in Berlin, AURA VOX has been pushing the boundaries of electronic music since 2018.",
      location: "Berlin, Germany",
      since: 2018,
      monthlyListeners: 500000,
      releases: 42,
      countriesVisited: 23,
      genres: ["Electronic", "Ambient", "Techno", "Downtempo", "Experimental"],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Initialize tour dates
    this.tourDates = [
      {
        id: 1,
        date: new Date("2023-11-15"),
        venue: "Club Pulse",
        location: "Berlin, Germany",
        ticketLink: "https://example.com/tickets/1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        date: new Date("2023-12-03"),
        venue: "Warehouse 34",
        location: "London, UK",
        ticketLink: "https://example.com/tickets/2",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        date: new Date("2023-12-18"),
        venue: "Le Circuit",
        location: "Paris, France",
        ticketLink: "https://example.com/tickets/3",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        date: new Date("2024-01-22"),
        venue: "Sonic Space",
        location: "Amsterdam, Netherlands",
        ticketLink: "https://example.com/tickets/4",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getArtistInfo(): Promise<ArtistInfo> {
    return this.artistInfo;
  }
  
  async getTourDates(): Promise<TourDate[]> {
    return this.tourDates;
  }
}

export const storage = new MemStorage();
