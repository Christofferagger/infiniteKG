import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const IndexPage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
    .then(response => response.json())
    .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Next-app</h1>
      <p>{message}</p>
    </div>
  )
}

export default IndexPage
