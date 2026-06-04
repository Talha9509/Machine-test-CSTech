
import { useState, useEffect } from 'react';

export default function AgentLists() {
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLists = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/distributed-lists`, {
        headers: {
          'Authorization': `${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch lists');
      
      setDistributionData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  if (loading) return <div className="mt-6 text-gray-500">Loading distributed lists...</div>;
  if (error) return <div className="mt-6 text-red-500">Error: {error}</div>;
  if (distributionData.length === 0) return <div className="mt-6 text-gray-500">No agents found.</div>;

  return (
    <div className="mt-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Distributed Agent Lists</h3>
        <button 
          onClick={fetchLists}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
        >
          Refresh Lists
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {distributionData.map((data, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            <div className="bg-blue-50 border-b border-gray-200 p-4">
              <h4 className="font-bold text-lg text-blue-900">{data.agentDetails.name}</h4>
              <p className="text-sm text-gray-600">{data.agentDetails.email}</p>
              <p className="text-sm text-gray-600 font-mono mt-1">{data.agentDetails.mobile || data.agentDetails.phone}</p>
              <div className="mt-3 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                Tasks Assigned: {data.totalAssigned}
              </div>
            </div>

            <div className="p-0 flex-1 overflow-y-auto max-h-64">
              {data.tasks.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 italic text-center mt-4">No tasks assigned yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.tasks.map((task: any, tIndex: number) => (
                    <li key={tIndex} className="p-4 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-800">First Name: {task.FirstName}</p>
                      <p className="text-sm font-mono text-gray-600">Phone: {task.phone}</p>
                      {task.notes && (
                        <p className="text-sm text-gray-500 mt-2 bg-gray-100 p-2 rounded rounded-tl-none italic">
                          "{task.notes}"
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}