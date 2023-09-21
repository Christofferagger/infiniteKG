import React, { useEffect } from 'react';

const Chat = ({ chat }) => {

    console.log(chat);
    return (
        <div className='w-1/2 ml-auto overflow-auto border pt-14'>
            <p>this is a chat</p>
        </div>
    )
}

export default Chat;