import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !isLoggedIn && req.nextUrl.pathname !== '/admin/login') {
    return Response.redirect(new URL('/admin/login', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
