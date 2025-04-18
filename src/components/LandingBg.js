import React from 'react';
import Sketch from "react-p5";

/**
 * Background component with animated p5.js sketch
 * Creates a dynamic background with noise-based patterns
 */
const LandingBg = (_) => {
    const setup = (p5) => {
        p5.createCanvas(window.innerWidth, window.innerHeight).parent("LandingBgParent");
        p5.rectMode(p5.CORNERS)
        p5.ellipseMode(p5.CORNERS)
        p5.noStroke()
    };

    const windowResized = (p5) => {
        p5.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    const draw = (p5) => {
        const w = p5.width;
        const h = p5.height;
        const rows = Math.ceil(w / 150);
        const cols = Math.ceil(h / 150);
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                let noise = p5.noise(p5.frameCount * 0.01, x, y);
                let colV = p5.lerp(235, 250, noise)
                p5.fill(colV, colV, 255);
                p5.rect((x / rows) * w, (y / cols) * h, ((x + 1) / rows) * w, ((y + 1) / cols) * h)

                noise = p5.noise(p5.frameCount * 0.01 + 100, x, y);
                colV = p5.lerp(235, 250, noise)
                p5.fill(colV, colV, 255);
                p5.ellipse((x / rows) * w, (y / cols) * h, ((x + 1) / rows) * w, ((y + 1) / cols) * h)
            }
        }

        // p5.background(200, p5.lerp(100, 240, noise), 255);
    };

    return (
        <div id="LandingBgParent">
            <Sketch setup={setup} draw={draw} windowResized={windowResized} />
        </div>
    );
};

export default LandingBg;
