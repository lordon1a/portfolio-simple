import { auth } from "../auth"

export async function checkAuth() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return { authorized: false, error: 'Unauthorized' }
  }

  const allowedUsers = process.env.ALLOWED_GITHUB_USERS?.split(',') || []
  const isAllowed = allowedUsers.includes(session.user.email)

  if (!isAllowed) {
    return { authorized: false, error: 'Forbidden' }
  }

  return { authorized: true, user: session.user }
}
