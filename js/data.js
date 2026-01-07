window.APP_DATA = {
    INITIAL_SETTINGS: {
        materialPrices: { 'Suntalam': 320, 'MDFlam': 480, 'Lake': 1200, 'Membran': 850, 'Akrilik': 950 },
        glassDoorPrice: 1100,
        hardwarePrices: {
            hinges: { 'Samet': 65, 'Blum': 130, 'Hettich': 110 }, // Menteşe Adet Fiyatı
            slides: { 'Samet': 280, 'Blum': 480, 'Hettich': 420 }, // Çekmece Rayı Takım Fiyatı
            slidingSystem: 1500, // Sürgü Mekanizma Baz Fiyatı (Ray + Tekerlek Seti)
            liftSystemBrands: { 'Samet': 450, 'Blum': 1200, 'Hettich': 950 }
        },
        laborFactor: 1.4, 
        profitMargin: 1.25
    },
    PRODUCTS: [
        // ... Diğer ürünlerin aynen kalabilir ...
        { id: 100, parentCat: 'Alt Dolaplar', subCat: 'Kapaklı', name: 'Kapaklı Alt Dolap', type: 'hinged_base', image: 'https://images.unsplash.com/photo-1556911223-e45242d50730?auto=format&fit=crop&q=80&w=400', defaultWidth: 60, defaultHeight: 72, defaultDepth: 56 },
        { id: 105, parentCat: 'Alt Dolaplar', subCat: 'Köşe', name: 'Köşe Alt Dolap (L)', type: 'corner_base', image: 'https://images.unsplash.com/photo-1556912161-0062402d2948?auto=format&fit=crop&q=80&w=400', defaultWidth: 90, defaultHeight: 72, defaultDepth: 56 },
        { id: 2, parentCat: 'Alt Dolaplar', subCat: 'Çekmeceli', name: 'Çekmeceli Alt Dolap', type: 'drawer', image: 'https://images.unsplash.com/photo-1556912170-4537da395983?auto=format&fit=crop&q=80&w=400', defaultWidth: 60, defaultHeight: 72, defaultDepth: 56, drawerCount: 3 },
        { id: 201, parentCat: 'Üst Dolaplar', subCat: 'Kapaklı', name: 'Kapaklı Üst Modül', type: 'hinged_upper', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600', defaultWidth: 60, defaultHeight: 60, defaultDepth: 32 },
        
        // --- YENİ EKLENEN/GÜNCELLENEN DUVAR DOLABI ---
        { 
            id: 300, 
            parentCat: 'Duvar Dolapları', 
            subCat: 'Özel Üretim', 
            name: 'Özel Ölçü Gardırop/Duvar Dolabı', 
            type: 'wall_cabinet', 
            image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=400', 
            defaultWidth: 200, 
            defaultHeight: 210, 
            defaultDepth: 60 
        }
    ]
};
