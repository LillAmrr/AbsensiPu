DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  department VARCHAR(100),
  position VARCHAR(100),
  phone VARCHAR(20),
  face_embedding BYTEA,
  face_registered BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS attendance_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  check_in TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  check_out TIMESTAMP WITH TIME ZONE,
  attendance_location_id UUID REFERENCES attendance_locations(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accuracy DECIMAL(5, 2),
  face_verified BOOLEAN DEFAULT FALSE,
  verification_score DECIMAL(5, 4),
  selfie_url TEXT,
  status VARCHAR(20) DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS attendance_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  work_days INTEGER[] DEFAULT '{1,2,3,4,5}',
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  late_threshold INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes
CREATE INDEX idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_records_check_in ON attendance_records(check_in);
CREATE INDEX idx_attendance_records_status ON attendance_records(status);
CREATE INDEX idx_profiles_employee_id ON profiles(employee_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read) WHERE NOT is_read;

-- Spatial index for locations
CREATE INDEX idx_attendance_locations_geo ON attendance_locations USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles policies
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND position = 'admin'
  )
);

CREATE POLICY "Admins can insert profiles" 
ON profiles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND position = 'admin'
  )
);

-- Attendance records policies
CREATE POLICY "Users can view own attendance" 
ON attendance_records FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own attendance" 
ON attendance_records FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own attendance" 
ON attendance_records FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all attendance" 
ON attendance_records FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND position = 'admin'
  )
);

-- Attendance locations policies
CREATE POLICY "Everyone can view active locations" 
ON attendance_locations FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage locations" 
ON attendance_locations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND position = 'admin'
  )
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" 
ON notifications FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
USING (user_id = auth.uid());

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_locations_updated_at 
    BEFORE UPDATE ON attendance_locations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate distance
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 6371000;
  phi1 DECIMAL := RADIANS(lat1);
  phi2 DECIMAL := RADIANS(lat2);
  delta_phi DECIMAL := RADIANS(lat2 - lat1);
  delta_lambda DECIMAL := RADIANS(lon2 - lon1);
  a DECIMAL;
  c DECIMAL;
BEGIN
  a := SIN(delta_phi/2) * SIN(delta_phi/2) +
       COS(phi1) * COS(phi2) *
       SIN(delta_lambda/2) * SIN(delta_lambda/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  RETURN R * c;
END;
$$ LANGUAGE plpgsql;