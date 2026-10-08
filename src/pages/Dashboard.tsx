import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44, Business, Review, User } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Star, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Navigation,
  Sparkles,
  Coffee,
  Laptop,
  Flower2,
  Wrench,
  HeartPulse,
  Plus
} from "lucide-react";
import { BusinessModal } from "@/components/BusinessModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("São Paulo, SP (Região Central / Pinheiros)");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const bizList = await base44.businesses.list();
    setBusinesses(bizList);
    const reviews = await base44.reviews.list();
    setRecentReviews(reviews.slice(0, 4));
    const currentUser = await base44.auth.me();
    setUser(currentUser);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/businesses?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/businesses");
    }
  };

  const handleUseLocation = () => {
    setLocationStatus("Localização obtida: Pinheiros / Jardins (Raio de 3 km)");
  };

  const categories = [
    { name: "Alimentação & Café", icon: Coffee, count: "12 locais" },
    { name: "Tecnologia & Escritórios", icon: Laptop, count: "8 locais" },
    { name: "Flores & Decoração", icon: Flower2, count: "5 locais" },
    { name: "Serviços Automotivos", icon: Wrench, count: "7 locais" },
    { name: "Saúde & Bem-estar", icon: HeartPulse, count: "9 locais" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-linear-to-r from-blue-950 via-blue-900 to-indigo-900 text-white p-8 md:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 border border-blue-400/30 text-xs font-medium text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Descubra o comércio local ao seu redor
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Conecte-se com os melhores negócios da sua vizinhança
          </h1>
          
          <p className="text-blue-100/90 text-sm md:text-base leading-relaxed">
            Cafés artesanais, serviços automotivos, coworkings, saúde e profissionais de confiança a poucos passos de você.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por pães artesanais, coworking, mecânica, yoga..."
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
            </div>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="px-6 rounded-xl font-semibold shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Explorar
            </Button>
          </form>

          {/* Proximity Pill */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{locationStatus}</span>
            </div>
            <button
              type="button"
              onClick={handleUseLocation}
              className="inline-flex items-center gap-1 text-xs font-semibold text-white underline hover:text-orange-300 transition-colors cursor-pointer"
            >
              <Navigation className="w-3 h-3" />
              Atualizar GPS
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Negócios Locais</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{businesses.length}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% verificados</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avaliação Média</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums flex items-center gap-1">
            4.8 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </p>
          <p className="text-xs text-slate-500">Mais de 450 opiniões</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Bairros Ativos</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">4 Bairros</p>
          <p className="text-xs text-slate-500">Pinheiros, Jardins, Vila Madalena</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Acesso ao Mapa</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">Interativo</p>
          <Link to="/map" className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            Abrir mapa com rotas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Categorias em Alta</h2>
          <Link to="/businesses" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
            Ver todas as categorias <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/businesses?cat=${encodeURIComponent(cat.name)}`)}
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <cat.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-xs text-slate-900 leading-snug line-clamp-1">{cat.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Negócios em Destaque</h2>
            <p className="text-xs text-slate-500">Estabelecimentos recomendados pela comunidade e parceiros oficiais</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBusinessModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Cadastrar Negócio
            </Button>
            <Link to="/businesses">
              <Button variant="default" size="sm" className="text-xs">
                Ver Todos
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businesses.slice(0, 3).map((biz) => (
            <div
              key={biz.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {biz.image_url ? (
                  <img
                    src={biz.image_url}
                    alt={biz.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                    <Building2 className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {biz.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-slate-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    {biz.price_level}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={createPageUrl("BusinessDetail", { id: biz.id })}
                      className="font-bold text-base text-slate-900 hover:text-blue-800 line-clamp-1"
                    >
                      {biz.name}
                    </Link>
                    {biz.is_verified && (
                      <span title="Verificado">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">{biz.neighborhood}, {biz.city.split("-")[0]}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{biz.rating}</span>
                      <span className="text-slate-400 font-normal">({biz.reviews_count})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Aberto Agora
                    </span>
                    <Link
                      to={createPageUrl("BusinessDetail", { id: biz.id })}
                      className="font-semibold text-blue-700 hover:text-blue-900 text-xs flex items-center gap-1"
                    >
                      Ver Perfil <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Reviews & Interactive Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Avaliações Recentes de Clientes
            </h3>
            <Link to="/reviews" className="text-xs font-semibold text-blue-700 hover:underline">
              Todas ({recentReviews.length})
            </Link>
          </div>

          <div className="space-y-3">
            {recentReviews.map((rev) => (
              <div key={rev.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{rev.user_name}</span>
                    <span className="text-[10px] text-slate-400">· {rev.created_at}</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="text-[11px] font-medium text-blue-800">
                  Sobre: <span className="font-semibold">{rev.business_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Explorer Callout */}
        <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl border border-slate-700 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-xs font-medium text-orange-300">
              <MapPin className="w-3.5 h-3.5" />
              Geolocalização Ativa
            </div>
            <h3 className="text-xl font-bold text-white">
              Navegue pelo Mapa Interativo
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Filtre estabelecimentos por distância radial (1 km a 25 km), veja rotas recomendadas, horários de pico e conecte-se com fornecedores próximos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>Seu Bairro Atual</span>
              <span className="font-semibold text-orange-400">Pinheiros / Vila Madalena</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>Negócios a Menos de 15 Min</span>
              <span className="font-semibold text-emerald-400">{businesses.length} cadastrados</span>
            </div>
          </div>

          <Link to="/map">
            <Button variant="accent" className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5">
              <Navigation className="w-4 h-4" />
              Abrir Mapa de Proximidade
            </Button>
          </Link>
        </div>
      </div>

      <BusinessModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        onSaved={(newBiz) => {
          setBusinesses([newBiz, ...businesses]);
        }}
      />
    </div>
  );
}
