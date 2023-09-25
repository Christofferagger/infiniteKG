import React, { useEffect, useState, useRef } from 'react'
import autosize from 'autosize'

const Query = ({ setGraphData, setChat, setIsChatVisible }) => {

    const [inputValue, setInputValue] = useState('');
    const [buttonClicked, setButtonClicked] = useState('Graph');
    const [knowledgeGraph, setKnowledgeGraph] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 

    const handleSubmit = () => {
        setIsLoading(true);
        fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {queryPrompt: inputValue, button: buttonClicked, existingGraph: knowledgeGraph })
        })
        .then(response => response.json())
        .then(data => {
            setGraphData(data.message.data);
            setChat(data.message.chat);
            setKnowledgeGraph(data.message.data); 
            setInputValue('');
            setIsLoading(false);
        })
    };

    const textareaRef = useRef(null);
    
    useEffect(() => {
        if (textareaRef.current) {
            autosize(textareaRef.current);
        }
    }, []);

    return (
        <div className='fixed bottom-0 inset-x-0 w-full flex items-center justify-center px-72 py-6 space-x-4 z-10 border-t bg-white-custom'>
            <div className="flex flex-col space-y-2">
                <button className={`font-bold px-1.5 py-1.5 rounded-md text-xs border ${buttonClicked === 'Graph' ? 'border border-blue-primary text-blue-primary' : 'border-transparent text-gray-300'}`}
                onClick={() => {setButtonClicked('Graph'); setIsChatVisible(false);}}>Graph</button>
                <button className={`font-bold px-1.5 py-1.5 rounded-md text-xs border ${buttonClicked === 'Chat' ? 'border border-blue-primary text-blue-primary' : 'border-transparent text-gray-300'}`}
                onClick={() => {setButtonClicked('Chat'); setIsChatVisible(true);}}>Chat</button>
            </div>
            {isLoading ? (
                <div className="mb-5 h-4 overflow-hidden rounded-full bg-gray-200 w-full min-w-min">
                    <div className="h-4 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-blue-500" style={{width: '75%'}}></div>
                </div>
            ) : (
                <textarea
                ref={textareaRef}
                rows={1}
                className="flex-grow mr-3 px-3 py-2 rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none disabled:border-gray-200 bg-white-custom"
                placeholder="Ask me anything..."
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                />
            )}
            <button
            className={`px-2.5 py-2.5 rounded-lg bg-blue-primary text-white-custom font-bold ${inputValue ? 'opacity-100' : 'opacity-50'} disabled:opacity-50`}
            onClick={handleSubmit}
            disabled={!inputValue|| isLoading}
            >
                Send
            </button>
        </div>
    )
};

export default Query