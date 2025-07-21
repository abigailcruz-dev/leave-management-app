import React, { useEffect, useState } from "react";
import authAxios from "./authAxios";

const LeaveBalance = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await authAxios.get("/leaves/leave-balance/");
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching leave summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Loading summary...</p>;

  return (
    <div className="overflow-x-auto shadow-md">
      <h2 className="text-2xl font-bold mb-4">Leave Balance</h2>
      <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-indigo-50 text-indigo-800 font-semibold text-left">
          <tr>
            <th className="px-4 py-3 border-b">Leave Type</th>
            <th className="px-4 py-3 border-b">Total Earned</th>
            <th className="px-4 py-3 border-b">Used</th>
            <th className="px-4 py-3 border-b">Balance</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-4 py-2 border-b">{item.leave_type}</td>
              <td className="px-4 py-2 border-b">{item.total_earned}</td>
              <td className="px-4 py-2 border-b">{item.used}</td>
              <td className="px-4 py-2 border-b">{item.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveBalance;
