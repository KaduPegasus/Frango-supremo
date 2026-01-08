
import React from 'react';
import { BusinessInfo } from '../types';
import { FacebookIcon, InstagramIcon, WhatsappIcon, TikTokIcon, TwitterIcon, YouTubeIcon } from './IconComponents';

interface FooterProps {
    businessInfo: BusinessInfo;
}

const Footer: React.FC<FooterProps> = ({ businessInfo }) => {
    return (
        <footer className="bg-stone-900 text-white mt-16">
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="font-extrabold text-lg mb-2 text-amber-500">Frango Supremo</h3>
                        <p className="text-stone-300">{businessInfo.address}</p>
                        <p className="text-stone-300">{businessInfo.phone}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-3">Nossas Redes</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            {businessInfo.whatsapp && (
                                <a href={`https://wa.me/${businessInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-stone-300 hover:text-green-400 transition-transform hover:scale-110">
                                    <WhatsappIcon className="w-7 h-7" />
                                </a>
                            )}
                            {businessInfo.instagram && (
                                <a href={businessInfo.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-stone-300 hover:text-pink-400 transition-transform hover:scale-110">
                                    <InstagramIcon className="w-7 h-7" />
                                </a>
                            )}
                            {businessInfo.facebook && (
                                <a href={businessInfo.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-stone-300 hover:text-blue-400 transition-transform hover:scale-110">
                                    <FacebookIcon className="w-7 h-7" />
                                </a>
                            )}
                            {businessInfo.tiktok && (
                                <a href={businessInfo.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-stone-300 hover:text-cyan-400 transition-transform hover:scale-110">
                                    <TikTokIcon className="w-7 h-7" />
                                </a>
                            )}
                            {businessInfo.twitter && (
                                <a href={businessInfo.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-stone-300 hover:text-stone-400 transition-transform hover:scale-110">
                                    <TwitterIcon className="w-7 h-7" />
                                </a>
                            )}
                             {businessInfo.youtube && (
                                <a href={businessInfo.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-stone-300 hover:text-red-500 transition-transform hover:scale-110">
                                    <YouTubeIcon className="w-7 h-7" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                         <h3 className="font-bold text-lg mb-2">Funcionamento</h3>
                         {businessInfo.openingHours.split('\n').map((line, index) => (
                            <p key={index} className="text-stone-300">{line}</p>
                         ))}
                    </div>
                </div>
                <div className="border-t border-stone-700 mt-8 pt-6 text-center text-sm text-stone-400">
                    <p>&copy; {new Date().getFullYear()} {businessInfo.name}. Todos os direitos reservados.</p>
                    <p className="mt-1">Desenvolvido por Satierf Tecnologia</p>
                    <p className="mt-2 text-xs">Renderizado com 🍗 e 🔥</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
