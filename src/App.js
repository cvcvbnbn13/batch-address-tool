import { MainPage } from './pages';
import { ToastContainer } from 'react-toastify';
import { Loading } from './components';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <Loading />
      <MainPage />
    </div>
  );
}

export default App;
