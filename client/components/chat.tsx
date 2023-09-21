import React, { useEffect } from 'react';

const Chat = ({ chat }) => {

    console.log(chat);
    return (
        <div className='w-1/2 ml-auto overflow-auto border pt-14 pb-24'>
            {Array.isArray(chat) && chat.length > 0 ? (
                chat.map((entry, index) => {
                    const query = entry.query;
                    const response = entry.response;

                    return (
                        <div key={index}>
                            <div>
                                <p>{query}</p>
                            </div>
                            <div>
                                <p>{response}</p>
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