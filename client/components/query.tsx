import React, { useEffect, useState, useRef } from 'react'
import autosize from 'autosize'

const Query = ({ setGraphData, setChat }) => {

    const [inputValue, setInputValue] = useState('');
    const [buttonClicked, setButtonClicked] = useState('Build Graph');

    const handleSubmit = () => {
        fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {queryPrompt: inputValue, button: buttonClicked })
        })
        .then(response => response.json())
        .then(data => {
            setGraphData(data.message.data);
            setChat(data.message.chat);
        })
        if (buttonClicked === 'Build Graph') { 
            setButtonClicked('Question Graph');
        }
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
            <div className="flex flex-col space-y-3">
                <button className={`font-bold px-1.5 py-1.5 rounded-md text-xs border ${buttonClicked === 'Build Graph' ? 'border border-blue-primary text-blue-primary' : 'border-transparent text-gray-300'}`}
                onClick={() => setButtonClicked('Build Graph')}>Build Graph</button>
                <button className={`font-bold px-1.5 py-1.5 rounded-md text-xs border ${buttonClicked === 'Question Graph' ? 'border border-blue-primary text-blue-primary' : 'border-transparent text-gray-300'}`}
                onClick={() => setButtonClicked('Question Graph')}>Question Graph</button>
            </div>
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