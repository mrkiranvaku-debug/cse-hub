import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import AllResourcesPage from './pages/AllResourcesPage'
import CategoryPage from './pages/CategoryPage'
import SessionsPage from './pages/SessionsPage'
import SessionDetailPage from './pages/SessionDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import SettingsPage from './pages/SettingsPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<AllResourcesPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/sessions/:id" element={<SessionDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  )
}
