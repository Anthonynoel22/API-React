import { useEffect, useState } from "react";

function App() {
  const [dogs, setDogs] = useState([]);
  const [breedFilter, setBreedFilter] = useState("");
  const [sortByBreed, setSortByBreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllDogsWithBreeds = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const breedsResponse = await fetch("https://dog.ceo/api/breeds/list/all");
        const breedsData = await breedsResponse.json();
        // Objects.keys les noms des races en objet json
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
                //mais la première lettre en majuscule
                breed: breed[0].toUpperCase() + breed.slice(1),
                image: imageData.message,
                habitat: "Domestique"
              };
            }
            return null;
          } catch (error) {
            console.log(` Race ${breed} indisponible`);
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

    fetchAllDogsWithBreeds();
  }, []);

  const safeDogs = Array.isArray(dogs) ? dogs : [];
  const filteredDogs = safeDogs.filter((dog) =>
    dog.breed.toLowerCase().includes(breedFilter.toLowerCase())
  );
  const sortedDogs = [...filteredDogs].sort((a, b) =>
    a.breed.localeCompare(b.breed)
  );
  const toDisplay = sortByBreed ? sortedDogs : filteredDogs;

  return (
    <div className="dog-app">
      <h1>🐕 Toutes les Races de Chiens</h1>
      
      <div className="app-info">
        Dog CEO API - {toDisplay.length} / {safeDogs.length} races affichées
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

        <button 
          className="sort-btn"
          onClick={() => setSortByBreed((prev) => !prev)}
        >
          {sortByBreed ? "🔽 Désactiver tri" : "🔼 Trier par race"}
        </button>
      </div>

      {loading && <p className="loading">⏳ Chargement de toutes les races ({safeDogs.length} trouvées)...</p>}
      {error && <p className="error"> {error}</p>}
      {toDisplay.length === 0 && !loading && !error && (
        <p className="empty-state">Tape une race : "labrador", "husky"... 🐶</p>
      )}

      <div className="dogs-grid">
        {toDisplay.map((dog) => (
          <div key={dog.id} className="dog-card">
            <img 
              src={dog.image} 
              alt={`Chien ${dog.breed}`}
              className="dog-image"
            />
            <h3 className="dog-breed">{dog.breed}</h3>
            <div className="dog-habitat">🏠 {dog.habitat}</div>
          </div>
        ))}
      </div>

      <div className="stats">
        <p>📊 {toDisplay.length} / {safeDogs.length} races (sur ~200 possibles)</p>
        <button 
          className="refresh-btn"
          onClick={() => window.location.reload()}
        >
          🔄 Recharger toutes les races
        </button>
      </div>
    </div>
  );
}

export default App;
