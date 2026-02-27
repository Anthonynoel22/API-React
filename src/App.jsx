import { useEffect, useState } from "react";
import ScrollToTop from "./ScrollToTop/ScrollToTop";

function App() {
  const [dogs, setDogs] = useState([]);
  const [breedFilter, setBreedFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDogs = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const breedsResponse = await fetch("https://dog.ceo/api/breeds/list/all");
        const breedsData = await breedsResponse.json();
        // Objects.keys extrait les noms des races su json
        const breedList = Object.keys(breedsData.message);
        
        console.log(` ${breedList.length} races trouvées`);

        
        const dogPromises = breedList.map(async (breed) => {
          try {
            const imageResponse = await fetch(
              `https://dog.ceo/api/breed/${breed}/images/random`
            );
            const imageData = await imageResponse.json();
            
            // Vérifier si l'image existe
            if (imageData.status === "success") {
              return {
                id: breed,
                //mais la première lettre en majuscule du nom races de chiens 
                breed: breed[0].toUpperCase() + breed.slice(1),
                image: imageData.message,
              };
            }
            return null;
          } catch (error) {
            console.log(` Race ${breed} indisponible ` + error);
            return null;
          }
        });

        // Attendre TOUS les résultats
        const dogsWithImages = (await Promise.all(dogPromises)).filter(Boolean);
        console.log(` ${dogsWithImages.length} chiens avec images`);
        
        setDogs(dogsWithImages);
      } catch (error) {
        setError("Erreur chargement: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDogs();
  }, []);

  const findedDogs = Array.isArray(dogs) ? dogs : [];

  const filteredDogs = findedDogs.filter((dog) =>
    dog.breed.toLowerCase().includes(breedFilter.toLowerCase())
  );
  
  const displayDogs =  filteredDogs;

  return (
    <div className="dog-app">
      <h1>🐕 API sur les Chiens</h1>
      
      <div className="app-info">
        Dog CEO API - {displayDogs.length} / {findedDogs.length} races affichées
      </div>

      <div className="controls">
        <label>
          Filtrer par race :
          <input
            type="text"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            placeholder="labrador, husky ..."
          />
        </label>

      </div>

      {loading && <p className="loading">⏳ Chargement de toutes les races ({findedDogs.length} trouvées)...</p>}
      {error && <p className="error"> {error}</p>}

      <div className="dogs-grid">
        {displayDogs.map((dog) => (
          <div key={dog.id} className="dog-card">
            <img 
              src={dog.image} 
              alt={`Chien ${dog.breed}`}
              className="dog-image"
            />
            <h3 className="dog-breed">{dog.breed}</h3>
          </div>
        ))}
      </div>

      <div className="stats">
        <p>📊 {displayDogs.length} / {findedDogs.length} races </p>
      </div>
      <ScrollToTop />
    </div>
  );
}

export default App;
