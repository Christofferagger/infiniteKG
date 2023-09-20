import React, { useEffect, useState } from 'react'
import Query from '../components/query';
import CytoscapeComponent from '../components/graphVisualization';

const IndexPage = () => {
  const [message, setMessage] = useState('');
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
    .then(response => response.json())
    .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1 className='text-2xl text-blue'>Next-app</h1>
      <p>{message}</p>
      <Query setGraphData={setGraphData} />
      {graphData && <CytoscapeComponent elements={graphData} />}
    </div>
  )
}

export default IndexPage
