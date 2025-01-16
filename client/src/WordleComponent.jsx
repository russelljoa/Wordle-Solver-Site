import React, { useState, useEffect } from 'react';
import WordleLine from './WordleLine';

function WordleComponent({ reset }) {
    const [lines, setLines] = useState([0]);
    const [word, setWord] = useState('');
    const [colors, setColors] = useState('');
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        console.log("reset has changed in WC:", reset);
        
        if (reset === true) {
            setLines([0]);
            setResetKey(prevKey => prevKey + 1); // Update the key to force re-render
        }
    }, [reset]);

    const handleSubmit = () => {
        if (lines.length < 6) {
            setLines([...lines, lines.length]);
        }
    };

    return (
        <div>
            {lines.map((lineIndex) => (
                <WordleLine word={word} colors={colors} key={`${lineIndex}-${resetKey}`} onSubmit={handleSubmit} />
            ))}
        </div>
    );
}

export default WordleComponent;