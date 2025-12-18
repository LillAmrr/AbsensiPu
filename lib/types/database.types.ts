export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          employee_id: string | null
          full_name: string
          email: string
          avatar_url: string | null
          department: string | null
          position: string | null
          phone: string | null
          face_embedding: string | null
          face_registered: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          employee_id?: string | null
          full_name: string
          email: string
          avatar_url?: string | null
          department?: string | null
          position?: string | null
          phone?: string | null
          face_embedding?: string | null
          face_registered?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string | null
          full_name?: string
          email?: string
          avatar_url?: string | null
          department?: string | null
          position?: string | null
          phone?: string | null
          face_embedding?: string | null
          face_registered?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          user_id: string
          check_in: string
          check_out: string | null
          attendance_location_id: string | null
          latitude: number | null
          longitude: number | null
          accuracy: number | null
          face_verified: boolean
          verification_score: number | null
          selfie_url: string | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          check_in?: string
          check_out?: string | null
          attendance_location_id?: string | null
          latitude?: number | null
          longitude?: number | null
          accuracy?: number | null
          face_verified?: boolean
          verification_score?: number | null
          selfie_url?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          check_in?: string
          check_out?: string | null
          attendance_location_id?: string | null
          latitude?: number | null
          longitude?: number | null
          accuracy?: number | null
          face_verified?: boolean
          verification_score?: number | null
          selfie_url?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      attendance_locations: {
        Row: {
          id: string
          name: string
          address: string | null
          latitude: number
          longitude: number
          radius_meters: number
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          latitude: number
          longitude: number
          radius_meters?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          latitude?: number
          longitude?: number
          radius_meters?: number
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string | null
          type: string | null
          is_read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message?: string | null
          type?: string | null
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string | null
          type?: string | null
          is_read?: boolean
          metadata?: Json | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: {
          lat1: number
          lon1: number
          lat2: number
          lon2: number
        }
        Returns: number
      }
      is_within_radius: {
        Args: {
          target_lat: number
          target_lon: number
          location_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      attendance_status: 'present' | 'late' | 'absent' | 'leave' | 'holiday'
      user_role: 'admin' | 'manager' | 'employee' | 'supervisor'
    }
  }
}