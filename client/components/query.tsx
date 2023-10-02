import React, { useEffect, useState, useRef } from 'react';
import autosize from 'autosize';

const Query = ({ setGraphData, setChat, setIsChatVisible, setNewData, chat, setPushTokens, pushTokens }) => {

    const [inputValue, setInputValue] = useState('');
    const [buttonClicked, setButtonClicked] = useState('Graph');
    const [isLoading, setIsLoading] = useState(false); 

    const loadingMessage = "Loading Graph...";

    // Handle submit when user sends a question
    const handleSubmit = () => {
        setIsLoading(true);
        const initialButtonClicked = buttonClicked;
        setButtonClicked('Chat');
        setIsChatVisible(true);
        setPushTokens(false);
        
        // Add new chat entry
        setChat(prevChat => [...prevChat, { query: inputValue, response: null }]);

        // Fetch data from the API
        fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {queryPrompt: inputValue, button: buttonClicked })
        })
        .then(response => response.json())
        .then(data => {
            setGraphData(data.message.data);
            setNewData(data.message.newData);
            setInputValue('');
            setIsLoading(false);
            if (initialButtonClicked === 'Graph') {
                setButtonClicked('Graph');
            };
            setIsChatVisible(false);
            setPushTokens(true);
        })
    };

    const textareaRef = useRef(null);
    
    // Autosize textarea
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
            className={`flex-grow mr-3 px-3 py-2 rounded-md border border-gray-200 focus:border-blue-primary focus:outline-none disabled:border-gray-200 bg-white-custom ${isLoading ? 'text-gray-400' : ''}`}
            placeholder="Ask me anything..."
            onChange={(e) => setInputValue(e.target.value)}
            value={isLoading ? loadingMessage : inputValue}
            disabled={isLoading}
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