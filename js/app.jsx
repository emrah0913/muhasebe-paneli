const { useState, useEffect, useMemo } = React;
const { INITIAL_SETTINGS, PRODUCTS } = window.APP_DATA;
const { calculateItemPrice } = window.APP_LOGIC;

const App = () => {
    const [view, setView] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [settings, setSettings] = useState(INITIAL_SETTINGS);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState({ parent: null });
    const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
    const [showTeklifPreview, setShowTeklifPreview] = useState(false);
    const [bulkConfig, setBulkConfig] = useState({ bodyMaterial: 'Suntalam', doorMaterial: 'MDFlam', hardwareBrand: 'Samet' });

    // Versiyon v32: Tam Mobil Uyumlu Arayüz
    useEffect(() => {
        const saved = localStorage.getItem('carpenter_final_v32_cart');
        if (saved) setCart(JSON.parse(saved));
        const savedSettings = localStorage.getItem('carpenter_final_v32_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
    }, []);

    useEffect(() => {
        localStorage.setItem('carpenter_final_v32_cart', JSON.stringify(cart));
        localStorage.setItem('carpenter_final_v32_settings', JSON.stringify(settings));
    }, [cart, settings]);

    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (calculateItemPrice(item, settings) * (item.qty || 1)), 0), [cart, settings]);

    const addToCart = (product) => {
        const isSpecial = ['hinged_base', 'corner_base', 'blind_corner_base', 'hinged_upper', 'lift_upper', 'blind_upper', 'corner_upper'].includes(product.type);
        const newItem = {
            id: Date.now(),
            product, 
            qty: 1,
            config: {
                width: product.defaultWidth, width2: 150, width3: 150,
                height: product.defaultHeight, depth: product.defaultDepth,
                bodyMaterial: bulkConfig.bodyMaterial, doorMaterial: bulkConfig.doorMaterial,
                hardwareBrand: bulkConfig.hardwareBrand, 
                
                cabinetShape: 'Düz',
                doorType: product.type === 'lift_upper' ? 'lift' : (product.name.includes('Sürme') ? 'sliding' : 'hinged'), 
                slidingDoorCount: 2,
                solidDoorCount: 4,
                glassDoorCount: 0,
                
                doorStyle: 'normal',
                drawerCount: product.type === 'drawer' ? 3 : 0, 
                shelfCount: isSpecial ? 2 : 0, 
                doorCount: product.type === 'lift_upper' ? 1 : (['hinged_base', 'corner_base', 'corner_upper'].includes(product.type) ? 2 : 1)
            }
        };
        setCart([...cart, newItem]);
        setView('cart');
    };

    const updateItemQty = (id, change) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, (item.qty || 1) + change);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const duplicateItem = (originalItem) => {
        const newItem = { ...originalItem, id: Date.now(), qty: 1 };
        setCart([...cart, newItem]);
    };

    const updateItemConfig = (id, field, value) => setCart(cart.map(item => item.id === id ? { ...item, config: { ...item.config, [field]: value } } : item));
    const applyBulkToAll = () => setCart(cart.map(item => ({ ...item, config: { ...item.config, bodyMaterial: bulkConfig.bodyMaterial, doorMaterial: bulkConfig.doorMaterial, hardwareBrand: bulkConfig.hardwareBrand } })));

    // --- UI COMPONENTS ---
    const Sidebar = () => (
        <>
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 print:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />
            <aside className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[70] shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b flex justify-between items-center bg-slate-50 italic-hub uppercase tracking-tighter leading-none">
                    <span className="font-black text-2xl uppercase italic">Katalog</span>
                    <button onClick={() => setIsMenuOpen(false)} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"><i className="fa-solid fa-xmark text-xl"></i></button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto h-full pb-20">
                    <button onClick={() => { setActiveFilter({parent:null}); setView('home'); setIsMenuOpen(false); }} className={`w-full text-left font-black text-base p-6 rounded-2xl uppercase tracking-[0.1em] transition ${!activeFilter.parent ? 'bg-black text-white shadow-xl' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>Tüm Ürünler</button>
                    {['Alt Dolaplar', 'Üst Dolaplar', 'Duvar Dolapları'].map(cat => (
                        <button key={cat} onClick={() => { setActiveFilter({parent:cat}); setView('home'); setIsMenuOpen(false); }} className={`w-full text-left font-black text-base p-6 rounded-2xl uppercase tracking-[0.1em] transition ${activeFilter.parent === cat ? 'bg-black text-white shadow-xl' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>{cat}</button>
                    ))}
                </div>
            </aside>
        </>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-slate-900 font-sans pb-32 md:pb-0">
            {/* HEADER - DAHA BÜYÜK */}
            <header className="px-5 py-4 flex justify-between items-center bg-white border-b border-slate-200 sticky top-0 z-50 print-hidden shadow-sm italic-hub uppercase tracking-tighter leading-none">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsMenuOpen(true)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-200 active:bg-slate-200"><i className="fa-solid fa-bars text-xl"></i></button>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('home'); setActiveFilter({parent:null}); }}>
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-lg"><i className="fa-solid fa-box-archive text-xl"></i></div>
                        <span className="font-black text-2xl uppercase italic leading-none hidden md:block">DOLAP<span className="text-slate-300">HUB</span></span>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={() => setView('cart')} className="relative w-12 h-12 bg-black text-white rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center">
                        <i className="fa-solid fa-cart-shopping text-xl"></i>
                        {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>}
                    </button>
                </div>
            </header>
            
            <Sidebar />

            <main className="py-6 px-4 md:px-8 print-hidden animate-fade">
                {view === 'home' && (
                    <div className="max-w-7xl mx-auto italic-hub uppercase tracking-tighter">
                        <h2 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-3 px-1 text-slate-900 leading-none uppercase"><i className="fa-solid fa-layer-group text-slate-400"></i> {activeFilter.parent || 'Tüm Modüller'}</h2>
                        
                        {/* MOBİL İÇİN 1 SÜTUN, TABLET 2, MASAÜSTÜ 4 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {PRODUCTS.filter(p => !activeFilter.parent || p.parentCat === activeFilter.parent).map(p => (
                                <div key={p.id} className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm active:scale-[0.98] transition-all cursor-pointer" onClick={() => setSelectedProduct(p)}>
                                    <div className="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4 shadow-inner relative">
                                        <img src={p.image} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">HIZLI EKLE</div>
                                    </div>
                                    <h4 className="font-black text-lg leading-tight mb-4 text-slate-800 uppercase italic px-1">{p.name}</h4>
                                    <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="w-full h-12 bg-slate-100 border border-slate-200 text-black text-sm font-black rounded-xl hover:bg-black hover:text-white transition uppercase italic leading-none flex items-center justify-center gap-2"><i className="fa-solid fa-plus"></i> SEPETE EKLE</button>
                                </div>
                            ))}
                        </div>
                        
                        {selectedProduct && (
                            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setSelectedProduct(null)}>
                                <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative animate-fade" onClick={e => e.stopPropagation()}>
                                    <div className="relative">
                                        <img src={selectedProduct.image} className="w-full aspect-video object-cover" />
                                        <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center shadow-xl z-10"><i className="fa-solid fa-xmark text-2xl"></i></button>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-3xl font-black mb-8 tracking-tighter italic-hub uppercase leading-none">{selectedProduct.name}</h3>
                                        <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full h-16 bg-black text-white font-black rounded-2xl text-lg uppercase tracking-widest shadow-xl active:scale-95 transition italic-hub leading-none">SEPETE EKLE</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {view === 'cart' && (
                    <div className="max-w-5xl mx-auto italic-hub uppercase tracking-tighter leading-none">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center px-1">
                                <h2 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">Sepet <span className="text-slate-400 font-normal italic text-xl">({cart.length})</span></h2>
                                <button onClick={() => setView('home')} className="h-12 px-6 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm font-black uppercase hover:bg-slate-50 transition shadow-sm active:scale-95"><i className="fa-solid fa-plus"></i> Ürün Ekle</button>
                            </div>

                            {cart.length > 0 ? (
                                <>
                                    {/* TOPLU İŞLEM - MOBİLDE DAHA RAHAT */}
                                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-2"><i className="fa-solid fa-wand-magic-sparkles"></i> TOPLU DÜZENLEME</div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div><label className="text-xs font-bold text-slate-400 mb-2 block ml-1">Gövde</label><select value={bulkConfig.bodyMaterial} onChange={e => setBulkConfig({...bulkConfig, bodyMaterial: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl h-14 px-4 text-sm font-bold outline-none">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                            <div><label className="text-xs font-bold text-slate-400 mb-2 block ml-1">Kapak</label><select value={bulkConfig.doorMaterial} onChange={e => setBulkConfig({...bulkConfig, doorMaterial: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl h-14 px-4 text-sm font-bold outline-none">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                            <div><label className="text-xs font-bold text-slate-400 mb-2 block ml-1">Marka</label><select value={bulkConfig.hardwareBrand} onChange={e => setBulkConfig({...bulkConfig, hardwareBrand: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl h-14 px-4 text-sm font-bold outline-none">{['Samet', 'Blum', 'Hettich'].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                        </div>
                                        <button onClick={applyBulkToAll} className="w-full h-14 bg-black text-white text-base font-black rounded-xl hover:scale-[1.02] active:scale-95 transition shadow-lg mt-2">TÜMÜNE UYGULA</button>
                                    </div>

                                    {cart.map(item => (
                                        <div key={item.id} className="bg-white p-5 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                                            {/* ÜRÜN BAŞLIĞI VE RESMİ */}
                                            <div className="flex gap-4 items-start border-b border-slate-100 pb-5">
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                                                    <img src={item.product.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow min-w-0 pt-1">
                                                    <h4 className="font-black text-lg leading-tight mb-2 uppercase italic truncate">{item.product.name}</h4>
                                                    <div className="text-2xl font-black text-slate-900 mb-2">{(calculateItemPrice(item, settings) * (item.qty || 1)).toLocaleString('tr-TR')} <span className="text-sm text-slate-400 font-medium">TL</span></div>
                                                    
                                                    {/* ADET VE SİL BUTONLARI - BÜYÜK */}
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 h-12">
                                                            <button onClick={() => updateItemQty(item.id, -1)} className="w-12 h-full text-xl font-bold text-slate-500 active:bg-slate-200 rounded-l-xl">-</button>
                                                            <span className="w-8 text-center font-black text-lg">{item.qty || 1}</span>
                                                            <button onClick={() => updateItemQty(item.id, 1)} className="w-12 h-full text-xl font-bold text-slate-500 active:bg-slate-200 rounded-r-xl">+</button>
                                                        </div>
                                                        <button onClick={() => duplicateItem(item)} className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl"><i className="fa-solid fa-copy text-lg"></i></button>
                                                        <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl"><i className="fa-solid fa-trash-can text-lg"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* --- INPUTLAR: MOBİLDE TEK SÜTUN (ALT ALTA) --- */}
                                            {/* grid-cols-1 yaparak her şeyi alt alta aldık */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                
                                                {item.product.type === 'wall_cabinet' ? (
                                                    <>
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Dolap Şekli</label><select value={item.config.cabinetShape} onChange={e => updateItemConfig(item.id, 'cabinetShape', e.target.value)} className="w-full bg-slate-100 h-14 px-4 rounded-xl font-bold outline-none border border-transparent focus:border-black uppercase"><option value="Düz">Düz</option><option value="L">L Köşe</option><option value="U">U Tipi</option></select></div>
                                                        
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Genişlik (cm)</label><input type="number" value={item.config.width} onChange={e => updateItemConfig(item.id, 'width', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        
                                                        {['L', 'U'].includes(item.config.cabinetShape) && (
                                                            <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Genişlik 2 (cm)</label><input type="number" value={item.config.width2} onChange={e => updateItemConfig(item.id, 'width2', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        )}
                                                        {item.config.cabinetShape === 'U' && (
                                                            <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Genişlik 3 (cm)</label><input type="number" value={item.config.width3} onChange={e => updateItemConfig(item.id, 'width3', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        )}
                                                        
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Yükseklik (cm)</label><input type="number" value={item.config.height} onChange={e => updateItemConfig(item.id, 'height', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Derinlik (cm)</label><input type="number" value={item.config.depth} onChange={e => updateItemConfig(item.id, 'depth', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        
                                                        <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Kapak Tipi</label><select value={item.config.doorType} onChange={e => updateItemConfig(item.id, 'doorType', e.target.value)} className="w-full bg-amber-50 h-14 px-4 rounded-xl font-black outline-none border border-amber-100 uppercase text-amber-900"><option value="hinged">Menteşe Kapak</option><option value="sliding">Sürme (Raylı) Kapak</option></select></div>
                                                        
                                                        {item.config.doorType === 'sliding' ? (
                                                            <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Sürme Kapak Sayısı</label><input type="number" value={item.config.slidingDoorCount} onChange={e => updateItemConfig(item.id, 'slidingDoorCount', e.target.value)} className="w-full bg-amber-50 border border-amber-100 h-14 px-4 rounded-xl text-center font-black text-lg outline-none" placeholder="Adet" /></div>
                                                        ) : (
                                                            <>
                                                                <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Dolu Kapak</label><input type="number" value={item.config.solidDoorCount} onChange={e => updateItemConfig(item.id, 'solidDoorCount', e.target.value)} className="w-full bg-amber-50 border border-amber-100 h-14 px-4 rounded-xl text-center font-black text-lg outline-none" /></div>
                                                                <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Camlı Kapak</label><input type="number" value={item.config.glassDoorCount} onChange={e => updateItemConfig(item.id, 'glassDoorCount', e.target.value)} className="w-full bg-blue-50 border border-blue-100 h-14 px-4 rounded-xl text-center font-black text-lg outline-none" /></div>
                                                            </>
                                                        )}

                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Çekmece</label><input type="number" value={item.config.drawerCount} onChange={e => updateItemConfig(item.id, 'drawerCount', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none" /></div>
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Donanım</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-sm font-bold outline-none">{['Samet', 'Blum', 'Hettich'].map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                    </>
                                                ) : (
                                                    // --- STANDART DOLAP INPUTLARI ---
                                                    <>
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Genişlik (cm)</label><input type="number" value={item.config.width} onChange={e => updateItemConfig(item.id, 'width', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        {['corner_base', 'corner_upper'].includes(item.product.type) && (
                                                            <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Genişlik 2</label><input type="number" value={item.config.width2} onChange={e => updateItemConfig(item.id, 'width2', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        )}
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Yükseklik (cm)</label><input type="number" value={item.config.height} onChange={e => updateItemConfig(item.id, 'height', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>
                                                        <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Derinlik (cm)</label><input type="number" value={item.config.depth} onChange={e => updateItemConfig(item.id, 'depth', e.target.value)} className="w-full bg-white border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none focus:border-black" /></div>

                                                        {(item.product.type === 'drawer' || (item.product.type === 'wall_cabinet' && item.config.drawerCount > 0)) && (
                                                            <>
                                                                <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Çekmece</label><input type="number" value={item.config.drawerCount} onChange={e => updateItemConfig(item.id, 'drawerCount', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none" /></div>
                                                                <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Ray Marka</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-sm font-bold outline-none">{['Samet', 'Blum', 'Hettich'].map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                            </>
                                                        )}

                                                        {['hinged_base', 'hinged_upper', 'corner_base', 'corner_upper', 'blind_corner_base', 'blind_upper'].includes(item.product.type) && (
                                                            <>
                                                                {item.config.doorType !== 'lift' && (
                                                                    <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Kapak Adet</label><input type="number" value={item.config.doorCount} onChange={e => updateItemConfig(item.id, 'doorCount', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none" /></div>
                                                                )}
                                                                <div><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Raf Adet</label><input type="number" value={item.config.shelfCount} onChange={e => updateItemConfig(item.id, 'shelfCount', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-center font-black text-lg outline-none" /></div>
                                                                {item.product.type !== 'lift_upper' && (
                                                                    <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Menteşe Marka</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-sm font-bold outline-none">{Object.keys(settings.hardwarePrices.hinges).map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                                )}
                                                            </>
                                                        )}

                                                        {item.product.type === 'lift_upper' && (
                                                            <div className="md:col-span-2 uppercase italic"><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Piston Marka</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-amber-50 border border-amber-100 h-14 px-4 rounded-xl text-sm font-bold outline-none uppercase">{Object.keys(settings.hardwarePrices.liftSystemBrands).map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                        )}

                                                        {item.product.parentCat === 'Üst Dolaplar' && (
                                                            <div className="md:col-span-2 uppercase italic"><label className="text-xs font-bold text-slate-400 mb-1.5 block ml-1">Kapak Stili</label><select value={item.config.doorStyle} onChange={e => updateItemConfig(item.id, 'doorStyle', e.target.value)} className="w-full bg-amber-50 border border-amber-100 h-14 px-4 rounded-xl text-sm font-bold outline-none uppercase"><option value="normal">Normal</option><option value="glass">Camlı</option></select></div>
                                                        )}
                                                    </>
                                                )}
                                                
                                                {/* MALZEME SEÇİMİ - HER ZAMAN GÖRÜNÜR VE BÜYÜK */}
                                                <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2">
                                                    <label className="text-xs font-bold text-slate-400 mb-2 block ml-1 uppercase">Malzeme Seçimi (Gövde / Kapak)</label>
                                                    <div className="flex flex-col md:flex-row gap-3">
                                                        <select value={item.config.bodyMaterial} onChange={e => updateItemConfig(item.id, 'bodyMaterial', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-sm font-bold outline-none uppercase italic">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m.slice(0,3)} (G)</option>)}</select>
                                                        <select value={item.config.doorMaterial} onChange={e => updateItemConfig(item.id, 'doorMaterial', e.target.value)} className="w-full bg-slate-50 border border-slate-200 h-14 px-4 rounded-xl text-sm font-bold outline-none uppercase italic">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m.slice(0,3)} (K)</option>)}</select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-20 px-6 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fa-solid fa-basket-shopping text-3xl text-slate-300"></i></div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Sepetiniz Boş</h3>
                                    <p className="text-slate-400 font-medium mb-6">Projenize başlamak için ürün kataloğundan modül ekleyin.</p>
                                    <button onClick={() => setView('home')} className="px-8 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg">Kataloğa Git</button>
                                </div>
                            )}
                        </div>

                        {/* MÜŞTERİ BİLGİLERİ VE TOPLAM - MOBİLDE EN ALTTA SABİT GİBİ */}
                        {cart.length > 0 && (
                            <div className="mt-8 space-y-6">
                                <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2"><i className="fa-solid fa-address-card"></i> Müşteri Bilgileri</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Ad Soyad" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-base font-bold outline-none focus:border-black h-14" />
                                        <input type="tel" placeholder="Telefon No" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-base font-bold outline-none focus:border-black h-14" />
                                    </div>
                                </div>

                                <div className="bg-black text-white p-8 rounded-[40px] shadow-xl text-center">
                                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Genel Toplam</p>
                                    <h3 className="text-5xl md:text-7xl font-black mb-8 italic tracking-tighter">{(cartTotal).toLocaleString('tr-TR')}<span className="text-2xl text-slate-500 font-normal ml-2">TL</span></h3>
                                    <button onClick={() => setShowTeklifPreview(true)} className="w-full h-16 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition">TEKLİF DOSYASI OLUŞTUR</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ADMİN PANELİ */}
                {view === 'admin' && (
                    <div className="max-w-xl mx-auto py-4">
                        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                            <h2 className="text-2xl font-black tracking-tighter italic uppercase border-b pb-4">Admin Ayarları</h2>
                            {Object.keys(settings.materialPrices).map(m => (
                                <div key={m} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-sm font-bold text-slate-700 uppercase">{m}</span>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={settings.materialPrices[m]} onChange={e => setSettings({...settings, materialPrices: {...settings.materialPrices, [m]: Number(e.target.value)}})} className="w-24 bg-white border border-slate-200 h-12 rounded-lg text-right font-black px-3 outline-none" />
                                        <span className="text-xs font-bold text-slate-400">TL</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* PDF PREVIEW - FULL SCREEN MOBILE */}
            {showTeklifPreview && (
                <div className="fixed inset-0 z-[200] bg-white flex flex-col print:block">
                    <div className="p-4 border-b flex justify-between items-center bg-slate-50 shrink-0 print:hidden">
                        <h3 className="font-black text-lg uppercase">Önizleme</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setShowTeklifPreview(false)} className="px-4 py-2 bg-white border rounded-xl font-bold text-sm">Kapat</button>
                            <button onClick={() => window.print()} className="px-4 py-2 bg-black text-white rounded-xl font-bold text-sm">Yazdır</button>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 md:p-12">
                         <div className="w-full max-w-[800px] mx-auto uppercase tracking-tighter leading-none italic uppercase">
                                <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-10 italic-hub uppercase">
                                    <div><h1 className="text-3xl md:text-4xl font-black mb-1 italic uppercase leading-none">TEKLİF FORMU</h1><p className="text-xs font-bold text-slate-400 font-mono italic">#{Date.now().toString().slice(-6)} | {new Date().toLocaleDateString('tr-TR')}</p></div>
                                    <div className="text-right italic uppercase leading-none"><h2 className="font-black text-2xl uppercase italic leading-none italic uppercase">DOLAP<span className="text-slate-300 italic">HUB</span></h2><p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest italic tracking-tighter leading-none uppercase italic">Mobilya Üretim Atölyesi</p></div>
                                </div>
                                <table className="w-full text-left border-collapse italic uppercase tracking-tighter leading-none italic uppercase">
                                    <thead><tr className="border-b-2 border-black font-black uppercase text-[10px] tracking-widest leading-none">
                                        <th className="py-4 italic uppercase">Görsel</th>
                                        <th className="py-4 italic uppercase">Modül</th>
                                        <th className="py-4 text-center italic uppercase">Boyutlar</th>
                                        <th className="py-4 italic uppercase">Detaylar & Donanım</th>
                                        <th className="py-4 text-right italic uppercase">Tutar</th>
                                    </tr></thead>
                                    <tbody>
                                        {cart.map(item => (
                                            <tr key={item.id} className="border-b border-slate-100 italic tracking-tighter leading-none uppercase">
                                                <td className="py-5 w-16 align-middle"><img src={item.product.image} className="w-12 h-12 object-cover rounded-lg border border-slate-200" alt="Ürün" /></td>
                                                <td className="py-5 font-bold text-sm text-slate-800 uppercase italic leading-none">
                                                    {item.product.name}
                                                    {item.qty > 1 && <span className="text-xs text-slate-400 block mt-1">(x {item.qty} Adet)</span>}
                                                </td>
                                                <td className="py-5 text-xs font-bold text-slate-500 text-center italic leading-none uppercase">{['corner_base', 'corner_upper', 'wall_cabinet'].includes(item.product.type) && item.config.cabinetShape !== 'Düz' ? `${item.config.width}+${item.config.width2}` : item.config.width}x{item.config.height}</td>
                                                <td className="py-5 text-[10px] leading-tight uppercase italic leading-none">
                                                    <span className="font-bold text-slate-400 text-[9px] uppercase italic leading-none">Gövde:</span> <span className="font-black text-slate-700 italic uppercase leading-none">{item.config.bodyMaterial}</span><br/>
                                                    <span className="font-bold text-slate-400 text-[9px] uppercase italic leading-none">Kapak:</span> <span className="font-black text-slate-700 italic uppercase leading-none">{item.config.doorStyle === 'glass' ? 'CAMLI' : item.config.doorMaterial}</span><br/>
                                                    <span className="text-amber-600 font-bold text-[9px] mt-1 block uppercase italic leading-none uppercase">
                                                        {item.config.doorType === 'lift' ? `Piston: ${item.config.hardwareBrand}` : (item.product.type === 'drawer' || item.config.drawerCount > 0) ? `${item.config.hardwareBrand} Ray` : `${item.config.hardwareBrand} Mnt`}
                                                        {item.config.shelfCount > 0 && ` | Raf: ${item.config.shelfCount}`}
                                                        {item.config.drawerCount > 0 && ` | Çekm: ${item.config.drawerCount}`}
                                                        {item.product.type === 'wall_cabinet' && item.config.doorType === 'sliding' && ` | ${item.config.slidingDoorCount} Sürme Kapak`}
                                                        {item.product.type === 'wall_cabinet' && item.config.doorType === 'hinged' && ` | ${item.config.solidDoorCount} Dolu + ${item.config.glassDoorCount} Camlı`}
                                                    </span>
                                                </td>
                                                <td className="py-5 text-right font-black text-sm italic uppercase leading-none">{(calculateItemPrice(item, settings) * (item.qty || 1)).toLocaleString('tr-TR')} TL</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div class="text-right mt-12 border-t-4 border-black pt-8">
                                    <p class="text-[10px] font-black text-slate-300 uppercase mb-2 italic uppercase">Genel Toplam</p>
                                    <h2 class="text-5xl font-black uppercase italic leading-none">{(cartTotal).toLocaleString('tr-TR')} TL</h2>
                                </div>
                            </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
