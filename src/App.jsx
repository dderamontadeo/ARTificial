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
        <p className="text-purple-200 mt-2 text-center">
          <strong>Exposición colectiva</strong> 
        </p>
        <p className="text-purple-200 mt-2 text-justify">
        La presente propuesta aborda la Inteligencia Artificial desde la conciencia y reflexión de su uso. Detrás de cada obra está la experimentación de los estudiantes de la Facultad de Ciencias de la Computación y la Escuela de Artes Plásticas Plásticas y Audiovisuales que participaron en el proyecto “Curso Taller Arte con Inteligencia Artificial” desarrollado en los periodos Otoño 2023 y Primavera 2024.
        Durante su estancia en el proyecto aprendieron a usar la herramienta al mismo tiempo que participaron en el debate que implica su implementación en la creación de imágenes. Las obras que veras a continuación son resultado de un proceso creativo que simplifica múltiples paso de creación, pero ten en cuenta que no lo resuelve todo y requiere un planteamiento conceptual propio.   
        Los estudiantes generaron una propuesta donde eligieron un tema que les inspirara repitiendo y registrando los pasos que fueron necesarios para lograr su imagen, mientras exploraban las posibilidades compositivas que estaban a su alcance influenciados por los conocimientos artísticos que se compartieron en el proyecto.  
        La Inteligencia Artificial es una tecnología que simboliza un cambio en la sensibilidad del ser humano que continuara desarrollándose e impactara la forma que se entiende y hace arte, guste o no, es un medio que prevalecerá a largo plazo.
        Entre mejor lo comprendamos será posible definirlo estableciendo términos y condiciones para salvaguardar el valor de la creación y creatividad como cualidades fundamentales en el desarrollo humano. 
        </p>
        <p className="text-purple-200 mt-2 text-center">
          <strong>Comite Organizador:</strong>  Diego de Ramón Tadeo, Massiel Itzel Ballesteros Victoria, Daniela Luna Rueda, Araceli Alejandra Galicia Sánchez, César Chávez Rosas,  Jesús Daniel Guevara de Ita, Renato Sanchez Loeza.
        </p>
        <p className="text-purple-200 mt-2 text-center">
          <strong>Modelado:</strong> Renato Sanchez Loeza
        </p>
        <p className="text-purple-200 mt-2 text-center">
          <strong>Curaduría:</strong> Daniela Luna Rueda
        </p>
        <a href="/galeria3d/">
            <Button className="mt-4 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors">
              Explora la galería
            </Button>
          </a>
        </div>
      </section>

      {/* Main Content*/}
      <main className="pt-4 pb-12 px-4">
        {error && (
          <div className="text-red-400 text-center mb-4">
            Nota: Usando informacion de respaldo. {error}
          </div>
        )}
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-8 w-full">
          {artworks.map((artwork) => (
            <Card
              key={artwork.id}
              className="bg-purple-900/30 border-purple-700 hover:bg-purple-800/30 transition-all duration-300 w-full"
            >
              <div className="flex flex-col lg:flex-row w-full">
                {/* Image Container*/}
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
                      <p className="text-purple-300 text-justify">{artwork.description}</p>
                      <div className="mt-4">
                        <h3 className="text-purple-200 font-semibold">Prompt:</h3>
                        <p className="text-purple-300 text-justify">{artwork.prompt}</p>
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
          <p>© Diego de Ramon Tadeo.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
