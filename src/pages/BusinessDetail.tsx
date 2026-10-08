import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  base44, 
  Business, 
  Product, 
  Service, 
  Review, 
  BusinessRelationship, 
  User 
} from "@/api/base44Client";
import { createPageUrl, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle, 
  Globe, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  Plus, 
  Share2, 
  Check, 
  Send,
  Link as LinkIcon
} from "lucide-react";

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relationships, setRelationships] = useState<BusinessRelationship[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "services" | "reviews" | "relationships">("overview");

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Product modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");

  // Service booking notification state
  const [bookedService, setBookedService] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBusinessData(id);
    }
  }, [id]);

  const loadBusinessData = async (bizId: string) => {
    const biz = await base44.businesses.get(bizId);
    setBusiness(biz);
    if (biz) {
      const prodList = await base44.products.list(biz.id);
      setProducts(prodList);
      const servList = await base44.services.list(biz.id);
      setServices(servList);
      const revList = await base44.reviews.list(biz.id);
      setReviews(revList);
      const allRels = await base44.relationships.list();
      setRelationships(
        allRels.filter((r) => r.source_business_id === biz.id || r.target_business_id === biz.id)
      );
    }
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    if (currentUser) {
      setReviewerName(currentUser.full_name);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !newComment.trim()) return;

    await base44.reviews.create({
      business_id: business.id,
      business_name: business.name,
      user_name: reviewerName || "Cliente Verificado",
      rating: newRating,
      comment: newComment,
    });

    setNewComment("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);

    // Refresh reviews and business stats
    loadBusinessData(business.id);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !newProdName.trim()) return;

    await base44.products.create({
      business_id: business.id,
      business_name: business.name,
      name: newProdName,
      description: newProdDesc,
      price: parseFloat(newProdPrice) || 25.0,
      category: "Geral",
      in_stock: true,
    });

    setNewProdName("");
    setNewProdPrice("");
    setNewProdDesc("");
    setIsAddProductOpen(false);
    loadBusinessData(business.id);
  };

  if (!business) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500">Carregando detalhes do negócio...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/businesses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Negócios
        </Link>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="relative h-64 md:h-80 w-full bg-slate-900">
          {business.image_url ? (
            <img
              src={business.image_url}
              alt={business.name}
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800">
              <Building2 className="w-20 h-20 text-slate-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  {business.category}
                </span>
                {business.is_verified && (
                  <span className="bg-emerald-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verificado
                  </span>
                )}
                <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  {business.price_level}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">{business.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  {business.address}, {business.neighborhood} - {business.city}
                </span>
                <span className="flex items-center gap-1 font-semibold text-white">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {business.rating} ({business.reviews_count} avaliações)
                </span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex items-center gap-2">
              {business.whatsapp && (
                <a
                  href={`https://wa.me/55${business.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="accent" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              )}
              {business.phone && (
                <a href={`tel:${business.phone}`}>
                  <Button variant="default" size="sm" className="gap-1.5">
                    <Phone className="w-4 h-4" />
                    Ligar
                  </Button>
                </a>
              )}
              <Link to="/map">
                <Button variant="outline" size="sm" className="bg-white/90 text-slate-900 border-none gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  Ver no Mapa
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Strip */}
        <div className="p-6 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-800 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Horário</p>
              <p>{business.hours}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-800 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Contato Direto</p>
              <p>{business.phone} / {business.whatsapp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-800 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Website Oficial</p>
              <a href={business.website} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline truncate block">
                {business.website.replace("https://", "")}
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-6 flex items-center gap-4 text-sm font-semibold overflow-x-auto">
          {[
            { id: "overview", label: "Visão Geral" },
            { id: "products", label: `Produtos (${products.length})` },
            { id: "services", label: `Serviços (${services.length})` },
            { id: "reviews", label: `Avaliações (${reviews.length})` },
            { id: "relationships", label: `Parcerias B2B (${relationships.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 border-b-2 font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-900 text-blue-900 font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900">Sobre o Estabelecimento</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{business.description}</p>
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Especialidades & Tags</p>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlights products/services preview */}
            {products.length > 0 && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">Produtos em Destaque</h3>
                  <button onClick={() => setActiveTab("products")} className="text-xs text-blue-700 font-semibold hover:underline">
                    Ver todos ({products.length})
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.slice(0, 2).map((p) => (
                    <div key={p.id} className="p-3 border border-slate-200 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900">{p.name}</span>
                        <span className="text-xs font-bold text-blue-900">{formatCurrency(p.price)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Quick Contact & Map Box */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Localização & Acesso</h3>
              <p className="text-xs text-slate-600">{business.address}</p>
              <p className="text-xs text-slate-500">{business.neighborhood}, {business.city}</p>
              
              <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900 space-y-1">
                <p className="font-semibold">Transporte & Estacionamento</p>
                <p className="text-slate-600">A 400m de estações de metrô e ciclovias na região de Pinheiros.</p>
              </div>

              <Link to="/map">
                <Button variant="default" className="w-full text-xs">
                  Traçar Rota no Mapa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Catálogo de Produtos</h2>
              <p className="text-xs text-slate-500">Itens disponíveis para pronta entrega ou encomenda</p>
            </div>
            <Button size="sm" onClick={() => setIsAddProductOpen(true)} className="text-xs gap-1">
              <Plus className="w-3.5 h-3.5" /> Adicionar Produto
            </Button>
          </div>

          {products.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between hover:shadow-xs transition-shadow">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900">{prod.name}</span>
                      <span className="font-bold text-sm text-blue-900 tabular-nums">{formatCurrency(prod.price)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{prod.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      Em estoque
                    </span>
                    <a
                      href={`https://wa.me/55${business.whatsapp.replace(/\D/g, "")}?text=Olá,%20tenho%20interesse%20no%20produto:%20${encodeURIComponent(prod.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 font-semibold hover:underline"
                    >
                      Pedir pelo WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAddProductOpen && (
            <form onSubmit={handleAddProduct} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Novo Produto</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nome do produto"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Preço (R$)"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
              </div>
              <input
                type="text"
                placeholder="Descrição rápida"
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddProductOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  Salvar
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === "services" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Serviços Oferecidos</h2>
              <p className="text-xs text-slate-500">Agende diretamente com o estabelecimento</p>
            </div>
          </div>

          {bookedService && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
              <span>Pedido de agendamento enviado com sucesso para: <strong>{bookedService}</strong>! O estabelecimento entrará em contato.</span>
              <button onClick={() => setBookedService(null)} className="font-bold underline ml-2">Fechar</button>
            </div>
          )}

          {services.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Nenhum serviço listado no momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between hover:shadow-xs transition-shadow">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900">{srv.name}</span>
                      <span className="font-bold text-sm text-blue-900 tabular-nums">{formatCurrency(srv.price)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{srv.description}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Duração média: {srv.duration}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <Button
                      size="sm"
                      variant="default"
                      className="text-xs"
                      onClick={() => setBookedService(srv.name)}
                    >
                      Solicitar Agendamento
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* New Review Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Avaliar {business.name}</h3>
            {reviewSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Obrigado! Sua avaliação foi publicada com sucesso.</span>
              </div>
            )}
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Seu nome ou apelido"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nota (Estrelas)
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= newRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-2">{newRating} / 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Sua Experiência
                </label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Conte como foi o atendimento, a qualidade dos produtos ou a estrutura do local..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="default" size="sm" className="gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Publicar Avaliação
                </Button>
              </div>
            </form>
          </div>

          {/* Reviews List */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Todas as Avaliações ({reviews.length})</h3>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{r.user_name}</p>
                      <p className="text-[11px] text-slate-400">{r.created_at}</p>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "relationships" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Rede de Parcerias e Relacionamentos Locais</h2>
            <p className="text-xs text-slate-500">
              Negócios parceiros, fornecedores e pontos de apoio interligados com {business.name}
            </p>
          </div>

          {relationships.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Nenhum relacionamento B2B registrado no momento.</p>
          ) : (
            <div className="space-y-3">
              {relationships.map((rel) => {
                const otherName =
                  rel.source_business_id === business.id
                    ? rel.target_business_name
                    : rel.source_business_name;
                return (
                  <div key={rel.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{otherName}</span>
                        <Badge variant="warning">{rel.relationship_type}</Badge>
                        <span className="text-[10px] text-slate-400">· Desde {rel.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rel.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
