import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios.js';
import { csrf } from '../api/axios.js';

import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {

      await csrf.get('/sanctum/csrf-cookie');
      console.log(form);
      
      const res = await axiosInstance.post('/login', form);
      console.log(res);
      
      const { token, user } = res.data;

      // C’est ici qu’on utilise le contexte d’auth
      login(token, user); // on stocke le token et le user
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
