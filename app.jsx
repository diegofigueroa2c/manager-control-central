import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, AlertTriangle, Plus, TrendingUp, Package, DollarSign, Menu, X, Check, LogOut, Mail, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ManagerControlCentral() {
    const [user, setUser] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerMode, setRegisterMode] = useState(false);
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [events, setEvents] = useState([
        { id: 1, date: '2025-10-15', time: '14:00', patient: 'Juan García', address: 'Calle 5 #123', status: 'Planificado', checklist: ['Calibrar diadema', 'Cargar baterías', 'Preparar documentación'] },
        { id: 2, date: '2025-10-18', time: '10:00', patient: 'María López', address: 'Av. Principal 456', status: 'Planificado', checklist: ['Calibrar diadema', 'Cargar baterías', 'Preparar documentación'] }
    ]);

    const [inventory, setInventory] = useState([
        { id: 1, product: 'Diadema Modelo A', current: 5, min: 10, supplier: 'ProAudio' },
        { id: 2, product: 'Diadema Modelo B', current: 8, min: 8, supplier: 'SonicTech' },
        { id: 3, product: 'Baterías AAA', current: 0, min: 50, supplier: 'ProAudio' },
        { id: 4, product: 'Cargadores', current: 12, min: 5, supplier: 'ElectroPlus' }
    ]);

    const [transactions, setTransactions] = useState([
        { id: 1, date: '2025-10-05', type: 'Ingreso', description: 'Venta a Hospital Central', amount: 1500 },
        { id: 2, date: '2025-10-06', type: 'Gasto', description: 'Compra de 30 diademas', amount: 2000 },
        { id: 3, date: '2025-10-10', type: 'Ingreso', description: 'Venta a Clínica San José', amount: 900 }
    ]);

    const [eventForm, setEventForm] = useState({ date: '', time: '', patient: '', address: '' });
    const [transactionForm, setTransactionForm] = useState({ date: '', type: 'Ingreso', description: '', amount: '' });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventChecklist, setEventChecklist] = useState({});

    // Cargar datos del localStorage al montar
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedEvents = localStorage.getItem('events');
        const savedInventory = localStorage.getItem('inventory');
        const savedTransactions = localStorage.getItem('transactions');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedEvents) setEvents(JSON.parse(savedEvents));
        if (savedInventory) setInventory(JSON.parse(savedInventory));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    }, []);

    // Guardar datos en localStorage cuando cambian
    useEffect(() => {
        if (user) localStorage.setItem('events', JSON.stringify(events));
    }, [events, user]);

    useEffect(() => {
        if (user) localStorage.setItem('inventory', JSON.stringify(inventory));
    }, [inventory, user]);

    useEffect(() => {
        if (user) localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions, user]);

    const handleRegister = () => {
        setError('');
        if (!registerName || !registerEmail || !registerPassword) {
            setError('Completa todos los campos');
            return;
        }
        if (registerPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const newUser = {
            id: Date.now(),
            name: registerName,
            email: registerEmail,
            password: registerPassword
        };

        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        setRegisterMode(false);
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
    };

    const handleLogin = () => {
        setError('');
        if (!loginEmail || !loginPassword) {
            setError('Completa email y contraseña');
            return;
        }

        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
            setError('Usuario no encontrado. Regístrate primero.');
            return;
        }

        const user = JSON.parse(savedUser);
        if (user.email === loginEmail && user.password === loginPassword) {
            setUser(user);
            setLoginEmail('');
            setLoginPassword('');
            setError('');
        } else {
            setError('Email o contraseña incorrectos');
        }
    };

    const handleLogout = () => {
        setUser(null);
        setLoginEmail('');
        setLoginPassword('');
        setError('');
    };

    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const monthlyData = useMemo(() => {
        const income = transactions.filter(t => t.type === 'Ingreso').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'Gasto').reduce((sum, t) => sum + t.amount, 0);
        return [{ name: 'Mes Actual', Ingresos: income, Gastos: expense }];
    }, [transactions]);

    const monthlyProfit = useMemo(() => {
        const income = transactions.filter(t => t.type === 'Ingreso').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'Gasto').reduce((sum, t) => sum + t.amount, 0);
        return income - expense;
    }, [transactions]);

    const nextEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
    const alertedInventory = inventory.filter(i => i.current <= i.min);

    const handleAddEvent = () => {
        if (eventForm.date && eventForm.patient) {
            const newEvent = {
                id: Math.max(...events.map(e => e.id), 0) + 1,
                ...eventForm,
                status: 'Planificado',
                checklist: ['Calibrar diadema', 'Cargar baterías', 'Preparar documentación']
            };
            setEvents([...events, newEvent]);
            setEventForm({ date: '', time: '', patient: '', address: '' });
        }
    };

    const handleAddTransaction = () => {
        if (transactionForm.date && transactionForm.description && transactionForm.amount) {
            const newTrans = {
                id: Math.max(...transactions.map(t => t.id), 0) + 1,
                ...transactionForm,
                amount: parseFloat(transactionForm.amount)
            };
            setTransactions([...transactions, newTrans]);
            setTransactionForm({ date: '', type: 'Ingreso', description: '', amount: '' });
        }
    };

    const handleUpdateStock = (id, newStock) => {
        setInventory(inventory.map(item => item.id === id ? { ...item, current: newStock } : item));
    };

    const handleChecklistItem = (eventId, index) => {
        const key = `${eventId}-${index}`;
        setEventChecklist({ ...eventChecklist, [key]: !eventChecklist[key] });
    };

    const markEventComplete = (eventId) => {
        setEvents(events.map(e => e.id === eventId ? { ...e, status: 'Completado' } : e));
        setSelectedEvent(null);
    };

    const Dashboard = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
                <p className="text-sm opacity-90">Ganancias del Mes</p>
                <p className="text-4xl font-bold">${monthlyProfit.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar size={20} /> Eventos Próximos</h3>
                    {nextEvents.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                            {nextEvents.map(e => (
                                <li key={e.id} className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-blue-50" onClick={() => { setSelectedEvent(e); setActiveTab('eventos'); }}>
                                    <p className="font-medium">{e.patient}</p>
                                    <p className="text-gray-600">{e.date} - {e.time}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay eventos próximos</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-yellow-600" /> Alertas de Inventario</h3>
                    {alertedInventory.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                            {alertedInventory.map(item => (
                                <li key={item.id} className={`p-2 rounded ${item.current === 0 ? 'bg-red-100 border-l-4 border-red-500' : 'bg-yellow-100 border-l-4 border-yellow-500'}`}>
                                    <p className="font-medium">{item.product}</p>
                                    <p className="text-gray-700">Stock: {item.current} (Mín: {item.min})</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Inventario en buen estado</p>
                    )}
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={() => setActiveTab('eventos')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><Plus size={18} /> Nuevo Evento</button>
                <button onClick={() => setActiveTab('finanzas')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"><Plus size={18} /> Registrar Venta/Compra</button>
            </div>
        </div>
    );

    const EventsModule = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Crear Evento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="border rounded px-3 py-2" />
                    <input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="border rounded px-3 py-2" />
                    <input type="text" placeholder="Nombre Paciente" value={eventForm.patient} onChange={(e) => setEventForm({ ...eventForm, patient: e.target.value })} className="border rounded px-3 py-2" />
                    <input type="text" placeholder="Dirección" value={eventForm.address} onChange={(e) => setEventForm({ ...eventForm, address: e.target.value })} className="border rounded px-3 py-2" />
                </div>
                <button onClick={handleAddEvent} className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar Evento</button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Eventos Programados</h3>
                <div className="space-y-3">
                    {events.map(e => (
                        <div key={e.id} className="p-4 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEvent(e)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{e.patient}</p>
                                    <p className="text-sm text-gray-600">{e.date} - {e.time} | {e.address}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${e.status === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{e.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="font-semibold mb-4">{selectedEvent.patient}</h3>
                        <p className="text-sm text-gray-600 mb-4">{selectedEvent.date} - {selectedEvent.time} | {selectedEvent.address}</p>
                        <div className="mb-4">
                            <p className="font-medium mb-2">Checklist:</p>
                            {selectedEvent.checklist.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" checked={eventChecklist[`${selectedEvent.id}-${idx}`] || false} onChange={() => handleChecklistItem(selectedEvent.id, idx)} className="w-4 h-4" />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => markEventComplete(selectedEvent.id)} className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"><Check size={18} /> Completar</button>
                            <button onClick={() => setSelectedEvent(null)} className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const InventoryModule = () => (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Package size={20} /> Gestión de Inventario</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Producto</th>
                            <th className="px-4 py-2 text-left">Stock Actual</th>
                            <th className="px-4 py-2 text-left">Mínimo</th>
                            <th className="px-4 py-2 text-left">Proveedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id} className={item.current === 0 ? 'bg-red-100' : item.current <= item.min ? 'bg-yellow-100' : ''}>
                                <td className="px-4 py-2">{item.product}</td>
                                <td className="px-4 py-2">
                                    <input type="number" value={item.current} onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value) || 0)} className="w-20 border rounded px-2 py-1" />
                                </td>
                                <td className="px-4 py-2">{item.min}</td>
                                <td className="px-4 py-2">{item.supplier}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const FinanceModule = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Registrar Transacción</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="date" value={transactionForm.date} onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })} className="border rounded px-3 py-2" />
                    <select value={transactionForm.type} onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })} className="border rounded px-3 py-2">
                        <option>Ingreso</option>
                        <option>Gasto</option>
                    </select>
                    <input type="text" placeholder="Descripción" value={transactionForm.description} onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })} className="border rounded px-3 py-2 md:col-span-2" />
                    <input type="number" placeholder="Monto" value={transactionForm.amount} onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })} className="border rounded px-3 py-2" />
                </div>
                <button onClick={handleAddTransaction} className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar Transacción</button>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Ingresos vs Gastos - {currentMonth}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Ingresos" fill="#10b981" />
                        <Bar dataKey="Gastos" fill="#ef4444" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-4">Historial de Transacciones</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Fecha</th>
                                <th className="px-4 py-2 text-left">Tipo</th>
                                <th className="px-4 py-2 text-left">Descripción</th>
                                <th className="px-4 py-2 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} className={t.type === 'Ingreso' ? 'bg-green-50' : 'bg-red-50'}>
                                    <td className="px-4 py-2">{t.date}</td>
                                    <td className="px-4 py-2"><span className={`px-2 py-1 rounded text-xs ${t.type === 'Ingreso' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{t.type}</span></td>
                                    <td className="px-4 py-2">{t.description}</td>
                                    <td className="px-4 py-2 text-right font-medium">${t.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // PANTALLA DE LOGIN
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Manager Control Central</h1>

                    {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

                    {!registerMode ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="flex items-center border rounded-lg px-3 py-2">
                                    <Mail size={18} className="text-gray-400 mr-2" />
                                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="tu@email.com" className="w-full outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <div className="flex items-center border rounded-lg px-3 py-2">
                                    <Lock size={18} className="text-gray-400 mr-2" />
                                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••" className="w-full outline-none" />
                                </div>
                            </div>
                            <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Ingresar</button>
                            <p className="text-center text-gray-600">¿No tienes cuenta? <button onClick={() => setRegisterMode(true)} className="text-blue-600 font-semibold hover:underline">Regístrate aquí</button></p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Tu Nombre" className="w-full border rounded-lg px-3 py-2 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="flex items-center border rounded-lg px-3 py-2">
                                    <Mail size={18} className="text-gray-400 mr-2" />
                                    <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="tu@email.com" className="w-full outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <div className="flex items-center border rounded-lg px-3 py-2">
                                    <Lock size={18} className="text-gray-400 mr-2" />
                                    <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="••••••" className="w-full outline-none" />
                                </div>
                            </div>
                            <button onClick={handleRegister} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Registrarse</button>
                            <p className="text-center text-gray-600">¿Ya tienes cuenta? <button onClick={() => setRegisterMode(false)} className="text-blue-600 font-semibold hover:underline">Inicia sesión</button></p>
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-600"><strong>Demo:</strong></p>
                        <p className="text-xs text-gray-600">Email: demo@test.com</p>
                        <p className="text-xs text-gray-600">Pass: 123456</p>
                    </div>
                </div>
            </div>
        );
    }

    // APP LOGUEADA
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gray-900 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Manager Control Central</h1>
                        <p className="text-xs text-gray-300">Bienvenido, {user.name}</p>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <button onClick={handleLogout} className="hidden md:flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700"><LogOut size={18} /> Salir</button>
                </div>
                <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex gap-4 mt-4 md:mt-0`}>
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                        { id: 'eventos', label: 'Eventos', icon: Calendar },
                        { id: 'inventario', label: 'Inventario', icon: Package },
                        { id: 'finanzas', label: 'Finanzas', icon: DollarSign }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }} className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === tab.id ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                    <button onClick={handleLogout} className="flex md:hidden items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700 ml-auto"><LogOut size={18} /> Salir</button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'eventos' && <EventsModule />}
                {activeTab === 'inventario' && <InventoryModule />}
                {activeTab === 'finanzas' && <FinanceModule />}
            </div>
        </div>
    );
}