// src/routes/ai/ai.routes.ts
import { RouteObject } from 'react-router-dom';
import { AILayout } from '../../layouts/ai/AILayout';

export const AIRoutes: RouteObject[] = [
  {
    path: '/ai',
    element: <AILayout />,
    children: [
      { index: true, element: <div>AI Assistant</div> },
      { path: 'history', element: <div>AI History</div> },
    ],
  },
];
