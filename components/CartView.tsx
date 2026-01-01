
import React, { useState } from 'react';
import { CartItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon } from './IconComponents';
import ConfirmationModal from './ConfirmationModal';

interface CartViewProps {
    cart: CartItem[];
    total: number;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onCheckout: () => void;
    onBack: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, total, onUpdateQuantity, onCheckout, onBack }) => {
    const [productToRemove, setProductToRemove] = useState<string | null>(null);

    const handleConfirmRemove = () => {
        if (productToRemove) {
            onUpdateQuantity(productToRemove, 0);
        }
        setProductToRemove(null);
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h2>
                <p className="text-stone-600 mb-6">Adicione alguns itens deliciosos do nosso cardápio!</p>
                <button onClick={onBack} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-colors">
                    Voltar ao Cardápio
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-extrabold text-stone-900 mb-6">Meu Pedido</h2>
                <div className="bg-white rounded-xl shadow-xl p-6">
                    <ul className="divide-y divide-stone-200">
                        {cart.map(({ product, quantity }) => (
                            <li key={product.id} className="py-4 flex items-center gap-4">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-20 h-20 rounded-lg object-cover" 
                                    loading="lazy"
                                    decoding="async"
                                    width="80"
                                    height="80"
                                />
                                <div className="flex-grow">
                                    <p className="font-bold">{product.name}</p>
                                    <p className="text-stone-600">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => quantity === 1 ? setProductToRemove(product.id) : onUpdateQuantity(product.id, quantity - 1)} 
                                        className="p-2 rounded-full bg-stone-100 hover:bg-stone-200"
                                        aria-label={quantity === 1 ? 'Remover item' : 'Diminuir quantidade'}
                                    >
                                        {quantity === 1 ? <TrashIcon className="w-5 h-5 text-red-600" /> : <MinusIcon className="w-5 h-5 text-stone-700" />}
                                    </button>
                                    <span className="w-8 text-center font-bold">{quantity}</span>
                                    <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="p-2 rounded-full bg-stone-100 hover:bg-stone-200" aria-label="Aumentar quantidade">
                                        <PlusIcon className="w-5 h-5 text-stone-700" />
                                    </button>
                                </div>
                                <p className="w-24 text-right font-bold">R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 border-t pt-6 text-right">
                        <p className="text-lg">Subtotal: <span className="font-bold text-2xl ml-2">R$ {total.toFixed(2).replace('.', ',')}</span></p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                            <button onClick={onBack} className="bg-transparent border-2 border-stone-300 text-stone-700 font-bold py-3 px-6 rounded-lg hover:bg-stone-100 transition-colors">
                                Continuar Comprando
                            </button>
                            <button onClick={onCheckout} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-colors">
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={!!productToRemove}
                onClose={() => setProductToRemove(null)}
                onConfirm={handleConfirmRemove}
                title="Remover Item"
                message="Tem certeza que deseja remover este item do seu carrinho?"
                confirmText="Remover"
                cancelText="Cancelar"
            />
        </>
    );
};

export default CartView;
