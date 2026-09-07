import { useState, type ReactNode } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import AddResourceModal from '../components/AddResourceModal'
import { useCategories } from '../hooks/useCategories'
import { useSessions } from '../hooks/useSessions'

export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const { categories, refresh: refreshCategories } = useCategories()
  const { sessions } = useSessions()

  return (
    <div className="min-h-screen bg-night-950">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        recentSessions={sessions}
      />

      <Header onMenuClick={() => setSidebarOpen(true)} onAddClick={() => setAddOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>

      <AddResourceModal
        open={addOpen}
        categories={categories}
        onClose={() => setAddOpen(false)}
        onSaved={() => {
          refreshCategories()
          window.dispatchEvent(new Event('cse-hub:resources-changed'))
        }}
      />
    </div>
  )
}
