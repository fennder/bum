import React, { createContext, useContext, useState } from "react";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger({
  className = "",
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      className={`p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Sidebar({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0"
        } ${className}`}
        {...props}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SidebarContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroup({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`py-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function SidebarMenu({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`list-none space-y-1 p-0 m-0 ${className}`} {...props}>
      {children}
    </ul>
  );
}

export function SidebarMenuItem({
  className = "",
  children,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return (
    <li className={`list-none m-0 p-0 ${className}`} {...props}>
      {children}
    </li>
  );
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export function SidebarMenuButton({
  className = "",
  children,
  asChild,
  ...props
}: SidebarMenuButtonProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: `${(children as any).props.className || ""} ${className}`,
      ...props,
    });
  }

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 mt-auto ${className}`} {...props}>
      {children}
    </div>
  );
}
