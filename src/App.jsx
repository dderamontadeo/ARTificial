import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const App = () => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const response = await fetch('/datosobras.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar');
        }
        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        setError(err.message);
        const fallbackData = Array.from({ length: 37 }, (_, i) => ({
          id: i + 1,
          title: `Trabajo${i + 1}`,
          artist: `Artista ${i + 1}`,
          description: 'Descripción generica"',
          image: `/src/obras/baseColor_${i + 1}.webp`,
          prompt: `Prompt generico ${i + 1}.`,
          tools: `Herramienta de IA ${i + 1}`,
        }));
        setArtworks(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, []);

  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 to-purple-950 flex items-center justify-center fixed top-0 left-0">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-purple-100 text-xl font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950">
    {/* Header Section */}
    <section className="bg-purple-950/80 backdrop-blur-sm w-full pt-12 pb-8">
      <div className="w-full px-4 text-center">
        <h1 className="text-4xl font-bold text-purple-100">
          ARTificial
        </h1>
        <p className="text-purple-200 mt-2 text-lg">
          <strong>Comite Organizador:</strong>  Diego de Ramón Tadeo, Massiel Itzel Ballesteros Victoria, , Daniela Luna Rueda, Araceli Alejandra Galicia Sánchez, César Chávez Rosas,  Jesús Daniel Guevara de Ita, Renato Sanchez Loeza
        </p>
        <a href="/galeria3d/">
            <Button className="mt-4 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors">
              Explora la galería
            </Button>
          </a>
        </div>
      </section>

      {/* Main Content - Gallery Grid */}
      <main className="pt-4 pb-12 px-4">
        {error && (
          <div className="text-red-400 text-center mb-4">
            Note: Using fallback data. {error}
          </div>
        )}
        {/* Gallery Grid - One artwork at a time */}
        <div className="grid grid-cols-1 gap-8 w-full">
          {artworks.map((artwork) => (
            <Card
              key={artwork.id}
              className="bg-purple-900/30 border-purple-700 hover:bg-purple-800/30 transition-all duration-300 w-full"
            >
              <div className="flex flex-col lg:flex-row w-full">
                {/* Image Container - Now preserves aspect ratio */}
                <div className="lg:w-1/2 flex items-center justify-center p-4">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="max-w-full h-auto max-h-[600px] object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="lg:w-1/2 p-4">
                  <CardHeader>
                    <CardTitle className="text-purple-100">{artwork.title}</CardTitle>
                    <p className="text-purple-300">{artwork.artist}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="text-purple-200 font-semibold">Descripción:</h3>
                      <p className="text-purple-300">{artwork.description}</p>
                      <div className="mt-4">
                        <h3 className="text-purple-200 font-semibold">Prompt:</h3>
                        <p className="text-purple-300">{artwork.prompt}</p>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-purple-200 font-semibold">Herramienta:</h3>
                        <p className="text-purple-300">{artwork.tools}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-950/80 backdrop-blur-sm py-6">
        <div className="w-full px-4 text-center text-purple-300">
          <p>© 2025 dderamontadeo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
