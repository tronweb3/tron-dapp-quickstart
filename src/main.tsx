import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { getInitialDarkMode } from './hooks/useDarkTheme.ts';
import './index.css';

document.documentElement.setAttribute('data-theme', getInitialDarkMode() ? 'dark' : 'light');

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
