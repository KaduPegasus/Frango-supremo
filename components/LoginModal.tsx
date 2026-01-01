import React, { useState } from 'react';

interface LoginModalProps {
    onLogin: (password: string) => boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onLogin(password);
        if (!success) {
            setError('Senha incorreta. Tente novamente.');
            setPassword('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Acesso Restrito</h2>
                <p className="text-center text-slate-600 mb-6">Por favor, insira a senha para gerenciar a loja.</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password-input" className="sr-only">Senha</label>
                            <input
                                id="password-input"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="Digite a senha"
                                required
                                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                         {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                             className="w-full bg-transparent text-slate-600 font-semibold py-3 px-4 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;