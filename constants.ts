
import { Product, Combo, BusinessInfo } from './types';

export const defaultProducts: Product[] = [
    {
        id: 'frango_assado_inteiro',
        name: 'Frango Supremo Clássico',
        description: 'A estrela da casa! Marinado por 24h em temperos secretos e assado na brasa lentamente até a perfeição.',
        price: 48.00,
        category: 'Frango',
        imageUrl: 'https://images.pexels.com/photos/3926124/pexels-photo-3926124.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: 'meio_frango_assado',
        name: 'Meio Frango Supremo',
        description: 'A porção ideal para uma refeição individual, com o mesmo sabor e suculência incomparável.',
        price: 28.00,
        category: 'Frango',
        imageUrl: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: 'maionese_batata',
        name: 'Maionese Suprema (Cremosa)',
        description: 'Cremosa e bem temperada, nossa maionese de batata caseira é o acompanhamento perfeito. Porção de 500g.',
        price: 18.00,
        category: 'Acompanhamento',
        imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: 'farofa_especial',
        name: 'Farofa Suprema (com Bacon)',
        description: 'Feita na manteiga com pedaços generosos de bacon e calabresa. Crocante e cheia de sabor. Porção de 300g.',
        price: 15.00,
        category: 'Acompanhamento',
        imageUrl: 'https://images.pexels.com/photos/5639433/pexels-photo-5639433.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: 'arroz_branco',
        name: 'Arroz Branco Soltinho',
        description: 'O clássico que não pode faltar. Arroz soltinho e bem feito para completar sua refeição. Porção de 500g.',
        price: 12.00,
        category: 'Acompanhamento',
        imageUrl: 'https://images.pexels.com/photos/209482/pexels-photo-209482.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: 'coca_cola_2l',
        name: 'Coca-Cola 2L',
        description: 'Refrigerante Coca-Cola super gelado para toda a família.',
        price: 12.00,
        category: 'Bebida',
        imageUrl: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: 'guarana_antarctica_2l',
        name: 'Guaraná Antarctica 2L',
        description: 'O sabor original e refrescante do Brasil para acompanhar seu banquete.',
        price: 10.00,
        category: 'Bebida',
        imageUrl: 'https://images.pexels.com/photos/16158213/pexels-photo-16158213/free-photo-of-refrigerante-bebida-lata-guarana.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
];

export const defaultCombos: Combo[] = [
    {
        id: 'combo_casal',
        name: 'Combo Supremo (2 pessoas)',
        description: 'O banquete perfeito para dois. Frango inteiro, maionese, farofa crocante e uma Coca-Cola 2L.',
        price: 89.00,
        items: [
            { productId: 'frango_assado_inteiro', quantity: 1 },
            { productId: 'maionese_batata', quantity: 1 },
            { productId: 'farofa_especial', quantity: 1 },
            { productId: 'coca_cola_2l', quantity: 1 },
        ],
        imageUrl: 'https://images.pexels.com/photos/3926124/pexels-photo-3926124.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        id: 'combo_familia',
        name: 'Combo Família Supremo (4 pessoas)',
        description: 'Para toda a família! Frango inteiro, porção dupla de arroz, maionese e um Guaraná 2L.',
        price: 95.00,
        items: [
            { productId: 'frango_assado_inteiro', quantity: 1 },
            { productId: 'arroz_branco', quantity: 2 },
            { productId: 'maionese_batata', quantity: 1 },
            { productId: 'guarana_antarctica_2l', quantity: 1 },
        ],
        imageUrl: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
];

export const defaultBusinessInfo: BusinessInfo = {
    name: "Frango Supremo",
    address: "Avenida da Brasa, 123 - Vila Saborosa",
    phone: "(11) 1234-5678",
    whatsapp: "5511912345678",
    instagram: "https://instagram.com/frangosupremooficial",
    facebook: "https://facebook.com/frangosupremooficial",
    openingHours: "Sábados, Domingos e Feriados\n10:00 - 15:00",
    tiktok: "",
    twitter: "",
    youtube: "",
    pixKey: "seu-email-pix-aqui",
};