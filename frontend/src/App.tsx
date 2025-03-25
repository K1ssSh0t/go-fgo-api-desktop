import { useState, useEffect } from 'react';
import logo from './assets/images/logo-universal.png';
import { Greet } from "../wailsjs/go/main/App";
import { GetAllCharacters } from "../wailsjs/go/main/App";
import { Button } from './components/ui/button';
import { Card, CardContent } from "./components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
import { Skeleton } from "./components/ui/skeleton";
import { Input } from "./components/ui/input";
import { Search } from "lucide-react";

import { main } from "../wailsjs/go/models";
type Character = main.Character;

function App() {

    const [characters, setCharacters] = useState<Character[]>([]);
    const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar personajes cuando el componente se monte
        getAllCharacters();
    }, []);

    // Efecto para filtrar personajes cuando cambia el término de búsqueda
    useEffect(() => {
        if (characters.length > 0) {
            const filtered = characters.filter(character =>
                character.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCharacters(filtered);
        }
    }, [searchTerm, characters]);


    function getAllCharacters() {
        setLoading(true);
        GetAllCharacters().then(result => {
            setCharacters(result);
            setFilteredCharacters(result);
            setLoading(false);
        });
    }

    // Componente para renderizar filas skeleton durante la carga
    const SkeletonRows = () => {
        return Array(10).fill(0).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
                <TableCell>
                    <Skeleton className="h-12 w-12 rounded-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <div id="App" className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">


            <Card className="w-full max-w-4xl mb-4">
                <CardContent className="pt-6">
                    <div className="relative flex items-center mb-4">
                        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar personajes por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                        {!loading && `Mostrando ${filteredCharacters.length} de ${characters.length} personajes`}
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Clase</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <SkeletonRows />
                            ) : (
                                filteredCharacters.map((character, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={character.face} alt={character.name} />
                                                <AvatarFallback>{character.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{character.name}</TableCell>
                                        <TableCell className="capitalize">{character.className}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default App
