window.APP_DATA = {
    INITIAL_SETTINGS: {
        materialPrices: { 'Suntalam': 320, 'MDFlam': 480, 'Lake': 1200, 'Membran': 850, 'Akrilik': 950 },
        glassDoorPrice: 1100, // Cam m2 Fiyatı
        hardwarePrices: {
            hinges: { 'Samet': 65, 'Blum': 130, 'Hettich': 110 },
            slides: { 'Samet': 280, 'Blum': 480, 'Hettich': 420 },
            slidingSystem: 1500, // Sürme Sistem Baz Fiyat
            liftSystemBrands: { 'Samet': 450, 'Blum': 1200, 'Hettich': 950 }
        },
        laborFactor: 1.4, 
        profitMargin: 1.25
    },
    PRODUCTS: [
        { id: 100, parentCat: 'Alt Dolaplar', subCat: 'Kapaklı', name: 'Kapaklı Alt Dolap', type: 'hinged_base', image: 'https://images.unsplash.com/photo-1556911223-e45242d50730?auto=format&fit=crop&q=80&w=400', defaultWidth: 60, defaultHeight: 72, defaultDepth: 56 },
        { id: 105, parentCat: 'Alt Dolaplar', subCat: 'Köşe', name: 'Köşe Alt Dolap (L)', type: 'corner_base', image: 'https://images.unsplash.com/photo-1556912161-0062402d2948?auto=format&fit=crop&q=80&w=400', defaultWidth: 90, defaultHeight: 72, defaultDepth: 56 },
        { id: 106, parentCat: 'Alt Dolaplar', subCat: 'Kör Köşe', name: 'Kör Alt Dolap', type: 'blind_corner_base', image: 'https://images.unsplash.com/photo-1556911223-e45242d50730?auto=format&fit=crop&q=80&w=400', defaultWidth: 100, defaultHeight: 72, defaultDepth: 56 },
        { id: 2, parentCat: 'Alt Dolaplar', subCat: 'Çekmeceli', name: 'Çekmeceli Alt Dolap', type: 'drawer', image: 'https://images.unsplash.com/photo-1556912170-4537da395983?auto=format&fit=crop&q=80&w=400', defaultWidth: 60, defaultHeight: 72, defaultDepth: 56, drawerCount: 3 },
        { id: 201, parentCat: 'Üst Dolaplar', subCat: 'Kapaklı', name: 'Kapaklı Üst Modül', type: 'hinged_upper', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600', defaultWidth: 60, defaultHeight: 60, defaultDepth: 32 },
        { id: 202, parentCat: 'Üst Dolaplar', subCat: 'Devirme', name: 'Devirme Kapak Üst Modül', type: 'lift_upper', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600', defaultWidth: 80, defaultHeight: 40, defaultDepth: 32 },
        { id: 203, parentCat: 'Üst Dolaplar', subCat: 'Kör Köşe', name: 'Kör Üst Modül', type: 'blind_upper', image: 'https://images.unsplash.com/photo-1556911223-e45242d50730?auto=format&fit=crop&q=80&w=600', defaultWidth: 90, defaultHeight: 60, defaultDepth: 32 },
        { id: 204, parentCat: 'Üst Dolaplar', subCat: 'Köşe', name: 'Köşe Üst Modül (L)', type: 'corner_upper', image: 'https://images.unsplash.com/photo-1556912161-0062402d2948?auto=format&fit=crop&q=80&w=600', defaultWidth: 60, defaultHeight: 60, defaultDepth: 32 },
        { id: 300, parentCat: 'Duvar Dolapları', subCat: 'Özel Üretim', name: 'Duvar Ünitesi Dolabı', type: 'wall_cabinet', image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=400', defaultWidth: 200, defaultHeight: 220, defaultDepth: 60 }
    ]
};
