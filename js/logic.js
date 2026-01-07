window.APP_LOGIC = {
    calculateItemPrice: (item, currentSettings) => {
        const { config, product } = item;
        
        // Boyutlar
        const w1 = parseFloat(config.width) || 0;
        const w2 = parseFloat(config.width2) || 0; // L dönüşü için
        const w3 = parseFloat(config.width3) || 0; // U dönüşü için
        const h = parseFloat(config.height) || 0;
        const d = parseFloat(config.depth) || 0;
        
        // Adetler
        const drawerCount = parseInt(config.drawerCount) || 0;
        const shelfCount = parseInt(config.shelfCount) || 0;
        const doorCount = parseInt(config.doorCount) || 0; // Menteşeli kapak sayısı
        const slidingDoorCount = parseInt(config.slidingDoorCount) || 0; // Sürgü kapak sayısı

        let bodyArea = 0; // m2
        let doorArea = 0; // m2
        let hardwareCost = 0; // TL

        // --- DUVAR DOLABI MANTIĞI (DÜZ / L / U) ---
        if (product.type === 'wall_cabinet') {
            let totalLength = w1; // Düz ise sadece w1

            if (config.cabinetShape === 'L') {
                totalLength = w1 + w2;
                // Köşe birleşim yerindeki malzeme kaybı/fazlalığı için basitleştirilmiş faktör:
                // Normalde köşe dönüşleri daha pahalıdır.
            } else if (config.cabinetShape === 'U') {
                totalLength = w1 + w2 + w3;
            }

            // Gövde Alanı (Yaklaşık m2 hesabı: Çevre x Derinlik + Raflar)
            // (Toplam boy * Yükseklik) arka panel + (Toplam boy * Derinlik * 2) alt/üst + (Dikmeler)
            // Basit formül: (En x Boy) + (En x Derinlik x 2)
            bodyArea = ((totalLength * h) + (totalLength * d * 2) + (h * d * 4)) / 10000;
            
            // Kapak Alanı
            doorArea = (totalLength * h) / 10000;

            // --- DONANIM MALİYETLERİ ---
            
            // 1. Kapak Sistemi (Sürme veya Menteşe)
            if (config.doorType === 'sliding') {
                // Sürgü seçildiyse: Mekanizma fiyatı + Sürgü kapak adedi kadar ek profil/tekerlek maliyeti
                // slidingSystem: Ray takımı
                // slidingDoorCount: Her kapak için ilave tekerlek/fren maliyeti (Örn: 250TL/kapak varsayalım)
                hardwareCost += (currentSettings.hardwarePrices.slidingSystem || 1500); 
                hardwareCost += slidingDoorCount * 250; 
            } else {
                // Menteşe seçildiyse: Kapak başı ortalama 4-5 menteşe (Yüksek dolap olduğu için)
                // (Kapak Sayısı * 5 * Menteşe Birim Fiyatı)
                hardwareCost += doorCount * 5 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 65);
            }

            // 2. Çekmece Sistemi
            if (drawerCount > 0) {
                hardwareCost += drawerCount * (currentSettings.hardwarePrices.slides[config.hardwareBrand] || 280);
            }

        } 
        // --- DİĞER STANDART MODÜLLER ---
        else {
            // (Eski mantık aynen korunuyor)
            if (['corner_base', 'corner_upper'].includes(product.type)) {
                let totalWidth = w1 + 90; 
                bodyArea = (((totalWidth * d * 2) + (totalWidth * h)) / 10000) * 1.25;
                doorArea = (totalWidth * h) / 10000;
                hardwareCost = 4 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
            } else {
                bodyArea = ((h * d * 2) + (w1 * d * 2) + (w1 * h)) / 10000;
                if (shelfCount > 0) bodyArea += (shelfCount * (w1 * d)) / 10000;
                doorArea = (w1 * h) / 10000;

                if (product.type === 'drawer') {
                    hardwareCost = (config.drawerCount || 3) * (currentSettings.hardwarePrices.slides[config.hardwareBrand] || 0);
                } else if (product.type === 'lift_upper') {
                    hardwareCost = currentSettings.hardwarePrices.liftSystemBrands[config.hardwareBrand] || 0;
                } else {
                    hardwareCost = (config.doorCount || 2) * 2 * (currentSettings.hardwarePrices.hinges[config.hardwareBrand] || 0);
                }
            }
        }

        const doorPrice = config.doorStyle === 'glass' ? currentSettings.glassDoorPrice : currentSettings.materialPrices[config.doorMaterial];
        
        // Toplam = (Gövde + Kapak + Donanım) * İşçilik * Kar
        const total = (
            (bodyArea * currentSettings.materialPrices[config.bodyMaterial]) + 
            (doorArea * (doorPrice || 0)) + 
            hardwareCost
        ) * currentSettings.laborFactor * currentSettings.profitMargin;

        return Math.round(total) || 0;
    }
};
