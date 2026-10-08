import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44, Service, Business } from "@/api/base44Client";
import { createPageUrl, formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Search, 
  Plus, 
  Clock, 
  Building2, 
  CheckCircle, 
  Calendar,
  X
} from "lucide-react";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBizId, setSelectedBizId] = useState("all");

  // Booking modal
  const [bookingModalService, setBookingModalService] = useState<Service | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("2026-10-12");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // New service modal
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [newServName, setNewServName] = useState("");
  const [newServPrice, setNewServPrice] = useState("");
  const [newServDuration, setNewServDuration] = useState("1 hora");
  const [newServBizId, setNewServBizId] = useState("");
  const [newServDesc, setNewServDesc] = useState("");

  useEffect(() => {
    loadData();
  }, [selectedBizId]);

  const loadData = async () => {
    const bList = await base44.businesses.list();
    setBusinesses(bList);
    if (bList.length > 0 && !newServBizId) {
      setNewServBizId(bList[0].id);
    }
    const sList = await base44.services.list(selectedBizId === "all" ? undefined : selectedBizId);
    setServices(sList);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServName.trim() || !newServBizId) return;

    const targetBiz = businesses.find((b) => b.id === newServBizId);

    const created = await base44.services.create({
      business_id: newServBizId,
      business_name: targetBiz ? targetBiz.name : "Negócio Local",
      name: newServName,
      description: newServDesc,
      price: parseFloat(newServPrice) || 120.0,
      duration: newServDuration,
      category: "Serviços Especializados",
      is_available: true,
    });

    setServices([created, ...services]);
    setIsNewServiceModalOpen(false);
    setNewServName("");
    setNewServPrice("");
    setNewServDesc("");
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalService(null);
    }, 2500);
  };

  const filtered = services.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.business_name.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-900" />
            Serviços & Profissionais Locais
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Contrate serviços técnicos, bem-estar, veterinários e empresariais de confiança
          </p>
        </div>

        <Button onClick={() => setIsNewServiceModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Novo Serviço
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
            placeholder="Buscar por mecânica, salas de reunião, banho e tosa, pilates..."
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

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">Nenhum serviço encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tente buscar com outros termos ou altere o estabelecimento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {srv.category}
                  </span>
                  <span className="font-bold text-base text-slate-900 tabular-nums">
                    {formatCurrency(srv.price)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{srv.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {srv.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duração média: {srv.duration}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <Link
                  to={createPageUrl("BusinessDetail", { id: srv.business_id })}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-blue-900 transition-colors font-medium truncate"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{srv.business_name}</span>
                </Link>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-emerald-700 bg-emerald-50 text-[10px] font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Agenda Aberta
                  </span>

                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setBookingModalService(srv);
                      setClientName("Lucas Silva");
                      setClientPhone("(11) 98765-4321");
                    }}
                    className="text-xs py-1 h-7"
                  >
                    Agendar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Agendar Serviço</h3>
                <p className="text-xs text-slate-500">{bookingModalService.name}</p>
              </div>
              <button
                onClick={() => setBookingModalService(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900">Agendamento Solicitado!</h4>
                <p className="text-xs text-emerald-700">
                  O estabelecimento {bookingModalService.business_name} confirmará o horário pelo WhatsApp informado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Desejada</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Preço estimado:</span>
                    <strong className="text-slate-900">{formatCurrency(bookingModalService.price)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duração:</span>
                    <span className="text-slate-700">{bookingModalService.duration}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setBookingModalService(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm">
                    Confirmar Agendamento
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* New Service Modal */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Novo Serviço</h3>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estabelecimento</label>
                <select
                  value={newServBizId}
                  onChange={(e) => setNewServBizId(e.target.value)}
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
                <label className="block font-semibold text-slate-700 mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Troca de Óleo e Filtros"
                  value={newServName}
                  onChange={(e) => setNewServName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="150.00"
                    value={newServPrice}
                    onChange={(e) => setNewServPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duração Média</label>
                  <input
                    type="text"
                    required
                    placeholder="1 hora"
                    value={newServDuration}
                    onChange={(e) => setNewServDuration(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="O que está incluso no atendimento..."
                  value={newServDesc}
                  onChange={(e) => setNewServDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsNewServiceModalOpen(false)}>
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
