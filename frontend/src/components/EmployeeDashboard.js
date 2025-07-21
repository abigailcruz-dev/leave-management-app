import React, { useEffect, useState, useRef } from 'react';
import LeaveForm from './LeaveForm';
import LeaveBalance from './LeaveBalance';
import LeaveStatusTable from './LeaveStatusTable';
import { ClipboardList, BarChart2, FileText, LogOut, Settings } from 'lucide-react';
import authAxios from './authAxios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [myLeaves, setMyLeaves] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = () => {
      authAxios.get('/leaves/my-requests/')
        .then(res => setMyLeaves(res.data))
        .catch(err => console.error('Error loading leave data:', err));

      authAxios.get('/leaves/user/')
        .then(res => setCurrentUser(res.data))
        .catch(err => console.error('Error loading user data:', err));
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);
    const timer = setTimeout(() => setShowWelcome(false), 5000);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]); 

  const handleLogout = () => {
    localStorage.removeItem('access'); 
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const leaveStats = {
    total: myLeaves.length,
    approved: myLeaves.filter(l => l.status === 'Approved').length,
    pending: myLeaves.filter(l => l.status === 'Pending').length,
    rejected: myLeaves.filter(l => l.status === 'Rejected').length,
  };

  const tabs = [
    { id: 'form', label: 'Apply for Leave', icon: <ClipboardList className="w-6 h-6 mr-2" /> },
    { id: 'status', label: 'Application Status', icon: <FileText className="w-6 h-6 mr-2" /> },
    { id: 'balance', label: 'Leave Balance', icon: <BarChart2 className="w-6 h-6 mr-2" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'form':
        return <LeaveForm setMyLeaves={setMyLeaves} />;
      case 'balance':
        return <LeaveBalance />;   
      case 'status':
        return <LeaveStatusTable myLeaves={myLeaves} />;
      default:
        return null;
    }
  };

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

      {showWelcome && (
        <div className="mb-6 p-4 text-center text-indigo-900 font-medium bg-indigo-100 border border-indigo-300 rounded shadow">
          🔔 Welcome back! Here's a quick look at your leave status.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow text-center">
          <p className="text-sm">Total Requests</p>
          <p className="text-xl font-bold">{leaveStats.total}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded shadow text-center">
          <p className="text-sm">Approved</p>
          <p className="text-xl font-bold">{leaveStats.approved}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow text-center">
          <p className="text-sm">Pending</p>
          <p className="text-xl font-bold">{leaveStats.pending}</p>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded shadow text-center">
          <p className="text-sm">Rejected</p>
          <p className="text-xl font-bold">{leaveStats.rejected}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tabs.map((tab) => (
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

      <div className="bg-white rounded-xl shadow-md p-6">{renderContent()}</div>
      
    </div>
  );
};

export default EmployeeDashboard;
