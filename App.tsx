
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, CartItem, Order, View, Combo, BusinessInfo, OrderStatusType } from './types';
import { defaultProducts, defaultCombos, defaultBusinessInfo } from './constants';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartView from './components/CartView';
import CheckoutForm from './components/CheckoutForm';
import OrderStatus from './components/OrderStatus';
import ComboList from './components/ComboList';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import DeliveryView from './components/DeliveryView';
import OrderHistoryView from './components/OrderHistoryView';
import { ShoppingCartIcon } from './components/IconComponents';
import FeedbackForm from './components/FeedbackForm';

const App: React.FC = () => {
    const [view, setView] = useState<View>('menu');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
        try {
            const saved = window.localStorage.getItem(`frango-supremo-app-${key}`);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error(`Failed to load ${key} from localStorage`, error);
            return defaultValue;
        }
    };
    
    const saveToStorage = <T,>(key: string, value: T) => {
         try {
            window.localStorage.setItem(`frango-supremo-app-${key}`, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to save ${key} to localStorage`, error);
        }
    };

    const [products, setProducts] = useState<Product[]>(() => loadFromStorage('products', defaultProducts));
    const [combos, setCombos] = useState<Combo[]>(() => loadFromStorage('combos', defaultCombos));
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => loadFromStorage('business-info', defaultBusinessInfo));
    const [orderHistory, setOrderHistory] = useState<Order[]>(() => loadFromStorage('order-history', []));

    useEffect(() => {
        saveToStorage('order-history', orderHistory);
    }, [orderHistory]);

    useEffect(() => {
        if (isAdminAuthenticated) saveToStorage('products', products);
    }, [products, isAdminAuthenticated]);

    useEffect(() => {
        if (isAdminAuthenticated) saveToStorage('combos', combos);
    }, [combos, isAdminAuthenticated]);

    useEffect(() => {
        if (isAdminAuthenticated) saveToStorage('business-info', businessInfo);
    }, [businessInfo, isAdminAuthenticated]);

    useEffect(() => {
        if (view !== 'menu') setSearchQuery('');
    }, [view]);

    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);

    const addToCart = useCallback((product: Product, quantity: number = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { product, quantity }];
        });
    }, []);
    
    const addComboToCart = useCallback((combo: Combo) => {
        combo.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                addToCart(product, item.quantity);
            }
        });
    }, [addToCart, products]);

    const updateCartQuantity = useCallback((productId: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.product.id !== productId);
            }
            return prevCart.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            );
        });
    }, []);

    const handleCheckout = useCallback((customerDetails: Omit<Order, 'items' | 'total' | 'status' | 'id' | 'date'>) => {
        const newOrder: Order = {
            id: Date.now().toString(),
            date: Date.now(),
            ...customerDetails,
            items: cart,
            total: cartTotal,
            status: 'Recebido',
        };
        setActiveOrder(newOrder);
        setOrderHistory(prevHistory => [newOrder, ...prevHistory]);
        setCart([]);
        setView('status');
    }, [cart, cartTotal]);
    
    const startNewOrder = () => {
        setActiveOrder(null);
        setCart([]);
        setView('menu');
    };

    const handleUpdateOrderStatus = useCallback((orderId: string, newStatus: OrderStatusType) => {
        setOrderHistory(prev => 
            prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
        // Also update the customer's active order if it's the one being changed
        if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
    }, [activeOrder]);
    
    const handleReorder = useCallback((orderToReorder: Order) => {
        setCart(orderToReorder.items);
        setView('cart');
    }, []);
    
    const saveData = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, dataToSave: T) => {
        setter(prevData => {
            const existingIndex = prevData.findIndex(d => d.id === dataToSave.id);
            if (existingIndex > -1) {
                const updatedData = [...prevData];
                updatedData[existingIndex] = dataToSave;
                return updatedData;
            }
            return [...prevData, dataToSave];
        });
    };

    const deleteData = <T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) => {
        setter(prevData => prevData.filter(d => d.id !== id));
    };

    const handleSaveCombo = (combo: Combo) => saveData(setCombos, combo);
    const handleDeleteCombo = (id: string) => deleteData(setCombos, id);
    const handleSaveProduct = (product: Product) => saveData(setProducts, product);
    const handleDeleteProduct = (id: string) => deleteData(setProducts, id);
    const handleSaveBusinessInfo = (info: BusinessInfo) => setBusinessInfo(info);
    
    const handleAdminClick = () => {
        if (isAdminAuthenticated) setView('admin');
        else setIsLoginModalOpen(true);
    };

    const handleDeliveryClick = () => {
         if (isAdminAuthenticated) setView('delivery');
         else setIsLoginModalOpen(true);
    }

    const handleLogin = (password: string) => {
        // In a real app, this should be a secure backend call.
        if (password === 'supremo123') {
            setIsAdminAuthenticated(true);
            setIsLoginModalOpen(false);
            setView('admin');
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsAdminAuthenticated(false);
        setView('menu');
    };

    const activeDeliveryOrders = useMemo(() => 
        orderHistory
            .filter(o => o.orderType === 'Entrega' && o.status !== 'Entregue' && o.status !== 'Concluído')
            .sort((a, b) => a.date - b.date), // Show oldest orders first
    [orderHistory]);

    const renderContent = () => {
        switch (view) {
            case 'cart':
                return <CartView cart={cart} total={cartTotal} onUpdateQuantity={updateCartQuantity} onCheckout={() => setView('checkout')} onBack={() => setView('menu')} />;
            case 'checkout':
                return <CheckoutForm onSubmit={handleCheckout} onBack={() => setView('cart')} />;
            case 'status':
                return activeOrder && <OrderStatus order={activeOrder} onNewOrder={startNewOrder} />;
            case 'admin':
                return isAdminAuthenticated ? <AdminPanel 
                            combos={combos} 
                            products={products} 
                            businessInfo={businessInfo}
                            onSaveCombo={handleSaveCombo} 
                            onDeleteCombo={handleDeleteCombo}
                            onSaveProduct={handleSaveProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onSaveBusinessInfo={handleSaveBusinessInfo} 
                            onBack={() => setView('menu')}
                            onLogout={handleLogout}
                        /> : null;
            case 'delivery':
                return isAdminAuthenticated ? <DeliveryView activeOrders={activeDeliveryOrders} onUpdateStatus={handleUpdateOrderStatus} onBack={() => setView('menu')}/> : null;
            case 'history':
                return <OrderHistoryView orderHistory={orderHistory} onReorder={handleReorder} onBack={() => setView('menu')} />;
            case 'menu':
            default:
                return (
                    <div className="container mx-auto px-4 py-8 space-y-12">
                        {!searchQuery && <ComboList combos={combos} onAddComboToCart={addComboToCart} products={products}/>}
                        <ProductList products={products} onAddToCart={addToCart} searchQuery={searchQuery} />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
            <Header 
                cartCount={cartCount} 
                onCartClick={() => setView('cart')} 
                onLogoClick={() => setView('menu')} 
                onAdminClick={handleAdminClick} 
                onDeliveryClick={handleDeliveryClick} 
                onHistoryClick={() => setView('history')}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentView={view}
            />
            <main className="flex-grow">
                {renderContent()}
            </main>
             {isLoginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setIsLoginModalOpen(false)} />}
            
            <style>{`
                .fab-cart-button { display: none; }
                @media (max-height: 500px) and (orientation: landscape) {
                    .full-width-cart-button { display: none; }
                    .fab-cart-button { display: block; }
                }
            `}</style>

            {view === 'menu' && cartCount > 0 && (
                <div className="full-width-cart-button sticky bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-stone-200 lg:hidden">
                    <button
                        onClick={() => setView('cart')}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex justify-between items-center"
                    >
                        <span>Ver Pedido ({cartCount} {cartCount > 1 ? 'itens' : 'item'})</span>
                        <span className="text-lg">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </button>
                </div>
            )}
            
            {view === 'menu' && cartCount > 0 && (
                <div className="fab-cart-button sticky bottom-4 right-4 z-20 lg:hidden">
                    <button
                        onClick={() => setView('cart')}
                        className="relative bg-red-600 text-white w-16 h-16 rounded-full shadow-xl hover:bg-red-700 transition-all duration-300 transform hover:rotate-12 flex items-center justify-center"
                        aria-label="Ver carrinho de compras"
                    >
                        <ShoppingCartIcon className="h-8 w-8" />
                        <span className="absolute -top-1 -right-1 block h-6 w-6 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                            {cartCount}
                        </span>
                    </button>
                </div>
            )}

            {view === 'menu' && <FeedbackForm />}

            <Footer businessInfo={businessInfo} />
        </div>
    );
};

export default App;