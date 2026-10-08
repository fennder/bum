import React, { useState, useEffect } from "react";
import { base44, User } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, ShieldCheck, Briefcase, User as UserIcon } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChanged: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onUserChanged }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      base44.users.list().then((list) => {
        setUsers(list);
      });
      base44.auth.me().then((u) => {
        if (u) setActiveUserId(u.id);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectUser = async (user: User) => {
    await base44.auth.login(user.id);
    setActiveUserId(user.id);
    onUserChanged(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Alternar ou Entrar na Conta</h3>
            <p className="text-xs text-slate-500 mt-0.5">Selecione um perfil de teste ou visualize como visitante</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {users.map((u) => {
            const isSelected = u.id === activeUserId;
            return (
              <div
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    u.role === "admin" ? "bg-amber-100 text-amber-800" : u.role === "business_owner" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {u.role === "admin" ? <ShieldCheck className="w-5 h-5" /> : u.role === "business_owner" ? <Briefcase className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 text-sm">{u.full_name}</p>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={u.role === "admin" ? "warning" : u.role === "business_owner" ? "default" : "secondary"}>
                        {u.role === "admin" ? "Administrador Geral" : u.role === "business_owner" ? "Dono de Negócio" : "Cliente / Visitante"}
                      </Badge>
                      {u.can_manage_relationships && (
                        <span className="text-[10px] text-slate-500">· Gerencia Parcerias</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await base44.auth.logout();
              onClose();
              window.location.reload();
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
          >
            Navegar Desconectado
          </Button>
          <Button variant="default" size="sm" onClick={onClose}>
            Concluir
          </Button>
        </div>
      </div>
    </div>
  );
};
