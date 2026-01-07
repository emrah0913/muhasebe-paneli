// js/logic.js
window.APP_LOGIC = {
    calculateItemPrice: (item, currentSettings) => {
        const { config, product } = item;
        const w1 = parseFloat(config.width) || 0;
        const w2 = parseFloat(config.width2) || 0;
        const w3 = parseFloat(config.width3) || 0;
        const h = parseFloat(config.height) || 0;
        const d = parseFloat(config.depth) || 0;
        const drawerCount = parseInt(config.drawerCount) || 0;
        const shelfCount = parseInt(config.shelfCount) || 0;
        const doorCount = parseInt(config.doorCount) || 1;

        let bodyArea = 0;
        let doorArea = 0;
        let hardwareCost = 0;

        if (product.type === 'wall_cabinet') {
            let totalWidth = w1;
            if (config.cabinetShape === 'L') totalWidth = w1 + w2;
            if (config.cabinetShape === 'U') totalWidth = w1 + w2 + w3;
            bodyArea = ((totalWidth + d) * (h + d)) / 10000;
            doorArea = (totalWidth * h) / 10000; 
            if (config.doorType === 'sliding') hardwareCost += currentSettings.hardwarePrices.slidingSystem || 0;
            else hardwareCost += (Math.ceil(totalWidth / 45) || 2) * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
            if (drawerCount > 0) hardwareCost += drawerCount * (currentSettings.hardwarePrices.slides[config.hardwareBrand] || 0);
        } 
        else if (['corner_base', 'corner_upper'].includes(product.type)) {
            let totalWidth = w1 + w2;
            bodyArea = (((totalWidth * d * 2) + (totalWidth * h)) / 10000) * 1.25; 
            doorArea = (totalWidth * h) / 10000;
            hardwareCost = doorCount * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
        }
        else if (['blind_corner_base', 'blind_upper'].includes(product.type)) {
            bodyArea = (((h * d * 2) + (w1 * d * 2) + (w1 * h)) / 10000) * 1.15;
            if (shelfCount > 0) bodyArea += (shelfCount * (w1 * d)) / 10000;
            doorArea = ((w1 / 2) * h) / 10000;
            hardwareCost = doorCount * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
        }
        else {
            bodyArea = ((h * d * 2) + (w1 * d * 2) + (w1 * h)) / 10000;
            if (shelfCount > 0) bodyArea += (shelfCount * (w1 * d)) / 10000;
            doorArea = (w1 * h) / 10000;
            if (product.type === 'lift_upper') {
                hardwareCost = currentSettings.hardwarePrices.liftSystemBrands[config.hardwareBrand] || 0;
            } else if (product.type === 'drawer') {
                hardwareCost = drawerCount * (currentSettings.hardwarePrices.slides[config.hardwareBrand] || 0);
            } else {
                hardwareCost = doorCount * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
            }
        }

        const doorPrice = config.doorStyle === 'glass' ? currentSettings.glassDoorPrice : currentSettings.materialPrices[config.doorMaterial];
        const total = (bodyArea * currentSettings.materialPrices[config.bodyMaterial] + doorArea * (doorPrice || 0) + hardwareCost) * currentSettings.laborFactor * currentSettings.profitMargin;
        return Math.round(total) || 0;
    }
};
