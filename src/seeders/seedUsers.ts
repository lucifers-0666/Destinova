// mongoose imported via connectDB
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { connectDatabase } from '../config/db.js';

dotenv.config();

// Admin and sample users for testing
const createUsers = async () => {
  // Hash passwords
  const saltRounds = 12;
  const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
  const userPassword = await bcrypt.hash('User@123', saltRounds);

  const users = [
    // ============ ADMIN USER ============
    {
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@destinova.com',
      password: adminPassword,
      phone: '+91-9000000001',
      role: 'admin',
      isVerified: true,
      verificationToken: null,
      profilePicture: 'https://ui-avatars.com/api/?name=System+Administrator&background=6366f1&color=fff',
      loyaltyPoints: 100000,
      loyaltyTier: 'platinum',
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: true,
          marketing: false
        },
        seatPreference: 'window',
        mealPreference: 'vegetarian'
      },
      passportDetails: {
        number: 'A1234567',
        expiryDate: new Date('2030-12-31'),
        issuingCountry: 'India',
        nationality: 'Indian'
      },
      savedAddresses: [
        {
          type: 'home',
          line1: 'Destinova HQ',
          line2: 'Tech Park, Sector 5',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          isDefault: true
        }
      ]
    },
    
    // ============ SAMPLE USERS ============
    {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@email.com',
      password: userPassword,
      phone: '+91-9876543210',
      role: 'user',
      isVerified: true,
      verificationToken: null,
      profilePicture: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=3b82f6&color=fff',
      loyaltyPoints: 15000,
      loyaltyTier: 'gold',
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: true
        },
        seatPreference: 'window',
        mealPreference: 'non-vegetarian'
      },
      passportDetails: {
        number: 'B2345678',
        expiryDate: new Date('2028-06-15'),
        issuingCountry: 'India',
        nationality: 'Indian'
      },
      savedAddresses: [
        {
          type: 'home',
          line1: '42, Park Street',
          line2: 'Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400058',
          country: 'India',
          isDefault: true
        }
      ]
    },
    {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@email.com',
      password: userPassword,
      phone: '+91-9876543211',
      role: 'user',
      isVerified: true,
      verificationToken: null,
      profilePicture: 'https://ui-avatars.com/api/?name=Priya+Patel&background=ec4899&color=fff',
      loyaltyPoints: 8500,
      loyaltyTier: 'silver',
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          sms: true,
          marketing: false
        },
        seatPreference: 'aisle',
        mealPreference: 'vegetarian'
      },
      passportDetails: {
        number: 'C3456789',
        expiryDate: new Date('2029-03-20'),
        issuingCountry: 'India',
        nationality: 'Indian'
      },
      savedAddresses: [
        {
          type: 'home',
          line1: '15, Gandhi Nagar',
          line2: 'Navrangpura',
          city: 'Ahmedabad',
          state: 'Gujarat',
          postalCode: '380009',
          country: 'India',
          isDefault: true
        }
      ]
    },
    {
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'amit.kumar@email.com',
      password: userPassword,
      phone: '+91-9876543212',
      role: 'user',
      isVerified: true,
      verificationToken: null,
      profilePicture: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10b981&color=fff',
      loyaltyPoints: 25000,
      loyaltyTier: 'platinum',
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: true,
          marketing: true
        },
        seatPreference: 'window',
        mealPreference: 'vegetarian'
      },
      passportDetails: {
        number: 'D4567890',
        expiryDate: new Date('2027-11-10'),
        issuingCountry: 'India',
        nationality: 'Indian'
      },
      savedAddresses: [
        {
          type: 'home',
          line1: '78, MG Road',
          line2: 'Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true
        },
        {
          type: 'work',
          line1: 'Tech Tower',
          line2: 'Whitefield',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560066',
          country: 'India',
          isDefault: false
        }
      ]
    },
    {
      firstName: 'Sneha',
      lastName: 'Reddy',
      email: 'sneha.reddy@email.com',
      password: userPassword,
      phone: '+91-9876543213',
      role: 'user',
      isVerified: true,
      verificationToken: null,
      profilePicture: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f59e0b&color=fff',
      loyaltyPoints: 3200,
      loyaltyTier: 'bronze',
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: true
        },
        seatPreference: 'middle',
        mealPreference: 'non-vegetarian'
      },
      passportDetails: {
        number: 'E5678901',
        expiryDate: new Date('2031-02-28'),
        issuingCountry: 'India',
        nationality: 'Indian'
      },
      savedAddresses: [
        {
          type: 'home',
          line1: '23, Jubilee Hills',
          line2: 'Road No. 10',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500033',
          country: 'India',
          isDefault: true
        }
      ]
    },
    {
      firstName: 'Vikram',
      lastName: 'Singh',
      email: 'vikram.singh@email.com',
      password: userPassword,
      phone: '+91-9876543214',
      role: 'user',
      isVerified: false,
      verificationToken: 'pending-verification-token-vikram',
      profilePicture: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=8b5cf6&color=fff',
      loyaltyPoints: 0,
      loyaltyTier: 'bronze',
      preferences: {
        currency: 'INR',
        language: 'hi',
        notifications: {
          email: true,
          push: false,
          sms: false,
          marketing: false
        },
        seatPreference: 'window',
        mealPreference: 'vegetarian'
      },
      passportDetails: {
        number: '',
        expiryDate: null,
        issuingCountry: '',
        nationality: 'Indian'
      },
      savedAddresses: []
    }
  ];

  return users;
};

const seedUsers = async () => {
  try {
    console.log('👤 Starting user seeding...');
    await connectDatabase();
    
    // Clear existing users
    await User.deleteMany();
    console.log('✅ Existing users cleared');

    // Create users with hashed passwords
    const users = await createUsers();
    
    // Insert all users
    const insertedUsers = await User.insertMany(users);
    console.log(`✅ Successfully seeded ${insertedUsers.length} users:`);
    
    // Log summary
    const adminUsers = insertedUsers.filter(u => u.role === 'admin');
    const regularUsers = insertedUsers.filter(u => u.role === 'user');
    const verifiedUsers = insertedUsers.filter(u => u.isVerified);
    
    console.log('\n   👑 Admin Users:');
    adminUsers.forEach(u => {
      console.log(`      - ${u.firstName} ${u.lastName} (${u.email})`);
      console.log(`        Password: Admin@123`);
    });
    
    console.log('\n   👥 Regular Users:');
    regularUsers.forEach(u => {
      const verifiedBadge = u.isVerified ? '✓' : '○';
      console.log(`      ${verifiedBadge} ${u.firstName} ${u.lastName} (${u.email}) - ${u.loyaltyTier} tier`);
    });
    
    console.log('\n   📊 Summary:');
    console.log(`      - Total Users: ${insertedUsers.length}`);
    console.log(`      - Admin Users: ${adminUsers.length}`);
    console.log(`      - Regular Users: ${regularUsers.length}`);
    console.log(`      - Verified Users: ${verifiedUsers.length}`);
    console.log(`      - Unverified Users: ${insertedUsers.length - verifiedUsers.length}`);
    
    console.log('\n   🔐 Test Credentials:');
    console.log(`      Admin: admin@destinova.com / Admin@123`);
    console.log(`      User:  rahul.sharma@email.com / User@123`);
    console.log(`      User:  priya.patel@email.com / User@123`);
    console.log(`      User:  amit.kumar@email.com / User@123`);
    console.log(`      User:  sneha.reddy@email.com / User@123`);
    console.log(`      User:  vikram.singh@email.com / User@123 (unverified)`);

    console.log('\n🎉 User seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
