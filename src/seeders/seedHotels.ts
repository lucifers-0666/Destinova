// mongoose imported via connectDB
import dotenv from 'dotenv';
import { Hotel } from '../models/Hotel.js';
import { connectDatabase } from '../config/db.js';

dotenv.config();

const hotels = [
  {
    name: 'The Taj Mahal Palace',
    city: 'Mumbai',
    country: 'India',
    address: 'Apollo Bunder, Mumbai, Maharashtra 400001',
    rating: 5,
    reviewCount: 12500,
    description: 'The Taj Mahal Palace is a heritage, five-star, luxury hotel built in the Saracenic Revival style in the Colaba area of Mumbai, Maharashtra, India, situated next to the Gateway of India.',
    roomTypes: [
      {
        type: 'Luxury Room',
        pricePerNight: 25000,
        availableRooms: 10,
        maxGuests: 2,
        amenities: ['King Bed', 'Sea View', 'Breakfast', 'WiFi']
      },
      {
        type: 'Palace Suite',
        pricePerNight: 55000,
        availableRooms: 5,
        maxGuests: 3,
        amenities: ['King Bed', 'Sea View', 'Breakfast', 'WiFi', 'Butler Service']
      }
    ],
    hotelAmenities: ['Pool', 'Spa', 'Gym', 'Restaurants', 'Bar'],
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg/1200px-Mumbai_Aug_2018_%2843397784544%29.jpg'],
    mainImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mumbai_Aug_2018_%2843397784544%29.jpg/1200px-Mumbai_Aug_2018_%2843397784544%29.jpg',
    featured: true
  },
  {
    name: 'The Oberoi Amarvilas',
    city: 'Agra',
    country: 'India',
    address: 'Taj East Gate Road, Agra, Uttar Pradesh 282001',
    rating: 5,
    reviewCount: 8500,
    description: 'Located just 600 metres from the Taj Mahal, The Oberoi Amarvilas offers uninterrupted views of the ancient monument from every room.',
    roomTypes: [
      {
        type: 'Premier Room',
        pricePerNight: 35000,
        availableRooms: 15,
        maxGuests: 2,
        amenities: ['King Bed', 'Taj View', 'Breakfast', 'WiFi']
      }
    ],
    hotelAmenities: ['Pool', 'Spa', 'Gym', 'Restaurants'],
    images: ['https://cf.bstatic.com/xdata/images/hotel/max1024x768/37065228.jpg?k=7065228'],
    mainImage: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/37065228.jpg?k=7065228',
    featured: true
  },
  {
    name: 'Rambagh Palace',
    city: 'Jaipur',
    country: 'India',
    address: 'Bhawani Singh Road, Jaipur, Rajasthan 302005',
    rating: 5,
    reviewCount: 6000,
    description: 'Rambagh Palace is a living legend in Jaipur. Originally built in 1835, it has stepped gracefully through many royal transitions.',
    roomTypes: [
      {
        type: 'Palace Room',
        pricePerNight: 40000,
        availableRooms: 8,
        maxGuests: 2,
        amenities: ['King Bed', 'Garden View', 'Breakfast', 'WiFi']
      }
    ],
    hotelAmenities: ['Pool', 'Spa', 'Gym', 'Restaurants', 'Gardens'],
    images: ['https://cf.bstatic.com/xdata/images/hotel/max1024x768/260432222.jpg?k=260432222'],
    mainImage: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/260432222.jpg?k=260432222',
    featured: true
  }
];

const seedHotels = async () => {
  try {
    await connectDatabase();
    
    await Hotel.deleteMany();
    console.log('Hotels cleared');

    await Hotel.insertMany(hotels);
    console.log('Hotels seeded');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedHotels();
