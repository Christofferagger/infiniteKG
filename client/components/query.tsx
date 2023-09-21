import React, { useEffect, useState, useRef } from 'react'
import autosize from 'autosize'

const Query = ({ setGraphData, setChat }) => {

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {query: inputValue })
        })
        .then(response => response.json())
        .then(data => {
            setGraphData(data.message.data);
            setChat(data.message.chat);
        })
        console.log('Got cyrograph data');
    };

    const textareaRef = useRef(null);
    
    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, []);

    return (
        <div className='fixed bottom-0 inset-x-0 w-full flex items-center justify-center px-72 py-6 space-x-2 z-10 border-t bg-white-custom'>
            <textarea
            ref={textareaRef}
            rows={1}
            className="flex-grow mr-3 px-3 py-2 rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none disabled:border-gray-200 bg-white-custom"
            placeholder="Prompt"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            />
            <button
            className={`px-2.5 py-3 rounded-lg bg-blue-primary text-white-custom font-bold ${inputValue ? 'opacity-100' : 'opacity-50'} disabled:opacity-50`}
            onClick={handleSubmit}
            disabled={!inputValue}
            >
                Send
            </button>
        </div>
    )
};

export default Query