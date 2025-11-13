

export enum Role {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TripStatus {
  UPCOMING = 'Upcoming',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  password?: string; // Client-side only
  dob?: string;
  address?: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  gov_id_type?: string;
  gov_id_number?: string;
  gov_id_image_url?: string;
  profile_image_url?: string;
}

export interface Trip {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  from_station: string;
  to_station:string;
  platform: string;
  train_no: string;
  ticket_price: number;
  food_price: number;
  food_option: boolean;
  notes: string;
  image_url: string;
  status: TripStatus;
}

export interface Booking {
  id: number;
  trip_id: number;
  user_id: string;
  seat_count: number;
  admin_status: BookingStatus;
  created_at: string;
}

export interface Donation {
  id: number;
  donor_name: string;
  user_id: string | null; // Link to user if logged in
  amount: number;
  transaction_id: string;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  tripId: number; // To link back to a trip
  imageUrl: string;
  caption: string;
}

export interface Testimonial {
    id: number;
    author_name: string;
    author_location: string;
    author_image_url: string;
    message: string;
    created_at: string;
}

export interface AboutContent {
  missionTitle: string;
  mainTitle: string;
  subtitle: string;
  body: string;
  visionTitle: string;
  visionBody: string;
  whatWeDoTitle: string;
  whatWeDoPoints: string[];
  closing: string;
}

export interface ContactContent {
  address: string;
  phone: string;
  email: string;
  whatsapp_number?: string; // For WhatsApp inquiries
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  responsibility: string;
  image_url: string;
  display_order: number;
}
