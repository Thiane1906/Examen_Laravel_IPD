import { Link } from "react-router-dom"

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
        <p className="text-gray-600">{project.description}</p>
      </div>
    </Link>
  )
}
