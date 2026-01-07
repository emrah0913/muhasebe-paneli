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
        { id: 100, parentCat: 'Alt Dolaplar', subCat: 'Kapaklı', name: 'Kapaklı Alt Dolap', type: 'hinged_base', image: 'https://www.minarmobilya.com/idea/dq/03/myassets/products/365/8684990261720-1.jpg?revision=1767087317', defaultWidth: 60, defaultHeight: 72, defaultDepth: 56 },
        { id: 105, parentCat: 'Alt Dolaplar', subCat: 'Köşe', name: 'Köşe Alt Dolap (L)', type: 'corner_base', image: 'https://img1.wsimg.com/isteam/ip/3c139178-dc7e-4b9d-93ab-c65c7aee5924/ols/900X900mm%20Highline%20Corner%20Base%20Unit%20With%20Shelf.jpg/:/rs=w:1200,h:1200', defaultWidth: 90, defaultHeight: 72, defaultDepth: 56 },
        { id: 106, parentCat: 'Alt Dolaplar', subCat: 'Kör Köşe', name: 'Kör Alt Dolap', type: 'blind_corner_base', image: 'https://www.minarmobilya.com/idea/dq/03/myassets/products/429/8684990262369-1.jpg?revision=1765363294', defaultWidth: 100, defaultHeight: 72, defaultDepth: 56 },
        { id: 2, parentCat: 'Alt Dolaplar', subCat: 'Çekmeceli', name: 'Çekmeceli Alt Dolap', type: 'drawer', image: 'https://www.minarmobilya.com/idea/dq/03/myassets/products/381/8684990261881-1.jpg?revision=1765289033', defaultWidth: 60, defaultHeight: 72, defaultDepth: 56, drawerCount: 3 },
        { id: 201, parentCat: 'Üst Dolaplar', subCat: 'Kapaklı', name: 'Kapaklı Üst Modül', type: 'hinged_upper', image: 'https://www.minarmobilya.com/idea/dq/03/myassets/products/447/8684990262543-1.jpg?revision=1765368218', defaultWidth: 60, defaultHeight: 60, defaultDepth: 32 },
        { id: 202, parentCat: 'Üst Dolaplar', subCat: 'Devirme', name: 'Devirme Kapak Üst Modül', type: 'lift_upper', image: 'https://www.minarmobilya.com/idea/dq/03/myassets/products/411/8684990262185-1.jpg?revision=1765369537', defaultWidth: 80, defaultHeight: 40, defaultDepth: 32 },
        { id: 203, parentCat: 'Üst Dolaplar', subCat: 'Kör Köşe', name: 'Kör Üst Modül', type: 'blind_upper', image: 'https://classycabinet.com/wp-content/uploads/2023/08/b9-copy-1-600x600.jpg', defaultWidth: 90, defaultHeight: 60, defaultDepth: 32 },
        { id: 204, parentCat: 'Üst Dolaplar', subCat: 'Köşe', name: 'Köşe Üst Modül (L)', type: 'corner_upper', image: 'https://www.minarmobilya.com/idea/dq/03/myassets/products/420/8684990262277-1.jpg?revision=1765544537', defaultWidth: 60, defaultHeight: 60, defaultDepth: 32 },
        { id: 300, parentCat: 'Duvar Dolapları', subCat: 'Özel Üretim', name: 'Duvar Ünitesi Dolabı', type: 'wall_cabinet', image: 'https://www.minarmobilya.com/idea/dq/03/myassets/products/671/8681285969040-3.jpg?revision=1759935875', defaultWidth: 200, defaultHeight: 220, defaultDepth: 60 }
    ]
};
