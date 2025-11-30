import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  city: string;
  country: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviewCount: number;
  description: string;
  roomTypes: {
    type: string;
    pricePerNight: number;
    availableRooms: number;
    maxGuests: number;
    amenities: string[];
  }[];
  hotelAmenities: string[];
  images: string[];
  mainImage: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema: Schema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true, index: true },
  country: { type: String, required: true, index: true },
  address: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  rating: { type: Number, default: 0, index: true },
  reviewCount: { type: Number, default: 0 },
  description: { type: String },
  roomTypes: [{
    type: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    availableRooms: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
    amenities: [{ type: String }]
  }],
  hotelAmenities: [{ type: String }],
  images: [{ type: String }],
  mainImage: { type: String },
  featured: { type: Boolean, default: false, index: true },
}, {
  timestamps: true
});

export const Hotel = mongoose.model<IHotel>('Hotel', HotelSchema);
