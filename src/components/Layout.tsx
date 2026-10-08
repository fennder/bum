import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44, onOpenLoginModal, User } from "@/api/base44Client";
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  Briefcase, 
  Star, 
  MapPin,
  Menu,
  LogOut,
  User as UserIcon,
  Users,
  ShieldCheck,
  Link as LinkIcon,
  ArrowRightLeft
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Negócios",
    url: createPageUrl("Businesses"),
    icon: Building2,
  },
  {
    title: "Mapa",
    url: createPageUrl("Map"),
    icon: MapPin,
  },
  {
    title: "Produtos",
    url: createPageUrl("Products"),
    icon: Package,
  },
  {
    title: "Serviços",
    url: createPageUrl("Services"),
    icon: Briefcase,
  },
  {
    title: "Avaliações",
    url: createPageUrl("Reviews"),
    icon: Star,
  },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadUser();
    onOpenLoginModal(() => {
      setIsAuthModalOpen(true);
    });
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch {
      console.log("Usuário não autenticado");
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    setUser(null);
  };

  const canManageRelationships = user?.role === 'admin' || user?.can_manage_relationships;

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: #1e3a8a;
          --primary-hover: #1e40af;
          --accent: #f97316;
          --accent-hover: #ea580c;
          --background: #f8fafc;
          --card: #ffffff;
          --border: #e2e8f0;
        }
        
        .gradient-primary {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        }
        
        .gradient-accent {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-[--background]">
        <Sidebar className="border-r border-[--border] bg-white">
          <SidebarHeader className="border-b border-[--border] p-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900 group-hover:text-blue-900 transition-colors">BusinessAroundMe</h2>
                <p className="text-xs text-gray-500">Negócios ao seu redor</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Menu Principal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`transition-all duration-200 rounded-lg mb-1 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-[--primary] font-semibold shadow-sm' 
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-[--primary]' : 'text-gray-500'}`} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user?.role === 'admin' && (
              <SidebarGroup className="mt-4">
                <SidebarGroupLabel className="text-xs font-semibold text-orange-600 uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                  <Badge className="bg-[--accent] text-white">Admin</Badge>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        className={`transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === createPageUrl("AdminBusinesses")
                            ? "bg-orange-50 text-orange-800 font-semibold"
                            : "hover:bg-orange-50 text-gray-700"
                        }`}
                      >
                        <Link to={createPageUrl("AdminBusinesses")} className="flex items-center gap-3 px-3 py-2.5">
                          <ShieldCheck className="w-5 h-5 text-orange-600" />
                          <span>Gerenciar Negócios</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {canManageRelationships && (
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className={`transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === createPageUrl("BusinessRelationships")
                              ? "bg-orange-50 text-orange-800 font-semibold"
                              : "hover:bg-orange-50 text-gray-700"
                          }`}
                        >
                          <Link to={createPageUrl("BusinessRelationships")} className="flex items-center gap-3 px-3 py-2.5">
                            <LinkIcon className="w-5 h-5 text-orange-600" />
                            <span>Relacionamentos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        className={`transition-all duration-200 rounded-lg mb-1 ${
                          location.pathname === createPageUrl("UserManagement")
                            ? "bg-orange-50 text-orange-800 font-semibold"
                            : "hover:bg-orange-50 text-gray-700"
                        }`}
                      >
                        <Link to={createPageUrl("UserManagement")} className="flex items-center gap-3 px-3 py-2.5">
                          <Users className="w-5 h-5 text-orange-600" />
                          <span>Gerenciar Usuários</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-[--border] p-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {user.profile_photo_url ? (
                    <img 
                      src={user.profile_photo_url} 
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 gradient-accent rounded-full flex items-center justify-center shrink-0">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-700 hover:bg-slate-100 py-1 h-8"
                    title="Alternar entre Admin, Lojista ou Visitante"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                    Alternar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-xs py-1 h-8 px-2.5"
                    title="Desconectar"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
              >
                Entrar
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-white border-b border-[--border] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 md:hidden">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div>
                <h1 className="text-lg font-bold text-gray-900">BusinessAroundMe</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Plataforma de Descoberta & Conexão de Negócios Locais</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
                  <span className="text-slate-500">Conectado como:</span>
                  <span className="font-semibold text-slate-900">{user.full_name.split(" ")[0]}</span>
                  <Badge variant={user.role === "admin" ? "warning" : "secondary"}>
                    {user.role === "admin" ? "Admin" : user.role === "business_owner" ? "Lojista" : "Cliente"}
                  </Badge>
                </div>
              ) : (
                <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  Entrar / Perfil de Teste
                </Button>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-slate-50">
            {children}
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserChanged={(updatedUser) => setUser(updatedUser)}
      />
    </SidebarProvider>
  );
}
