import React, { useState, useEffect } from "react";
import { Business, base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { X, Building2, MapPin, Phone, Globe, Tag } from "lucide-react";

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (business: Business) => void;
  businessToEdit?: Business | null;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  businessToEdit,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Alimentação & Café");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("Pinheiros");
  const [city, setCity] = useState("São Paulo - SP");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [priceLevel, setPriceLevel] = useState<"$" | "$$" | "$$$">("$$");
  const [hours, setHours] = useState("Segunda a Sábado: 09:00 - 19:00");
  const [tagsInput, setTagsInput] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    if (businessToEdit) {
      setName(businessToEdit.name);
      setCategory(businessToEdit.category);
      setDescription(businessToEdit.description);
      setAddress(businessToEdit.address);
      setNeighborhood(businessToEdit.neighborhood);
      setCity(businessToEdit.city);
      setPhone(businessToEdit.phone);
      setWhatsapp(businessToEdit.whatsapp);
      setWebsite(businessToEdit.website);
      setPriceLevel(businessToEdit.price_level);
      setHours(businessToEdit.hours);
      setTagsInput(businessToEdit.tags.join(", "));
      setIsVerified(businessToEdit.is_verified);
    } else {
      setName("");
      setCategory("Alimentação & Café");
      setDescription("");
      setAddress("");
      setNeighborhood("Pinheiros");
      setCity("São Paulo - SP");
      setPhone("(11) 3210-9988");
      setWhatsapp("(11) 98765-4321");
      setWebsite("https://meunegocio.com.br");
      setPriceLevel("$$");
      setHours("Segunda a Sábado: 09:00 - 19:00");
      setTagsInput("Local, Atendimento Rápido, Wi-Fi");
      setIsVerified(true);
    }
  }, [businessToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (businessToEdit) {
      const updated = await base44.businesses.update(businessToEdit.id, {
        name,
        category,
        description,
        address,
        neighborhood,
        city,
        phone,
        whatsapp,
        website,
        price_level: priceLevel,
        hours,
        tags,
        is_verified: isVerified,
      });
      onSaved(updated);
    } else {
      const user = await base44.auth.me();
      const created = await base44.businesses.create({
        name,
        category,
        description,
        address,
        neighborhood,
        city,
        phone,
        whatsapp,
        website,
        price_level: priceLevel,
        is_verified: isVerified,
        is_open: true,
        hours,
        image_url: "",
        coordinates: { lat: -23.5615 + (Math.random() - 0.5) * 0.02, lng: -46.682 + (Math.random() - 0.5) * 0.02 },
        owner_id: user?.id || "usr_admin",
        status: "active",
        tags,
      });
      onSaved(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {businessToEdit ? "Editar Negócio" : "Cadastrar Novo Negócio"}
              </h3>
              <p className="text-xs text-slate-500">
                Preencha as informações para listar no BusinessAroundMe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nome do Negócio *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Padaria Bella Vista"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              >
                <option value="Alimentação & Café">Alimentação & Café</option>
                <option value="Tecnologia & Escritórios">Tecnologia & Escritórios</option>
                <option value="Flores & Decoração">Flores & Decoração</option>
                <option value="Serviços Automotivos">Serviços Automotivos</option>
                <option value="Saúde & Pets">Saúde & Pets</option>
                <option value="Saúde & Bem-estar">Saúde & Bem-estar</option>
                <option value="Varejo & Moda">Varejo & Moda</option>
                <option value="Educação & Cursos">Educação & Cursos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descrição do Estabelecimento
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a história, especialidades e diferenciais do local..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                <MapPin className="inline w-3.5 h-3.5 mr-1" /> Endereço Completo
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Rua Oscar Freire, 1120"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bairro
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Pinheiros"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                <Phone className="inline w-3.5 h-3.5 mr-1" /> Telefone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 3333-4444"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-8888"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                <Globe className="inline w-3.5 h-3.5 mr-1" /> Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Horário de Funcionamento
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Ex: Seg a Sex: 08h - 18h"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Faixa de Preço
              </label>
              <div className="flex gap-2">
                {(["$", "$$", "$$$"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriceLevel(lvl)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                      priceLevel === lvl
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              <Tag className="inline w-3.5 h-3.5 mr-1" /> Tags / Palavras-chave (separadas por vírgula)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Café, Wi-Fi, Pet Friendly, Estacionamento"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_verified"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="is_verified" className="text-sm text-slate-700 cursor-pointer select-none">
              Selo de Negócio Verificado pela Plataforma
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="default">
              {businessToEdit ? "Salvar Alterações" : "Cadastrar Negócio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
