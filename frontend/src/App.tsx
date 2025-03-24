import { useState } from 'react';
import logo from './assets/images/logo-universal.png';
import { Greet } from "../wailsjs/go/main/App";
import { GetAllCharacters } from "../wailsjs/go/main/App";
import { Button } from './components/ui/button';
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
        <div id="App" className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <img src={logo} id="logo" alt="logo" className="w-32 h-32 mb-8" />
            <div id="result" className="text-2xl font-semibold text-foreground mb-6">{resultText}</div>
            <div id="input" className="flex gap-4 mb-8">
                <input
                    id="name"
                    onChange={updateName}
                    autoComplete="off"
                    name="input"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button
                    onClick={greet}
                    variant="default"
                    size="default"
                >
                    Greet test
                </Button>
            </div>
            <div id="characters" className="p-4 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
                <p className="text-lg">Characters: {dato}</p>
            </div>
        </div>
    )
}

export default App
