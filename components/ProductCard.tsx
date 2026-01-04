
import React, { useState } from 'react';
import { Product } from '../types';
import { PlusIcon, ShareIcon } from './IconComponents';
import ShareModal from './ShareModal';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-shadow duration-300 hover:shadow-2xl group">
                <div className="overflow-hidden md:w-40 flex-shrink-0">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="300"
                    />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-stone-900">{product.name}</h3>
                    <p className="text-sm text-stone-600 mt-1 flex-grow">{product.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-xl font-extrabold text-stone-800">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="bg-stone-100 text-stone-600 rounded-full p-2.5 shadow-sm hover:bg-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400"
                                aria-label={`Compartilhar ${product.name}`}
                            >
                                <ShareIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => onAddToCart(product)}
                                className="bg-red-600 text-white rounded-full p-2.5 shadow-md hover:bg-red-700 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                aria-label={`Adicionar ${product.name} ao carrinho`}
                            >
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ShareModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                product={product} 
            />
        </>
    );
};

export default ProductCard;