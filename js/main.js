function appState() {
    return {
        // --- STATE ---
        appReady: false, activeTab: 'dashboard', userRole: 'personel', isModalOpen: false, modalType: '', isLoading: false,
        searchTerm: '', viewingCustomer: null, customerDetailTab: 'active',
        newCustomer: {}, newOrder: {}, newExpense: {}, newStock: {}, newPayment: {}, 
        newPersonnel: {}, newPersonnelPayment: {}, payingPersonnel: null,
        newUser: { email: '', role: 'personel' }, payingCustomer: null,
        
        // --- VERİ DİZİLERİ ---
        customers: [], orders: [], payments: [], stock: [], expenses: [], personnel: [], personnelPayments: [], users: [],
        
        availableStatuses: ['Onaylandı', 'Üretimde', 'Hazır', 'Teslim Edildi', 'Eksik Var', 'İptal Edildi'],

        // --- HESAPLANMIŞ DEĞERLER ---
        get filteredCustomers() { if (!this.searchTerm) return this.customers; const s = this.searchTerm.toLowerCase(); return this.customers.filter(c => c.name.toLowerCase().includes(s) || (c.phone && c.phone.includes(s)) || c.id.toString().includes(s)); },
        get sortedOrders() { return [...this.orders].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); },
        get cashFlowTotals() { const income = this.payments.reduce((s, p) => s + (p.amount || 0), 0); const expense = this.expenses.reduce((s, e) => s + (e.amount || 0), 0); return { income, expense, net: income - expense }; },
        
        // --- BAŞLATMA ve GERÇEK ZAMANLI VERİ YÖNETİMİ ---
        init() {
            if (typeof window.firebaseReady === 'undefined') { setTimeout(() => this.init(), 100); return; }
            
            fb.onAuthStateChanged(window.auth, async (user) => {
                if (user) {
                    try {
                        const tokenResult = await user.getIdTokenResult(true);
                        this.userRole = tokenResult.claims.role || 'personel'; 
                        this.activeTab = (this.userRole === 'admin') ? 'dashboard' : 'siparisler';
                        this.setupRealtimeListeners();
                        this.appReady = true;
                    } catch (error) {
                        console.error("Token alınırken hata, çıkış yapılıyor.", error);
                        await fb.signOut(window.auth);
                    }
                } else {
                    if (!window.location.pathname.includes('index.html')) { window.location.href = 'index.html'; }
                }
            });
        },
        setupRealtimeListeners() {
            const listenTo = (collectionName, targetArray, orderByField = 'createdAt', orderDirection = 'desc') => {
                const q = fb.query(fb.collection(window.db, collectionName), fb.orderBy(orderByField, orderDirection));
                fb.onSnapshot(q, (snapshot) => {
                    this[targetArray] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                });
            };
            listenTo('customers', 'customers', 'name', 'asc');
            listenTo('orders', 'orders');
            listenTo('personnel', 'personnel', 'name', 'asc');
            listenTo('stock', 'stock', 'name', 'asc');
            listenTo('expenses', 'expenses');
            listenTo('payments', 'payments');
            listenTo('personnelPayments', 'personnelPayments');
            listenTo('authorizedUsers', 'users', 'email', 'asc');
        },

        // --- CRUD FONKSİYONLARI ---
        openModal(type, data = null) {
            this.modalType = type;
            if (type === 'newCustomer') { const nextId = (this.customers.length > 0 ? Math.max(...this.customers.map(c => parseInt(c.id))) : 100) + 1; this.newCustomer = { id: nextId, name: '', phone: '', address: '' }; }
            if (type === 'newOrder') { this.newOrder = { customerId: '', product: '', price: null }; }
            if (type === 'newPersonnel') { this.newPersonnel = { name: '', salary: null, salaryType: 'Aylık' }; }
            if (type === 'newStock') { this.newStock = { name: '', quantity: null, unit: '' }; }
            if (type === 'newExpense') { this.newExpense = { date: new Date().toLocaleDateString('tr-TR'), category: 'Diğer', description: '', amount: null }; }
            if (type === 'newPersonnelPayment') { this.payingPersonnel = data; this.newPersonnelPayment = { amount: null, description: ''}; }
            if (type === 'newPayment') { this.payingCustomer = data; this.newPayment = { amount: null, description: '' }; }
            this.isModalOpen = true;
        },
        async authorizeNewUser() {
            if (!this.newUser.email) { alert('E-posta adresi zorunludur.'); return; }
            this.isLoading = true;
            try {
                await fb.setDoc(fb.doc(window.db, 'authorizedUsers', this.newUser.email), { role: this.newUser.role });
                alert(`Kullanıcı ${this.newUser.email} başarıyla yetkilendirildi. Artık Google ile giriş yapabilir.`);
                this.newUser.email = '';
            } catch (error) { console.error("Yetkilendirme hatası:", error); alert("Hata: " + error.message);
            } finally { this.isLoading = false; }
        },
        async addCustomer() {
            if (!this.newCustomer.name || !this.newCustomer.id) return alert('Müşteri No ve Adı zorunludur.');
            if (this.customers.some(c => c.id.toString() === this.newCustomer.id.toString())) return alert('Bu Müşteri No zaten kullanılıyor.');
            const newCustomerData = { ...this.newCustomer, id: parseInt(this.newCustomer.id), createdAt: fb.serverTimestamp() };
            await fb.setDoc(fb.doc(window.db, 'customers', newCustomerData.id.toString()), newCustomerData);
            this.isModalOpen = false;
        },
        async addOrder() {
            if (!this.newOrder.customerId || !this.newOrder.product || !this.newOrder.price) return alert('Tüm alanlar zorunludur.');
            const customerOrders = this.orders.filter(o => o.customerId == this.newOrder.customerId);
            const newCount = customerOrders.length > 0 ? Math.max(...customerOrders.map(o => parseInt(o.code.split('-')[1] || 0))) + 1 : 1;
            const newOrderData = { ...this.newOrder, code: `${this.newOrder.customerId}-${newCount}`, customerId: parseInt(this.newOrder.customerId), price: parseFloat(this.newOrder.price), createdAt: fb.serverTimestamp(), deliveryNote: '', photoUrls: [], isUploading: false, status: 'Onaylandı' };
            await fb.addDoc(fb.collection(window.db, 'orders'), newOrderData);
            this.isModalOpen = false;
        },
        async addPersonnel() {
            if (!this.newPersonnel.name || !this.newPersonnel.salary) return alert('Personel Adı ve Maaşı zorunludur.');
            const data = { ...this.newPersonnel, salary: parseFloat(this.newPersonnel.salary), createdAt: fb.serverTimestamp() };
            await fb.addDoc(fb.collection(window.db, 'personnel'), data);
            this.isModalOpen = false;
        },
        async addPersonnelPayment() {
            if (!this.newPersonnelPayment.amount || !this.payingPersonnel) return;
            const paymentData = { personnelId: this.payingPersonnel.id, name: this.payingPersonnel.name, amount: parseFloat(this.newPersonnelPayment.amount), description: this.newPersonnelPayment.description, createdAt: fb.serverTimestamp() };
            await fb.addDoc(fb.collection(window.db, 'personnelPayments'), paymentData);
            const expenseData = { category: 'Personel', description: `${this.payingPersonnel.name} - ${this.newPersonnelPayment.description || 'Maaş Ödemesi'}`, amount: parseFloat(this.newPersonnelPayment.amount), date: new Date().toLocaleDateString('tr-TR'), createdAt: fb.serverTimestamp() };
            await fb.addDoc(fb.collection(window.db, 'expenses'), expenseData);
            this.isModalOpen = false;
        },
        async addStockItem() {
            if (!this.newStock.name || !this.newStock.quantity || !this.newStock.unit) return alert('Tüm alanlar zorunludur.');
            const data = { ...this.newStock, quantity: parseFloat(this.newStock.quantity), name: this.newStock.name.toLowerCase(), createdAt: fb.serverTimestamp() };
            await fb.addDoc(fb.collection(window.db, 'stock'), data);
            this.isModalOpen = false;
        },
        async addExpense() {
            if (!this.newExpense.description || !this.newExpense.amount) return alert('Açıklama ve Tutar zorunludur.');
            const data = { ...this.newExpense, amount: parseFloat(this.newExpense.amount), createdAt: fb.serverTimestamp() };
            await fb.addDoc(fb.collection(window.db, 'expenses'), data);
            this.isModalOpen = false;
        },
        async changeOrderStatus(order, newStatus) {
            let updatedData = { status: newStatus };
            if (newStatus === 'Eksik Var') {
                const note = prompt('Lütfen açıklama giriniz:', order.deliveryNote || '');
                if (note !== null) updatedData.deliveryNote = note;
            } else { updatedData.deliveryNote = ''; }
            await fb.updateDoc(fb.doc(window.db, 'orders', order.id), updatedData);
        },
        async deleteDocAndFiles(collectionName, docId, filePaths = []) {
            if (!confirm('Bu kaydı kalıcı olarak silmek istediğinizden emin misiniz?')) return;
            try {
                for (const path of filePaths) { if (path) { const fileRef = fb.ref(window.storage, path); await fb.deleteObject(fileRef).catch(e => console.warn("Dosya silinemedi:", e.code)); } }
                await fb.deleteDoc(fb.doc(window.db, collectionName, docId.toString()));
                alert('Kayıt başarıyla silindi.');
            } catch (error) { console.error("Silme hatası:", error); alert("Kayıt silinirken bir hata oluştu."); }
        },
        async uploadFile(file, path) {
            if (!file) return null;
            const fileRef = fb.ref(window.storage, path);
            await fb.uploadBytes(fileRef, file);
            return await fb.getDownloadURL(fileRef);
        },
        async uploadPhoto(order, event) {
            const files = event.target.files; if (!files.length) return;
            order.isUploading = true;
            for (const file of files) {
                const url = await this.uploadFile(file, `orders/${order.id}/${Date.now()}-${file.name}`);
                if (url) {
                    const updatedUrls = order.photoUrls ? [...order.photoUrls, url] : [url];
                    await fb.updateDoc(fb.doc(window.db, 'orders', order.id), { photoUrls: updatedUrls });
                }
            }
            order.isUploading = false;
            event.target.value = null;
        },
        async uploadProjectFile(customer, event) {
            const file = event.target.files[0]; if(file) customer.isProjectUploading = true;
            const url = await this.uploadFile(file, `projects/${customer.id}/${file.name}`);
            if (url) await fb.updateDoc(fb.doc(window.db, 'customers', customer.id.toString()), { projectFileUrl: url });
            customer.isProjectUploading = false;
            event.target.value = null;
        },
        async signOut() { if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) { await fb.signOut(window.auth); }},
        
        // --- YARDIMCI VE HESAPLAMA FONKSİYONLARI ---
        getProjectUrlForOrder(order) { return this.customers.find(c => c.id == order.customerId)?.projectFileUrl || null; },
        getCustomerBalance(customerId) { const totalOrders = this.orders.filter(o => o.customerId == customerId && o.status !== 'İptal Edildi').reduce((s, o) => s + (o.price || 0), 0); const totalPayments = this.payments.filter(p => p.customerId == customerId).reduce((s, p) => s + (p.amount || 0), 0); return { balance: totalOrders - totalPayments }; },
        getPersonnelBalance(personnelId) { const p = this.personnel.find(p => p.id === personnelId); if (!p) return 0; const totalPayments = this.personnelPayments.filter(payment => payment.personnelId === personnelId).reduce((sum, payment) => sum + (payment.amount || 0), 0); return p.salary - totalPayments; },
        formatCurrency(amount) { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount != null ? amount : 0); },
        getStatusColor(status) { return {'Onaylandı':'bg-gray-200','Üretimde':'text-blue-800 bg-blue-200','Hazır':'text-teal-800 bg-teal-200','Teslim Edildi':'text-green-800 bg-green-200','Eksik Var':'text-yellow-800 bg-yellow-200','İptal Edildi':'text-red-800 bg-red-200'}[status] || 'bg-gray-200'; },
        viewCustomerDetail(customer) { this.viewingCustomer = customer; this.activeTab = 'cariler'; this.customerDetailTab = 'active'; }
    }
}
</script>
