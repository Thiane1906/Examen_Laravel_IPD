import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = AuthContext

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div className="font-bold text-xl"><a href='/dashboard'>Task Manager</a></div>
      <div className="space-x-4">
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  )
}
