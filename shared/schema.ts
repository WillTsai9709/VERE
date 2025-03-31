import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Artist information schema
export const artistInfo = pgTable("artist_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  location: text("location").notNull(),
  since: integer("since").notNull(),
  monthlyListeners: integer("monthly_listeners"),
  releases: integer("releases"),
  countriesVisited: integer("countries_visited"),
  genres: text("genres").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertArtistInfoSchema = createInsertSchema(artistInfo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Tour dates schema
export const tourDates = pgTable("tour_dates", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  location: text("location").notNull(),
  ticketLink: text("ticket_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTourDateSchema = createInsertSchema(tourDates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Cached Spotify data
export const spotifyCache = pgTable("spotify_cache", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  data: text("data").notNull(), // JSON stringified
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cached YouTube data
export const youtubeCache = pgTable("youtube_cache", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  data: text("data").notNull(), // JSON stringified
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cached Instagram data
export const instagramCache = pgTable("instagram_cache", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  data: text("data").notNull(), // JSON stringified
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ArtistInfo = typeof artistInfo.$inferSelect;
export type InsertArtistInfo = z.infer<typeof insertArtistInfoSchema>;

export type TourDate = typeof tourDates.$inferSelect;
export type InsertTourDate = z.infer<typeof insertTourDateSchema>;

export type SpotifyCache = typeof spotifyCache.$inferSelect;
export type YoutubeCache = typeof youtubeCache.$inferSelect;
export type InstagramCache = typeof instagramCache.$inferSelect;
