/**
 * Utility functions for BusinessAroundMe
 */

export function createPageUrl(pageName: string, params?: Record<string, any>): string {
  switch (pageName) {
    case "Dashboard":
      return "/";
    case "Businesses":
      return "/businesses";
    case "BusinessDetail":
      return `/businesses/${params?.id || ""}`;
    case "Map":
      return "/map";
    case "Products":
      return "/products";
    case "Services":
      return "/services";
    case "Reviews":
      return "/reviews";
    case "AdminBusinesses":
      return "/admin/businesses";
    case "BusinessRelationships":
      return "/admin/relationships";
    case "UserManagement":
      return "/admin/users";
    default:
      return "/";
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
