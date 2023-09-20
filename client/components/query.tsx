import React, { useEffect, useState } from 'react'

const Query = ({ setGraphData }) => {

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        fetch('http://localhost:3001/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {query: inputValue })
        })
        .then(response => response.json())
        .then(data => setGraphData(data.message))
        console.log('Got cyrograph data');
    };

    return (
        <div>
            <textarea
            placeholder="Prompt"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            />
            <button
            onClick={handleSubmit}
            >
                Send
            </button>
        </div>
    )
};

export default Query