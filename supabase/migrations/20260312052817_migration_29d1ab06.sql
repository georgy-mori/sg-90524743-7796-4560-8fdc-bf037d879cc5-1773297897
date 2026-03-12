-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'renter');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'active', 'inactive', 'rented', 'maintenance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'refund', 'payout', 'booking', 'topup', 'fee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'approved', 'rejected', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispute_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table with role and additional fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'renter',
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS kyc_status kyc_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    icon text,
    item_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text NOT NULL,
    price_per_day numeric(10,2) NOT NULL,
    price_per_week numeric(10,2),
    price_per_month numeric(10,2),
    location text NOT NULL,
    condition text,
    availability listing_status DEFAULT 'draft',
    images jsonb DEFAULT '[]'::jsonb,
    specifications jsonb DEFAULT '{}'::jsonb,
    views integer DEFAULT 0,
    rating numeric(3,2) DEFAULT 0,
    review_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number text UNIQUE NOT NULL,
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    renter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vendor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days integer NOT NULL,
    price_per_day numeric(10,2) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status booking_status DEFAULT 'pending',
    payment_status text DEFAULT 'pending',
    check_in_time timestamp with time zone,
    check_out_time timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    balance numeric(10,2) DEFAULT 0,
    available_balance numeric(10,2) DEFAULT 0,
    pending_balance numeric(10,2) DEFAULT 0,
    total_earned numeric(10,2) DEFAULT 0,
    total_spent numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount numeric(10,2) NOT NULL,
    balance_before numeric(10,2) NOT NULL,
    balance_after numeric(10,2) NOT NULL,
    reference text UNIQUE NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'completed',
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vendor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    images jsonb DEFAULT '[]'::jsonb,
    is_verified boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id text NOT NULL,
    sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, listing_id)
);

-- Create disputes table
CREATE TABLE IF NOT EXISTS disputes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    complainant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    respondent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason text NOT NULL,
    description text NOT NULL,
    evidence jsonb DEFAULT '[]'::jsonb,
    status dispute_status DEFAULT 'open',
    resolution text,
    resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create payouts table
CREATE TABLE IF NOT EXISTS payouts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL,
    status payout_status DEFAULT 'pending',
    bank_name text NOT NULL,
    account_number text NOT NULL,
    account_name text NOT NULL,
    reference text UNIQUE NOT NULL,
    processed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    processed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create kyc_submissions table
CREATE TABLE IF NOT EXISTS kyc_submissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    document_type text NOT NULL,
    document_number text NOT NULL,
    document_front text NOT NULL,
    document_back text,
    selfie text NOT NULL,
    status kyc_status DEFAULT 'pending',
    reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_vendor ON listings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(availability);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);