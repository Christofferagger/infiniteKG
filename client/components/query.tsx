import React, { useEffect, useState, useRef } from 'react';
import autosize from 'autosize';

const Query = ({ setGraphData, setChat, setIsChatVisible, setNewData }) => {

    const [inputValue, setInputValue] = useState('');
    const [buttonClicked, setButtonClicked] = useState('Graph');
    const [knowledgeGraph, setKnowledgeGraph] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const [loadingMessage, setLoadingMessage] = useState('Processing...');
    const [opacity, setOpacity] = useState(1);

    const loadingMessages = ['Refining...', 'Still working...', 'Almost done...', 'Purifying...', 'It takes time for the seed you plant to bloom. Have the patience not to pluck them too soon...', 'Patience is the road to wisdom...', "Everything great takes time..."];

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isLoading) {
                setOpacity(0);
                setTimeout(() => {
                    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
                    setLoadingMessage(loadingMessages[randomIndex]);
                    setOpacity(1);
                }, 500); 
            }
        }, 3500);
    
        return () => clearInterval(intervalId); 
    }, [isLoading]);

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
            setNewData(data.message.newData);
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
        <div className='fixed bottom-0 inset-x-0 w-full flex items-center justify-center px-72 py-6 space-x-3 z-10 border-t bg-white-custom'>
            <div className="flex flex-col space-y-2">
                <button className={`font-bold px-1.5 py-1.5 rounded-md text-xs border ${buttonClicked === 'Graph' ? 'border border-blue-primary text-blue-primary' : 'border-transparent text-gray-300'}`}
                onClick={() => {setButtonClicked('Graph'); setIsChatVisible(false);}}>Graph</button>
                <button className={`font-bold px-1.5 py-1.5 rounded-md text-xs border ${buttonClicked === 'Chat' ? 'border border-blue-primary text-blue-primary' : 'border-transparent text-gray-300'}`}
                onClick={() => {setButtonClicked('Chat'); setIsChatVisible(true);}}>Chat</button>
            </div>
            <textarea
            ref={textareaRef}
            rows={1}
            className="flex-grow mr-3 px-3 py-2 rounded-md border border-gray-200 focus:border-blue-primary focus:outline-none disabled:border-gray-200 bg-white-custom"
            placeholder="Ask me anything..."
            onChange={(e) => setInputValue(e.target.value)}
            value={isLoading ? loadingMessage : inputValue}
            disabled={isLoading}
            style={{ opacity: opacity, transition: 'opacity 0.5s' }}
            />
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