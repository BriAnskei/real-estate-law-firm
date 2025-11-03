import argon2 from "argon2";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });

    const firstName = "System";
    const lastName = "Administrator";
    const role = "founding-manager/admin";

    // check if admin already exists
    const [existing]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      console.log("✅ Admin already exists, skipping seed.");
      return;
    }

    // insert new admin (manual signup only)
    await pool.query(
      `INSERT INTO users 
        (email, firstName, lastName, role, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [email, firstName, lastName, role, hashedPassword]
    );

    console.log("🌱 Admin account successfully seeded (manual signup).");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    pool.end();
  }
};

seedAdmin();
