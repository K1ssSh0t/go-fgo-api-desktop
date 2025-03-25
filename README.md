# FGO Servant Explorer

## Acerca de

FGO Servant Explorer es una aplicación de escritorio que te permite explorar y visualizar información sobre los sirvientes del juego Fate/Grand Order. Desarrollada con Wails y React, ofrece una interfaz elegante para navegar por la base de datos de personajes.

## Características

- **Listado completo de sirvientes**: Visualiza todos los personajes del juego con sus nombres y clases
- **Búsqueda rápida**: Filtra sirvientes por nombre
- **Vista detallada**: Accede a información específica de cada sirviente
- **Galería de imágenes**: Explora las diferentes ascensiones y trajes de cada personaje
- **Modo oscuro**: Cambia entre tema claro y oscuro según tus preferencias

## Tecnologías

- **Backend**: Go con Wails para la integración con el frontend
- **Frontend**: React + TypeScript
- **UI**: Componentes de shadcn/ui basados en Tailwind CSS
- **API**: Conexión con la API de Atlas Academy para obtener los datos de FGO

## Desarrollo

Para ejecutar la aplicación en modo de desarrollo:

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
wails dev
```

Esto ejecutará un servidor de desarrollo Vite que proporcionará recarga en caliente de tus cambios frontend. También hay un servidor de desarrollo que se ejecuta en http://localhost:34115 para acceder a los métodos de Go desde el navegador.

## Compilación

Para compilar un paquete redistribuible en modo producción:

```bash
wails build
```

## Estructura del proyecto

- `app.go`: Contiene la lógica del backend y las funciones para obtener datos de la API
- `frontend/src/App.tsx`: Componente principal de React que muestra la interfaz de usuario
- `frontend/src/components/`: Componentes de UI reutilizables
- `build/`: Archivos de configuración para la compilación en diferentes plataformas

## Personalización

Puedes configurar el proyecto editando `wails.json`. Más información sobre la configuración del proyecto se puede encontrar aquí: https://wails.io/docs/reference/project-config
