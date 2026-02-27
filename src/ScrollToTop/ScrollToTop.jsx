import { useEffect, useState } from "react";
import "./ScrollToTop.css";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth"});
    };

    if (!isVisible) return null;

    return (
        <button className="scroll-to-top" onClick={handleClick}>
        ↑ 
        </button>
    );
};

export default ScrollToTop