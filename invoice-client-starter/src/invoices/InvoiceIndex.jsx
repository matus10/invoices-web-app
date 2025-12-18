import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "../utils/api";
import InvoiceTable from "./InvoiceTable";

const InvoiceIndex = () => {
  const [invoices, setInvoices] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    sellerID: "",
    buyerID: "",
    product: "",
    minPrice: "",
    maxPrice: "",
    limit: "",
  })

  const loadInvoices = (currentFilters) => {
    const filtered = {};

  Object.entries(currentFilters).forEach(([key, value]) => {
    if (value !== "" && value != null) {
      filtered[key] = value;
    }
  });

  apiGet("/api/invoices", filtered)
    .then((data) => setInvoices(data))
    .catch((err) => {
      console.error(err);
      alert("Nepodařilo se načíst faktury.");
    });
};

  useEffect(() => {
    loadInvoices(filters);
  }, [filters.search]);

  const deleteInvoice = async (id) => {
    try {
      await apiDelete("/api/invoices/" + id);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    
    setInvoices(invoices.filter((item) => item._id !== id));
  };


  return (
    <div className="container">
      <h1>Seznam faktur</h1>

      <form
        className="row g-3 mb-4 align-items-end"
        onSubmit={(e) => {
          e.preventDefault();
          loadInvoices(filters);
        }}
      >
        <div className="col-md-6 col-sm-12">
          <input
            type="text"
            className="form-control"
            placeholder="Vyhledat ..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </div>

        <div className="col-md-3 col-sm-10">
          <label className="form-label mb-1">Cena</label>

          <div className="d-flex gap-2">
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Min"
            value={filters.minPrice}  
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
          />

          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          />
          </div>
        </div>

        <div className="col-2 col-md-1 col-sm-2">
          <label className="form-label mb-1">Limit</label>
          <input
              type="text"
              className="form-control"
              placeholder="Limit"
              value={filters.limit}
              onChange={(e) =>
                  setFilters({ ...filters, limit: e.target.value })
              }
          />
        </div>

        <div className="col-12 col-md-auto">
          <button type="submit" className="btn btn-primary w-100">
            Filtrovat
          </button>
        </div>

        <div className="col-12 col-md-auto">
          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={() => {
              const empty = {
                search: "",
                sellerID: "",
                buyerID: "",
                product: "",
                minPrice: "",
                maxPrice: "",
                limit: "",
              };
              setFilters(empty);
              loadInvoices(empty);
            }}
          >
            Zrušit filtr
          </button>
        </div>
      </form>

      <InvoiceTable
        deleteInvoice={deleteInvoice}
        items={invoices}
        label="Počet faktur:"
      />
    </div>
  );
};

export default InvoiceIndex;
