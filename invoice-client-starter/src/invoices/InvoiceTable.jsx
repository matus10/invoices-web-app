import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { formatCurrency } from "../utils/currencyFormatter.js";

const InvoiceTable = ({  label,  items , deleteInvoice = () => {},
}) => {
  return (
    <div>
      <p>
        {label} {items.length}
      </p>
      <div className="table-responsive-lg">
        <table className="table table-bordered text-center align-middle mb-3 table-mobile-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Číslo faktury</th>
              <th>Prodávající</th>
              <th>Kupující</th>
              <th>Cena bez DPH</th>
              <th>Cena s DPH</th>
              <th colSpan={3}>Akce</th>
            </tr>
          </thead>
          <tbody>
            {items.map((invoice, index) => (
              <tr key={invoice._id ?? index}>
                <td>{index + 1}</td>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.seller?.name}</td>
                <td>{invoice.buyer?.name}</td>
                <td>{formatCurrency(invoice.price)}</td>
                <td>{formatCurrency(invoice.price*(Number(invoice.vat) / 100 + 1))}</td>
                <td>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <Link
                      to={"/invoices/show/" + invoice._id}
                      className="btn btn-sm btn-info"
                    >
                      Zobrazit
                    </Link>
                    <Link
                      to={"/invoices/edit/" + invoice._id}
                      className="btn btn-sm btn-warning"
                    >
                      Upravit
                    </Link>
                    <button
                      onClick={() => deleteInvoice(invoice._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Odstranit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row">
        <div className="col-12 col-md-auto">
          <Link to={"/invoices/create"} className="btn btn-success w-100">
            Nová faktura
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;