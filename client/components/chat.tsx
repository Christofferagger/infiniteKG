import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';


const Chat = ({ chat, isChatVisible }) => {

    const endOfChatRef = useRef(null);
    const [wsChat, setWsChat] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001'); // Replace with your server URL

        ws.onmessage = (event) => {
            const { token } = JSON.parse(event.data);
            setWsChat(prevChat => [...prevChat, token]);
        };
    
        return () => {
            ws.close();
        };

    }, []);

    return (
        <div className={isChatVisible ? 'w-1/2 ml-auto overflow-auto border pt-14 pb-24' : 'w-full ml-auto overflow-auto border pt-14 pb-24'}>
            {wsChat.length > 0 ? (
            wsChat.map((token, index) => (
                <div key={index} className='py-8 px-6 border-b-2 space-y-1'>
                    <div className='h-0.5 w-5 bg-border-blue border-1.5 border-border-blue rounded-full'></div>
                    <ReactMarkdown
                    className='leading-7'
                    components={{
                        p: ({node, ...props}) => <p {...props} className="mb-2" />
                    }}
                    >
                        {token}
                    </ReactMarkdown>
                </div>
            ))
            ) : (
                <p>Let's get started</p>
            )}
        </div>
    )
}

export default Chat;