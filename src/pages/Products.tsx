import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44, Product, Business, User } from "@/api/base44Client";
import { createPageUrl, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  Plus, 
  Building2, 
  MessageCircle, 
  ArrowRight,
  Filter,
  CheckCircle
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBizId, setSelectedBizId] = useState("all");
  const [user, setUser] = useState<User | null>(null);

  // New product modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdBizId, setNewProdBizId] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Panificação Artesanal");

  useEffect(() => {
    loadData();
  }, [selectedBizId]);

  const loadData = async () => {
    const bList = await base44.businesses.list();
    setBusinesses(bList);
    if (bList.length > 0 && !newProdBizId) {
      setNewProdBizId(bList[0].id);
    }
    const pList = await base44.products.list(selectedBizId === "all" ? undefined : selectedBizId);
    setProducts(pList);
    const currentUser = await base44.auth.me();
    setUser(currentUser);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdBizId) return;

    const targetBiz = businesses.find((b) => b.id === newProdBizId);

    const created = await base44.products.create({
      business_id: newProdBizId,
      business_name: targetBiz ? targetBiz.name : "Negócio Local",
      name: newProdName,
      description: newProdDesc,
      price: parseFloat(newProdPrice) || 29.9,
      category: newProdCategory,
      in_stock: true,
    });

    setProducts([created, ...products]);
    setIsModalOpen(false);
    setNewProdName("");
    setNewProdDesc("");
    setNewProdPrice("");
  };

  const filtered = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.business_name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-900" />
            Produtos do Comércio Local
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compre produtos de produtores, artesãos e lojas do seu bairro
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por pães, cafés, buquês, plantas, acessórios..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedBizId}
            onChange={(e) => setSelectedBizId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="all">Todos os Estabelecimentos</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">Nenhum produto encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tente buscar com outro termo ou selecione outro estabelecimento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prod) => {
            const biz = businesses.find((b) => b.id === prod.business_id);
            return (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {prod.category}
                    </span>
                    <span className="font-bold text-base text-slate-900 tabular-nums">
                      {formatCurrency(prod.price)}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{prod.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <Link
                    to={createPageUrl("BusinessDetail", { id: prod.business_id })}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-900 transition-colors font-medium truncate"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{prod.business_name}</span>
                  </Link>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-emerald-700 bg-emerald-50 text-[10px] font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Disponível
                    </span>

                    {biz && (
                      <a
                        href={`https://wa.me/55${biz.whatsapp.replace(/\D/g, "")}?text=Olá,%20vi%20o%20produto%20${encodeURIComponent(prod.name)}%20no%20BusinessAroundMe%20e%20gostaria%20de%20comprar.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Comprar
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Novo Produto</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estabelecimento</label>
                <select
                  value={newProdBizId}
                  onChange={(e) => setNewProdBizId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Croissant Artesanal"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="25.00"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Categoria do Produto</label>
                <input
                  type="text"
                  placeholder="Ex: Panificação, Café em Grão..."
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes sobre ingredientes, tamanho..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
