import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rec = ({ reset }) => {
    const [recommendedWord, setRecommendedWord] = useState('');
    const [len_words, setLenWords] = useState('');
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const storedSessionId = localStorage.getItem('sessionId');
        setSessionId(storedSessionId);
        console.log("Rec1 Session ID:", storedSessionId);
    }, []);

    const fetchRecommendedWord = async (sessionId) => {
        try {
            
            const response = await axios.post('http://localhost:5000/recommended_word', {
                session_id: sessionId
            });
            setRecommendedWord(response.data.recommended_word);
        } catch (error) {
            console.error('Error fetching recommended word:', error);
        }
    };

    const fetchWordData = async (sessionId) => {
        try {
            const response = await axios.post('http://localhost:5000/word_count', {
                session_id: sessionId
            });
            setLenWords(response.data.len_words);
        } catch (error) {
            console.error('Error fetching len words :', error);
        }
    };

    const getData = async () => {
        if (sessionId) {
            const storedSessionId = localStorage.getItem('sessionId');
            setSessionId(storedSessionId);
            console.log("Rec Session ID:", sessionId);
            await fetchRecommendedWord(sessionId);
            await fetchWordData(sessionId);
        }
    };

    useEffect(() => {
            
            console.log("reset has changed in WC:", reset);
            
            if (reset == true){
                setRecommendedWord('');
                setLenWords('');
            }
            
        }, [reset]);

    return (
        <div>
            <button onClick={getData}>Get Recommended Word</button>
            {recommendedWord && <p>Recommended Word: {recommendedWord}</p>}
            {len_words && <p>Number of words: {len_words}</p>}
        </div>
    );
};

export default Rec;