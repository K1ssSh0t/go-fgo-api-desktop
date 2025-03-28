import { useState, useEffect } from 'react';
import logo from './assets/images/logo-universal.png';
import { GetAllCharacters, GetServantDetail } from "../wailsjs/go/main/App";
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
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "./components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "./components/ui/carousel";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";

import { main } from "../wailsjs/go/models";
type Character = main.Character;
type ServantDetail = main.ServantDetail;

function AppContent() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedServant, setSelectedServant] = useState<ServantDetail | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [currentIndex, setCurrentIndex] = useState(0);

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

    // Listen to carousel changes
    useEffect(() => {
        if (!carouselApi) {
            return;
        }

        const onSelect = () => {
            setCurrentIndex(carouselApi.selectedScrollSnap());
        };

        carouselApi.on("select", onSelect);
        return () => {
            carouselApi.off("select", onSelect);
        };
    }, [carouselApi]);

    // Reset current index when dialog closes
    useEffect(() => {
        if (!detailsOpen) {
            setCurrentIndex(0);
            // También podemos resetear selectedServant si es necesario
            // setSelectedServant(null);
        }
    }, [detailsOpen]);

    function getAllCharacters() {
        setLoading(true);
        GetAllCharacters().then(result => {
            setCharacters(result);
            setFilteredCharacters(result);
            setLoading(false);
        });
    }

    function loadServantDetails(collectionNo: number) {
        setDetailsLoading(true);
        setDetailsOpen(true);
        // Reset the current index when loading a new servant
        setCurrentIndex(0);
        // Reset the carousel to the first position if API is available
        if (carouselApi) {
            carouselApi.scrollTo(0);
        }

        GetServantDetail(collectionNo.toString()).then(result => {
            setSelectedServant(result);
            setDetailsLoading(false);
        }).catch(error => {
            console.error("Error loading servant details:", error);
            setDetailsLoading(false);
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

    // Imágenes del personaje
    const characterImages = () => {
        const images: string[] = [];
        if (selectedServant?.extraAssets?.charaGraph?.ascension) {
            Object.values(selectedServant.extraAssets.charaGraph.ascension).forEach(url => {
                images.push(url as string);
            });
        }
        if (selectedServant?.extraAssets?.charaGraph?.costume) {
            Object.values(selectedServant.extraAssets.charaGraph.costume).forEach(url => {
                images.push(url as string);
            });
        }
        return images;
    };

    return (
        <div id="App" className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

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
                                    <TableRow
                                        key={index}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => loadServantDetails(character.collectionNo)}
                                    >
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

            <Dialog
                open={detailsOpen}
                onOpenChange={(open) => {
                    setDetailsOpen(open);
                    if (!open) {
                        // Al cerrar, resetear el índice
                        setCurrentIndex(0);
                        // Opcionalmente, limpiar el personaje seleccionado
                        // setSelectedServant(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-4xl max-h-[98vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center items-center">
                            {detailsLoading ?
                                <Skeleton className="h-8 w-[200px]" /> :
                                <span>{selectedServant?.name} <span className="text-muted-foreground text-sm">({selectedServant?.originalName})</span></span>
                            }

                        </DialogTitle>
                        <DialogDescription className="capitalize text-center">
                            {detailsLoading ? <Skeleton className="h-4 w-full mt-2 " /> : `Clase: ${selectedServant?.className} ⭐${selectedServant?.rarity}`}
                        </DialogDescription>
                    </DialogHeader>

                    {detailsLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-[300px] w-full" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <h3 className="font-semibold mb-1">CV</h3>
                                    <p>{selectedServant?.profile?.cv || 'No disponible'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Ilustrador</h3>
                                    <p>{selectedServant?.profile?.illustrator || 'No disponible'}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Imágenes</h3>
                                {characterImages().length > 0 ? (
                                    <>
                                        <Carousel className="w-full" setApi={setCarouselApi}>
                                            <CarouselContent>
                                                {characterImages().map((img, idx) => (
                                                    <CarouselItem key={idx}>
                                                        <div className="p-1">
                                                            <div className="overflow-hidden rounded-md border flex items-center justify-center bg-muted/10 h-[500px]">
                                                                <img
                                                                    src={img}
                                                                    alt={`${selectedServant?.name} - Imagen ${idx + 1}`}
                                                                    className="max-h-full max-w-full object-contain"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-2" />
                                            <CarouselNext className="right-2" />
                                        </Carousel>
                                        <div className="text-center text-sm text-muted-foreground mt-2">
                                            Imagen {currentIndex + 1} de {characterImages().length}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">No hay imágenes disponibles</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="fgo-ui-theme">
            <AppContent />
        </ThemeProvider>
    );
}

export default App
