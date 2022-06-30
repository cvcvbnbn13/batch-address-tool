import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import { InputSection } from '../../components';
import './index.css';

const MainPage = () => {
  const { approveContract, transfer } = useBatchTool();

  return (
    <div className="mainPage">
      <h2>Batch Transfer</h2>

      <InputSection />

      <button onClick={approveContract}>Approve Contract</button>
      <button onClick={transfer}>Transfer</button>
    </div>
  );
};

export default MainPage;
