
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCartIcon, StorefrontIcon, MotorcycleIcon, ReceiptIcon, SearchIcon, XIcon } from './IconComponents';
import { View } from '../types';

interface HeaderProps {
    cartCount: number;
    onCartClick: () => void;
    onLogoClick: () => void;
    onAdminClick: () => void;
    onDeliveryClick: () => void;
    onHistoryClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    currentView: View;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLogoClick, onAdminClick, onDeliveryClick, onHistoryClick, searchQuery, onSearchChange, currentView }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const prevCartCountRef = useRef(cartCount);
    const isSearchVisible = currentView === 'menu' || currentView === 'search';

    useEffect(() => {
        if (cartCount > prevCartCountRef.current) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
        prevCartCountRef.current = cartCount;
    }, [cartCount]);
    
    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
            <style>{`
                @keyframes cart-bounce {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.25) rotate(10deg); }
                    100% { transform: scale(1); }
                }
                .cart-bounce-animation {
                    animation: cart-bounce 0.3s ease-in-out;
                }
            `}</style>
            <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
                <div 
                    className="flex items-center gap-2 cursor-pointer flex-shrink-0"
                    onClick={onLogoClick}
                >
                    <span className="text-3xl" role="img" aria-label="frango">🐔</span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-stone-800 tracking-tight">
                        Frango <span className="font-semibold text-amber-600">Supremo</span>
                    </h1>
                </div>

                {isSearchVisible && (
                    <div className="relative flex-grow max-w-lg mx-4 hidden md:block">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Buscar no cardápio..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-11 pr-10 py-2.5 border border-stone-300 rounded-full bg-stone-100 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition focus:bg-white"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-200"
                                aria-label="Limpar busca"
                            >
                                <XIcon className="h-4 w-4 text-stone-500" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                     <button 
                        onClick={onAdminClick}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                        aria-label="Gerenciar loja"
                        title="Gerenciar Loja"
                    >
                        <StorefrontIcon className="h-6 w-6 text-stone-600" />
                    </button>
                    <button 
                        onClick={onDeliveryClick}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                        aria-label="Portal do Entregador"
                        title="Portal do Entregador"
                    >
                        <MotorcycleIcon className="h-6 w-6 text-stone-600" />
                    </button>
                     <button 
                        onClick={onHistoryClick}
                        className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                        aria-label="Histórico de Pedidos"
                        title="Histórico de Pedidos"
                    >
                        <ReceiptIcon className="h-6 w-6 text-stone-600" />
                    </button>
                    <button 
                        onClick={onCartClick}
                        className={`relative p-2 rounded-full hover:bg-stone-100 transition-colors ${isAnimating ? 'cart-bounce-animation' : ''}`}
                        aria-label="Ver carrinho de compras"
                        title="Ver Carrinho"
                    >
                        <ShoppingCartIcon className="h-7 w-7 text-stone-600" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 block h-6 w-6 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
             {isSearchVisible && (
                <div className="container mx-auto px-4 pb-4 md:hidden">
                    <div className="relative w-full">
                       <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                       <input
                           type="text"
                           placeholder="Buscar no cardápio..."
                           value={searchQuery}
                           onChange={(e) => onSearchChange(e.target.value)}
                           className="w-full pl-11 pr-10 py-2.5 border border-stone-300 rounded-full bg-stone-100 focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition focus:bg-white"
                       />
                       {searchQuery && (
                           <button
                               onClick={() => onSearchChange('')}
                               className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-200"
                               aria-label="Limpar busca"
                           >
                               <XIcon className="h-4 w-4 text-stone-500" />
                           </button>
                       )}
                   </div>
                </div>
            )}
        </header>
    );
};

export default Header;