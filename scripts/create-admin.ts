import bcrypt from "bcryptjs";
import { db } from "../server/db";
import { adminUsers } from "@shared/schema";

async function createAdmin() {
  const password = await bcrypt.hash("admin123", 10);
  
  try {
    await db.insert(adminUsers).values({
      username: "admin",
      password
    }).onConflictDoNothing();
    
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
  
  process.exit();
}

createAdmin();
