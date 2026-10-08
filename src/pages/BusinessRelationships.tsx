import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44, BusinessRelationship, Business } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Building2, 
  Handshake, 
  Share2,
  X 
} from "lucide-react";

export default function BusinessRelationships() {
  const [relationships, setRelationships] = useState<BusinessRelationship[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [type, setType] = useState<BusinessRelationship["relationship_type"]>("Fornecedor");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const rels = await base44.relationships.list();
    setRelationships(rels);
    const bList = await base44.businesses.list();
    setBusinesses(bList);
    if (bList.length >= 2) {
      setSourceId(bList[0].id);
      setTargetId(bList[1].id);
    }
  };

  const handleCreateRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) {
      alert("Selecione dois negócios distintos para estabelecer a parceria.");
      return;
    }

    const sourceBiz = businesses.find((b) => b.id === sourceId);
    const targetBiz = businesses.find((b) => b.id === targetId);

    const created = await base44.relationships.create({
      source_business_id: sourceId,
      source_business_name: sourceBiz ? sourceBiz.name : "Negócio A",
      target_business_id: targetId,
      target_business_name: targetBiz ? targetBiz.name : "Negócio B",
      relationship_type: type,
      description: description || "Parceria comercial e colaboração local mútua.",
    });

    setRelationships([created, ...relationships]);
    setIsModalOpen(false);
    setDescription("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remover este vínculo de relacionamento?")) {
      await base44.relationships.delete(id);
      setRelationships(relationships.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Rede de Relacionamentos B2B</h1>
            <Badge variant="warning">Ecossistema Local</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Conecte fornecedores, parcerias cruzadas e prestadores de serviço entre estabelecimentos
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Conectar Estabelecimentos
        </Button>
      </div>

      {/* Network Overview Card */}
      <div className="bg-linear-to-r from-orange-50 via-amber-50 to-orange-100/50 p-6 rounded-2xl border border-orange-200 space-y-2">
        <h3 className="font-bold text-sm text-orange-950 flex items-center gap-2">
          <Handshake className="w-5 h-5 text-orange-600" />
          Por que mapear relacionamentos no BusinessAroundMe?
        </h3>
        <p className="text-xs text-orange-900/80 leading-relaxed max-w-3xl">
          Negócios locais florescem quando compram uns dos outros. Esta funcionalidade permite identificar redes de suprimento (ex: o café que compra pães da padaria parceira, que por sua vez utiliza serviços de manutenção da oficina vizinha).
        </p>
      </div>

      {/* Relationship List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relationships.map((rel) => (
          <div
            key={rel.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between">
              <Badge variant="warning">{rel.relationship_type}</Badge>
              <span className="text-[10px] text-slate-400">Criado em {rel.created_at}</span>
            </div>

            {/* Nodes connection */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Origem</p>
                <Link
                  to={createPageUrl("BusinessDetail", { id: rel.source_business_id })}
                  className="font-bold text-xs text-slate-900 hover:text-blue-900 truncate block"
                >
                  {rel.source_business_name}
                </Link>
              </div>

              <div className="p-1.5 rounded-full bg-orange-100 text-orange-700 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pl-2 text-right">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Destino</p>
                <Link
                  to={createPageUrl("BusinessDetail", { id: rel.target_business_id })}
                  className="font-bold text-xs text-slate-900 hover:text-blue-900 truncate block"
                >
                  {rel.target_business_name}
                </Link>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{rel.description}"
            </p>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(rel.id)}
                className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Desvincular
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Novo Vínculo entre Estabelecimentos</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRelationship} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primeiro Negócio (Origem)</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Segundo Negócio (Destino)</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Relação</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Parceiro Comercial">Parceiro Comercial</option>
                  <option value="Afiliado">Afiliado</option>
                  <option value="Prestador de Serviço">Prestador de Serviço</option>
                  <option value="Ponto de Retirada">Ponto de Retirada</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição do Vínculo</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Fornece grãos de café orgânico e pães toda terça e quinta-feira..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                  Criar Vínculo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
