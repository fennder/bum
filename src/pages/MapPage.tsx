import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44, Business } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Search, 
  Star, 
  ShieldCheck, 
  Compass, 
  Car, 
  Bike, 
  Footprints, 
  X,
  Phone,
  MessageCircle,
  ArrowRight
} from "lucide-react";

export default function MapPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [simulatedRoute, setSimulatedRoute] = useState<{
    walkingMin: number;
    bikingMin: number;
    drivingMin: number;
  } | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, [selectedCategory]);

  const loadBusinesses = async () => {
    const list = await base44.businesses.list({
      category: selectedCategory === "all" ? undefined : selectedCategory,
    });
    setBusinesses(list);
    if (list.length > 0 && !selectedBiz) {
      setSelectedBiz(list[0]);
    }
  };

  const handleSelectBusiness = (b: Business) => {
    setSelectedBiz(b);
    // Calculate simulated route
    const dist = (Math.random() * 2.5 + 0.5).toFixed(1);
    const numDist = parseFloat(dist);
    setSimulatedRoute({
      walkingMin: Math.round(numDist * 12),
      bikingMin: Math.round(numDist * 4),
      drivingMin: Math.round(numDist * 3 + 2),
    });
  };

  // Convert lat/lng to svg coordinates relative to center
  const centerLat = -23.562;
  const centerLng = -46.680;

  const getSvgCoords = (coords: { lat: number; lng: number }) => {
    // scale factor
    const x = 400 + (coords.lng - centerLng) * 12000;
    const y = 300 - (coords.lat - centerLat) * 12000;
    return { x: Math.max(50, Math.min(750, x)), y: Math.max(50, Math.min(550, y)) };
  };

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row overflow-hidden bg-slate-100">
      {/* Sidebar with List and Filters */}
      <div className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col z-10 shrink-0 shadow-sm">
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-900" />
              Explorador de Mapa
            </h2>
            <Badge variant="default">GPS Ativo</Badge>
          </div>

          {/* Radius selector */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Raio de Busca</span>
              <span className="font-bold text-blue-900">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value))}
              className="w-full accent-blue-900 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {["all", "Alimentação & Café", "Tecnologia & Escritórios", "Flores & Decoração", "Serviços Automotivos"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "Todos" : cat.split("&")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Business list in range */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {businesses.map((b) => {
            const isSelected = selectedBiz?.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => handleSelectBusiness(b)}
                className={`p-4 transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? "bg-blue-50/70 border-l-4 border-blue-900"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-blue-900 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-xs text-slate-900 truncate">{b.name}</p>
                    <span className="text-[10px] text-slate-500 font-semibold shrink-0">{b.price_level}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{b.address}, {b.neighborhood}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-600 font-medium">{b.category}</span>
                    <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" /> {b.rating}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 relative bg-slate-200 overflow-hidden flex items-center justify-center">
        {/* SVG stylized map representation */}
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover select-none"
          style={{ background: "#e2e8f0" }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Simulated River / Pinheiros */}
          <path
            d="M 120 0 Q 180 200, 150 400 T 210 600"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <text x="140" y="320" fill="#2563eb" fontSize="12" fontWeight="600" transform="rotate(75 140 320)">
            Rio Pinheiros
          </text>

          {/* Main Avenues */}
          {/* Faria Lima */}
          <path d="M 100 500 L 700 150" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
          <path d="M 100 500 L 700 150" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
          <text x="360" y="340" fill="#64748b" fontSize="11" fontWeight="bold" transform="rotate(-30 360 340)">
            Av. Brg. Faria Lima
          </text>

          {/* Paulista */}
          <path d="M 500 50 L 780 250" stroke="#ffffff" strokeWidth="16" strokeLinecap="round" />
          <text x="610" y="140" fill="#64748b" fontSize="11" fontWeight="bold" transform="rotate(35 610 140)">
            Av. Paulista
          </text>

          {/* Rebouças */}
          <path d="M 280 580 L 620 80" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <text x="440" y="340" fill="#64748b" fontSize="11" fontWeight="bold" transform="rotate(-55 440 340)">
            Av. Rebouças
          </text>

          {/* User Location Radar */}
          <circle cx="400" cy="300" r={radiusKm * 18} fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="400" cy="300" r="10" fill="#2563eb" fillOpacity="0.3" />
          <circle cx="400" cy="300" r="5" fill="#1d4ed8" />
          <text x="412" y="304" fill="#1e3a8a" fontSize="10" fontWeight="bold">
            Você está aqui
          </text>

          {/* Interactive Business Markers */}
          {businesses.map((biz) => {
            const { x, y } = getSvgCoords(biz.coordinates);
            const isSelected = selectedBiz?.id === biz.id;

            return (
              <g
                key={biz.id}
                onClick={() => handleSelectBusiness(biz)}
                className="cursor-pointer transition-transform duration-200"
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                {isSelected && (
                  <circle cx={x} cy={y} r="22" fill="#ea580c" fillOpacity="0.25" className="animate-ping" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 16 : 12}
                  fill={isSelected ? "#ea580c" : "#1e3a8a"}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="shadow-lg"
                />
                <text
                  x={x}
                  y={y + 4}
                  fill="#ffffff"
                  fontSize={isSelected ? "11" : "9"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ★
                </text>
                {isSelected && (
                  <g>
                    <rect
                      x={x - 60}
                      y={y - 42}
                      width="120"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      fillOpacity="0.95"
                    />
                    <text
                      x={x}
                      y={y - 26}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {biz.name.slice(0, 16)}...
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Business Floating Card */}
        {selectedBiz && (
          <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-sm">
                    {selectedBiz.category}
                  </span>
                  {selectedBiz.is_verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-1">{selectedBiz.name}</h3>
                <p className="text-xs text-slate-500">{selectedBiz.address}, {selectedBiz.neighborhood}</p>
              </div>
              <button
                onClick={() => setSelectedBiz(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Travel Time Route Estimator */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Tempo Estimado até o Local</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Footprints className="w-4 h-4 mx-auto text-slate-600 mb-1" />
                  <span className="font-bold text-slate-900">{simulatedRoute?.walkingMin || 14} min</span>
                  <span className="block text-[10px] text-slate-400">A pé</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Bike className="w-4 h-4 mx-auto text-slate-600 mb-1" />
                  <span className="font-bold text-slate-900">{simulatedRoute?.bikingMin || 5} min</span>
                  <span className="block text-[10px] text-slate-400">Bike</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Car className="w-4 h-4 mx-auto text-slate-600 mb-1" />
                  <span className="font-bold text-slate-900">{simulatedRoute?.drivingMin || 4} min</span>
                  <span className="block text-[10px] text-slate-400">Carro</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {selectedBiz.whatsapp && (
                <a
                  href={`https://wa.me/55${selectedBiz.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {selectedBiz.phone && (
                <a
                  href={`tel:${selectedBiz.phone}`}
                  className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                  title="Telefone"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              <Link to={createPageUrl("BusinessDetail", { id: selectedBiz.id })} className="flex-1">
                <Button variant="default" className="w-full text-xs gap-1.5">
                  Ver Perfil Completo <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
