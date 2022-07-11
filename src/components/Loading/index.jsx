import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import './index.css';

const Loading = () => {
  const { isLoading, isTransfering, isApproving } = useBatchTool();

  return isLoading || isTransfering || isApproving ? (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  ) : null;
};

export default Loading;
