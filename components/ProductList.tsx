
import React, { useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
    // Agrupa produtos por categoria para renderização organizada.
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
    
    // Define a ordem de preferência, mas renderiza todas as categorias encontradas.
    const sortedCategories = useMemo(() => {
        const preferredOrder: (keyof typeof productsByCategory)[] = ['Frango', 'Acompanhamento', 'Bebida'];
        const allCategories = Object.keys(productsByCategory) as (keyof typeof productsByCategory)[];

        return allCategories.sort((a, b) => {
            const indexA = preferredOrder.indexOf(a);
            const indexB = preferredOrder.indexOf(b);

            if (indexA > -1 && indexB > -1) return indexA - indexB; // Ambos na lista de preferência
            if (indexA > -1) return -1; // A está na lista, B não
            if (indexB > -1) return 1;  // B está na lista, A não
            return a.localeCompare(b); // Nenhum está na lista, ordena alfabeticamente
        });
    }, [productsByCategory]);
    
    const getCategoryTitle = (category: string) => {
        if (category === 'Acompanhamento') return 'Acompanhamentos';
        // Regra simples de pluralização que funciona para os casos comuns (Frango -> Frangos, Bebida -> Bebidas)
        return `${category}s`;
    };

    return (
        <section>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-6 border-l-4 border-amber-500 pl-4">Monte seu Banquete</h2>
            <div className="space-y-12">
                {sortedCategories.map(category => {
                    const categoryProducts = productsByCategory[category];
                    
                    if (!categoryProducts || categoryProducts.length === 0) {
                        return null;
                    }
                    
                    return (
                        <div key={category}>
                            <h3 className="text-2xl font-bold text-stone-800 mb-4">{getCategoryTitle(category)}</h3>
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