/**
 * Seed Script for Test Users
 * 
 * This script is meant to be run ONCE to seed test users into the database.
 * It's NOT run during normal server startup.
 * 
 * Usage:
 * npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./Model/user');

const testUsers = [
  { userName: 'Test User1', email: 'test@user1.com', password: 'password123' },
  { userName: 'Test User2', email: 'test@user2.com', password: 'password123' },
  { userName: 'Test User3', email: 'test@user3.com', password: 'password123' },
  { userName: 'Test User4', email: 'test@user4.com', password: 'password123' },
  { userName: 'Test User5', email: 'test@user5.com', password: 'password123' },
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Seed each test user
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = new User({
          userName: userData.userName,
          email: userData.email,
          password: hashedPassword,
        });

        await newUser.save();
        console.log(`✅ User ${userData.email} created successfully`);
      } else {
        console.log(`⚠️ User ${userData.email} already exists - skipping`);
      }
    }

    console.log('\n✅ Seeding complete!');
    console.log('\nTest Accounts:');
    testUsers.forEach(user => {
      console.log(`  - Email: ${user.email}, Password: ${user.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedUsers();
