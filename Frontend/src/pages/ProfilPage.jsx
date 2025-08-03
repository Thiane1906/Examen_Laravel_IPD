import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
export default function UserProfilePage() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Chargement du profil...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center">Utilisateur non trouvé.</div>;
  }

  return (
    <>
        <Navbar />
      <div className="p-6 max-w-xl mx-auto mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profil de l'utilisateur</h1>
      <p><strong>Nom :</strong> {user.name}</p>
      <p><strong>Email :</strong> {user.email}</p>
      {/* Tu peux ajouter d'autres infos si elles existent dans l'objet user */}
    </div>
    </>
  );
}
