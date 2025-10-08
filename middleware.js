import { withAuth } from "next-auth/middleware"
import GithubProvider from 'next-auth/providers/github'

export const config = { matcher: "/admin/:path*" }

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async signIn({ user }) {
            if (user.email && user.email == process.env.ADMIN_EMAIL) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        },
    },
}

export default withAuth(authOptions)

