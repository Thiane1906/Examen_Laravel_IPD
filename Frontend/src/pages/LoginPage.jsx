import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
export default function LoginPage() {

   const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password })
    } catch (error) {
      alert("Erreur de connexion")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}

