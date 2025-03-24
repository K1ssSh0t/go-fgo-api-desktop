package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Character representa la estructura de cada personaje del juego
type Character struct {
	CollectionNo int    `json:"collectionNo"` // ID único del personaje
	Name         string `json:"name"`         // Nombre del personaje
	ClassName    string `json:"className"`    // Clase del personaje (Saber, Archer, etc.)
	Face         string `json:"face"`         // URL de la imagen del rostro
}

// GetAllCharacters obtiene la lista completa de personajes desde la API de Atlas Academy.
// Retorna un slice de Character. Si ocurre algún error, retorna un slice vacío.
func (a *App) GetAllCharacters() []Character {
	url := "https://api.atlasacademy.io/export/JP/basic_servant_lang_en.json"
	resp, err := http.Get(url)
	if err != nil {
		return []Character{}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return []Character{}
	}

	var characters []Character
	err = json.Unmarshal(body, &characters)
	if err != nil {
		return []Character{}
	}

	return characters
}

// ServantDetail representa la estructura detallada de un personaje específico
type ServantDetail struct {
	Name         string `json:"name"`         // Nombre del personaje
	OriginalName string `json:"originalName"` // Nombre original en japonés
	ClassName    string `json:"className"`    // Clase del personaje
	Rarity       int    `json:"rarity"`      // Rareza del personaje (1-5 estrellas)
	Profile      struct {
		CV          string `json:"cv"`          // Nombre del actor de voz
		Illustrator string `json:"illustrator"` // Nombre del ilustrador
	} `json:"profile"`
	ExtraAssets struct {
		CharaGraph struct {
			Ascension map[string]string `json:"ascension"` // Imágenes de ascensión
			Costume   map[string]string `json:"costume"`   // Imágenes de trajes alternativos
		} `json:"charaGraph"`
	} `json:"extraAssets"`
}

// GetServantDetail obtiene la información detallada de un personaje específico.
// Parámetros:
//   - collectionNo: ID único del personaje a consultar
//
// Retorna un ServantDetail con la información completa del personaje.
// Si ocurre algún error, retorna una estructura ServantDetail vacía.
func (a *App) GetServantDetail(collectionNo string) ServantDetail {
	url := fmt.Sprintf("https://api.atlasacademy.io/nice/JP/servant/%s?lore=true&lang=en", collectionNo)
	resp, err := http.Get(url)
	if err != nil {
		return ServantDetail{}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ServantDetail{}
	}

	var servant ServantDetail
	err = json.Unmarshal(body, &servant)
	if err != nil {
		return ServantDetail{}
	}

	return servant
}
