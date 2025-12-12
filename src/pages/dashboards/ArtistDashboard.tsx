
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const ArtistDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Artist Dashboard</h1>
      <p className="text-lg mb-8">Welcome to your dashboard.</p>
      <Button onClick={handleLogout} className="bg-purple-600 hover:bg-purple-700 text-white">Logout</Button>
    </div>
  );
};

export default ArtistDashboard;
