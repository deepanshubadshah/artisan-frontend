// src/ParticlesBackground.js
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // This loads the tsparticles package bundle
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // You can log the container if needed.
    // console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: { color: { value: "#0f172a" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#ffffff" },
          links: { enable: false },
          collisions: { enable: true },
          move: { enable: true, speed: 2, outModes: { default: "bounce" } },
          number: { density: { enable: true, area: 800 }, value: 50 },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 3, max: 7 } },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
};

export default ParticlesBackground;