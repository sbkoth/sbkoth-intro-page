import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull(),
  socials: jsonb("socials").$type<{
    github?: string;
    linkedin?: string;
    twitter?: string;
    email: string;
  }>().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["image", "pdf", "slides", "text"] }).notNull(),
  content: jsonb("content").notNull(),
  thumbnail: text("thumbnail").notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });

export type Project = typeof projects.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;