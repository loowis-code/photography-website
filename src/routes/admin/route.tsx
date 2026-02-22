import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/lib/auth'
import AdminNavbar from '~/components/AdminNavbar/AdminNavbar'
import { createServerFn } from '@tanstack/react-start'

const getAuthSession = createServerFn().handler(async () => {
    const request = getRequest()
    const session = await getSession(request, authConfig)
    return session
})

export const Route = createFileRoute('/admin')({
    beforeLoad: async () => {
        const session = await getAuthSession()
        if (!session?.user) {
            throw redirect({ href: '/api/auth/signin' })
        }
        return { session }
    },
    component: AdminLayout,
})

function AdminLayout() {
    return (
        <>
            <AdminNavbar />
            <Outlet />
        </>
    )
}
