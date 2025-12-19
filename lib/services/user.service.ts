import { createClient } from '@/lib/supabase/client';

export interface Intern {
  id: string; // Supabase uses UUIDs for IDs by default, but using string for now.
  name: string;
  email: string;
  role: 'Admin' | 'Intern';
  status: 'Active' | 'Inactive';
  created_at?: string; // Optional, as Supabase adds this automatically
}

const supabase = createClient();
const TABLE_NAME = 'interns'; // Assuming a table named 'employees' in Supabase

export const userService = {
  async getInterns(): Promise<Intern[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interns:', error.message);
      throw error;
    }
    return data as Intern[];
  },

  async createIntern(intern: Omit<Intern, 'id' | 'created_at'>): Promise<Intern> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(intern)
      .select()
      .single();

    if (error) {
      console.error('Error creating intern:', error.message);
      throw error;
    }
    return data as Intern;
  },

  async updateIntern(id: string, intern: Partial<Omit<Intern, 'id' | 'created_at'>>): Promise<Intern> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(intern)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating intern:', error.message);
      throw error;
    }
    return data as Intern;
  },

  async deleteIntern(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting intern:', error.message);
      throw error;
    }
  },
};
