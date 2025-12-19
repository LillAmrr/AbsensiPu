import { createClient } from '@/lib/supabase/client';

export interface Employee {
  id: string; // Supabase uses UUIDs for IDs by default, but using string for now.
  name: string;
  email: string;
  role: 'Admin' | 'Employee';
  status: 'Active' | 'Inactive';
  created_at?: string; // Optional, as Supabase adds this automatically
}

const supabase = createClient();
const TABLE_NAME = 'employees'; // Assuming a table named 'employees' in Supabase

export const userService = {
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees:', error.message);
      throw error;
    }
    return data as Employee[];
  },

  async createEmployee(employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(employee)
      .select()
      .single();

    if (error) {
      console.error('Error creating employee:', error.message);
      throw error;
    }
    return data as Employee;
  },

  async updateEmployee(id: string, employee: Partial<Omit<Employee, 'id' | 'created_at'>>): Promise<Employee> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(employee)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error.message);
      throw error;
    }
    return data as Employee;
  },

  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error.message);
      throw error;
    }
  },
};
