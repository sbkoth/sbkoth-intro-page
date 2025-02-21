import type { Project, Profile, InsertProject, InsertProfile } from "@shared/schema";

export interface IStorage {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<Project[]>;
}

export class MemStorage implements IStorage {
  private profile: Profile;
  private projects: Project[];

  constructor() {
    this.profile = {
      id: 1,
      name: "John Doe",
      title: "Full Stack Developer",
      bio: "Passionate developer with expertise in web technologies and system design. I love creating beautiful and functional applications.",
      avatar: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
      socials: {
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        email: "john@example.com"
      }
    };

    this.projects = [
      {
        id: 1,
        title: "Project One",
        description: "A beautiful web application",
        type: "image",
        content: {
          url: "https://images.unsplash.com/photo-1484981138541-3d074aa97716"
        },
        thumbnail: "https://images.unsplash.com/photo-1484981138541-3d074aa97716",
        order: 1
      },
      {
        id: 2,
        title: "Project Two",
        description: "Technical documentation",
        type: "pdf",
        content: {
          url: "https://example.com/sample.pdf"
        },
        thumbnail: "https://images.unsplash.com/photo-1425421669292-0c3da3b8f529",
        order: 2
      },
      {
        id: 3,
        title: "Project Three",
        description: "Presentation deck",
        type: "slides",
        content: {
          slides: [
            "https://images.unsplash.com/photo-1710855492709-aa06902e181c",
            "https://images.unsplash.com/photo-1716788781066-7dbce308bbe0",
            "https://images.unsplash.com/photo-1609921212029-bb5a28e60960"
          ]
        },
        thumbnail: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
        order: 3
      }
    ];
  }

  async getProfile(): Promise<Profile> {
    return this.profile;
  }

  async getProjects(): Promise<Project[]> {
    return this.projects.sort((a, b) => a.order - b.order);
  }
}

export const storage = new MemStorage();
