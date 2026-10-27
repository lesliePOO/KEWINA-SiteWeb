import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { CatalogueProvider } from './context/CatalogueContext';
import { FavorisProvider } from './context/FavorisContext';
import { PanierProvider } from './context/PanierContext';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogueProvider>
        <PanierProvider>
          <FavorisProvider>
            <App />
          </FavorisProvider>
        </PanierProvider>
      </CatalogueProvider>
    </BrowserRouter>
  </StrictMode>,
);
