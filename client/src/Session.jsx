import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Session({ reset }) {
  const url = "http://localhost:5000";
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId'));

  useEffect(() => {
    if (!sessionId) {
      fetch(`${url}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then(res => res.json()).then(sessionData => {
        setSessionId(sessionData.id);
        localStorage.setItem('sessionId', sessionData.id);
        console.log("Session ID:", sessionData.id);
      });
    }
  }, []);

  const refreshSession = async () => {
    if (sessionId) {
      try {
        await axios.post(`${url}/deletesession`, { sessionId: sessionId }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const response = await axios.post(`${url}/session`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const sessionData = response.data;
        setSessionId(sessionData.id);
        localStorage.setItem('sessionId', sessionData.id);
        console.log("New Session ID:", sessionData.id);

        reset(); // calls the reset function from parent
      } catch (error) {
        console.error("Error refreshing session:", error);
      }
    }
  };

  return (
    <div>
      <p>Session ID: {sessionId}</p>
      <button onClick={refreshSession}>Restart Solver</button>
    </div>
  );
}

export default Session;
