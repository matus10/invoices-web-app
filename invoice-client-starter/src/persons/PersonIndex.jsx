import React, {useEffect, useState} from "react";

import {apiDelete, apiGet} from "../utils/api";

import PersonTable from "./PersonTable";

const PersonIndex = () => {
    const [persons, setPersons] = useState([]);
    
    const [filters, setFilters] = useState({
        search: "",
        name: "",
        identificationNumber: "",
        taxNumber: "",
        limit: "",
    });

    const loadPersons = (currentFilters) => {
        const filtered = {};

        Object.entries(currentFilters).forEach(([key, value]) => {
            if(value !== "" && value != null) {
                filtered[key] = value;
            }
        });

        apiGet("/api/persons", filtered)
            .then((data) => setPersons(data))
            .catch((err) => {
                console.error(err);
                alert("Neporařilo se načíst osoby.");
            });
    };

    useEffect(() => {
        loadPersons(filters);
    }, [filters.search]);

    const deletePerson = async (id) => {
        try {
            await apiDelete("/api/persons/" + id);
        } catch (error) {
            console.log(error.message);
            alert(error.message)
        }
        setPersons(persons.filter((item) => item._id !== id));
    };

    return (
        <div className="container">
            <h1>Seznam osob</h1>

            <form
                className="row g-3 mb-4 align-items-end"
                onSubmit={(e) => {
                    e.preventDefault();
                    loadPersons(filters);
                }}
            >
                <div className="col-8 col-md-8">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Vyhledat..."
                        value={filters.search}
                        onChange={(e) =>
                            setFilters({ ...filters, search: e.target.value })
                        }
                    />
                </div>
                
                <div className="col-4 col-md-2">
                    <label className="form-label mb-1"></label>
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
                            name: "",
                            identificationNumber: "",
                            taxNumber: "",
                            limit: "",
                        };
                        setFilters(empty);
                        loadPersons(empty);
                        }}
                    >
                        Zrušit filtr
                    </button>
                </div>
                </form>
                    <PersonTable
                        deletePerson={deletePerson}
                        items={persons}
                        label="Počet osob:"
                />
      </div>
    );
};
export default PersonIndex;
