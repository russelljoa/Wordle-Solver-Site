import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const WordleLine = ({ onSubmit, word, colors }) => {

    if (!word) {
        word = Array(5).fill('');
    }
    else {
        word = word.split('');
    }
    const [localWord, setLocalWord] = useState(word);

    if (!colors) {
        colors = Array(5).fill('grey');
    }
    const [localColors, setLocalColors] = useState(colors);
    
    const [submitted, setSubmitted] = useState(false);
    const [isWordFilled, setIsWordFilled] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const inputRefs = useRef([]);

    useEffect(() => {
        const storedSessionId = localStorage.getItem('sessionId');
        setSessionId(storedSessionId);
        console.log("WordLine Session ID:", storedSessionId);
    }, []);

    const handleChange = (e, index) => {
        if (submitted) return;
        const value = e.target.value.toUpperCase();
        if (/^[A-Z]$/.test(value) || value === '') {
            const newWord = [...localWord];
            newWord[index] = value;
            setLocalWord(newWord);
            setIsWordFilled(newWord.every(letter => letter !== ''));
            if (value && index < 4) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (index > 0 && !localWord[index]) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleClick = (index) => {
        if (submitted) return;
        inputRefs.current[index].focus();
        const newColors = [...localColors];
        switch (newColors[index]) {
            case 'grey':
                newColors[index] = 'yellow';
                break;
            case 'yellow':
                newColors[index] = 'green';
                break;
            case 'green':
                newColors[index] = 'grey';
                break;
            default:
                newColors[index] = 'grey';
        }
        setLocalColors(newColors);
    };

    const handleSubmit = async () => {
        if (isWordFilled) {
            const wordString = localWord.join('');
            const colorsString = localColors.map(color => {
                switch (color) {
                    case 'grey': return '0';
                    case 'yellow': return '1';
                    case 'green': return '2';
                    default: return '0';
                }
            }).join('');

            console.log("Data sent to /handleword:", { word: wordString, colors: colorsString, session_id: sessionId });
            const storedSessionId = localStorage.getItem('sessionId');
            setSessionId(storedSessionId);
            console.log("Handlesub Session ID:", sessionId);
            try {
                const response = await axios.post("http://localhost:5000/handleword", {
                    word: wordString,
                    colors: colorsString,
                    session_id: sessionId
                }, {
                    headers: { "Content-Type": "application/json" }
                });
                console.log("Data sent to /handleword:", { word: wordString, colors: colorsString, session_id: sessionId });

                const result = response.data;
                if (result.status === "success") {
                    setSubmitted(true);
                }
                if (localWord.every(letter => letter !== '')) {
                    setIsWordFilled(true);
                }
            } catch (error) {
                console.error("Error sending data to /handleword:", error);
            }
        }

        if (onSubmit && isWordFilled) {
            onSubmit();
        }
    };

    return (
        <div>
            {localWord.map((letter, index) => (
                <input
                    key={index}
                    type="text"
                    value={letter}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onClick={() => handleClick(index)}
                    ref={el => inputRefs.current[index] = el}
                    maxLength={1}
                    readOnly={submitted}
                    style={{
                        width: '40px',
                        height: '40px',
                        textAlign: 'center',
                        fontSize: '24px',
                        margin: '5px',
                        backgroundColor: localColors[index]
                    }}
                />
            ))}
            <button onClick={handleSubmit} disabled={submitted}>
                Submit
            </button>
        </div>
    );
}

export default WordleLine;