/**
 * Insurance Seeder
 * Seeds default insurance plans
 */

import mongoose from 'mongoose';
import { Insurance } from '../models/Insurance.js';
import dotenv from 'dotenv';

dotenv.config();

const insurancePlans = [
  {
    name: 'Basic Coverage',
    slug: 'basic-coverage',
    description: 'Essential travel protection for budget-conscious travelers. Get basic coverage for trip cancellation and flight delays at an affordable price.',
    shortDescription: 'Essential protection for your journey',
    price: 299,
    priceType: 'fixed',
    coverage: [
      {
        type: 'trip_cancellation',
        description: 'Coverage for trip cancellation due to covered reasons like illness, injury, or emergency',
        maxAmount: 25000,
        isIncluded: true
      },
      {
        type: 'flight_delay',
        description: 'Compensation for flight delays over 6 hours',
        maxAmount: 5000,
        isIncluded: true
      },
      {
        type: 'baggage_loss',
        description: 'Coverage for lost or damaged baggage',
        maxAmount: 10000,
        isIncluded: true
      }
    ],
    maxCoverageAmount: 50000,
    deductible: 500,
    planType: 'basic',
    duration: 'single_trip',
    minAge: 0,
    maxAge: 70,
    domesticOnly: false,
    internationalOnly: false,
    features: [
      'Trip cancellation coverage up to ₹25,000',
      'Flight delay compensation',
      'Baggage loss protection',
      '24/7 customer support',
      'Easy online claims'
    ],
    exclusions: [
      'Pre-existing medical conditions',
      'Adventure sports injuries',
      'War or terrorism',
      'Self-inflicted injuries'
    ],
    termsAndConditions: 'Coverage is subject to policy terms and conditions. Claims must be filed within 30 days of the incident. Pre-existing conditions are not covered.',
    claimProcess: '1. Report incident within 24 hours\n2. Gather required documents\n3. Submit claim online\n4. Claim reviewed within 7 business days\n5. Approved claims paid within 14 days',
    isActive: true,
    isPopular: false,
    displayOrder: 1
  },
  {
    name: 'Standard Coverage',
    slug: 'standard-coverage',
    description: 'Comprehensive travel protection with medical emergency coverage. Perfect for domestic and short international trips with peace of mind.',
    shortDescription: 'Comprehensive protection with medical coverage',
    price: 599,
    priceType: 'fixed',
    coverage: [
      {
        type: 'trip_cancellation',
        description: 'Coverage for trip cancellation due to covered reasons',
        maxAmount: 75000,
        isIncluded: true
      },
      {
        type: 'medical_emergency',
        description: 'Medical expenses coverage during travel',
        maxAmount: 200000,
        isIncluded: true
      },
      {
        type: 'flight_delay',
        description: 'Compensation for flight delays over 4 hours',
        maxAmount: 10000,
        isIncluded: true
      },
      {
        type: 'baggage_loss',
        description: 'Coverage for lost, stolen, or damaged baggage',
        maxAmount: 25000,
        isIncluded: true
      },
      {
        type: 'trip_interruption',
        description: 'Coverage if trip is cut short due to emergency',
        maxAmount: 50000,
        isIncluded: true
      }
    ],
    maxCoverageAmount: 500000,
    deductible: 250,
    planType: 'standard',
    duration: 'single_trip',
    minAge: 0,
    maxAge: 75,
    domesticOnly: false,
    internationalOnly: false,
    features: [
      'Trip cancellation up to ₹75,000',
      'Medical emergency coverage up to ₹2,00,000',
      'Flight delay compensation (4+ hours)',
      'Baggage protection up to ₹25,000',
      'Trip interruption coverage',
      '24/7 emergency assistance',
      'Cashless hospitalization',
      'Online claim tracking'
    ],
    exclusions: [
      'Pre-existing conditions (unless declared)',
      'Extreme adventure sports',
      'Alcohol/drug-related incidents',
      'Acts of war'
    ],
    termsAndConditions: 'Standard terms apply. Medical coverage requires declaration of pre-existing conditions. Adventure sports coverage available as add-on.',
    claimProcess: '1. Call emergency helpline immediately for medical emergencies\n2. Report other incidents within 24 hours\n3. Submit documents via app or website\n4. Track claim status online\n5. Fast-track processing for genuine claims',
    isActive: true,
    isPopular: true,
    displayOrder: 2
  },
  {
    name: 'Premium Coverage',
    slug: 'premium-coverage',
    description: 'Ultimate travel protection with highest coverage limits, emergency evacuation, and personal accident coverage. Ideal for international travel and high-value trips.',
    shortDescription: 'Ultimate protection with premium benefits',
    price: 1299,
    priceType: 'fixed',
    coverage: [
      {
        type: 'trip_cancellation',
        description: 'Full trip cost coverage for cancellation',
        maxAmount: 200000,
        isIncluded: true
      },
      {
        type: 'medical_emergency',
        description: 'Comprehensive medical coverage worldwide',
        maxAmount: 1000000,
        isIncluded: true
      },
      {
        type: 'flight_delay',
        description: 'Compensation for flight delays over 2 hours',
        maxAmount: 25000,
        isIncluded: true
      },
      {
        type: 'baggage_loss',
        description: 'Premium baggage protection including electronics',
        maxAmount: 75000,
        isIncluded: true
      },
      {
        type: 'trip_interruption',
        description: 'Full coverage for trip interruption',
        maxAmount: 150000,
        isIncluded: true
      },
      {
        type: 'personal_accident',
        description: 'Personal accident coverage during travel',
        maxAmount: 500000,
        isIncluded: true
      },
      {
        type: 'emergency_evacuation',
        description: 'Emergency medical evacuation and repatriation',
        maxAmount: 500000,
        isIncluded: true
      }
    ],
    maxCoverageAmount: 2500000,
    deductible: 0,
    planType: 'premium',
    duration: 'single_trip',
    minAge: 0,
    maxAge: 80,
    domesticOnly: false,
    internationalOnly: false,
    features: [
      'Trip cancellation up to ₹2,00,000',
      'Medical coverage up to ₹10,00,000',
      'Zero deductible',
      'Flight delay compensation (2+ hours)',
      'Premium baggage protection (₹75,000)',
      'Personal accident cover (₹5,00,000)',
      'Emergency evacuation & repatriation',
      'Adventure sports included',
      'Pre-existing conditions covered (with declaration)',
      'Concierge services',
      '24/7 global assistance',
      'Priority claims processing'
    ],
    exclusions: [
      'Intentional self-harm',
      'Criminal activities',
      'Nuclear/radiation events',
      'Pandemic exclusions may apply'
    ],
    termsAndConditions: 'Premium terms provide maximum coverage. Pre-existing conditions covered with medical declaration. No waiting period for accidents.',
    claimProcess: '1. Dedicated claims manager assigned\n2. 24/7 emergency assistance\n3. Cashless treatment at network hospitals\n4. Priority document processing\n5. Claims settled within 7 days',
    isActive: true,
    isPopular: false,
    displayOrder: 3
  }
];

async function seedInsurance() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/destinova';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing insurance plans
    await Insurance.deleteMany({});
    console.log('Cleared existing insurance plans');

    // Insert new plans
    const inserted = await Insurance.insertMany(insurancePlans);
    console.log(`Inserted ${inserted.length} insurance plans:`);
    
    inserted.forEach(plan => {
      console.log(`  - ${plan.name} (₹${plan.price})`);
    });

    console.log('\nInsurance seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding insurance:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run if called directly
seedInsurance().catch(console.error);

export { seedInsurance, insurancePlans };
