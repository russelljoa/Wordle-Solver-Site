import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rec = () => {
    const [recommendedWord, setRecommendedWord] = useState('');
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const storedSessionId = localStorage.getItem('sessionId');
        setSessionId(storedSessionId);
    }, []);

    const fetchRecommendedWord = async () => {
        try {
            const response = await axios.post('http://localhost:5000/recommended_word', {
                session_id: sessionId // Use the actual session ID
            });
            setRecommendedWord(response.data.recommended_word);
        } catch (error) {
            console.error('Error fetching recommended word:', error);
        }
    };

    return (
        <div>
            <button onClick={fetchRecommendedWord}>Get Recommended Word</button>
            {recommendedWord && <p>Recommended Word: {recommendedWord}</p>}
        </div>
    );
};

export default Rec;