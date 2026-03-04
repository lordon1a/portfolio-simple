import { signIn } from "../../../auth"
import { Github } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-secondary p-8 rounded-lg border border-gray-800 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-100 mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Sign in with your GitHub account to access the admin panel
        </p>
        
        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/admin" })
          }}
        >
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 px-4 py-3 rounded transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Only authorized GitHub accounts can access the admin panel
        </p>
      </div>
    </div>
  )
}
