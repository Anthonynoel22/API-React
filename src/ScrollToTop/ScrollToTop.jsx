import { useEffect, useState } from "react";
import "./ScrollToTop.css";

const ScrollToTop = () => {
    // State pour savoir si le bouton doit être visible ou non
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fonction appelée à chaque scroll
        const handleScroll = () => {
            // Si on a scroll de plus de 300px → afficher le bouton
            setIsVisible(window.scrollY > 300);
        };

        // Ajout de l'écouteur d'événement scroll
        window.addEventListener("scroll", handleScroll);

        // On enlève l'écouteur quand le composant est démonté
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fonction appelée au clic sur le bouton 
    const handleClick = () => {
        // Scroll fluide vers le haut de la page 
        window.scrollTo({ top: 0, behavior: "smooth"});
    };

    // Si le bouton ne doit pas être visible, on ne rend rien
    if (!isVisible) return null;

    return (
        <button className="scroll-to-top" onClick={handleClick}>
        ↑ 
        </button>
    );
};

export default ScrollToTop