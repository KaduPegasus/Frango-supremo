
import React from 'react';
import { Combo, Product } from '../types';
import ComboCard from './ComboCard';

interface ComboListProps {
    combos: Combo[];
    products: Product[];
    onAddComboToCart: (combo: Combo) => void;
}

const ComboList: React.FC<ComboListProps> = ({ combos, products, onAddComboToCart }) => {
    return (
        <section>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-6 border-l-4 border-amber-500 pl-4">Nossos Combos Supremos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combos.map(combo => (
                    <ComboCard key={combo.id} combo={combo} onAddComboToCart={onAddComboToCart} products={products} />
                ))}
            </div>
        </section>
    );
};

export default ComboList;
