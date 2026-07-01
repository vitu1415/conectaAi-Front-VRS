import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { EventsDashboard } from '@/pages/EventsDashboard'
import { EventLayout } from '@/layouts/EventLayout'
import { Feed } from '@/pages/Feed'
import { People } from '@/pages/People'
import { Groups } from '@/pages/Groups'
import { Teams } from '@/pages/Teams'
import { Agenda } from '@/pages/Agenda'
import { Announcements } from '@/pages/Announcements'
import { Profile } from '@/pages/Profile'
import { AuthGuard } from './AuthGuard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/events" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/events',
    element: (
      <AuthGuard>
        <EventsDashboard />
      </AuthGuard>
    ),
  },
  {
    path: '/event/:eventId',
    element: (
      <AuthGuard>
        <EventLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="feed" replace /> },
      { path: 'feed', element: <Feed /> },
      { path: 'people', element: <People /> },
      { path: 'groups', element: <Groups /> },
      { path: 'teams', element: <Teams /> },
      { path: 'agenda', element: <Agenda /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
])
