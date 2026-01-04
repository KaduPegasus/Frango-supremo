
import React from 'react';
import { Product, Combo } from '../types';
import ProductCard from './ProductCard';
import ComboCard from './ComboCard';
import { SearchIcon } from './IconComponents';

interface SearchResultsViewProps {
    query: string;
    results: {
        products: Product[];
        combos: Combo[];
    };
    allProducts: Product[];
    onAddToCart: (product: Product) => void;
    onAddComboToCart: (combo: Combo) => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({ query, results, allProducts, onAddToCart, onAddComboToCart }) => {
    const hasResults = results.products.length > 0 || results.combos.length > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-extrabold text-stone-900 mb-6 border-l-4 border-amber-500 pl-4">
                Resultados para "{query}"
            </h2>
            
            {hasResults ? (
                <div className="space-y-12">
                    {/* Seção de Combos */}
                    {results.combos.length > 0 && (
                        <section>
                            <h3 className="text-2xl font-bold text-stone-800 mb-4">Combos Encontrados</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.combos.map(combo => (
                                    <ComboCard 
                                        key={combo.id} 
                                        combo={combo} 
                                        onAddComboToCart={onAddComboToCart} 
                                        products={allProducts} 
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Seção de Produtos */}
                    {results.products.length > 0 && (
                         <section>
                            <h3 className="text-2xl font-bold text-stone-800 mb-4">Produtos Encontrados</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {results.products.map(product => (
                                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
                    <SearchIcon className="w-12 h-12 mx-auto text-stone-400 mb-4" />
                    <h3 className="text-xl font-bold text-stone-800">Nenhum resultado encontrado</h3>
                    <p className="text-stone-600 mt-2">Tente buscar por "frango" ou "maionese".</p>
                </div>
            )}
        </div>
    );
};

export default SearchResultsView;