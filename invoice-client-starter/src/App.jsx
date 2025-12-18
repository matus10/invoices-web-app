import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import PersonIndex from "./persons/PersonIndex";
import PersonDetail from "./persons/PersonDetail";
import PersonForm from "./persons/PersonForm";

import InvoiceDetail from "./invoices/InvoiceDetail";
import InvoiceIndex from "./invoices/InvoiceIndex";
import InvoiceForm from "./invoices/InvoiceForm";

import InvoiceStatistics from "./statistics/InvoiceStatistics";
import PersonStatistics from "./statistics/PersonStatistics";

const AppNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <NavLink to="/persons" className="navbar-brand fw-bold fs-3">
          Fakturační systém
        </NavLink>

        {/* Hamburger / toggler */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainNavbar"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="mainNavbar"
        >
          <ul className="navbar-nav ms-auto fs-5">
            <li className="nav-item">
              <NavLink
                to="/persons"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active fw-bold" : "")
                }
                onClick={closeMenu}
              >
                Osoby
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/invoices"
                end
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active fw-bold" : "")
                }
                onClick={closeMenu}
              >
                Faktury
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/invoices/statistics"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active fw-bold" : "")
                }
                onClick={closeMenu}
              >
                Statistiky
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export function App() {
  return (
    <Router>
      <AppNavbar />

      <div className="container">
        <Routes>
          {/* Uvodní stránka */}
          <Route path="/" element={<Navigate to="/persons" replace />} />

          {/* Osoby */}
          <Route path="/persons" element={<PersonIndex />} />
          <Route path="/persons/show/:id" element={<PersonDetail />} />
          <Route path="/persons/create" element={<PersonForm />} />
          <Route path="/persons/edit/:id" element={<PersonForm />} />
          <Route path="/persons/statistics" element={<PersonStatistics />} />

          {/* Faktury */}
          <Route path="/invoices" element={<InvoiceIndex />} />
          <Route path="/invoices/show/:id" element={<InvoiceDetail />} />
          <Route path="/invoices/create" element={<InvoiceForm />} />
          <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
          <Route path="/invoices/statistics" element={<InvoiceStatistics />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
