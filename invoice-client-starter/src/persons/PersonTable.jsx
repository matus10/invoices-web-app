import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const PersonTable = ({ label, items, deletePerson }) => {
  return (
    <div>
      <p>
        {label} {items.length}
      </p>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle mb-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Jméno</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Akce</th>
            </tr>
          </thead>

          <tbody>
            {items.map((person, index) => (
              <tr key={person._id ?? index}>
                <td>{index + 1}</td>
                <td className="text-nowrap">{person.name}</td>
                <td className="text-break">{person.mail}</td>
                <td className="text-nowrap">{person.telephone}</td>

                <td>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <Link
                      to={"/persons/show/" + person._id}
                      className="btn btn-sm btn-info"
                    >
                      Zobrazit
                    </Link>

                    <Link
                      to={"/persons/edit/" + person._id}
                      className="btn btn-sm btn-warning"
                    >
                      Upravit
                    </Link>

                    <button
                      onClick={() => deletePerson(person._id)}
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
            <Link to={"/persons/create"} className="btn btn-success w-100">
                Nová osoba
            </Link>
        </div>
        </div>
    </div>
  );
};

export default PersonTable;
