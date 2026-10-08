/**
 * Base44 API Client Simulator with LocalStorage persistence.
 * Provides complete authentication and data access for BusinessAroundMe.
 */

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "business_owner" | "user";
  profile_photo_url?: string;
  can_manage_relationships?: boolean;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  rating: number;
  reviews_count: number;
  price_level: "$" | "$$" | "$$$";
  is_verified: boolean;
  is_open: boolean;
  hours: string;
  phone: string;
  whatsapp: string;
  website: string;
  image_url: string;
  coordinates: { lat: number; lng: number };
  owner_id: string;
  status: "active" | "pending" | "suspended";
  tags: string[];
}

export interface Product {
  id: string;
  business_id: string;
  business_name: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  in_stock: boolean;
}

export interface Service {
  id: string;
  business_id: string;
  business_name: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  is_available: boolean;
}

export interface Review {
  id: string;
  business_id: string;
  business_name: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  likes: number;
}

export interface BusinessRelationship {
  id: string;
  source_business_id: string;
  source_business_name: string;
  target_business_id: string;
  target_business_name: string;
  relationship_type: "Fornecedor" | "Parceiro Comercial" | "Afiliado" | "Prestador de Serviço" | "Ponto de Retirada";
  description: string;
  created_at: string;
}

const DEFAULT_USERS: User[] = [
  {
    id: "usr_admin",
    full_name: "Carlos Eduardo Menezes",
    email: "carlos.admin@businessaroundme.com",
    role: "admin",
    profile_photo_url: "",
    can_manage_relationships: true,
  },
  {
    id: "usr_owner_1",
    full_name: "Mariana Costa",
    email: "mariana@cafearomas.com.br",
    role: "business_owner",
    profile_photo_url: "",
    can_manage_relationships: true,
  },
  {
    id: "usr_client",
    full_name: "Lucas Fernandes Silva",
    email: "lucas.silva@gmail.com",
    role: "user",
    profile_photo_url: "",
    can_manage_relationships: false,
  },
];

const DEFAULT_BUSINESSES: Business[] = [
  {
    id: "biz_1",
    name: "Café Aromas da Vila",
    category: "Alimentação & Café",
    description: "Cafeteria artesanal com grãos selecionados do cerrado mineiro, pães de fermentação natural e ambiente acolhedor com Wi-Fi de alta velocidade.",
    address: "Rua Fradique Coutinho, 1420",
    neighborhood: "Vila Madalena",
    city: "São Paulo - SP",
    rating: 4.9,
    reviews_count: 142,
    price_level: "$$",
    is_verified: true,
    is_open: true,
    hours: "Terça a Domingo: 08:00 - 19:30",
    phone: "(11) 3042-8910",
    whatsapp: "(11) 98765-4321",
    website: "https://cafearomasdavila.com.br",
    image_url: "/src/assets/images/business_artisan_bakery_1791476536575.jpg",
    coordinates: { lat: -23.5583, lng: -46.6892 },
    owner_id: "usr_owner_1",
    status: "active",
    tags: ["Café Especial", "Brunch", "Pet Friendly", "Pães Artesanais", "Wi-Fi"],
  },
  {
    id: "biz_2",
    name: "TechHub Coworking & Inovação",
    category: "Tecnologia & Escritórios",
    description: "Espaço compartilhado premium com salas de reunião privativas, cabines acústicas, eventos de networking e café liberado para membros.",
    address: "Av. Brigadeiro Faria Lima, 2232",
    neighborhood: "Pinheiros",
    city: "São Paulo - SP",
    rating: 4.8,
    reviews_count: 89,
    price_level: "$$$",
    is_verified: true,
    is_open: true,
    hours: "Segunda a Sábado: 24 Horas",
    phone: "(11) 4003-9120",
    whatsapp: "(11) 97123-9988",
    website: "https://techhubsp.io",
    image_url: "/src/assets/images/business_tech_coworking_1791476545066.jpg",
    coordinates: { lat: -23.5711, lng: -46.6914 },
    owner_id: "usr_admin",
    status: "active",
    tags: ["Coworking", "Salas de Reunião", "Startups", "Networking", "Fibra Óptica"],
  },
  {
    id: "biz_3",
    name: "Boutique Floral Jardim Secreto",
    category: "Flores & Decoração",
    description: "Arranjos florais contemporâneos, plantas ornamentais raras, assinatura floral semanal para residências e ambientação para pequenos eventos.",
    address: "Al. Lorena, 1560",
    neighborhood: "Jardins",
    city: "São Paulo - SP",
    rating: 4.9,
    reviews_count: 67,
    price_level: "$$",
    is_verified: true,
    is_open: true,
    hours: "Segunda a Sábado: 09:00 - 18:30",
    phone: "(11) 3881-2240",
    whatsapp: "(11) 99112-3344",
    website: "https://jardimsecretoboutique.com.br",
    image_url: "/src/assets/images/business_boutique_flower_1791476554812.jpg",
    coordinates: { lat: -23.5654, lng: -46.6678 },
    owner_id: "usr_admin",
    status: "active",
    tags: ["Flores Naturais", "Design Botânico", "Entrega Rápida", "Presentes"],
  },
  {
    id: "biz_4",
    name: "Oficina Mecânica Precision Auto",
    category: "Serviços Automotivos",
    description: "Centro automotivo especializado em diagnóstico eletrônico, injeção, suspensão e alinhamento a laser com garantia de serviço e transparência total.",
    address: "Rua Teodoro Sampaio, 2100",
    neighborhood: "Pinheiros",
    city: "São Paulo - SP",
    rating: 4.7,
    reviews_count: 115,
    price_level: "$$",
    is_verified: true,
    is_open: true,
    hours: "Segunda a Sexta: 08:00 - 18:00",
    phone: "(11) 3088-7711",
    whatsapp: "(11) 98111-2233",
    website: "https://precisionautosp.com.br",
    image_url: "",
    coordinates: { lat: -23.5623, lng: -46.6852 },
    owner_id: "usr_admin",
    status: "active",
    tags: ["Revisão Preventiva", "Freios", "Injeção Eletrônica", "Guincho"],
  },
  {
    id: "biz_5",
    name: "Clínica & Spa Veterinário Bem Estar Pet",
    category: "Saúde & Pets",
    description: "Cuidados veterinários completos com consultas preventivas, vacinação importada, banho & tosa terapêuticos e táxi dog com monitoramento.",
    address: "Rua Mourato Coelho, 890",
    neighborhood: "Vila Madalena",
    city: "São Paulo - SP",
    rating: 4.8,
    reviews_count: 98,
    price_level: "$$",
    is_verified: true,
    is_open: true,
    hours: "Segunda a Sábado: 08:30 - 20:00",
    phone: "(11) 3219-5500",
    whatsapp: "(11) 97654-1234",
    website: "https://bemestarpet.com.br",
    image_url: "",
    coordinates: { lat: -23.5574, lng: -46.6925 },
    owner_id: "usr_admin",
    status: "active",
    tags: ["Veterinário", "Banho e Tosa", "Vacinas", "Emergência 24h"],
  },
  {
    id: "biz_6",
    name: "Studio Pilates & Movimento Vital",
    category: "Saúde & Bem-estar",
    description: "Aulas personalizadas com instrutores pós-graduados, equipamentos clássicos e foco em reabilitação postural e fortalecimento corporal.",
    address: "Rua Oscar Freire, 910",
    neighborhood: "Cerqueira César",
    city: "São Paulo - SP",
    rating: 4.9,
    reviews_count: 53,
    price_level: "$$$",
    is_verified: false,
    is_open: true,
    hours: "Segunda a Sexta: 07:00 - 21:00",
    phone: "(11) 3083-9912",
    whatsapp: "(11) 99444-5566",
    website: "https://movimentovitalpilates.com.br",
    image_url: "",
    coordinates: { lat: -23.5638, lng: -46.6698 },
    owner_id: "usr_owner_1",
    status: "active",
    tags: ["Pilates Clássico", "Fisioterapia", "Postura", "Aulas Individuais"],
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    business_id: "biz_1",
    business_name: "Café Aromas da Vila",
    name: "Café Especial Catuaí Vermelho 250g",
    description: "Torra média, notas sensoriais de chocolate amargo e caramelo, colheita seletiva.",
    price: 42.0,
    category: "Cafés em Grão",
    in_stock: true,
  },
  {
    id: "prod_2",
    business_id: "biz_1",
    business_name: "Café Aromas da Vila",
    name: "Pão Sourdough Rústico Tradicional",
    description: "Fermentação lenta de 36 horas, casca crocante e miolo aerado com farinha francesa.",
    price: 28.5,
    category: "Panificação Artesanal",
    in_stock: true,
  },
  {
    id: "prod_3",
    business_id: "biz_1",
    business_name: "Café Aromas da Vila",
    name: "Croissant Folhado com Manteiga da Canastra",
    description: "Folhado leve e crocante, preparado diariamente com manteiga artesanal premium.",
    price: 16.0,
    category: "Panificação Artesanal",
    in_stock: true,
  },
  {
    id: "prod_4",
    business_id: "biz_3",
    business_name: "Boutique Floral Jardim Secreto",
    name: "Buquê Silvestre 'Luz da Tarde'",
    description: "Composição com eucalipto, hortênsias, cravos nobres e flores sazonais envoltas em papel kraft.",
    price: 185.0,
    category: "Arranjos Florais",
    in_stock: true,
  },
  {
    id: "prod_5",
    business_id: "biz_3",
    business_name: "Boutique Floral Jardim Secreto",
    name: "Vaso de Cerâmica Terracota c/ Fícus Lyrata",
    description: "Planta adulta exuberante em vaso artesanal drenado, ideal para salas de estar e escritórios.",
    price: 240.0,
    category: "Plantas Vivas",
    in_stock: true,
  },
  {
    id: "prod_6",
    business_id: "biz_2",
    business_name: "TechHub Coworking & Inovação",
    name: "Passe Diário Hot Desk (Day Pass)",
    description: "Acesso por 1 dia ao salão compartilhado, internet fibra 1Gbps, cabines de call e café à vontade.",
    price: 75.0,
    category: "Passes & Acesso",
    in_stock: true,
  },
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: "srv_1",
    business_id: "biz_2",
    business_name: "TechHub Coworking & Inovação",
    name: "Locação de Sala de Reunião Executiva (10 pessoas)",
    description: "Tela 4K para videoconferência, lousa de vidro, microfone omnidirecional e serviço de recepção.",
    price: 130.0,
    duration: "1 hora",
    category: "Espaços Corporativos",
    is_available: true,
  },
  {
    id: "srv_2",
    business_id: "biz_4",
    business_name: "Oficina Mecânica Precision Auto",
    name: "Diagnóstico Computadorizado Completo",
    description: "Escaneamento de injeção, freios ABS, airbags e emissão de relatório digital com laudo técnico.",
    price: 180.0,
    duration: "45 min",
    category: "Diagnóstico",
    is_available: true,
  },
  {
    id: "srv_3",
    business_id: "biz_4",
    business_name: "Oficina Mecânica Precision Auto",
    name: "Alinhamento 3D e Balanceamento das 4 Rodas",
    description: "Ajuste milimétrico computadorizado para máxima segurança, estabilidade e durabilidade dos pneus.",
    price: 160.0,
    duration: "1 hora",
    category: "Suspensão & Rodas",
    is_available: true,
  },
  {
    id: "srv_4",
    business_id: "biz_5",
    business_name: "Clínica & Spa Veterinário Bem Estar Pet",
    name: "Banho Terapêutico & Hidratação de Argan",
    description: "Shampoo hipoalergênico especial, corte de unhas, limpeza de ouvidos e escovação dos dentes.",
    price: 95.0,
    duration: "1h 30min",
    category: "Estética Animal",
    is_available: true,
  },
  {
    id: "srv_5",
    business_id: "biz_6",
    business_name: "Studio Pilates & Movimento Vital",
    name: "Avaliação Biomecânica Postural Individual",
    description: "Mapeamento completo de assimetrias posturais e plano personalizado de condicionamento.",
    price: 150.0,
    duration: "1 hora",
    category: "Saúde & Fisioterapia",
    is_available: true,
  },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev_1",
    business_id: "biz_1",
    business_name: "Café Aromas da Vila",
    user_name: "Juliana Rocha",
    rating: 5,
    comment: "Melhor cappuccino da região! Os pães artesanais saem quentinhos por volta das 9h e o atendimento é impecável.",
    created_at: "Há 2 dias",
    likes: 12,
  },
  {
    id: "rev_2",
    business_id: "biz_1",
    business_name: "Café Aromas da Vila",
    user_name: "Fernando Meireles",
    rating: 5,
    comment: "Ambiente perfeito para trabalhar remotamente por algumas horas. Internet rápida e tomadas em quase todas as mesas.",
    created_at: "Há 5 dias",
    likes: 8,
  },
  {
    id: "rev_3",
    business_id: "biz_2",
    business_name: "TechHub Coworking & Inovação",
    user_name: "Ana Beatriz Ramos",
    rating: 5,
    comment: "As cabines acústicas salvam qualquer reunião com cliente gringo. Estrutura impecável na Faria Lima.",
    created_at: "Há 1 semana",
    likes: 15,
  },
  {
    id: "rev_4",
    business_id: "biz_3",
    business_name: "Boutique Floral Jardim Secreto",
    user_name: "Rodrigo Silveira",
    rating: 5,
    comment: "Encomendei flores para o aniversário da minha esposa e o buquê superou todas as expectativas. Muito bom gosto!",
    created_at: "Há 1 semana",
    likes: 7,
  },
  {
    id: "rev_5",
    business_id: "biz_4",
    business_name: "Oficina Mecânica Precision Auto",
    user_name: "Marcelo Dantas",
    rating: 4,
    comment: "Diagnóstico transparente e sem empurrar peças desnecessárias. Cumpriram o prazo prometido à risca.",
    created_at: "Há 2 semanas",
    likes: 9,
  },
];

const DEFAULT_RELATIONSHIPS: BusinessRelationship[] = [
  {
    id: "rel_1",
    source_business_id: "biz_1",
    source_business_name: "Café Aromas da Vila",
    target_business_id: "biz_2",
    target_business_name: "TechHub Coworking & Inovação",
    relationship_type: "Fornecedor",
    description: "Fornecimento oficial de café em grãos e pães frescos para os eventos de networking e copa do Coworking.",
    created_at: "15/01/2026",
  },
  {
    id: "rel_2",
    source_business_id: "biz_3",
    source_business_name: "Boutique Floral Jardim Secreto",
    target_business_id: "biz_1",
    target_business_name: "Café Aromas da Vila",
    relationship_type: "Parceiro Comercial",
    description: "Decoração botânica permanente do salão do café em troca de exposição de buquês exclusivos no balcão.",
    created_at: "03/02/2026",
  },
  {
    id: "rel_3",
    source_business_id: "biz_3",
    source_business_name: "Boutique Floral Jardim Secreto",
    target_business_id: "biz_2",
    target_business_name: "TechHub Coworking & Inovação",
    relationship_type: "Prestador de Serviço",
    description: "Manutenção paisagística semanal das plantas ornamentais e jardins verticais do prédio.",
    created_at: "20/02/2026",
  },
];

// LocalStorage helpers
function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`bam_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load storage", key, e);
  }
  return defaultValue;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`bam_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save storage", key, e);
  }
}

// Current user state
let currentUser: User | null = null;
try {
  const storedUser = localStorage.getItem("bam_current_user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  } else {
    // Default to the first admin user so that the full app and admin menu are readily accessible
    currentUser = DEFAULT_USERS[0];
    localStorage.setItem("bam_current_user", JSON.stringify(currentUser));
  }
} catch {
  currentUser = DEFAULT_USERS[0];
}

// Global modal trigger listener
let loginModalListener: (() => void) | null = null;
export function onOpenLoginModal(callback: () => void) {
  loginModalListener = callback;
}

export const base44 = {
  auth: {
    me: async (): Promise<User | null> => {
      return currentUser;
    },
    login: async (userId: string): Promise<User> => {
      const users = await base44.users.list();
      const found = users.find((u) => u.id === userId) || users[0];
      currentUser = found;
      localStorage.setItem("bam_current_user", JSON.stringify(currentUser));
      return currentUser;
    },
    logout: async (): Promise<void> => {
      currentUser = null;
      localStorage.removeItem("bam_current_user");
    },
    redirectToLogin: () => {
      if (loginModalListener) {
        loginModalListener();
      } else {
        // Fallback: switch to admin user
        currentUser = DEFAULT_USERS[0];
        localStorage.setItem("bam_current_user", JSON.stringify(currentUser));
        window.location.reload();
      }
    },
    setMockUser: (user: User | null) => {
      currentUser = user;
      if (user) {
        localStorage.setItem("bam_current_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("bam_current_user");
      }
    },
  },

  users: {
    list: async (): Promise<User[]> => {
      return loadStorage<User[]>("users", DEFAULT_USERS);
    },
    update: async (id: string, updates: Partial<User>): Promise<User> => {
      const users = loadStorage<User[]>("users", DEFAULT_USERS);
      const updated = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
      saveStorage("users", updated);
      if (currentUser?.id === id) {
        currentUser = { ...currentUser, ...updates };
        localStorage.setItem("bam_current_user", JSON.stringify(currentUser));
      }
      return updated.find((u) => u.id === id)!;
    },
    create: async (data: Omit<User, "id">): Promise<User> => {
      const users = loadStorage<User[]>("users", DEFAULT_USERS);
      const newUser: User = {
        ...data,
        id: `usr_${Date.now()}`,
      };
      users.push(newUser);
      saveStorage("users", users);
      return newUser;
    },
  },

  businesses: {
    list: async (filters?: { category?: string; query?: string; verifiedOnly?: boolean }): Promise<Business[]> => {
      let list = loadStorage<Business[]>("businesses", DEFAULT_BUSINESSES);
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        list = list.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.neighborhood.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q) ||
            b.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (filters?.category && filters.category !== "all") {
        list = list.filter((b) => b.category.toLowerCase().includes(filters.category!.toLowerCase()));
      }
      if (filters?.verifiedOnly) {
        list = list.filter((b) => b.is_verified);
      }
      return list;
    },
    get: async (id: string): Promise<Business | null> => {
      const list = loadStorage<Business[]>("businesses", DEFAULT_BUSINESSES);
      return list.find((b) => b.id === id) || null;
    },
    create: async (data: Omit<Business, "id" | "rating" | "reviews_count">): Promise<Business> => {
      const list = loadStorage<Business[]>("businesses", DEFAULT_BUSINESSES);
      const newBiz: Business = {
        ...data,
        id: `biz_${Date.now()}`,
        rating: 5.0,
        reviews_count: 1,
      };
      list.unshift(newBiz);
      saveStorage("businesses", list);
      return newBiz;
    },
    update: async (id: string, updates: Partial<Business>): Promise<Business> => {
      const list = loadStorage<Business[]>("businesses", DEFAULT_BUSINESSES);
      const updated = list.map((b) => (b.id === id ? { ...b, ...updates } : b));
      saveStorage("businesses", updated);
      return updated.find((b) => b.id === id)!;
    },
    delete: async (id: string): Promise<void> => {
      const list = loadStorage<Business[]>("businesses", DEFAULT_BUSINESSES);
      const filtered = list.filter((b) => b.id !== id);
      saveStorage("businesses", filtered);
    },
  },

  products: {
    list: async (businessId?: string): Promise<Product[]> => {
      const list = loadStorage<Product[]>("products", DEFAULT_PRODUCTS);
      if (businessId) {
        return list.filter((p) => p.business_id === businessId);
      }
      return list;
    },
    create: async (data: Omit<Product, "id">): Promise<Product> => {
      const list = loadStorage<Product[]>("products", DEFAULT_PRODUCTS);
      const newProd: Product = {
        ...data,
        id: `prod_${Date.now()}`,
      };
      list.unshift(newProd);
      saveStorage("products", list);
      return newProd;
    },
    update: async (id: string, updates: Partial<Product>): Promise<Product> => {
      const list = loadStorage<Product[]>("products", DEFAULT_PRODUCTS);
      const updated = list.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveStorage("products", updated);
      return updated.find((p) => p.id === id)!;
    },
    delete: async (id: string): Promise<void> => {
      const list = loadStorage<Product[]>("products", DEFAULT_PRODUCTS);
      const filtered = list.filter((p) => p.id !== id);
      saveStorage("products", filtered);
    },
  },

  services: {
    list: async (businessId?: string): Promise<Service[]> => {
      const list = loadStorage<Service[]>("services", DEFAULT_SERVICES);
      if (businessId) {
        return list.filter((s) => s.business_id === businessId);
      }
      return list;
    },
    create: async (data: Omit<Service, "id">): Promise<Service> => {
      const list = loadStorage<Service[]>("services", DEFAULT_SERVICES);
      const newServ: Service = {
        ...data,
        id: `srv_${Date.now()}`,
      };
      list.unshift(newServ);
      saveStorage("services", list);
      return newServ;
    },
    update: async (id: string, updates: Partial<Service>): Promise<Service> => {
      const list = loadStorage<Service[]>("services", DEFAULT_SERVICES);
      const updated = list.map((s) => (s.id === id ? { ...s, ...updates } : s));
      saveStorage("services", updated);
      return updated.find((s) => s.id === id)!;
    },
    delete: async (id: string): Promise<void> => {
      const list = loadStorage<Service[]>("services", DEFAULT_SERVICES);
      const filtered = list.filter((s) => s.id !== id);
      saveStorage("services", filtered);
    },
  },

  reviews: {
    list: async (businessId?: string): Promise<Review[]> => {
      const list = loadStorage<Review[]>("reviews", DEFAULT_REVIEWS);
      if (businessId) {
        return list.filter((r) => r.business_id === businessId);
      }
      return list;
    },
    create: async (data: Omit<Review, "id" | "created_at" | "likes">): Promise<Review> => {
      const list = loadStorage<Review[]>("reviews", DEFAULT_REVIEWS);
      const newRev: Review = {
        ...data,
        id: `rev_${Date.now()}`,
        created_at: "Agora mesmo",
        likes: 0,
      };
      list.unshift(newRev);
      saveStorage("reviews", list);

      // Recalculate business rating
      const businesses = loadStorage<Business[]>("businesses", DEFAULT_BUSINESSES);
      const targetBiz = businesses.find((b) => b.id === data.business_id);
      if (targetBiz) {
        const bizReviews = list.filter((r) => r.business_id === data.business_id);
        const avg = bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length;
        targetBiz.rating = parseFloat(avg.toFixed(1));
        targetBiz.reviews_count = bizReviews.length;
        saveStorage("businesses", businesses);
      }

      return newRev;
    },
    delete: async (id: string): Promise<void> => {
      const list = loadStorage<Review[]>("reviews", DEFAULT_REVIEWS);
      const filtered = list.filter((r) => r.id !== id);
      saveStorage("reviews", filtered);
    },
  },

  relationships: {
    list: async (): Promise<BusinessRelationship[]> => {
      return loadStorage<BusinessRelationship[]>("relationships", DEFAULT_RELATIONSHIPS);
    },
    create: async (data: Omit<BusinessRelationship, "id" | "created_at">): Promise<BusinessRelationship> => {
      const list = loadStorage<BusinessRelationship[]>("relationships", DEFAULT_RELATIONSHIPS);
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
      const newRel: BusinessRelationship = {
        ...data,
        id: `rel_${Date.now()}`,
        created_at: dateStr,
      };
      list.unshift(newRel);
      saveStorage("relationships", list);
      return newRel;
    },
    delete: async (id: string): Promise<void> => {
      const list = loadStorage<BusinessRelationship[]>("relationships", DEFAULT_RELATIONSHIPS);
      const filtered = list.filter((r) => r.id !== id);
      saveStorage("relationships", filtered);
    },
  },
};
