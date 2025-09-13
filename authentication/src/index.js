import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { FirebaseSignInCard } from './components/ui/FirebaseSignInCard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseSignInCard />
  </React.StrictMode>
);
