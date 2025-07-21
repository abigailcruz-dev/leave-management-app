import React, { useState } from 'react';
import authAxios from './authAxios';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'Employee',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await authAxios.post('/leaves/employees/create/', formData);
      setSuccessMsg('User created successfully!');
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        role: 'Employee',
      });
    } catch (error) {
      setErrorMsg('Error creating user: ' + (error.response?.data?.message || 'Check fields or server.'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New User</h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full border px-3 py-2" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-2" required />
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="w-full border px-3 py-2" />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="w-full border px-3 py-2" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border px-3 py-2" required />

        <select name="role" value={formData.role} onChange={handleChange} className="w-full border px-3 py-2">
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
