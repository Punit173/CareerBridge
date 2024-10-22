import React from 'react'
import { useEffect } from 'react';

const LottiePlayer = () => {
    useEffect(() => {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
      script.type = "module";
      document.body.appendChild(script);
    }, []);
  
    return (
      <dotlottie-player
        src="https://lottie.host/56b1dfab-4950-488c-88b9-735a56a1a2c9/t8n0iATAXs.json"
        speed="1"
        style={{ width: "300px", height: "300px" }}
        loop
        autoplay
      ></dotlottie-player>
    );
  };
  
  export default LottiePlayer