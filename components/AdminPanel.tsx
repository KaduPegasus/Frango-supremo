import React, { useState, useEffect } from 'react';
import { Combo, Product, ComboItem, BusinessInfo } from '../types';
import { EditIcon, PlusIcon, TrashIcon, StorefrontIcon, PackageIcon, ChickenIcon, XIcon, CheckCircleIcon } from './IconComponents';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

// --- FORMULÁRIOS --- //

const ComboForm: React.FC<{
    initialData: Combo | null;
    products: Product[];
    onSave: (combo: Combo) => void;
    onCancel: () => void;
}> = ({ initialData, products, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Combo, 'id'>>({
        name: '', description: '', price: 0, imageUrl: '', items: [{ productId: '', quantity: 1 }],
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setImagePreview(initialData.imageUrl);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, imageUrl: base64 }));
            setImagePreview(base64);
        }
    };
    
    const handleItemChange = (index: number, field: keyof ComboItem, value: string | number) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData(prev => ({...prev, items: newItems }));
    };

    const addItem = () => setFormData(prev => ({ ...prev, items: [...prev.items, { productId: '', quantity: 1 }] }));
    const removeItem = (index: number) => setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: initialData?.id || Date.now().toString(), ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-stone-800 mb-6">{initialData ? 'Editar Combo' : 'Criar Novo Combo'}</h3>
            <input type="text" name="name" placeholder="Nome do Combo" value={formData.name} onChange={handleChange} required className="input-field"/>
            <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} required rows={3} className="input-field"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="number" name="price" placeholder="Preço (R$)" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="input-field"/>
                <div>
                     <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-700">Imagem do Combo</label>
                    <input type="file" name="imageUrl" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-md" width="128" height="128" decoding="async" />}
                </div>
            </div>
            <div>
                <h4 className="text-lg font-medium text-stone-700 mb-2">Itens do Combo</h4>
                <div className="space-y-4">
                    {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-stone-50 rounded-md">
                            <select value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} required className="flex-grow input-field">
                                <option value="" disabled>Selecione um produto...</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))} required min="1" className="w-20 input-field" />
                            <button type="button" onClick={() => removeItem(index)} className="p-2 rounded-full hover:bg-red-100"><TrashIcon className="w-5 h-5 text-red-600" /></button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addItem} className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"><PlusIcon className="w-4 h-4" /> Adicionar Item</button>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row-reverse gap-4">
                <button type="submit" className="btn-primary">Salvar Combo</button>
                <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
            </div>
        </form>
    );
};

const ProductForm: React.FC<{
    initialData: Product | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
}> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '', description: '', price: 0, category: 'Frango', imageUrl: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

     useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setImagePreview(initialData.imageUrl);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target instanceof HTMLInputElement && e.target.type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value as Product['category'] }));
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setFormData(prev => ({ ...prev, imageUrl: base64 }));
            setImagePreview(base64);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: initialData?.id || Date.now().toString(), ...formData });
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-stone-800 mb-6">{initialData ? 'Editar Produto' : 'Criar Novo Produto'}</h3>
            <input type="text" name="name" placeholder="Nome do Produto" value={formData.name} onChange={handleChange} required className="input-field"/>
            <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} required rows={3} className="input-field"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="number" name="price" placeholder="Preço (R$)" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="input-field"/>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                    <option value="Frango">Frango</option>
                    <option value="Acompanhamento">Acompanhamento</option>
                    <option value="Bebida">Bebida</option>
                </select>
            </div>
             <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-stone-700">Imagem do Produto</label>
                <input type="file" name="imageUrl" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-md" width="128" height="128" decoding="async" />}
            </div>
            <div className="pt-4 flex flex-col sm:flex-row-reverse gap-4">
                <button type="submit" className="btn-primary">Salvar Produto</button>
                <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
            </div>
        </form>
    )
};

const BusinessInfoForm: React.FC<{
    initialData: BusinessInfo;
    onSave: (info: BusinessInfo) => void;
}> = ({ initialData, onSave }) => {
    const [formData, setFormData] = useState<BusinessInfo>(initialData);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setSaveMessage("Informações salvas com sucesso!");
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="name" placeholder="Nome da Loja" value={formData.name} onChange={handleChange} required className="input-field"/>
            <input type="text" name="address" placeholder="Endereço" value={formData.address} onChange={handleChange} required className="input-field"/>
            <input type="tel" name="phone" placeholder="Telefone Fixo" value={formData.phone} onChange={handleChange} required className="input-field"/>
            <input type="tel" name="whatsapp" placeholder="Nº do WhatsApp (ex: 55119...)" value={formData.whatsapp} onChange={handleChange} required className="input-field"/>
            <input type="url" name="instagram" placeholder="Link do Instagram" value={formData.instagram} onChange={handleChange} className="input-field"/>
            <input type="url" name="facebook" placeholder="Link do Facebook" value={formData.facebook} onChange={handleChange} className="input-field"/>
            <input type="url" name="tiktok" placeholder="Link do TikTok" value={formData.tiktok} onChange={handleChange} className="input-field"/>
            <input type="url" name="twitter" placeholder="Link do X (Twitter)" value={formData.twitter} onChange={handleChange} className="input-field"/>
            <input type="url" name="youtube" placeholder="Link do YouTube" value={formData.youtube} onChange={handleChange} className="input-field"/>
             <div>
                <label htmlFor="openingHours" className="block text-sm font-medium text-stone-700">Horário de Funcionamento</label>
                <textarea 
                    id="openingHours" 
                    name="openingHours" 
                    placeholder="Ex: Sábados e Domingos&#10;10:00 - 14:00" 
                    value={formData.openingHours} 
                    onChange={handleChange} 
                    required 
                    className="input-field mt-1" 
                    rows={3}
                />
                <p className="text-xs text-stone-500 mt-1">Dica: Pressione Enter para criar uma nova linha.</p>
            </div>
            <div className="pt-4 flex justify-end items-center gap-4">
                 {saveMessage && <p className="text-sm font-semibold text-green-600 flex items-center gap-2"><CheckCircleIcon className="w-5 h-5"/> {saveMessage}</p>}
                <button type="submit" className="btn-primary">Salvar Informações</button>
            </div>
        </form>
    )
};

// --- PAINEL PRINCIPAL --- //

interface AdminPanelProps {
    combos: Combo[];
    products: Product[];
    businessInfo: BusinessInfo;
    onSaveCombo: (combo: Combo) => void;
    onDeleteCombo: (comboId: string) => void;
    onSaveProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
    onSaveBusinessInfo: (info: BusinessInfo) => void;
    onBack: () => void;
    onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'combos' | 'products' | 'business'>('combos');
    const [editingItem, setEditingItem] = useState<Combo | Product | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleEdit = (item: Combo | Product) => {
        setEditingItem(item);
        setIsFormVisible(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsFormVisible(true);
    };

    const handleSave = (item: Combo | Product) => {
        if ('items' in item) { // É um combo
            props.onSaveCombo(item);
        } else { // É um produto
            props.onSaveProduct(item);
        }
        setIsFormVisible(false);
        setEditingItem(null);
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este item?")) {
            if (activeTab === 'combos') props.onDeleteCombo(id);
            if (activeTab === 'products') props.onDeleteProduct(id);
        }
    }

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingItem(null);
    };
    
    const tabs = [
        { id: 'combos', name: 'Combos', icon: <ChickenIcon className="w-5 h-5 mr-2" /> },
        { id: 'products', name: 'Produtos', icon: <PackageIcon className="w-5 h-5 mr-2" /> },
        { id: 'business', name: 'Info da Loja', icon: <StorefrontIcon className="w-5 h-5 mr-2" /> }
    ];

    const renderList = () => {
        const data = activeTab === 'combos' ? props.combos : props.products;
        return (
             <ul className="divide-y divide-stone-200">
                {data.map(item => (
                     <li key={item.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                             <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover hidden sm:block" loading="lazy" decoding="async" width="64" height="64" />
                             <div>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-stone-600">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 rounded-full hover:bg-stone-100"><EditIcon className="w-5 h-5 text-stone-600"/></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 rounded-full hover:bg-red-100"><TrashIcon className="w-5 h-5 text-red-600"/></button>
                        </div>
                     </li>
                ))}
            </ul>
        );
    };

    const renderContent = () => {
        if (isFormVisible) {
            if (activeTab === 'combos') {
                return <ComboForm initialData={editingItem as Combo | null} products={props.products} onSave={handleSave as (c: Combo) => void} onCancel={handleCancel} />
            }
            if (activeTab === 'products') {
                 return <ProductForm initialData={editingItem as Product | null} onSave={handleSave as (p: Product) => void} onCancel={handleCancel} />
            }
        }

        if (activeTab === 'business') {
            return <BusinessInfoForm initialData={props.businessInfo} onSave={props.onSaveBusinessInfo} />;
        }
        
        return (
            <div>
                {renderList()}
                <div className="mt-8 flex justify-end">
                    <button onClick={handleAddNew} className="btn-primary flex items-center"><PlusIcon className="w-5 h-5 mr-2"/> Adicionar Novo</button>
                </div>
            </div>
        )
    };
    

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
             <h2 className="text-3xl font-extrabold text-stone-900 mb-2">Gerenciar Loja</h2>
             <p className="text-stone-600 mb-6">Aqui você pode customizar os produtos, combos e informações da sua loja.</p>

            <div className="flex items-center justify-between border-b border-stone-200">
                <div className="flex-grow flex space-x-1">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setIsFormVisible(false); }}
                            className={`flex items-center px-4 py-3 font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500 hover:text-stone-800'}`}>
                            {tab.icon} {tab.name}
                        </button>
                    ))}
                </div>
                <button onClick={props.onLogout} title="Sair do modo de edição" className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                    <XIcon className="w-6 h-6 text-stone-600"/>
                </button>
            </div>
             
             <div className="bg-white rounded-xl shadow-xl p-6 mt-6">
                {renderContent()}
             </div>
             <button onClick={props.onBack} className="btn-secondary w-full mt-6">Voltar ao Cardápio</button>

            <style>{`
                .input-field {
                    width: 100%; 
                    padding: 0.75rem; 
                    border: 1px solid #d6d3d1; 
                    border-radius: 0.5rem; 
                    transition: box-shadow 0.2s;
                    background-color: #ffffff;
                    color: #292524;
                }
                .input-field:focus {
                    outline: none; box-shadow: 0 0 0 2px #fbbf24; border-color: #f59e0b;
                }
                .btn-primary {
                    background-color: #dc2626; color: white; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); transition: background-color 0.2s;
                }
                .btn-primary:hover {
                    background-color: #b91c1c;
                }
                .btn-secondary {
                    background-color: transparent; border: 2px solid #e7e5e4; color: #44403c; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.5rem; transition: background-color 0.2s;
                }
                .btn-secondary:hover {
                    background-color: #f5f5f4;
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;