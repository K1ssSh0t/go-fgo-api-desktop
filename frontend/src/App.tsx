import { useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import { Greet } from "../wailsjs/go/main/App";
import { GetAllCharacters } from "../wailsjs/go/main/App";
function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);
    const [dato, setDato] = useState("");

    function greet() {
        Greet(name).then(updateResultText);
        getAllCharacters();
    }
    function getAllCharacters() {
        GetAllCharacters().then(result => {
            setDato(result);
        });
    }

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo" />
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text" />
                <button className="btn" onClick={greet}>Greet</button>
            </div>
            <div id="characters" className="characters">
                <p>Characters:{dato}</p>
            </div>
        </div>
    )
}

export default App
