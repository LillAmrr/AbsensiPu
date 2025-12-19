'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
// import { userService } from '@/lib/services/user.service'; // Temporarily disable userService import
import { Employee } from '@/lib/services/user.service'; // Keep Employee interface for type checking

const dummyEmployees: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Employee', status: 'Active' },
  { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Employee', status: 'Inactive' },
];

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>(dummyEmployees); // Use dummy data directly
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, 'id' | 'created_at'>>({ name: '', email: '', role: '', status: 'Active' });
  // Removed isLoading, error, isSubmitting states
  // Removed fetchEmployees and useEffect

  const openModal = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData({ name: employee.name, email: employee.email, role: employee.role, status: employee.status });
    } else {
      setCurrentEmployee(null);
      setFormData({ name: '', email: '', role: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
    setFormData({ name: '', email: '', role: '', status: 'Active' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => { // Reverted to local state only
    e.preventDefault();
    try {
      if (currentEmployee) {
        setEmployees(employees.map(emp => emp.id === currentEmployee.id ? { ...emp, ...formData, id: emp.id } : emp));
      } else {
        const newEmployee: Employee = { ...formData, id: String(employees.length + 1 + Math.random()) }; // Generate unique ID
        setEmployees([...employees, newEmployee]);
      }
      closeModal();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = (id: string) => { // Reverted to local state only
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Daftar Karyawan</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" /> Tambah Karyawan
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jabatan
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(employee)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={currentEmployee ? 'Edit Karyawan' : 'Tambah Karyawan'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Jabatan</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Pilih Jabatan</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
