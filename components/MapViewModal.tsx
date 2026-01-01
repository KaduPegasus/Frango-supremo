
import React from 'react';
import { XIcon, MotorcycleIcon } from './IconComponents';

interface MapViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: { lat: number; lng: number } | null;
}

const MapViewModal: React.FC<MapViewModalProps> = ({ isOpen, onClose, location }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl h-3/4 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-slate-800">Localização do Entregador</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200" aria-label="Fechar mapa">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                <div className="flex-grow bg-slate-200 relative">
                    {location ? (
                        <>
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                // URL centers the map without adding a default pin. 't=m' sets map type to roadmap.
                                src={`https://maps.google.com/maps?ll=${location.lat},${location.lng}&z=15&output=embed&t=m`}
                            ></iframe>
                            
                            {/* Custom Marker Overlay */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                style={{ pointerEvents: 'none' }} // Allows map interaction underneath
                            >
                                <div className="relative flex items-center justify-center">
                                    {/* Pulsing ring for attention */}
                                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75"></span>
                                    {/* The icon itself with a background */}
                                    <div className="relative bg-white rounded-full p-2 shadow-lg border-2 border-white">
                                        <MotorcycleIcon className="w-8 h-8 text-red-600" />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-slate-600">Aguardando localização...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapViewModal;
