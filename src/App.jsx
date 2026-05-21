import { useEffect, useState } from "react";
import ScrollToTop from "./ScrollToTop/ScrollToTop";

function App() {
  // State principal : liste des chiens stocker dans un tableau 
  const [dogs, setDogs] = useState([]);

  // State pour filter les races via l'input utilisateur
  const [breedFilter, setBreedFilter] = useState("");

  // State pour gérer le chargement
  const [loading, setLoading] = useState(false);

  // State pour gérer les erreurs
  const [error, setError] = useState(null);

  // useEffect exécuté une seule fois au montage du composant
  useEffect(() => {
    const fetchAllDogs = async () => {
      try {
        // Début du chargement
        setLoading(true);
        setError(null);

        // Récupérer la liste de toutes les races 
        const breedsResponse = await fetch("https://dog.ceo/api/breeds/list/all");
        const breedsData = await breedsResponse.json();

        // Objects.keys extrait les noms des races sur json
        const breedList = Object.keys(breedsData.message);
        
        console.log(`${breedList.length} races trouvées`);

        // Pour chaque race, récupérer une image aléatoire
        const dogPromises = breedList.map(async (breed) => {
          try {
            const imageResponse = await fetch(
              `https://dog.ceo/api/breed/${breed}/images/random`
            );
            const imageData = await imageResponse.json();
            
            // Vérifier si l'image existe
            if (imageData.status === "success") {
              return {
                id: breed, // identifiant unique basé sur la race 
                //mais la première lettre en majuscule du nom races de chiens 
                breed: breed[0].toUpperCase() + breed.slice(1),
                image: imageData.message, // URL de l'image
              };
            }
            return null;
          } catch (error) {
            // Si une race échoue, on log mais on continue
            console.log(` Race ${breed} indisponible ` + error);
            return null;
          }
        });

        // Attendre que toutes les requêtes soient terminées
        const dogsWithImages = (await Promise.all(dogPromises)).filter(Boolean);
        
        console.log(`${dogsWithImages.length} chiens avec images`);
        
        // Mise à jour du state avec les résultats 
        setDogs(dogsWithImages);
      } catch (error) {
        // Gestion globale des erreurs 
        setError("Erreur chargement: " + error.message);
      } finally {
        // Fin du chargement
        setLoading(false);
      }
    };

    fetchAllDogs();
  }, []);

  // S'arrure que dogs est bien dans un tableau
  const findedDogs = Array.isArray(dogs) ? dogs : [];

  // Filtrage des chiens selon que tape l'utilisateur dans l'input
  const filteredDogs = findedDogs.filter((dog) =>
    dog.breed.toLowerCase().includes(breedFilter.toLowerCase())
  );
  
  // Affichage des chiens
  const displayDogs =  filteredDogs;

  return (
    <div className="dog-app">
      <h1>🐕 API sur les Chiens</h1>
      
      {/* Information sur le nombre de résultats */}
      <div className="app-info">
        Dog CEO API - {displayDogs.length} / {findedDogs.length} races affichées
      </div>

      {/* Zone de filtrage */}
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

      {/* Affichage conditionnel du loading */}
      {loading && <p className="loading">⏳ Chargement de toutes les races ({findedDogs.length} trouvées)...</p>}

      {/* Affichage conditionnel des erreurs */}
      {error && <p className="error"> {error}</p>}

      {/* .map parcourt d'un tableau pour affichage des chiens */}
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

      {/* Statistiques */}
      <div className="stats">
        <p>📊 {displayDogs.length} / {findedDogs.length} races </p>
      </div>

      {/* Bouton scroll vert le haut */}
      <ScrollToTop />
    </div>
  );
}

export default App;
