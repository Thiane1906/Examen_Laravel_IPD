import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import Logout from './pages/logout';
import ProjectPage from './pages/ProjectPage';
import TaskDetails from './pages/TaskDetails';
import ProjectKanban from "./pages/ProjectKanban";
import ProfilPage from './pages/ProfilPage';

export default function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectKanban /></ProtectedRoute>} />
          <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
        </Routes>
    </AuthProvider>
  );
}
