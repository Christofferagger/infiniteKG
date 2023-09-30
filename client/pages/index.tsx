import React, { useEffect, useState } from 'react'
import Query from '../components/query';
import CytoscapeComponent from '../components/graphVisualization';
import Chat from '../components/chat';
import { ChatBotIcon } from '../assets/chatBotIcon';

const IndexPage = () => {
  const [chat, setChat] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [newData, setNewData] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false); 

  

  return (
    <div className='w-full h-full'>
      <div className='flex items-center justify-center py-3 border-b fixed w-full z-10 bg-white-custom'>
        <ChatBotIcon / >
      </div>
      <Query setGraphData={setGraphData} setChat={setChat} setIsChatVisible={setIsChatVisible} setNewData={setNewData} chat={chat} />
      <div className='flex'>
        {graphData &&  newData && <CytoscapeComponent elements={graphData} isChatVisible={isChatVisible} newData={newData} />}
        {isChatVisible && <Chat chat={chat} isChatVisible={isChatVisible} />}
      </div>
    </div>
  )
}

export default IndexPage
