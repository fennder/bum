/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Businesses from "./pages/Businesses";
import BusinessDetail from "./pages/BusinessDetail";
import MapPage from "./pages/MapPage";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import AdminBusinesses from "./pages/AdminBusinesses";
import BusinessRelationships from "./pages/BusinessRelationships";
import UserManagement from "./pages/UserManagement";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/businesses/:id" element={<BusinessDetail />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/admin/businesses" element={<AdminBusinesses />} />
          <Route path="/admin/relationships" element={<BusinessRelationships />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
