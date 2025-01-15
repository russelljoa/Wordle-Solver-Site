import React, { useState } from 'react';
import WordleLine from './WordleLine';

const WordleComponent = () => {
    const [lines, setLines] = useState([0]);

    const handleSubmit = () => {
        if (lines.length < 6) {
            setLines([...lines, lines.length]);
        }
    };

    return (
        <div>
            {lines.map((lineIndex) => (
                <WordleLine key={lineIndex} onSubmit={handleSubmit} />
            ))}
        </div>
    );
};

export default WordleComponent;