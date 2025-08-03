import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ à mettre tout en haut
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div className="font-bold text-xl"><a href='/dashboard'>Task Manager</a></div>

      {user && (
        <div className="relative flex ml-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex ml-auto space-x-2 focus:outline-none"
          >
            {/* Avatar rond */}
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline">{user.email}</span>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 z-50">
              <Link
                to="/profil"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Profil
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setShowModal(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}



      <div className="space-x-4">


        {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Voulez-vous vraiment vous déconnecter ?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Oui, se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
            {/* <Link to="/logout">Deconnexion</Link> */}
            {/* <Link to="/register">Inscription</Link> */}
          

      </div>
    </nav>
  )
}
