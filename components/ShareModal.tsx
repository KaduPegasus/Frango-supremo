
import React from 'react';
import { Product } from '../types';
import { XIcon, WhatsappIcon, FacebookIcon, TwitterIcon, LinkIcon } from './IconComponents';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, product }) => {
    const [copySuccess, setCopySuccess] = React.useState('');

    if (!isOpen) {
        return null;
    }

    const productUrl = `https://frangosupremo.com/product/${product.id}`;
    const shareText = encodeURIComponent(`Confira este produto delicioso: ${product.name}!`);

    const socialLinks = {
        whatsapp: `https://wa.me/?text=${shareText}%20${encodeURIComponent(productUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${shareText}`,
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(productUrl).then(() => {
            setCopySuccess('Link copiado!');
            setTimeout(() => setCopySuccess(''), 2000); // Reset after 2 seconds
        }, () => {
            setCopySuccess('Falha ao copiar.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-slate-800">Compartilhar Produto</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200" aria-label="Fechar">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" width="96" height="96" />
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                            <p className="text-slate-600">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>

                    <div className="flex justify-around items-center my-4">
                         <a href={socialLinks.whatsapp} data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-slate-600 hover:text-green-500 transition-colors">
                            <WhatsappIcon className="w-10 h-10 text-green-500" />
                            <span className="text-xs">WhatsApp</span>
                        </a>
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
                            <FacebookIcon className="w-10 h-10 text-blue-600" />
                             <span className="text-xs">Facebook</span>
                        </a>
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-slate-600 hover:text-sky-500 transition-colors">
                             <TwitterIcon className="w-10 h-10 text-sky-500" />
                             <span className="text-xs">Twitter</span>
                        </a>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="share-link" className="block text-sm font-medium text-slate-700 mb-1">Ou copie o link:</label>
                        <div className="relative">
                             <input
                                id="share-link"
                                type="text"
                                value={productUrl}
                                readOnly
                                className="w-full pl-3 pr-24 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-700 font-semibold py-1.5 px-3 rounded-md hover:bg-slate-300 transition-colors text-sm flex items-center gap-1"
                            >
                                <LinkIcon className="w-4 h-4" />
                                {copySuccess ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShareModal;
