import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/authContext'
import Layout from './components/navbar'
import Login from './pages/login'
import Profile from './pages/profile'
import MediaList from './pages/mediaList'
import SearchMedia from './pages/searchMedia'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import NotFound from './pages/notfound'
import HomePage from './pages/home'

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
  <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
  <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
  <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
    <Route index element={<HomePage />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="list" element={<MediaList />} />
    <Route path="search" element={<SearchMedia />} />
    <Route path="profile" element={<Profile />} />
  </Route>
  <Route path="/404" element={<NotFound />} />
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>
  )
}

export default App