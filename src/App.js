import { MainPage } from './pages';
import { ToastContainer } from 'react-toastify';
import { useBatchTool } from './context/toolProvider';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { inputValue } = useBatchTool();
  if (
    inputValue.Recipient !== '' ||
    inputValue.NFTAddress !== '' ||
    inputValue.TokenIDs !== ''
  )
    window.onbeforeunload = function (e) {
      const dialogText = '等一下啦';
      e.returnValue = dialogText;
      return dialogText;
    };

  return (
    <div>
      <ToastContainer />
      <MainPage />
    </div>
  );
}

export default App;
