import React, { useEffect, useState } from 'react'
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout'
import { usePage } from '@inertiajs/react'
import type { BreadcrumbItem } from '@/types'

interface AppLayoutProps {
    children: React.ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { url } = usePage()
    const [openHelp, setOpenHelp] = useState(false)
    const [helpText, setHelpText] = useState('')

    // Determine help content based on current route
    useEffect(() => {
        if (url.startsWith('/dashboard')) {
            setHelpText(`
                📌 DASHBOARD HELP
                - View system metrics and summary cards.
                - Check recent activity logs.
                - Use the filters on the top right for dates.
            `)
        }
        else if (url.startsWith('/user-management')) {
            setHelpText(`
                👥 USER MANAGEMENT HELP
                - Add, edit, or delete system users.
                - Assign roles and permissions.
                - Use search bar to locate users quickly.
            `)
        }
        else {
            setHelpText('Press F1 to view help for this page.')
        }
    }, [url])

    // F1 key listener
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'F1') {
                e.preventDefault()
                setOpenHelp(true)
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    return (
        <>
            {/* Main Layout */}
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>

            {/* Help Modal */}
            {openHelp && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-4">Help Center</h2>

                        <pre className="whitespace-pre-wrap text-sm">
                            {helpText}
                        </pre>

                        <button
                            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg"
                            onClick={() => setOpenHelp(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
