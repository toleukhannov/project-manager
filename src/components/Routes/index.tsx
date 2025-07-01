// libraries
import type { RouteObject } from 'react-router-dom';
// components
import LoginPage from 'components/LoginPage';
import ProfilePage from 'components/ProfilePage';
import Project from 'components/Project';
import ProjectsPage from 'components/ProjectsPage';
import ProtectedRoute from 'components/ProtectedRoute';
import TaskPage from 'components/TaskPage';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <ProjectsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id',
    element: (
      <ProtectedRoute>
        <Project />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id/tasks/:id',
    element: (
      <ProtectedRoute>
        <TaskPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
];
