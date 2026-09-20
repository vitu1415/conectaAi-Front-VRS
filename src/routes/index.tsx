import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { EventsDashboard } from '@/pages/EventsDashboard'
import { EventLayout } from '@/layouts/EventLayout'
import { Feed } from '@/pages/Feed'
import { People } from '@/pages/People'
import { Groups } from '@/pages/Groups'
import { Agenda } from '@/pages/Agenda'
import { Announcements } from '@/pages/Announcements'
import { Profile } from '@/pages/Profile'
import { AuthGuard } from './AuthGuard'

export const router = createBrowserRouter([
  {
    path: 'app/',
    element: <Navigate to="/app/events" replace />,
  },
  {
    path: 'app/login',
    element: <Login />,
  },
  {
    path: 'app/events',
    element: (
      <AuthGuard>
        <EventsDashboard />
      </AuthGuard>
    ),
  },
  {
    path: 'app/profile',
    element: (
      <AuthGuard>
        <Profile />
      </AuthGuard>
    ),
  },
  {
    path: 'app/profile/:userId',
    element: (
      <AuthGuard>
        <Profile />
      </AuthGuard>
    ),
  },
  {
    path: 'app/event/:eventId',
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
      { path: 'agenda', element: <Agenda /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
])
