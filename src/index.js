import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import TodoList from './TodoList';
import registerServiceWorker from './registerServiceWorker';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>
);

registerServiceWorker();
