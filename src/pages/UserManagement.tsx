import React, { useState, useEffect } from "react";
import { base44, User } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  Briefcase, 
  User as UserIcon, 
  Check, 
  X 
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("user");
  const [canManageRelationships, setCanManageRelationships] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const list = await base44.users.list();
    setUsers(list);
  };

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    const updated = await base44.users.update(userId, { role: newRole });
    setUsers(users.map((u) => (u.id === userId ? updated : u)));
  };

  const handleToggleRelationships = async (userId: string, current: boolean) => {
    const updated = await base44.users.update(userId, {
      can_manage_relationships: !current,
    });
    setUsers(users.map((u) => (u.id === userId ? updated : u)));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const created = await base44.users.create({
      full_name: name,
      email,
      role,
      can_manage_relationships: canManageRelationships || role === "admin",
    });

    setUsers([...users, created]);
    setIsModalOpen(false);
    setName("");
    setEmail("");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Usuários</h1>
            <Badge variant="warning">Acesso & Permissões</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controle papéis de administradores, donos de negócios e clientes da plataforma
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
            <tr>
              <th className="p-4">Usuário</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Papel / Nível</th>
              <th className="p-4 text-center">Gestão de Parcerias</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                      {u.role === "admin" ? <ShieldCheck className="w-4 h-4 text-orange-600" /> : u.role === "business_owner" ? <Briefcase className="w-4 h-4 text-blue-600" /> : <UserIcon className="w-4 h-4 text-slate-500" />}
                    </div>
                    <span className="font-bold text-slate-900">{u.full_name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                    className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="admin">Administrador</option>
                    <option value="business_owner">Dono de Negócio</option>
                    <option value="user">Cliente / Visitante</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleRelationships(u.id, !!u.can_manage_relationships)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                      u.can_manage_relationships
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {u.can_manage_relationships ? "Permitido" : "Bloqueado"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={() => {
                      base44.auth.login(u.id).then(() => {
                        window.location.reload();
                      });
                    }}
                  >
                    Entrar como Este
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Novo Usuário</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Lima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="beatriz@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Papel</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="user">Cliente / Visitante</option>
                  <option value="business_owner">Dono de Negócio</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="can_rel"
                  checked={canManageRelationships}
                  onChange={(e) => setCanManageRelationships(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded-sm"
                />
                <label htmlFor="can_rel" className="text-slate-700 cursor-pointer">
                  Habilitar gerenciamento de relacionamentos e parcerias
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
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
