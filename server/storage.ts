import type { Project, Profile, InsertProject } from "@shared/schema";
import { projects, profile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProfilePhoto(photoUrl: string): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile> {
    const [profileData] = await db.select().from(profile);
    return profileData;
  }

  async getProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProfilePhoto(photoUrl: string): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profile)
      .set({ avatar: photoUrl })
      .returning();
    return updatedProfile;
  }
}

export const storage = new DatabaseStorage();