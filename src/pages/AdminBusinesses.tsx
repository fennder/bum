import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44, Business } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { BusinessModal } from "@/components/BusinessModal";

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    const list = await base44.businesses.list();
    setBusinesses(list);
  };

  const handleToggleVerified = async (b: Business) => {
    const updated = await base44.businesses.update(b.id, {
      is_verified: !b.is_verified,
    });
    setBusinesses(businesses.map((item) => (item.id === b.id ? updated : item)));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este estabelecimento?")) {
      await base44.businesses.delete(id);
      setBusinesses(businesses.filter((b) => b.id !== id));
    }
  };

  const filtered = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Negócios</h1>
            <Badge variant="warning">Área Administrativa</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Moderação, controle de verificação e catálogo de estabelecimentos comerciais
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingBiz(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Negócio
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome do negócio, categoria ou bairro..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="p-4">Estabelecimento</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Bairro / Cidade</th>
                <th className="p-4 text-center">Verificação</th>
                <th className="p-4 text-center">Avaliação</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {b.image_url ? (
                          <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <Building2 className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <Link
                          to={createPageUrl("BusinessDetail", { id: b.id })}
                          className="font-bold text-slate-900 hover:text-blue-900 line-clamp-1"
                        >
                          {b.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate">{b.phone || b.whatsapp}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-700 font-medium">{b.category}</span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {b.neighborhood}, {b.city.split("-")[0]}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleVerified(b)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                        b.is_verified
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {b.is_verified ? "Verificado" : "Não verificado"}
                    </button>
                  </td>
                  <td className="p-4 text-center font-semibold text-slate-900 tabular-nums">
                    ★ {b.rating} ({b.reviews_count})
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingBiz(b);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessToEdit={editingBiz}
        onSaved={(saved) => {
          if (editingBiz) {
            setBusinesses(businesses.map((item) => (item.id === saved.id ? saved : item)));
          } else {
            setBusinesses([saved, ...businesses]);
          }
        }}
      />
    </div>
  );
}
