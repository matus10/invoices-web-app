import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";

import { apiGet, apiPost, apiPut } from "../utils/api";

import InputField from "../components/InputField";
import FlashMessage from "../components/FlashMessage";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    issued: "",
    dueDate: "",
    product: "",
    price: "",
    vat: "",
    note: "",
    seller: null,
    buyer: null,
  });

  const [sentState, setSent] = useState(false);
  const [successState, setSuccess] = useState(false);
  const [errorState, setError] = useState(null);

  const [personModalMode, setPersonModalMode] = useState(null); 
  const [personSearch, setPersonSearch] = useState("");
  const [personResults, setPersonResults] = useState([]);

  useEffect(() => {
    if (id) {
      apiGet("/api/invoices/" + id)
        .then((data) => {
          setInvoice(data);
        })
        .catch((err) => {
          console.error(err);
          setError("Nepodařilo se načíst fakturu.");
        });
    }
  }, [id]);

  useEffect(() => {
    if (!personModalMode) return;

    if (personSearch.trim() === "") {
      setPersonResults([]);
      return;
    }

    apiGet("/api/persons", { search: personSearch, limit: 10 })
      .then((data) => {
        setPersonResults(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [personModalMode, personSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const sellerId = invoice.seller?._id;
    const buyerId = invoice.buyer?._id;

    if (!sellerId || !buyerId) {
      setError("Musíte vybrat prodávajícího i kupujícího.");
      setSent(true);
      setSuccess(false);
      return;
    }

    if (sellerId === buyerId) {
      setError("Prodávající a kupující nesmí být stejná osoba.");
      setSent(true);
      setSuccess(false);
      return;
    }

    const action = id
      ? apiPut("/api/invoices/" + id, invoice)
      : apiPost("/api/invoices", invoice);

    action
      .then(() => {
        setSent(true);
        setSuccess(true);
        navigate("/invoices");
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
        setSent(true);
        setSuccess(false);
      });
  };

  const sent = sentState;
  const success = successState;

  const handleOpenPersonModal = (mode) => {
    setPersonModalMode(mode);
    setPersonSearch("");
    setPersonResults([]);
  };

  const handleClosePersonModal = () => {
    setPersonModalMode(null);
    setPersonSearch("");
    setPersonResults([]);
  };

  const handleSelectPerson = (person) => {
    if (personModalMode === "seller") {
      setInvoice((prev) => ({
        ...prev,
        seller: { _id: person._id, name: person.name },
      }));
    } else if (personModalMode === "buyer") {
      setInvoice((prev) => ({
        ...prev,
        buyer: { _id: person._id, name: person.name },
      }));
    }

    handleClosePersonModal();
  };

  return (
    <div
      className="mx-auto mt-4 p-4 shadow rounded bg-white"
      style={{ maxWidth: "600px" }}
    >
      <div className="container d-flex justify-content-center">
        <h1>{id ? "Upravit fakturu" : "Vytvořit fakturu"}</h1>
        <hr />
      </div>

      {errorState ? (
        <div className="alert alert-danger">{errorState}</div>
      ) : null}

      {sent && (
        <FlashMessage
          theme={success ? "success" : ""}
          text={success ? "Uložení faktury proběhlo úspěšně." : ""}
        />
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          required={true}
          type="text"
          name="invoiceNumber"
          min="3"
          label="Číslo faktury"
          prompt="Zadejte číslo faktury"
          value={invoice.invoiceNumber}
          handleChange={(e) => {
            setInvoice({ ...invoice, invoiceNumber: e.target.value });
          }}
        />

        <InputField
          required={true}
          type="date"
          name="issued"
          label="Datum vystavení"
          prompt="Zadejte datum vystavení"
          value={invoice.issued}
          handleChange={(e) => {
            setInvoice({ ...invoice, issued: e.target.value });
          }}
        />

        <InputField
          required={true}
          type="date"
          name="dueDate"
          label="Datum splatnosti"
          prompt="Zadejte datum splatnosti"
          value={invoice.dueDate}
          handleChange={(e) => {
            setInvoice({ ...invoice, dueDate: e.target.value });
          }}
        />

        <InputField
          required={true}
          type="text"
          name="product"
          min="3"
          label="Název produktu/služby"
          prompt="Zadejte název produktu/služby"
          value={invoice.product}
          handleChange={(e) => {
            setInvoice({ ...invoice, product: e.target.value });
          }}
        />

        <InputField
          required={true}
          type="number"
          name="price"
          min="0"
          label="Cena bez DPH"
          prompt="Zadejte cenu bez DPH"
          value={invoice.price}
          handleChange={(e) => {
            setInvoice({ ...invoice, price: e.target.value });
          }}
        />

        <InputField
          required={true}
          type="number"
          name="vat"
          min="0"
          label="DPH (%)"
          prompt="Zadejte DPH"
          value={invoice.vat}
          handleChange={(e) => {
            setInvoice({ ...invoice, vat: e.target.value });
          }}
        />

        <InputField
          required={false}
          type="text"
          name="note"
          label="Poznámka"
          value={invoice.note || ""}
          handleChange={(e) => {
            setInvoice({ ...invoice, note: e.target.value });
          }}
        />

        {/* Akce pro osoby */}
        <div className="mb-3 mt-3 d-flex justify-content-between">
          <Link to="/persons/create" className="btn btn-secondary me-2">
            Zadat osobu ručně
          </Link>

          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={() => handleOpenPersonModal("seller")}
          >
            Vyhledat prodávajícího
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary me-2"
            onClick={() => handleOpenPersonModal("buyer")}
          >
            Vyhledat kupujícího
          </button>
        </div>

        <div className="container d-flex justify-content-around mb-5">
          <div className="mb-3">
            <div>
              {invoice.seller ? (
                <>
                  <div>Prodávající: <strong>{invoice.seller.name}</strong></div>
                  
                </>
              ) : (
                <span className="text-muted">Žádný prodávající není vybrán.</span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div>
              {invoice.buyer ? (
                <>
                  <div>Kupující: <strong>{invoice.buyer.name}</strong></div>
                  
                </>
              ) : (
                <span className="text-muted">Žádný kupující není vybrán.</span>
              )}
            </div>
          </div>
        </div>
        <div className="container d-flex justify-content-center gap-4">
          <input type="submit" className="btn btn-primary btn-lg" value="Uložit" />
          <Link to={"/invoices"} className="btn btn-danger btn-lg">
            Zrušit
          </Link>
        </div>
      </form>

      {personModalMode && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "700px", maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {personModalMode === "seller"
                  ? "Vyhledat prodávajícího"
                  : "Vyhledat kupujícího"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClosePersonModal}
              />
            </div>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Zadejte jméno, IČO nebo DIČ…"
              value={personSearch}
              onChange={(e) => setPersonSearch(e.target.value)}
            />

            {personSearch.trim() === "" && (
              <p className="text-muted">
                Zadejte jméno, IČO nebo DIČ...
              </p>
            )}

            {personSearch.trim() !== "" && personResults.length === 0 && (
              <p className="text-muted">Nenalezena žádná osoba.</p>
            )}

            {personResults.length > 0 && (
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Jméno</th>
                    <th>IČO</th>
                    <th>DIČ</th>
                    <th>Město</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {personResults.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.identificationNumber}</td>
                      <td>{p.taxNumber}</td>
                      <td>{p.city}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSelectPerson(p)}
                        >
                          Vybrat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="text-end mt-3">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClosePersonModal}
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
