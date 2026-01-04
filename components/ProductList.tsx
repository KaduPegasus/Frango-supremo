
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
    
    // Define a ordem desejada das categorias para garantir um layout consistente.
    const categoryOrder: Product['category'][] = ['Frango', 'Acompanhamento', 'Bebida'];

    return (
        <section>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-6 border-l-4 border-amber-500 pl-4">Monte seu Banquete</h2>
            <div className="space-y-12">
                {categoryOrder.map(category => {
                    const categoryProducts = productsByCategory[category];
                    
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