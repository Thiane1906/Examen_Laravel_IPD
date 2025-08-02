import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import CommentSection from '../components/CommentSection';
import Navbar from '../components/Navbar';

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const loadTask = () => {
    axiosInstance.get(`/tasks/${id}`).then(res => setTask(res.data));
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  const addComment = async (text) => {
    await axiosInstance.post(`/tasks/${id}/comments`, { texte: text });
    loadTask();
  };

  if (!task) return <div>Chargement...</div>;

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="font-bold">{task.titre}</h2>
        <p>{task.description}</p>
        <CommentSection comments={task.comments} onAdd={addComment} />
      </div>
    </>
  );
}
