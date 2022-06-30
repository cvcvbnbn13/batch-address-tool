import React from 'react';
import { useBatchTool } from '../../context/toolProvider';
import './index.css';

const Loading = () => {
  const { isLoading } = useBatchTool();

  return isLoading ? <div className="loading"></div> : null;
};

export default Loading;
