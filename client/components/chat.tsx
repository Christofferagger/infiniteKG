import React from 'react';
import ReactMarkdown from 'react-markdown';

const Chat = ({ chat }) => {

    return (
        <div className='w-1/2 ml-auto overflow-auto border pt-14 pb-24'>
            {Array.isArray(chat) && chat.length > 0 ? (
                chat.map((entry, index) => {
                    const query = entry.query;
                    const response = entry.response;

                    return (
                        <div key={index}>
                            <div className='py-8 px-6 border-b-2'>
                                <p>{query}</p>
                            </div>
                            <div className='py-8 px-6 border-b-2'>
                                <ReactMarkdown className='leading-7'>{response}</ReactMarkdown>
                            </div>
                        </div>
                    )
                })
                ) : (
                    <p>Let's get started</p>
                )}
        </div>
    )
}

export default Chat;