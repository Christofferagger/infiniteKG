import React, { useEffect, useState } from 'react'
import Query from '../components/query';
import CytoscapeComponent from '../components/graphVisualization';
import Chat from '../components/chat';

const IndexPage = () => {
  const [chat, setChat] = useState(null);
  const [graphData, setGraphData] = useState(null);

  return (
    <div className='w-full h-full'>
      <div className='flex items-center justify-center py-3 border-b'>
        <h1 className='text-2xl text-blue'>infiniteKG</h1>
      </div>
      <Query setGraphData={setGraphData} setChat={setChat} />
      {graphData && <CytoscapeComponent elements={graphData} />}
      <Chat chat={chat} />
    </div>
  )
}

export default IndexPage
