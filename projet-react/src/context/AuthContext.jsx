// import { createContext, useContext, useState } from 'react'

// const AuthContext = createContext()

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)

//   const login = (userData) => setUser(userData)
//   const logout = () => setUser(null)

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   return useContext(AuthContext)
// }

import { createContext, useContext, useEffect, useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user')
      setUser(data)
    } catch {
      setUser(null)
    }
  }

  const login = async (credentials) => {
    await axios.get('/sanctum/csrf-cookie') // Important avant le login
    await axios.post('/api/login', credentials)
    await fetchUser()
    navigate('/')
  }

  const register = async (userData) => {
    await axios.get('/sanctum/csrf-cookie')
    await axios.post('/api/register', userData)
    await fetchUser()
    navigate('/')
  }

  const logout = async () => {
    await axios.post('/api/logout')
    setUser(null)
    navigate('/login')
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

