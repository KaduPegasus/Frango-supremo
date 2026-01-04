
import React from 'react';
import { AlertTriangleIcon } from './IconComponents';

export interface CardDetailsState {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvc: string;
}

interface CardPaymentFormProps {
    cardDetails: CardDetailsState;
    onCardDetailsChange: (details: CardDetailsState) => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ cardDetails, onCardDetailsChange }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onCardDetailsChange({ ...cardDetails, [name]: value });
    };

    // Formats card number input with spaces (e.g., 4444 4444 4444 4242)
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\s/g, '');
        if (/^\d*$/.test(rawValue) && rawValue.length <= 16) {
            const formattedValue = rawValue.match(/.{1,4}/g)?.join(' ') || '';
            onCardDetailsChange({ ...cardDetails, cardNumber: formattedValue });
        }
    };

    // Formats expiry date input with a slash (e.g., 12/28)
    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value.replace('/', '');
        if (/^\d*$/.test(rawValue) && rawValue.length <= 4) {
            if (rawValue.length > 2) {
                rawValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2);
            }
            onCardDetailsChange({ ...cardDetails, expiryDate: rawValue });
        }
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500";

    return (
        <div className="space-y-4 pt-4 border-t">
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                       <AlertTriangleIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                           <span className="font-bold">Atenção:</span> Este é um ambiente de demonstração.
                           <span className="font-semibold"> Não use dados de cartão de crédito reais.</span>
                           Para testar um pagamento aprovado, use um número de cartão terminado em <span className="font-bold">4242</span>.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-stone-700">Nome no Cartão</label>
                <input type="text" id="cardholderName" name="cardholderName" value={cardDetails.cardholderName} onChange={handleInputChange} required className={inputClasses} />
            </div>
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-stone-700">Número do Cartão</label>
                <input type="text" id="cardNumber" name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardNumberChange} required placeholder="0000 0000 0000 0000" inputMode="numeric" className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-stone-700">Validade</label>
                    <input type="text" id="expiryDate" name="expiryDate" value={cardDetails.expiryDate} onChange={handleExpiryDateChange} required placeholder="MM/AA" className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-stone-700">CVC</label>
                    <input type="text" id="cvc" name="cvc" value={cardDetails.cvc} onChange={handleInputChange} required placeholder="123" inputMode="numeric" maxLength={4} className={inputClasses} />
                </div>
            </div>
        </div>
    );
};

export default CardPaymentForm;
