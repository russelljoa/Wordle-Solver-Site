import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Session from './Session';
import Header from './Header';
import Rec from './Rec';
import WordleComponent from './WordleComponent';
import reportWebVitals from './reportWebVitals';

// BIG TODO: make the session ID passed from the session component the rest of the components
// TODO impliment the win
const App = () => {
  const [reset, setReset] = useState(false);

  function onReset() {
    setReset(true);
    setTimeout(() => setReset(false), 30);
  }

  return (
    <React.StrictMode>
      <Header />
      <Session reset={onReset} />
      <WordleComponent reset={reset} />
      <Rec reset={reset} />
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
