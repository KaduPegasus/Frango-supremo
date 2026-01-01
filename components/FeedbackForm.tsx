
import React, { useState } from 'react';
import { StarIcon } from './IconComponents';

const FeedbackForm: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 && message.trim() === '') {
            setError('Por favor, deixe uma avaliação ou uma mensagem.');
            return;
        }
        
        setError('');
        console.log('Feedback Submetido:', { rating, message });
        
        // Simulação de envio para um backend.
        // Em um app real, aqui você faria a chamada para a API.
        try {
            const feedbacks = JSON.parse(localStorage.getItem('frango-app-feedbacks') || '[]');
            feedbacks.push({ rating, message, date: new Date().toISOString() });
            localStorage.setItem('frango-app-feedbacks', JSON.stringify(feedbacks));
        } catch (err) {
            console.error("Falha ao salvar feedback no localStorage", err);
        }

        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-xl shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-green-600">Obrigado!</h2>
                    <p className="text-stone-600 mt-2">Seu feedback foi enviado com sucesso e nos ajudará a melhorar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-12 max-w-2xl">
            <div className="bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-extrabold text-stone-900 mb-2 text-center">Sua opinião é importante!</h2>
                <p className="text-stone-600 mb-6 text-center">Deixe seu feedback, crítica ou sugestão para melhorarmos nosso serviço.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <span className="block text-center font-medium text-stone-700 mb-2">Qual sua avaliação?</span>
                        <div className="flex justify-center items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 text-amber-400 transition-transform duration-200 hover:scale-125 focus:outline-none"
                                    aria-label={`Avaliação ${star} de 5 estrelas`}
                                >
                                    <StarIcon 
                                        className="w-8 h-8" 
                                        fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="feedback-message" className="sr-only">Sua mensagem</label>
                        <textarea 
                            id="feedback-message"
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Deixe sua mensagem aqui..." 
                            className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            className="w-full sm:w-auto bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                        >
                            Enviar Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
