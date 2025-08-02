import { Link } from "react-router-dom"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Adresse email"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
