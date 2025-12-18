import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {apiGet, apiPost, apiPut} from "../utils/api";

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet(`/api/invoices/${id}`)
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Nepodařilo se načíst fakturu.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Načítám fakturu…</p>;
  if (error) return <p>{error}</p>;
  if (!invoice) return <p>Faktura nenalezena.</p>;

  const { seller, buyer } = invoice;

  return (
    <div>
      <div className="mb-4">
          <Link to="/invoices" className="btn btn-secondary">
              ← Zpět na seznam faktur</Link>
      </div>
      <p></p>
      <h1>Faktura {invoice.invoiceNumber}</h1>

      <p>
        <strong>Produkt:</strong> {invoice.product}
      </p>
      <p> 
        <strong>Vystaveno:</strong> {invoice.issued}
      </p>
      <p>
        <strong>Splatnost:</strong> {invoice.dueDate}
      </p>
      <p>
        <strong>Cena:</strong> {invoice.price} (+ {invoice.vat} % DPH)
      </p>
      <p>
        <strong>Poznámka:</strong> {invoice.note || "—"}
      </p>

      <hr />

      <h2>Prodávající</h2>
      {seller && (
        <div>
          <p>{seller.name}</p>
          <p>{seller.street}</p>
          <p>
            {seller.zip} {seller.city}
          </p>
          <p>IČO: {seller.identificationNumber}</p>
          <p>DIČ: {seller.taxNumber}</p>
          <p>E-mail: {seller.mail}</p>
          <p>Telefon: {seller.telephone}</p>
        </div>
      )}

      <h2>Kupující</h2>
      {buyer && (
        <div>
          <p>{buyer.name}</p>
          <p>{buyer.street}</p>
          <p>
            {buyer.zip} {buyer.city}
          </p>
          <p>IČO: {buyer.identificationNumber}</p>
          <p>DIČ: {buyer.taxNumber}</p>
          <p>E-mail: {buyer.mail}</p>
          <p>Telefon: {buyer.telephone}</p>
        </div>
      )}
    </div>
  );
}
