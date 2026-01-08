
import React, { useState } from 'react';
import { StorefrontIcon, MotorcycleIcon, CreditCardIcon, PixIcon, MoneyIcon, LinkIcon } from './IconComponents';
import { PaymentMethod, BusinessInfo } from '../types';

interface CheckoutFormProps {
    total: number;
    businessInfo: BusinessInfo;
    onSubmit: (details: { 
        customerName: string; 
        phone: string; 
        orderType: 'Retirada' | 'Entrega'; 
        address?: string; 
        notes?: string;
        paymentMethod: PaymentMethod;
        changeFor?: number;
    }) => void;
    onBack: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, onBack, total, businessInfo }) => {
    const isPixAvailable = businessInfo.pixKey && businessInfo.pixKey.trim() !== '' && businessInfo.pixKey !== 'seu-email-pix-aqui';

    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [orderType, setOrderType] = useState<'Retirada' | 'Entrega'>('Retirada');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(isPixAvailable ? 'Pix' : 'Cartão (Online)');
    const [changeFor, setChangeFor] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = () => {
        if(!businessInfo.pixKey) return;
        navigator.clipboard.writeText(businessInfo.pixKey).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falha ao copiar.');
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const changeForValue = paymentMethod === 'Dinheiro' && changeFor ? parseFloat(changeFor) : undefined;
        onSubmit({ 
            customerName, 
            phone, 
            orderType, 
            address: orderType === 'Entrega' ? address : undefined, 
            notes,
            paymentMethod,
            changeFor: changeForValue
        });
    };

    const formatPhone = (value: string) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 3) return `(${phoneNumber}`;
        if (phoneNumberLength < 8) return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneNumber = formatPhone(e.target.value);
        setPhone(formattedPhoneNumber);
    };
    
    const allPaymentOptions: { id: PaymentMethod; label: string; icon: React.ReactElement; subtitle?: string; isRecommended?: boolean; }[] = [
        { id: 'Pix', label: 'Pix', icon: <PixIcon className="w-8 h-8 mx-auto mb-1 text-green-600" />, subtitle: 'Pagamento instantâneo', isRecommended: true },
        { id: 'Cartão (Online)', label: 'Cartão Online', icon: <CreditCardIcon className="w-8 h-8 mx-auto mb-2 text-red-600" /> },
        { id: 'Dinheiro', label: 'Dinheiro', icon: <MoneyIcon className="w-8 h-8 mx-auto mb-2 text-stone-500" /> },
        { id: 'Cartão (Entrega)', label: 'Cartão (Entrega)', icon: <CreditCardIcon className="w-8 h-8 mx-auto mb-2 text-stone-500" /> },
    ];
    
    const paymentOptions = allPaymentOptions.filter(option => {
        if (option.id === 'Pix' && !isPixAvailable) {
            return false;
        }
        return true;
    });

    let gridClass = 'grid-cols-2 sm:grid-cols-4';
    if (paymentOptions.length === 3) {
        gridClass = 'grid-cols-3';
    } else if (paymentOptions.length <= 2) {
        gridClass = 'grid-cols-2';
    }

    const isOnlinePayment = paymentMethod === 'Cartão (Online)';
    const inputFieldClasses = "mt-1 w-full p-3 bg-white border border-stone-300 rounded-lg shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500";


    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-extrabold text-stone-900 mb-6">Finalizar Pedido</h2>
            <div className="bg-white rounded-xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campos de Informações Pessoais */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700">Nome Completo</label>
                        <input type="text" id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} required className={inputFieldClasses}/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-stone-700">Telefone (WhatsApp)</label>
                        <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} required placeholder="(XX) XXXXX-XXXX" maxLength={15} className={inputFieldClasses}/>
                    </div>

                    {/* Opções de Entrega */}
                    <div>
                        <span className="block text-sm font-medium text-stone-700">Como você quer receber?</span>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button type="button" onClick={() => setOrderType('Retirada')} className={`p-4 rounded-xl border-2 text-center transition-all ${orderType === 'Retirada' ? 'bg-red-50 border-red-600 ring-2 ring-red-500' : 'bg-white border-stone-300 hover:border-red-400'}`}>
                                <StorefrontIcon className="w-8 h-8 mx-auto mb-2 text-red-600" />
                                <span className="font-bold text-stone-800">Retirada no Local</span>
                            </button>
                            <button type="button" onClick={() => setOrderType('Entrega')} className={`p-4 rounded-xl border-2 text-center transition-all ${orderType === 'Entrega' ? 'bg-red-50 border-red-600 ring-2 ring-red-500' : 'bg-white border-stone-300 hover:border-red-400'}`}>
                                <MotorcycleIcon className="w-8 h-8 mx-auto mb-2 text-red-600" />
                                <span className="font-bold text-stone-800">Entrega (Delivery)</span>
                            </button>
                        </div>
                    </div>
                    {orderType === 'Entrega' && (
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-stone-700">Endereço de Entrega</label>
                            <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required={orderType === 'Entrega'} placeholder="Rua, Número, Bairro, Complemento" className={inputFieldClasses}/>
                        </div>
                    )}

                    {/* Forma de Pagamento */}
                    <div>
                        <span className="block text-sm font-medium text-stone-700">Forma de Pagamento</span>
                        <div className={`mt-2 grid gap-4 ${gridClass}`}>
                            {paymentOptions.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(option.id)}
                                    className={`relative h-28 rounded-xl border-2 text-center transition-all overflow-hidden flex flex-col items-center justify-center ${paymentMethod === option.id ? 'bg-red-50 border-red-600 ring-2 ring-red-500' : 'bg-white border-stone-300 hover:border-red-400'}`}
                                >
                                    {option.isRecommended && (
                                        <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-[10px] font-bold py-1 leading-none z-10">
                                            RECOMENDADO
                                        </div>
                                    )}
                                    <div>
                                        {option.icon}
                                        <span className="font-bold text-stone-800 text-xs sm:text-sm block">{option.label}</span>
                                        {option.subtitle && (
                                            <span className="text-green-700 text-[10px] font-semibold leading-tight block mt-0.5">
                                                {option.subtitle}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {paymentMethod === 'Pix' && isPixAvailable && (
                        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 mt-4 text-left rounded-r-lg">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(businessInfo.pixKey!)}`} 
                                    alt="QR Code Pix" 
                                    className="w-32 h-32 object-contain rounded-lg bg-white p-1 shadow-sm"
                                    width="128" height="128" />
                                <div className="flex-grow">
                                    <h4 className="font-bold text-sky-800">Pague com Pix para confirmar</h4>
                                    <p className="text-sm text-sky-700 mt-1">
                                        Copie a chave ou leia o QR Code no app do seu banco. Após pagar, clique em "Confirmar Pedido".
                                    </p>
                                    <div className="mt-3 relative">
                                        <input
                                            type="text"
                                            value={businessInfo.pixKey!}
                                            readOnly
                                            className="w-full pr-28 pl-3 py-2 bg-white border border-sky-300 rounded-md shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={copyToClipboard}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-sky-600 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-sky-700 transition-colors flex items-center justify-center gap-1 text-sm"
                                        >
                                           <LinkIcon className="w-4 h-4" />
                                           {copySuccess || 'Copiar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'Dinheiro' && (
                        <div>
                            <label htmlFor="changeFor" className="block text-sm font-medium text-stone-700">Precisa de troco para quanto?</label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">R$</span>
                                <input type="number" id="changeFor" value={changeFor} onChange={e => setChangeFor(e.target.value)} placeholder={`Valor do pedido: ${total.toFixed(2)}`} min={total} className={`${inputFieldClasses} pl-10`}/>
                            </div>
                        </div>
                    )}

                    {/* Observações */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-stone-700">Observações (opcional)</label>
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Ex: frango bem passado, sem cebola na maionese..." className={inputFieldClasses}/>
                    </div>

                    {/* Botões de Ação */}
                    <div className="pt-4 flex flex-col sm:flex-row-reverse gap-4">
                        <button type="submit" className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition-colors flex justify-center items-center">
                           {isOnlinePayment ? 'Ir para Pagamento Seguro' : 'Confirmar Pedido'}
                        </button>
                         <button type="button" onClick={onBack} className="w-full sm:w-auto bg-transparent border-2 border-stone-300 text-stone-700 font-bold py-3 px-8 rounded-lg hover:bg-stone-100 transition-colors">
                            Voltar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;
