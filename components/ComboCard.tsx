
import React from 'react';
import { Combo, Product } from '../types';
import { PlusIcon } from './IconComponents';

interface ComboCardProps {
    combo: Combo;
    products: Product[];
    onAddComboToCart: (combo: Combo) => void;
}

const ComboCard: React.FC<ComboCardProps> = ({ combo, products, onAddComboToCart }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-shadow duration-300 hover:shadow-2xl group">
            <div className="overflow-hidden md:w-40 flex-shrink-0">
                <img 
                    src={combo.imageUrl} 
                    alt={combo.name} 
                    className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="300"
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-stone-900">{combo.name}</h3>
                <p className="text-sm text-stone-600 mt-1 flex-grow">{combo.description}</p>
                <div className="mt-4 border-t border-stone-200 pt-3">
                    <span className="text-xs font-semibold text-stone-500">INCLUI:</span>
                    <ul className="text-sm text-stone-600 list-disc list-inside mt-1 space-y-1">
                        {combo.items.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return product ? <li key={item.productId}>{item.quantity}x {product.name}</li> : null;
                        })}
                    </ul>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-extrabold text-stone-800">
                        R$ {combo.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                        onClick={() => onAddComboToCart(combo)}
                        className="bg-red-600 text-white font-bold rounded-lg py-2.5 px-5 shadow-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center gap-2"
                        aria-label={`Adicionar ${combo.name} ao carrinho`}
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComboCard;
