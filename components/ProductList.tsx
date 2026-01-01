
import React, { useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { SearchIcon } from './IconComponents';

interface ProductListProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    searchQuery: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, searchQuery }) => {
    // A lógica de busca permanece inalterada e funcional.
    const filteredProducts = useMemo(() => {
        if (!searchQuery) {
            return products;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.description.toLowerCase().includes(lowercasedQuery)
        );
    }, [products, searchQuery]);

    if (searchQuery) {
        return (
            <section>
                <h2 className="text-3xl font-extrabold text-stone-900 mb-6 border-l-4 border-amber-500 pl-4">
                    Resultados para "{searchQuery}"
                </h2>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                        <SearchIcon className="w-12 h-12 mx-auto text-stone-400 mb-4" />
                        <h3 className="text-xl font-bold text-stone-800">Nenhum produto encontrado</h3>
                        <p className="text-stone-600 mt-2">Tente buscar por outro termo.</p>
                    </div>
                )}
            </section>
        );
    }
    
    // Lógica refatorada: Agrupa produtos por categoria primeiro para clareza e eficiência.
    const productsByCategory = useMemo(() => {
        return products.reduce((acc, product) => {
            const category = product.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as Record<Product['category'], Product[]>);
    }, [products]);
    
    // Define a ordem desejada das categorias para garantir um layout consistente.
    const categoryOrder: Product['category'][] = ['Frango', 'Acompanhamento', 'Bebida'];

    return (
        <section>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-6 border-l-4 border-amber-500 pl-4">Monte seu Banquete</h2>
            <div className="space-y-12">
                {categoryOrder.map(category => {
                    const categoryProducts = productsByCategory[category];
                    
                    // Se a categoria não tiver produtos, não renderiza a seção.
                    if (!categoryProducts || categoryProducts.length === 0) {
                        return null;
                    }
                    
                    return (
                        <div key={category}>
                            <h3 className="text-2xl font-bold text-stone-800 mb-4">{category === 'Acompanhamento' ? 'Acompanhamentos' : `${category}s`}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categoryProducts.map(product => (
                                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ProductList;
