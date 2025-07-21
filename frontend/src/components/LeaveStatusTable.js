function LeaveStatusTable({ myLeaves }) {
  return (
    <div className="p-6 w-full bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Application Status</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-indigo-50 text-indigo-800 font-semibold text-left">
            <tr>
              <th className="px-4 py-3 border-b">Leave Type</th>
              <th className="px-4 py-3 border-b">Start Date</th>
              <th className="px-4 py-3 border-b">End Date</th>
              <th className="px-4 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.length > 0 ? (
              myLeaves.map((app, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-2 border-b">{app.leave_type}</td>
                  <td className="px-4 py-2 border-b">{app.start_date}</td>
                  <td className="px-4 py-2 border-b">{app.end_date}</td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No leave applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveStatusTable;
