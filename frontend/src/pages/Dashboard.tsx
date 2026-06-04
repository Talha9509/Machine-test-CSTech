
import { useNavigate } from 'react-router-dom';
import AddAgent from '../components/AddAgent';
import UploadFile from '../components/UploadFile';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-green-100'>
      <div className='p-4 max-w-4/5 my-0 mx-auto'>
        <header className='flex justify-between items-center' >
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <button onClick={handleLogout} className='border px-2 py-1 rounded-xl bg-gray-800 cursor-pointer text-white'>Logout</button>
        </header>
        {/* <div className=' bg-white'> */}
          <AddAgent />
          <UploadFile />
        {/* </div> */}
      </div>
    </div>
  );
}