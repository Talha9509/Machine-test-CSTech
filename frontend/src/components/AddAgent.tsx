import PhoneInputRaw from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 
import { useState } from 'react';

const PhoneInput = (PhoneInputRaw as any).default || PhoneInputRaw;

export default function AddAgent() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    const finalPayload = {
      ...formData,
      phone: phone 
    };

    try {
      const response = await fetch(`http://localhost:3001/add/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
        body: JSON.stringify(finalPayload) 
      });

      const data = await response.json();

      if (!response.ok){
        setMessage(`Error: ${data.message || data.error}`);
        throw new Error(data.error || 'Failed to add agent');
      }  

      setMessage('Agent added successfully!');
      setFormData({ name: '', email: '', password: '' }); 
      setPhone(''); 
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6 w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Create New Agent</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Name" 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />

        <div className="w-full">
          <PhoneInput
            country={'in'}
            enableSearch={true}
            value={phone} 
            onChange={(phoneValue: string) => setPhone(phoneValue)}
            inputProps={{
              id: 'phone-input',
              name: 'phone',
              required: true,
            }}
            inputStyle={{ 
              width: '100%', 
              height: '42px',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }}
            buttonStyle={{
              borderTopLeftRadius: '0.375rem',
              borderBottomLeftRadius: '0.375rem',
              border: '1px solid #d1d5db',
              backgroundColor: '#f9fafb',
            }}
          />
        </div>

        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={formData.password} 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        
        <button 
          type="submit"
          className="mt-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Add Agent
        </button>
      </form>
      
      {message && (
        <p className={`mt-4 text-sm font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}