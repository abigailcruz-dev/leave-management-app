import React, { useEffect, useState } from 'react';
import authAxios from './authAxios';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    authAxios.get('/leaves/user/profile/')
      .then(res => {
        setUser(res.data);
        setFormData({
          username: res.data.username || '',
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          email: res.data.email || '',
          password: ''
        });
      })
      .catch(() => setErrorMsg('Failed to load profile.'));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (!dataToSend.password) delete dataToSend.password;

    authAxios.patch('/leaves/user/profile/', dataToSend)
      .then(res => {
        setUser(res.data);
        setSuccessMsg('Profile updated successfully!');
        setFormData(prev => ({ ...prev, password: '' }));
        setTimeout(() => setSuccessMsg(''), 3000);
      })
      .catch(() => {
        setErrorMsg('Failed to update profile.');
        setTimeout(() => setErrorMsg(''), 3000);
      });
  };

  if (!user) return <p className="text-center mt-10 text-gray-600">Loading your profile...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Account Settings</h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-gray-700">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
