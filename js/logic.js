window.APP_LOGIC = {
    calculateItemPrice: (item, currentSettings) => {
        const { config, product } = item;
        const w1 = parseFloat(config.width) || 0;
        const w2 = parseFloat(config.width2) || 0;
        const w3 = parseFloat(config.width3) || 0;
        const h = parseFloat(config.height) || 0;
        const d = parseFloat(config.depth) || 0;
        
        // Adetler
        const drawerCount = parseInt(config.drawerCount) || 0;
        const shelfCount = parseInt(config.shelfCount) || 0;
        
        // Kapak Adetleri (Duvar Dolabı için)
        const solidDoorCount = parseInt(config.solidDoorCount) || 0;
        const glassDoorCount = parseInt(config.glassDoorCount) || 0;
        const slidingDoorCount = parseInt(config.slidingDoorCount) || 0;
        // Diğer dolaplar için standart kapak sayısı
        const standardDoorCount = parseInt(config.doorCount) || 1;

        let bodyArea = 0;
        let finalDoorCost = 0; // Kapak maliyetini burada özel hesaplayacağız
        let hardwareCost = 0;

        // --- DUVAR DOLABI ÖZEL HESABI ---
        if (product.type === 'wall_cabinet') {
            let totalWidth = w1;
            if (config.cabinetShape === 'L') totalWidth = w1 + w2;
            if (config.cabinetShape === 'U') totalWidth = w1 + w2 + w3;
            
            // Gövde Alanı
            bodyArea = ((totalWidth + d) * (h + d)) / 10000;
            const totalDoorArea = (totalWidth * h) / 10000; 

            // Donanım & Kapak Maliyeti
            if (config.doorType === 'sliding') {
                // SÜRME SİSTEM
                hardwareCost += (currentSettings.hardwarePrices.slidingSystem || 1500);
                // Sürgü kapak olduğu için tamamını seçilen kapak malzemesi kabul ediyoruz
                finalDoorCost = totalDoorArea * currentSettings.materialPrices[config.doorMaterial];
            } else {
                // MENTEŞELİ SİSTEM
                const totalDoors = solidDoorCount + glassDoorCount;
                
                // Donanım: Kapak başı 4 menteşe (Yüksek dolap)
                hardwareCost += totalDoors * 4 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);

                // Kapak Maliyeti (Oransal Hesap)
                if (totalDoors > 0) {
                    const areaPerDoor = totalDoorArea / totalDoors;
                    const solidCost = solidDoorCount * areaPerDoor * currentSettings.materialPrices[config.doorMaterial];
                    const glassCost = glassDoorCount * areaPerDoor * currentSettings.glassDoorPrice;
                    finalDoorCost = solidCost + glassCost;
                }
            }

            // Çekmece Varsa Ekle
            if (drawerCount > 0) hardwareCost += drawerCount * (currentSettings.hardwarePrices.slides[config.hardwareBrand] || 0);
        
        } 
        // --- DİĞER STANDART DOLAPLAR (ESKİ MANTIK) ---
        else {
            let doorArea = 0;
            // Gövde Hesabı
            if (['corner_base', 'corner_upper'].includes(product.type)) {
                let totalWidth = w1 + w2;
                bodyArea = (((totalWidth * d * 2) + (totalWidth * h)) / 10000) * 1.25; 
                doorArea = (totalWidth * h) / 10000;
                hardwareCost = standardDoorCount * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
            }
            else if (['blind_corner_base', 'blind_upper'].includes(product.type)) {
                bodyArea = (((h * d * 2) + (w1 * d * 2) + (w1 * h)) / 10000) * 1.15;
                if (shelfCount > 0) bodyArea += (shelfCount * (w1 * d)) / 10000;
                doorArea = ((w1 / 2) * h) / 10000;
                hardwareCost = standardDoorCount * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
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
                    hardwareCost = standardDoorCount * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
                }
            }
            
            // Diğerleri için standart kapak fiyatı (Cam stili seçildiyse cam fiyatı)
            const pricePerM2 = config.doorStyle === 'glass' ? currentSettings.glassDoorPrice : currentSettings.materialPrices[config.doorMaterial];
            finalDoorCost = doorArea * (pricePerM2 || 0);
        }

        // TOPLAM HESAP
        const total = (
            (bodyArea * currentSettings.materialPrices[config.bodyMaterial]) + 
            finalDoorCost + 
            hardwareCost
        ) * currentSettings.laborFactor * currentSettings.profitMargin;

        return Math.round(total) || 0;
    }
};
