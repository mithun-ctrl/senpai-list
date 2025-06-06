import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/authContext'
import Layout from './components/navbar'
import Login from './pages/login'
import Profile from './pages/profile'
import MediaTVList from './pages/MovieTVList'
import SearchMedia from './pages/MovieSearch'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import NotFound from './pages/notfound'
import HomePage from './pages/home'
import AnimeSearch from './pages/AnimeSearch'
import AnimeList from './pages/AnimeList'
import AnimeRecommendations from './components/AnimeRecommendations'
import TopAnime from './components/TopAnime'
import UpcomingAnime from './components/UpcomingAnime'
import AnimeDashboard from './pages/AnimeDashboard'

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
  <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
  <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
  <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
    <Route index element={<HomePage />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="list/movie" element={<MediaTVList />} />
    <Route path="search/movie" element={<SearchMedia />} />
    <Route path="profile" element={<Profile />} />
    <Route path='search/anime' element={<AnimeSearch/>} />
    <Route path='list/anime' element={< AnimeList/>}/>
    <Route path="/" element={<HomePage />} />
    <Route path="anime/top-anime" element={<TopAnime />} />
    <Route path="anime/recommendations" element={<AnimeRecommendations />} />
    <Route path='anime-dashboard' element={<AnimeDashboard/>}/>
    <Route path="anime/upcoming" element={<UpcomingAnime />} />
  </Route>
  <Route path="/404" element={<NotFound />} />
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>
  )
}

export default App
