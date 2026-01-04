
// Mocks a payment gateway API call
export interface CardDetails {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
}

export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    error?: string;
}

/**
 * Simulates a payment processing API call.
 * @param details - The card details for payment.
 * @param amount - The amount to be charged.
 * @returns A promise that resolves with the payment result.
 */
export const processPayment = (details: CardDetails, amount: number): Promise<PaymentResponse> => {
    console.log(`Processing payment of R$${amount.toFixed(2)} for ${details.cardholderName}`);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // Basic validation
            if (!details.cardholderName || !details.cardNumber || !details.expiryDate || !details.cvc) {
                resolve({ success: false, error: 'Por favor, preencha todos os campos do cartão.' });
                return;
            }

            if (details.cardNumber.replace(/\s/g, '').length < 13) {
                 resolve({ success: false, error: 'Número do cartão parece ser inválido.' });
                 return;
            }

            // Simulate success for a specific card number ending, failure for others
            // This allows for easy testing of both success and failure scenarios.
            if (details.cardNumber.replace(/\s/g, '').endsWith('4242')) {
                resolve({ success: true, transactionId: `txn_${Date.now()}` });
            } else {
                resolve({ success: false, error: 'Pagamento recusado pela operadora. Verifique os dados do cartão ou tente outro.' });
            }
        }, 2000); // Simulate a 2-second network delay
    });
};