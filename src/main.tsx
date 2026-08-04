import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { store } from '../src/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <div className="bg-gray-100">
      <App />
      <ToastContainer />
    </div>
  </Provider>
);
