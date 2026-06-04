
import { useState } from 'react';

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return setStatus("Please select a file first.");
    
    setStatus("Uploading and processing...");
    setStats(null);
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/upload/file`, {
        method: 'POST', headers: { 'Authorization': `${token}` }, body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setStatus(data.message);
      setStats(data.stats); 
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6 w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Task List (CSV / Excel)</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input 
          type="file" 
          accept=".csv, .xlsx, .xls, .axls" 
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
          className="block w-full text-sm text-gray-500 
            file:mr-4 file:py-2.5 file:px-4 
            file:rounded-md file:border-0 
            file:text-sm file:font-semibold 
            file:bg-blue-50 file:text-blue-700 
            hover:file:bg-blue-100 transition-colors cursor-pointer"
        />
        
        <button 
          onClick={handleUpload} 
          className="bg-green-600 text-white font-medium py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors whitespace-nowrap"
        >
          Distribute Tasks
        </button>
      </div>
      
      {status && (
        <p className="mt-4 text-sm text-gray-600">
          <strong className="font-semibold text-gray-800">Status:</strong> {status}
        </p>
      )}
      
      {stats && (
        <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Distribution Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Total Rows:</span> {stats.totalRowsProcessed}</p>
            <p><span className="font-medium text-gray-800">Base tasks per agent:</span> {stats.baseItemsPerAgent}</p>
            <p><span className="font-medium text-gray-800">Agents receiving an extra task:</span> {stats.agentsReceivingExtraItem}</p>
          </div>
        </div>
      )}
    </div>
  );
}