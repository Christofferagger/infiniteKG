import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); 

const Chat = ({ chat, isChatVisible }) => {

    const endOfChatRef = useRef(null);
    const [tokens, setTokens] = useState([]); 

    useEffect(() => {
        endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    useEffect(() => {
        socket.on('token', (token) => {
            setTokens((prevTokens) => [...prevTokens, token]);
        });

        return () => {
            socket.off('token');
        };
    }, [tokens]);

    return (
        <div className={isChatVisible ? 'w-1/2 ml-auto overflow-auto border pt-14 pb-24' : 'w-full ml-auto overflow-auto border pt-14 pb-24'}>
            {Array.isArray(chat) && chat.length > 0 ? (
                chat.map((entry, index) => {
                    const query = entry.query;
                    const response = entry.response;

                    return (
                        <div key={index}>
                            <div className='py-8 px-6 border-b-2 space-y-1'>
                            <div className='h-0.5 w-5 bg-border-purple border-1.5 border-border-purple rounded-full'></div>
                                <p>{query}</p>
                            </div>
                            <div className='py-8 px-6 border-b-2 space-y-1'>
                                <div className='h-0.5 w-5 bg-border-blue border-1.5 border-border-blue rounded-full'></div>
                                <ReactMarkdown 
                                    className='leading-7'
                                    components={{
                                        p: ({node, ...props}) => <p {...props} className="mb-2" />
                                    }}
                                >
                                    {tokens.join('')}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )
                })
                ) : (
                    <p>Let's get started</p>
                )}
                <div ref={endOfChatRef} />
        </div>
    )
}

export default Chat;