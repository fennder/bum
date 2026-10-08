import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44, Business, User } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Star, 
  Search, 
  ShieldCheck, 
  Plus, 
  Phone, 
  MessageCircle, 
  Globe, 
  LayoutGrid, 
  List, 
  ArrowRight
} from "lucide-react";
import { BusinessModal } from "@/components/BusinessModal";

export default function Businesses() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, onlyVerified]);

  const loadData = async () => {
    const list = await base44.businesses.list({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      verifiedOnly: onlyVerified,
    });
    setBusinesses(list);
    const currentUser = await base44.auth.me();
    setUser(currentUser);
  };

  const filteredBusinesses = businesses.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(term) ||
      b.description.toLowerCase().includes(term) ||
      b.neighborhood.toLowerCase().includes(term) ||
      b.category.toLowerCase().includes(term) ||
      b.tags.some((t) => t.toLowerCase().includes(term))
    );
  });

  const categories = [
    "all",
    "Alimentação & Café",
    "Tecnologia & Escritórios",
    "Flores & Decoração",
    "Serviços Automotivos",
    "Saúde & Pets",
    "Saúde & Bem-estar",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catálogo de Negócios Locais</h1>
          <p className="text-xs text-slate-500 mt-1">
            Encontre serviços, lojas e parceiros comerciais de confiança ao seu redor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Negócio</span>
          </Button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, tag, especialidade ou bairro..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm border-slate-300"
            />
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Apenas Verificados</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "Todas as Categorias" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Business Cards / List */}
      {filteredBusinesses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">Nenhum negócio encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tente ajustar os filtros de categoria ou busque por outros termos.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); setOnlyVerified(false); }}>
            Limpar Filtros
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
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
                    <Building2 className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
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
                      <span title="Negócio Verificado">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {biz.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {biz.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1">
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
                    <div className="flex items-center gap-2">
                      {biz.whatsapp && (
                        <a
                          href={`https://wa.me/55${biz.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Falar no WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {biz.phone && (
                        <a
                          href={`tel:${biz.phone}`}
                          className="p-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          title="Ligar"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {biz.website && (
                        <a
                          href={biz.website}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          title="Visitar Site"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <Link
                      to={createPageUrl("BusinessDetail", { id: biz.id })}
                      className="font-semibold text-blue-700 hover:text-blue-900 text-xs flex items-center gap-1"
                    >
                      Detalhes <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  {biz.image_url ? (
                    <img src={biz.image_url} alt={biz.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={createPageUrl("BusinessDetail", { id: biz.id })}
                      className="font-bold text-sm text-slate-900 hover:text-blue-800"
                    >
                      {biz.name}
                    </Link>
                    {biz.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <Badge variant="secondary" className="text-[10px]">{biz.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{biz.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      {biz.address}, {biz.neighborhood}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-900">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {biz.rating} ({biz.reviews_count})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-2 md:pt-0">
                <Link to={createPageUrl("BusinessDetail", { id: biz.id })}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Ver Página Completa
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(newBiz) => {
          setBusinesses([newBiz, ...businesses]);
        }}
      />
    </div>
  );
}
