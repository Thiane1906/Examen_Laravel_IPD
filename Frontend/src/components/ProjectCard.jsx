import { Link } from "react-router-dom"

export default function ProjectCard({ project, onClick }) {
  return (
    <div
      className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(project.id)}
    >
      <h2 className="font-bold">{project.nom}</h2>
      <p>{project.description}</p>
    </div>
  );
}

