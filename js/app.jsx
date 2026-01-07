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

    // Versiyonu v29 yaptık ki eski sepet önbelleği temizlensin ve resimler kesin gelsin
    useEffect(() => {
        const saved = localStorage.getItem('carpenter_final_v29_cart');
        if (saved) setCart(JSON.parse(saved));
        const savedSettings = localStorage.getItem('carpenter_final_v29_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
    }, []);

    useEffect(() => {
        localStorage.setItem('carpenter_final_v29_cart', JSON.stringify(cart));
        localStorage.setItem('carpenter_final_v29_settings', JSON.stringify(settings));
    }, [cart, settings]);

    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (calculateItemPrice(item, settings) * (item.qty || 1)), 0), [cart, settings]);

    const addToCart = (product) => {
        const isSpecial = ['hinged_base', 'corner_base', 'blind_corner_base', 'hinged_upper', 'lift_upper', 'blind_upper', 'corner_upper'].includes(product.type);
        const newItem = {
            id: Date.now(),
            product, // Ürün resmi burada nesne içinde saklanır
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

    const updateItemConfig = (id, field, value) => setCart(cart.map(item => item.id === id ? { ...item, config: { ...item.config, [field]: value } } : item));
    const applyBulkToAll = () => setCart(cart.map(item => ({ ...item, config: { ...item.config, bodyMaterial: bulkConfig.bodyMaterial, doorMaterial: bulkConfig.doorMaterial, hardwareBrand: bulkConfig.hardwareBrand } })));

    // --- UI COMPONENTS ---
    const Sidebar = () => (
        <>
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 print:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white z-[70] shadow-xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b flex justify-between items-center bg-slate-50/50 italic-hub uppercase tracking-tighter leading-none"><span className="font-black text-lg uppercase italic">Katalog</span><button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white rounded-lg transition shadow-sm"><i className="fa-solid fa-xmark text-xl"></i></button></div>
                <div className="p-4 space-y-2">
                    <button onClick={() => { setActiveFilter({parent:null}); setView('home'); setIsMenuOpen(false); }} className={`w-full text-left font-black text-[10px] p-4 rounded-xl uppercase tracking-[0.2em] transition ${!activeFilter.parent ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-slate-400 hover:bg-slate-50'}`}>Tüm Ürünler</button>
                    {['Alt Dolaplar', 'Üst Dolaplar', 'Duvar Dolapları'].map(cat => (
                        <button key={cat} onClick={() => { setActiveFilter({parent:cat}); setView('home'); setIsMenuOpen(false); }} className={`w-full text-left font-black text-[10px] p-4 rounded-xl uppercase tracking-[0.2em] transition ${activeFilter.parent === cat ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-slate-400 hover:bg-slate-50'}`}>{cat}</button>
                    ))}
                </div>
            </aside>
        </>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
            <header className="p-4 flex justify-between items-center bg-white border-b border-slate-50 sticky top-0 z-50 print-hidden shadow-sm italic-hub uppercase tracking-tighter leading-none">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(true)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition border border-slate-100"><i className="fa-solid fa-bars text-lg"></i></button>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); setActiveFilter({parent:null}); }}>
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white"><i className="fa-solid fa-box-archive text-sm"></i></div>
                        <span className="font-black text-lg uppercase italic leading-none">DOLAP<span className="text-slate-300">HUB</span></span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={() => setView('admin')} className="text-slate-300 hover:text-black transition"><i className="fa-solid fa-gear text-lg"></i></button>
                    <button onClick={() => setView('cart')} className="relative p-2.5 bg-black text-white rounded-xl shadow-lg transition active:scale-95">
                        <i className="fa-solid fa-cart-shopping text-sm"></i>
                        {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>}
                    </button>
                </div>
            </header>
            
            <Sidebar />

            <main className="py-6 px-4 print-hidden animate-fade">
                {view === 'home' && (
                    <div className="max-w-6xl mx-auto italic-hub uppercase tracking-tighter">
                        <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2 px-1 text-slate-900 leading-none uppercase"><i className="fa-solid fa-layer-group text-slate-200"></i> {activeFilter.parent || 'Tüm Modüller'}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {PRODUCTS.filter(p => !activeFilter.parent || p.parentCat === activeFilter.parent).map(p => (
                                <div key={p.id} className="bg-white p-2.5 rounded-2xl border border-slate-100 hover:border-black transition-all cursor-pointer group shadow-sm hover:shadow-xl" onClick={() => setSelectedProduct(p)}>
                                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3 shadow-inner"><img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 shadow-inner" /></div>
                                    <h4 className="font-bold text-[11px] leading-tight mb-3 h-8 line-clamp-2 px-1 text-slate-800 uppercase italic leading-none">{p.name}</h4>
                                    <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="w-full py-2 bg-slate-50 text-black text-[9px] font-black rounded-xl hover:bg-black hover:text-white transition uppercase shadow-sm italic leading-none">HIZLI EKLE</button>
                                </div>
                            ))}
                        </div>
                        {selectedProduct && (
                            <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                                <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative animate-fade" onClick={e => e.stopPropagation()}>
                                    <img src={selectedProduct.image} className="w-full aspect-video object-cover" />
                                    <div className="p-8"><h3 className="text-2xl font-black mb-4 tracking-tighter italic-hub uppercase">{selectedProduct.name}</h3><button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-4 bg-black text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition italic-hub leading-none">SEPETE EKLE & KONFİGÜRE ET</button></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {view === 'cart' && (
                    <div className="max-w-6xl mx-auto italic-hub uppercase tracking-tighter leading-none">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex justify-between items-center mb-2 px-1 italic uppercase tracking-tighter leading-none"><h2 className="text-2xl font-black tracking-tight text-slate-800 flex items-center gap-2">Teklif Sepeti <span className="text-slate-200 font-normal italic">/ {cart.length}</span></h2><button onClick={() => setView('home')} className="text-[10px] font-black uppercase bg-white border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition shadow-sm font-bold tracking-widest leading-none"><i className="fa-solid fa-plus text-[10px]"></i> Ürün Ekle</button></div>
                                {cart.length > 0 ? (
                                    <>
                                        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4 border-l-4 border-l-slate-900 italic uppercase">
                                            <i className="fa-solid fa-sliders text-slate-300 text-xl hidden md:block"></i>
                                            <div className="grid grid-cols-3 gap-3 flex-grow w-full">
                                                <div className="flex flex-col"><label className="text-[8px] font-black text-slate-400 mb-1 italic">Gövde Malzemesi</label><select value={bulkConfig.bodyMaterial} onChange={e => setBulkConfig({...bulkConfig, bodyMaterial: e.target.value})} className="bg-slate-50 rounded-xl p-3 text-[10px] font-bold outline-none italic">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                                <div className="flex flex-col"><label className="text-[8px] font-black text-slate-400 mb-1 italic">Kapak Malzemesi</label><select value={bulkConfig.doorMaterial} onChange={e => setBulkConfig({...bulkConfig, doorMaterial: e.target.value})} className="bg-slate-50 rounded-xl p-3 text-[10px] font-bold outline-none italic">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                                <div className="flex flex-col"><label className="text-[8px] font-black text-slate-400 mb-1 italic">Donanım Marka</label><select value={bulkConfig.hardwareBrand} onChange={e => setBulkConfig({...bulkConfig, hardwareBrand: e.target.value})} className="bg-slate-50 rounded-xl p-3 text-[10px] font-bold outline-none italic">{['Samet', 'Blum', 'Hettich'].map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                                            </div>
                                            <button onClick={applyBulkToAll} className="bg-black text-white text-[10px] font-black px-6 py-5 rounded-xl hover:scale-105 transition italic uppercase tracking-tighter leading-none">Uygula</button>
                                        </div>
                                        {cart.map(item => (
                                            <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-6 border-l-4 border-l-slate-100 hover:border-l-black transition-all group uppercase tracking-tighter">
                                                {/* SEPET LİSTESİ RESİM ALANI */}
                                                <div className="flex items-center gap-4 border-b border-slate-50 pb-5 uppercase">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 italic uppercase bg-white">
                                                        <img src={item.product.image} className="w-full h-full object-cover shadow-inner" alt={item.product.name} />
                                                    </div>
                                                    <div className="flex-grow"><h4 className="font-black text-base italic uppercase leading-none mb-2">{item.product.name}</h4><div className="flex items-center gap-3 italic leading-none"><span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-lg italic leading-none">{(calculateItemPrice(item, settings)).toLocaleString('tr-TR')} TL</span><span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest italic">G: {item.config.bodyMaterial} / K: {item.config.doorMaterial}</span></div></div>
                                                    <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-slate-200 hover:text-red-500 transition-colors p-2"><i className="fa-solid fa-trash-can text-lg"></i></button>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-2 text-[8px] font-black uppercase italic tracking-widest leading-none">
                                                    
                                                    {/* --- DUVAR DOLABI ÖZEL INPUTLARI --- */}
                                                    {item.product.type === 'wall_cabinet' ? (
                                                        <>
                                                            <div className="col-span-2"><label className="text-slate-300 block mb-1">Şekil</label><select value={item.config.cabinetShape} onChange={e => updateItemConfig(item.id, 'cabinetShape', e.target.value)} className="w-full bg-slate-100 p-2.5 rounded-xl font-black outline-none uppercase"><option value="Düz">Düz</option><option value="L">L Köşe</option><option value="U">U Tipi</option></select></div>
                                                            <div><label className="text-slate-300 block mb-1">En 1</label><input type="number" value={item.config.width} onChange={e => updateItemConfig(item.id, 'width', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            {['L', 'U'].includes(item.config.cabinetShape) && (
                                                                <div><label className="text-slate-300 block mb-1">En 2</label><input type="number" value={item.config.width2} onChange={e => updateItemConfig(item.id, 'width2', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            )}
                                                            {item.config.cabinetShape === 'U' && (
                                                                <div><label className="text-slate-300 block mb-1">En 3</label><input type="number" value={item.config.width3} onChange={e => updateItemConfig(item.id, 'width3', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            )}
                                                            <div><label className="text-slate-300 block mb-1">Boy</label><input type="number" value={item.config.height} onChange={e => updateItemConfig(item.id, 'height', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            <div><label className="text-slate-300 block mb-1">Derin</label><input type="number" value={item.config.depth} onChange={e => updateItemConfig(item.id, 'depth', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            
                                                            <div className="col-span-2"><label className="text-slate-300 block mb-1">Tip</label><select value={item.config.doorType} onChange={e => updateItemConfig(item.id, 'doorType', e.target.value)} className="w-full bg-amber-50 p-2.5 rounded-xl font-black outline-none uppercase"><option value="hinged">Menteşe</option><option value="sliding">Sürme</option></select></div>
                                                            
                                                            {item.config.doorType === 'sliding' ? (
                                                                <div className="col-span-2"><label className="text-slate-300 block mb-1">Sürme Kapak</label><input type="number" value={item.config.slidingDoorCount} onChange={e => updateItemConfig(item.id, 'slidingDoorCount', e.target.value)} className="w-full bg-amber-50 p-2.5 rounded-xl text-center shadow-inner" placeholder="Adet" /></div>
                                                            ) : (
                                                                <>
                                                                    <div><label className="text-slate-300 block mb-1">Dolu Kpk</label><input type="number" value={item.config.solidDoorCount} onChange={e => updateItemConfig(item.id, 'solidDoorCount', e.target.value)} className="w-full bg-amber-50 p-2.5 rounded-xl text-center shadow-inner" /></div>
                                                                    <div><label className="text-slate-300 block mb-1">Camlı Kpk</label><input type="number" value={item.config.glassDoorCount} onChange={e => updateItemConfig(item.id, 'glassDoorCount', e.target.value)} className="w-full bg-blue-50 p-2.5 rounded-xl text-center shadow-inner" /></div>
                                                                </>
                                                            )}

                                                            <div><label className="text-slate-300 block mb-1">Çekm.</label><input type="number" value={item.config.drawerCount} onChange={e => updateItemConfig(item.id, 'drawerCount', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner" /></div>
                                                            <div className="col-span-1"><label className="text-slate-300 block mb-1">Marka</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl italic font-black outline-none">{['Samet', 'Blum', 'Hettich'].map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                        </>
                                                    ) : (
                                                        // --- STANDART DOLAP INPUTLARI ---
                                                        <>
                                                            <div><label className="text-slate-300 block mb-1">En 1</label><input type="number" value={item.config.width} onChange={e => updateItemConfig(item.id, 'width', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            {['corner_base', 'corner_upper'].includes(item.product.type) && (
                                                                <div><label className="text-slate-300 block mb-1">En 2</label><input type="number" value={item.config.width2} onChange={e => updateItemConfig(item.id, 'width2', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            )}
                                                            <div><label className="text-slate-300 block mb-1">Boy</label><input type="number" value={item.config.height} onChange={e => updateItemConfig(item.id, 'height', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>
                                                            <div><label className="text-slate-300 block mb-1">Derin</label><input type="number" value={item.config.depth} onChange={e => updateItemConfig(item.id, 'depth', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner italic outline-none focus:ring-1 focus:ring-black" /></div>

                                                            {(item.product.type === 'drawer' || (item.product.type === 'wall_cabinet' && item.config.drawerCount > 0)) && (
                                                                <>
                                                                    <div><label className="text-slate-300 block mb-1">Çekm.</label><input type="number" value={item.config.drawerCount} onChange={e => updateItemConfig(item.id, 'drawerCount', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner" /></div>
                                                                    <div className="col-span-2"><label className="text-slate-300 block mb-1">Ray Marka</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl italic font-black outline-none">{['Samet', 'Blum', 'Hettich'].map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                                </>
                                                            )}

                                                            {['hinged_base', 'hinged_upper', 'corner_base', 'corner_upper', 'blind_corner_base', 'blind_upper'].includes(item.product.type) && (
                                                                <>
                                                                    {item.config.doorType !== 'lift' && (
                                                                        <div><label className="text-slate-300 block mb-1">Kapak</label><input type="number" value={item.config.doorCount} onChange={e => updateItemConfig(item.id, 'doorCount', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner" /></div>
                                                                    )}
                                                                    <div><label className="text-slate-300 block mb-1">Raf</label><input type="number" value={item.config.shelfCount} onChange={e => updateItemConfig(item.id, 'shelfCount', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl text-center shadow-inner" /></div>
                                                                    {item.product.type !== 'lift_upper' && (
                                                                        <div className="col-span-2"><label className="text-slate-300 block mb-1">Mnt Marka</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl italic font-black outline-none">{Object.keys(settings.hardwarePrices.hinges).map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                                    )}
                                                                </>
                                                            )}

                                                            {item.product.type === 'lift_upper' && (
                                                                <div className="col-span-2 uppercase italic"><label className="text-slate-300 block mb-1 italic">Piston Marka</label><select value={item.config.hardwareBrand} onChange={e => updateItemConfig(item.id, 'hardwareBrand', e.target.value)} className="w-full bg-amber-50 p-2.5 rounded-xl italic font-black outline-none uppercase">{Object.keys(settings.hardwarePrices.liftSystemBrands).map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                                            )}

                                                            {item.product.parentCat === 'Üst Dolaplar' && (
                                                                <div className="col-span-2 uppercase italic"><label className="text-slate-300 block mb-1">Stil</label><select value={item.config.doorStyle} onChange={e => updateItemConfig(item.id, 'doorStyle', e.target.value)} className="w-full bg-amber-50 p-2.5 rounded-xl italic font-black outline-none uppercase"><option value="normal">Normal</option><option value="glass">Camlı</option></select></div>
                                                            )}
                                                        </>
                                                    )}
                                                    
                                                    {/* ORTAK MALZEME SEÇİMİ */}
                                                    <div className="col-span-3 italic uppercase"><label className="text-slate-300 block mb-1 italic uppercase">Malzeme (G / K)</label>
                                                        <div className="flex gap-1 uppercase italic"><select value={item.config.bodyMaterial} onChange={e => updateItemConfig(item.id, 'bodyMaterial', e.target.value)} className="flex-1 bg-slate-50 p-2.5 rounded-xl uppercase italic font-black outline-none">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m.slice(0,3)} (G)</option>)}</select><select value={item.config.doorMaterial} onChange={e => updateItemConfig(item.id, 'doorMaterial', e.target.value)} className="flex-1 bg-slate-50 p-2.5 rounded-xl uppercase italic font-black outline-none">{Object.keys(settings.materialPrices).map(m => <option key={m} value={m}>{m.slice(0,3)} (K)</option>)}</select></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="text-center py-32 bg-white rounded-[48px] border-2 border-dashed border-slate-100 uppercase italic-hub tracking-widest italic tracking-tighter leading-none uppercase italic">Sepetiniz Boş</div>
                                )}
                            </div>
                            <div className="lg:col-span-4 space-y-6 uppercase italic-hub tracking-tighter leading-none uppercase">
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden italic uppercase">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-8 flex items-center gap-3 italic tracking-tighter uppercase leading-none italic uppercase"><i className="fa-solid fa-user-tag text-slate-200"></i> Müşteri Bilgileri</h3>
                                    <input type="text" placeholder="Ad Soyad" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl mb-4 text-sm font-bold shadow-inner outline-none italic focus:ring-1 focus:ring-black uppercase italic leading-none" />
                                    <input type="tel" placeholder="Telefon No" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold shadow-inner outline-none italic focus:ring-1 focus:ring-black italic uppercase leading-none" />
                                </div>
                                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 italic tracking-tighter leading-none uppercase italic"><p className="text-[10px] font-black text-slate-300 uppercase mb-4 italic leading-none">Toplam Teklif Bedeli</p><h3 className="text-6xl font-black mb-12 tracking-tighter text-slate-900 italic leading-none">{(cartTotal).toLocaleString('tr-TR')} <span className="text-base text-slate-300 italic font-normal ml-1">TL</span></h3><button disabled={cart.length === 0} onClick={() => setShowTeklifPreview(true)} className="w-full py-5 bg-black text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-slate-800 disabled:opacity-20 active:scale-95 transition-all italic-hub leading-none uppercase italic">TEKLİF DOSYASI HAZIRLA</button></div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'admin' && (
                    <div className="max-w-2xl mx-auto space-y-8 py-4 italic-hub uppercase tracking-tighter leading-none uppercase italic">
                        <h2 className="text-3xl font-black tracking-tighter italic uppercase"><i className="fa-solid fa-toolbox text-slate-200 mr-2"></i> Admin Ayarları</h2>
                        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8 italic uppercase tracking-tighter leading-none uppercase italic">
                            <div><h3 className="text-[10px] font-black text-slate-300 uppercase mb-10 italic leading-none italic uppercase">Malzeme m² Fiyatları</h3><div className="space-y-4 uppercase italic">
                                {Object.keys(settings.materialPrices).map(m => (
                                    <div key={m} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2 italic">
                                        <span className="text-sm font-black text-slate-600 uppercase tracking-tighter leading-none italic">{m}</span>
                                        <div className="flex items-center gap-2 italic uppercase">
                                            <input type="number" value={settings.materialPrices[m]} onChange={e => setSettings({...settings, materialPrices: {...settings.materialPrices, [m]: Number(e.target.value)}})} className="w-24 bg-white p-2.5 rounded-xl text-right font-black outline-none italic shadow-sm" />
                                            <span className="text-[9px] font-black text-slate-300 uppercase">TL</span>
                                        </div>
                                    </div>
                                ))}
                            </div></div>
                        </div>
                    </div>
                )}
            </main>

            {/* --- PROFESYONEL PDF ÖNİZLEME (ARTIK RESİMLİ) --- */}
            {showTeklifPreview && (
                <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:hidden italic-hub uppercase">
                    <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative animate-fade flex flex-col max-h-[95vh] uppercase tracking-tighter leading-none">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50 rounded-t-[40px] shrink-0">
                            <div className="flex items-center gap-3"><i className="fa-solid fa-file-invoice text-amber-500 text-xl"></i><h3 className="font-black text-lg text-slate-800 uppercase italic leading-none">Teklif Önizleme</h3></div>
                            <div className="flex gap-2 uppercase italic leading-none">
                                <button onClick={() => setShowTeklifPreview(false)} className="px-6 py-2 rounded-xl font-bold text-[10px] bg-white border hover:bg-slate-50 italic uppercase leading-none">Kapat</button>
                                <button onClick={() => window.print()} className="px-6 py-2 rounded-xl font-black text-[10px] bg-black text-white flex items-center gap-2 shadow-lg active:scale-95 transition-all italic leading-none"><i className="fa-solid fa-print text-[10px]"></i> PDF KAYDET</button>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-12 bg-white flex justify-center text-black uppercase tracking-tighter leading-none italic uppercase">
                            <div className="w-full max-w-[800px] uppercase tracking-tighter leading-none italic uppercase">
                                <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-10 italic-hub uppercase">
                                    <div><h1 className="text-4xl font-black mb-1 italic uppercase leading-none">TEKLİF FORMU</h1><p className="text-xs font-bold text-slate-400 font-mono italic">#{Date.now().toString().slice(-6)} | {new Date().toLocaleDateString('tr-TR')}</p></div>
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
                                                {/* PDF GÖRSEL SÜTUNU */}
                                                <td className="py-5 w-16 align-middle">
                                                    <img src={item.product.image} className="w-12 h-12 object-cover rounded-lg border border-slate-200" alt="Ürün" />
                                                </td>
                                                <td className="py-5 font-bold text-sm text-slate-800 uppercase italic leading-none">{item.product.name}</td>
                                                <td className="py-5 text-xs font-bold text-slate-500 text-center italic leading-none uppercase">
                                                    {['corner_base', 'corner_upper', 'wall_cabinet'].includes(item.product.type) && item.config.cabinetShape !== 'Düz' ? `${item.config.width}+${item.config.width2}` : item.config.width}x{item.config.height}
                                                </td>
                                                <td className="py-5 text-[10px] leading-tight uppercase italic leading-none">
                                                    <span className="font-bold text-slate-400 text-[9px] uppercase italic leading-none">Gövde:</span> <span className="font-black text-slate-700 italic uppercase leading-none">{item.config.bodyMaterial}</span><br/>
                                                    <span className="font-bold text-slate-400 text-[9px] uppercase italic leading-none">Kapak:</span> <span className="font-black text-slate-700 italic uppercase leading-none">{item.config.doorStyle === 'glass' ? 'CAMLI' : item.config.doorMaterial}</span><br/>
                                                    <span className="text-amber-600 font-bold text-[9px] mt-1 block uppercase italic leading-none uppercase">
                                                        {item.config.doorType === 'lift' ? `Piston: ${item.config.hardwareBrand}` : 
                                                        (item.product.type === 'drawer' || item.config.drawerCount > 0) ? `${item.config.hardwareBrand} Ray` : `${item.config.hardwareBrand} Mnt`}
                                                        {item.config.shelfCount > 0 && ` | Raf: ${item.config.shelfCount}`}
                                                        {item.config.drawerCount > 0 && ` | Çekm: ${item.config.drawerCount}`}
                                                        {item.product.type === 'wall_cabinet' && item.config.doorType === 'sliding' && ` | ${item.config.slidingDoorCount} Sürme Kapak`}
                                                        {item.product.type === 'wall_cabinet' && item.config.doorType === 'hinged' && ` | ${item.config.solidDoorCount} Dolu + ${item.config.glassDoorCount} Camlı`}
                                                    </span>
                                                </td>
                                                <td className="py-5 text-right font-black text-sm italic uppercase leading-none">{(calculateItemPrice(item, settings) || 0).toLocaleString('tr-TR')} TL</td>
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
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
