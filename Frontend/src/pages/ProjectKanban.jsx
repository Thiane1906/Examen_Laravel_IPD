// ... imports
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import TaskDetails from "./TaskDetails";

export default function ProjectKanban() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  
  const [columns, setColumns] = useState({
    todo: [],
    in_progress: [],
    done: [],
  });
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    titre: "",
    description: "",
    deadline: "",
    etat: "todo",
    assigned_to: "",
  });
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
    loadUsers();
  }, []);

  const loadProject = async () => {
    try {
      const res = await axiosInstance.get(`/projects/${id}`);
      setProject(res.data);
      const grouped = {
        todo: res.data.tasks.filter((t) => t.etat === "todo"),
        in_progress: res.data.tasks.filter((t) => t.etat === "in_progress"),
        done: res.data.tasks.filter((t) => t.etat === "done"),
      };
      setColumns(grouped);
    } catch (error) {
      toast.error("Erreur lors du chargement du projet");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Erreur chargement users", error);
      toast.error("Erreur chargement utilisateurs");
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.titre.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }
    if (!newTask.etat) {
      toast.error("Veuillez sélectionner un statut");
      return;
    }
    try {
      await axiosInstance.post(`/tasks`, { ...newTask, project_id: id });
      toast.success("Tâche créée avec succès !");
      setShowModal(false);
      setNewTask({
        titre: "",
        description: "",
        deadline: "",
        etat: "todo",
        assigned_to: "",
      });
      loadProject();
    } catch (error) {
      toast.error("Erreur lors de la création de la tâche");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(columns[source.droppableId]);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: items });
    } else {
      const sourceItems = Array.from(columns[source.droppableId]);
      const [moved] = sourceItems.splice(source.index, 1);
      const destItems = Array.from(columns[destination.droppableId]);
      moved.etat = destination.droppableId;
      destItems.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });

      try {
        await axiosInstance.put(`/tasks/${moved.id}`, { etat: moved.etat });
        toast.success("Statut mis à jour !");
      } catch {
        toast.error("Erreur lors de la mise à jour");
      }
    }
  };

  if (!project) return <div className="p-6">Chargement...</div>;

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Détails projet */}
        <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">{project.nom}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <span>📅 Créé le {new Date(project.created_at).toLocaleDateString()}</span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                {project.statut}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            + Nouvelle tâche
          </button>
        </div>

        {/* Kanban */}
        <h2 className="text-xl font-semibold mb-4">Tâches</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(columns).map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 rounded-lg p-4 shadow min-h-[500px]"
                  >
                    <h2 className="font-semibold mb-4 capitalize">
                      {status === "todo"
                        ? "En attente"
                        : status === "in_progress"
                        ? "En cours"
                        : "Terminée"}
                    </h2>
                    {columns[status].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedTaskId(task.id)}
                            className="bg-white p-3 rounded shadow mb-3 hover:shadow-lg cursor-pointer transition flex justify-between items-center"
                          >
                            <div>
                              <h3 className="font-bold">{task.titre}</h3>
                              <p className="text-sm text-gray-500">
                                {task.description.length > 50
                                  ? task.description.slice(0, 50) + "..."
                                  : task.description}
                              </p>
                              <p className="text-xs text-gray-400">
                                📅{" "}
                                {task.deadline
                                  ? new Date(task.deadline).toLocaleDateString()
                                  : "Pas de deadline"}
                              </p>
                            </div>

                            <div className="ml-4 px-2 py-1 bg-indigo-600 text-white text-xs rounded-full whitespace-nowrap">
                              {task.assigned_user
                                ? task.assigned_user.name
                                : "Non assignée"}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {selectedTaskId && (
          <TaskDetails
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onTaskUpdated={(updatedTask) => {
              setColumns((prev) => {
                const newColumns = { ...prev };

                // Retirer la tâche de son ancienne colonne
                Object.keys(newColumns).forEach((status) => {
                  newColumns[status] = newColumns[status].filter(
                    (t) => t.id !== updatedTask.id
                  );
                });

                // Ajouter dans la bonne colonne
                const key = updatedTask.etat || "todo"; // fallback
                if (!newColumns[key]) newColumns[key] = [];
                newColumns[key].push(updatedTask);

                return newColumns;
              });
            }}
          />
        )}

        {/* Modal création tâche */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Créer une nouvelle tâche</h2>
              <input
                type="text"
                placeholder="Titre"
                value={newTask.titre}
                onChange={(e) =>
                  setNewTask({ ...newTask, titre: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
              />
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
                className="w-full p-2 border rounded mb-3"
              />

              <select
                value={newTask.etat}
                onChange={(e) =>
                  setNewTask({ ...newTask, etat: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Sélectionner le statut</option>
                <option value="todo">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminée</option>
              </select>

              <select
                value={newTask.assigned_to}
                onChange={(e) =>
                  setNewTask({ ...newTask, assigned_to: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Assigner à...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
