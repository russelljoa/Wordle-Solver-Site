import React, { useState, useEffect } from 'react'

function App() {
  const url = "http://localhost:5000"
  const [data, setData] = useState([{}])
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'))

  useEffect(() => {
    // Check if session ID is already set
    if (!sessionId) {
      // Fetch session ID from the server using POST
      fetch(`${url}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* your data if needed */ }),
      }).then(
        res => res.json()
      ).then(
        sessionData => {
          setSessionId(sessionData.id)
          localStorage.setItem('sessionId', sessionData.id)
          console.log("Session ID:", sessionData.id)
        }
      )
    }

  }, [sessionId])

  const refreshSession = () => {
    if (sessionId) {
      // Send a POST request to delete the current session
      fetch(`${url}/deletesession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      }).then(() => {
        // Fetch a new session ID from the server using POST
        fetch(`${url}/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ /* your data if needed */ }),
        }).then(
          res => res.json()
        ).then(
          sessionData => {
            setSessionId(sessionData.id)
            localStorage.setItem('sessionId', sessionData.id)
            console.log("New Session ID:", sessionData.id)
          }
        )
      })
    }
  }

  return (
    <div>
      <p>Session ID: {sessionId}</p>
      <button onClick={refreshSession}>Restart Solver</button>
      
      {/* other components */}
    </div>
  )
}

export default App
