import type { Project, Profile, BlogPost, InsertProject } from "@shared/schema";
import { projects, profile, blogPosts } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  createProject(project: InsertProject): Promise<Project>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile> {
    const [profileData] = await db.select().from(profile);
    return profileData;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getProjects(): Promise<Project[]> {
    return db.select()
      .from(projects)
      .orderBy(projects.order);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }
}

export const storage = new DatabaseStorage();