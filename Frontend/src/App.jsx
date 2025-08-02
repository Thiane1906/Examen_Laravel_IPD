import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import TaskDetails from './pages/TaskDetails';
import ProjectKanban from "./pages/ProjectKanban";

export default function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectKanban /></ProtectedRoute>} />
          <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
        </Routes>
    </AuthProvider>
  );
}
