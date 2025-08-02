import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div className="font-bold text-xl">Task Manager</div>
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
