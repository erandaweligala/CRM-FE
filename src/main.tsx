import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import store from "./store/main-store";
import {Provider} from 'react-redux';
import ErrorBoundary from './components/error-boundary/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <Provider store={store}>
         <ErrorBoundary>
         <App/>
         </ErrorBoundary>
      </Provider>
   </StrictMode>,
)
