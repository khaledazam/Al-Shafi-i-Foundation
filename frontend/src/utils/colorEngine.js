import { paintCatalog } from '../data/paintCatalog';

// Helper: Convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

// Helper: Convert Hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Helper: Calculate Color Difference (Euclidean in RGB, simplified)
// A better approach is weighted Euclidean or DeltaE, but simple is fine for this constraint.
function colorDiff(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

export const analyzeImage = (imageElement, canvasElement) => {
    const ctx = canvasElement.getContext('2d');
    const width = 100; // Small size for performance
    const height = 100;

    canvasElement.width = width;
    canvasElement.height = height;
    ctx.drawImage(imageElement, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;
    let r = 0, g = 0, b = 0;
    let total = 0;
    const colorBuckets = {}; // Simple quantization

    // Sample every 5th pixel for speed
    for (let i = 0; i < imageData.length; i += 20) {
        const pr = imageData[i];
        const pg = imageData[i + 1];
        const pb = imageData[i + 2];

        // Skip white/black/transparent logic if needed, but let's keep all
        r += pr;
        g += pg;
        b += pb;
        total++;

        // Quantize to nearest 32 to group similar colors
        const key = `${Math.round(pr / 32) * 32},${Math.round(pg / 32) * 32},${Math.round(pb / 32) * 32}`;
        colorBuckets[key] = (colorBuckets[key] || 0) + 1;
    }

    const avgR = Math.round(r / total);
    const avgG = Math.round(g / total);
    const avgB = Math.round(b / total);

    // Calculate Brightness/Temperature
    // Brightness: (0.299*R + 0.587*G + 0.114*B)
    const brightness = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB);
    // Temperature: R > B is generally warmer
    // More precise: Compare normalized relative presence
    const isWarm = avgR > avgB;

    // Sort buckets to find dominant
    const sortedColors = Object.entries(colorBuckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => {
            const [cr, cg, cb] = key.split(',').map(Number);
            return `rgb(${cr},${cg},${cb})`;
        });

    return {
        averageColor: { r: avgR, g: avgG, b: avgB },
        dominantColors: sortedColors,
        brightness: brightness, // 0-255
        isWarm: isWarm
    };
};

export const generateSmartRecommendations = (analysis) => {
    const { brightness, isWarm, averageColor } = analysis;
    const recommendations = [];

    // 1. Finish Recommendation
    // Dark room (<100) -> Semi-Gloss to reflect light
    // Bright room (>180) -> Matte to absorb glare
    // Medium -> Matte or Semi-Gloss
    let recommendedFinish = 'matte';
    let finishReason = 'Standard choice for balanced light.';

    if (brightness < 90) {
        recommendedFinish = 'semi-gloss';
        finishReason = 'Room is dim; Semi-Gloss helps reflect light.';
    } else if (brightness > 160) {
        recommendedFinish = 'matte';
        finishReason = 'Room is bright; Matte reduces glare.';
    }

    // 2. Color Recommendations (Based on Average Color of room/furniture)
    // Convert avgRoom color to HSL
    const [h, s, l] = rgbToHsl(averageColor.r, averageColor.g, averageColor.b);

    // Strategy A: Complementary (Opposite Hue) - Good for contrast
    const compHue = (h + 180) % 360;

    // Strategy B: Analogous (Similar Hue) - Good for harmony
    const analHue1 = (h + 30) % 360;
    const analHue2 = (h - 30 + 360) % 360;

    // Helper to find closest paint in catalog to a target HSL/RGB
    const findClosestPaint = (targetHue, targetSat, targetLight) => {
        // Simple metric: Hue distance (weighted high) + Saturation/Light distance
        let closest = null;
        let minScore = Infinity;

        paintCatalog.forEach(paint => {
            const rgb = hexToRgb(paint.hex);
            if (!rgb) return;
            const [ph, ps, pl] = rgbToHsl(rgb.r, rgb.g, rgb.b);

            // Hue distance on circle
            let hueDist = Math.abs(ph - targetHue);
            if (hueDist > 180) hueDist = 360 - hueDist;

            const score = hueDist * 2 + Math.abs(ps - targetSat) + Math.abs(pl - targetLight);
            if (score < minScore) {
                minScore = score;
                closest = paint;
            }
        });
        return closest;
    };

    // Rec 1: Harmony (Analogous - matches furniture tone)
    const harmonyPaint = findClosestPaint(h, s, Math.min(l + 0.4, 0.9)); // Lighter version of room average
    if (harmonyPaint) recommendations.push({
        ...harmonyPaint,
        reason: 'Harmonizes with your existing furniture tones.',
        suggestedFinish: recommendedFinish
    });

    // Rec 2: Contrast (Complementary)
    const contrastPaint = findClosestPaint(compHue, s * 0.8, 0.7); // Slightly desaturated complement
    if (contrastPaint && contrastPaint.id !== harmonyPaint?.id) recommendations.push({
        ...contrastPaint,
        reason: 'Provides a vibrant contrast to the room.',
        suggestedFinish: recommendedFinish
    });

    // Rec 3: Neutral Balancer (White/Grey/Beige depending on temp)
    const neutralCategory = isWarm ? 'Beige' : 'Grey';
    // Find a paint in this category
    const neutralPaint = paintCatalog.find(p => p.category === neutralCategory && p.hex !== '#FFFFFF');
    if (neutralPaint) recommendations.push({
        ...neutralPaint,
        reason: `A ${isWarm ? 'warm' : 'cool'} neutral to balance the space.`,
        suggestedFinish: recommendedFinish
    });

    return {
        brightness: Math.round(brightness),
        isWarm,
        recommendedFinish,
        finishReason,
        colors: recommendations
    };
};
