import React, { useEffect, useState } from 'react';
import CreateUser from './CreateUser';
import authAxios from './authAxios';
import { useNavigate } from 'react-router-dom';
import { Users, ListChecks, Settings, LogOut } from 'lucide-react';
import {
        BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
        PieChart, Pie, Cell, Legend
      } from 'recharts';

const ManagerDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = () => {
      authAxios.get('/leaves/all/')
        .then(res => setLeaveRequests(res.data))
        .catch(err => console.error('Error fetching leaves:', err));

      authAxios.get('/leaves/employees/count/')
        .then(res => setTotalEmployees(res.data.total_employees))
        .catch(err => console.error('Error fetching employee count:', err));

      authAxios.get('/leaves/employees/')
        .then(res => setEmployees(res.data))
        .catch(err => console.error('Error fetching employee list:', err));

      authAxios.get('/leaves/user/')
        .then(res => setCurrentUser(res.data))
        .catch(err => console.error('Error loading user info:', err));
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [navigate, refresh]);

  const handleAction = (id, status) => {
    authAxios.patch(`/leaves/${id}/`, { status })
      .then(() => {
        setLeaveRequests(prev =>
          prev.map(req =>
            req.id === id ? { ...req, status } : req
          )
        );
      })
      .catch(err => console.error(`Failed to ${status}:`, err));
  };

  useEffect(() => {
    const handlePopState = () => {
      const token = localStorage.getItem('access');
      if (!token) navigate('/login');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const tabs = [
    { id: 'leaves', label: 'Leave Requests', icon: <ListChecks className="w-6 h-6 mr-2" /> },
    { id: 'employees', label: 'Employees', icon: <Users className="w-6 h-6 mr-2" /> },
  ];

  const leaveSummary = {
    total: leaveRequests.length,
    approved: leaveRequests.filter(l => l.status === 'Approved').length,
    rejected: leaveRequests.filter(l => l.status === 'Rejected').length,
    pending: leaveRequests.filter(l => l.status === 'Pending').length,
  };

  const chartData = [
    { name: 'Approved', value: leaveSummary.approved },
    { name: 'Rejected', value: leaveSummary.rejected },
    { name: 'Pending', value: leaveSummary.pending }
  ];

  const chartColors = ['#34D399', '#F87171', '#FBBF24'];

  const filteredRequests = leaveRequests.filter(leave =>
    leave.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (activeTab === 'leaves') {
      return (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by employee or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded shadow-sm"
            />
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm text-gray-700 border border-gray-300 shadow-md table-auto border-collapse">
              <thead className="bg-indigo-100 text-indigo-800 text-sm uppercase font-bold text-left">
                <tr>
                  <th className="px-4 py-3 border-b">Employee</th>
                  <th className="px-4 py-3 border-b">Leave Type</th>
                  <th className="px-4 py-3 border-b">Dates</th>
                  <th className="px-4 py-3 border-b">Reason</th>
                  <th className="px-4 py-3 border-b">Status</th>
                  <th className="px-4 py-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-2 border-b">{leave.user_name}</td>
                    <td className="px-4 py-2 border-b">{leave.leave_type}</td>
                    <td className="px-4 py-2 border-b">{leave.start_date} to {leave.end_date}</td>
                    <td className="px-4 py-2 border-b">{leave.reason}</td>
                    <td className="border px-4 py-2 font-semibold">
                      <span className={`px-2 py-1 rounded ${
                        leave.status === 'Approved' ? 'bg-green-200 text-green-800' :
                        leave.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                        'bg-yellow-200 text-yellow-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      {leave.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAction(leave.id, 'Approved')}
                            className="px-3 py-1 rounded-full text-sm font-medium shadow-sm transition hover:scale-105
                              bg-green-500 hover:bg-green-600 text-white"
                            >
                          
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(leave.id, 'Rejected')}
                            className="px-3 py-1 rounded-full text-sm font-medium shadow-sm transition hover:scale-105
                              bg-red-500 hover:bg-red-600 text-white"
                            >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );

    } else if (activeTab === 'employees') {
      return (
        <div>
          <div className="text-center p-6 text-2xl text-indigo-700 font-bold">
            👥 Total Employees: {totalEmployees}
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded mb-4"
            >
              Create New User
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-indigo-100 text-indigo-800 text-sm uppercase font-bold text-left">
                <tr>
                  <th className="px-4 py-3 border-b">Username</th>
                  <th className="px-4 py-3 border-b">Email</th>
                  <th className="px-4 py-3 border-b">First Name</th>
                  <th className="px-4 py-3 border-b">Last Name</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-2 border-b">{emp.username}</td>
                    <td className="px-4 py-2 border-b">{emp.email}</td>
                    <td className="px-4 py-2 border-b">{emp.first_name || '-'}</td>
                    <td className="px-4 py-2 border-b">{emp.last_name || '-'}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  const pendingApprovals = leaveRequests.filter(l => l.status === 'Pending');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {currentUser ? `Hello, ${currentUser.first_name || currentUser.first_name}!` : 'Loading...'}
        </h1>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow flex items-center gap-2 hover:bg-gray-50"
          >
            <Settings className="w-5 h-5" />
            Account
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
              <button
                onClick={handleSettings}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer p-6 rounded-xl shadow-lg transition-all duration-200 border-2 ${
              activeTab === tab.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 bg-white hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center text-indigo-700 font-semibold">
              {tab.icon}
              {tab.label}
            </div>
          </div>
        ))}
      </div>

      {activeTab && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {renderContent()}
        </div>
      )}

      {!activeTab && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-center text-lg font-semibold mb-2">Leave Summary - Bar Chart</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-center text-lg font-semibold mb-2">Currently Approved Leaves by Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      leaveRequests
                        .filter((l) => l.status === 'Approved')
                        .reduce((acc, curr) => {
                          acc[curr.leave_type] = (acc[curr.leave_type] || 0) + 1;
                          return acc;
                        }, {})
                    ).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {chartColors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">
              Pending Approvals <span className="text-gray-600">({pendingApprovals.length})</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-indigo-100 text-indigo-800 text-sm uppercase font-bold text-left">
                  <tr>
                    <th className="px-4 py-3 border-b">Employee</th>
                    <th className="px-4 py-3 border-b">Leave Type</th>
                    <th className="px-4 py-3 border-b">Dates</th>
                    <th className="px-4 py-3 border-b">Reason</th>
                    <th className="px-4 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map(leave => (
                    <tr key={leave.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-2 border-b">{leave.user_name}</td>
                      <td className="px-4 py-2 border-b">{leave.leave_type}</td>
                      <td className="px-4 py-2 border-b">{leave.start_date} to {leave.end_date}</td>
                      <td className="px-4 py-2 border-b">{leave.reason}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleAction(leave.id, 'Approved')}
                          className="px-3 py-1 rounded-full text-sm font-medium shadow-sm transition hover:scale-105
                            bg-green-500 hover:bg-green-600 text-white"
                          >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(leave.id, 'Rejected')}
                          className="px-3 py-1 rounded-full text-sm font-medium shadow-sm transition hover:scale-105
                            bg-red-500 hover:bg-red-600 text-white"
                          >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingApprovals.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">No pending leave requests.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
          <CreateUser
            onUserCreated={() => {
              setShowCreateModal(false);
              setRefresh((prev) => !prev);
            }}
          />
          <button
            onClick={() => setShowCreateModal(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </div>
    )}
    </div>
  );
};

export default ManagerDashboard;

