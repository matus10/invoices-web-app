import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiGet } from "../utils/api";
import PersonStatisticsTable from "./PersonStatisticsTable";

const PersonStatistics = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        minRevenue: "",
        maxRevenue: "",
    });

    const loadStatistics = (currentFilters) => {
        const filtered = {};

        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== "" && value != null) {
                filtered[key] = value;
            }
        });

        setLoading(true);

        apiGet("/api/persons/statistics", filtered)
            .then((data) => {
                setRows(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Nepodařilo se načíst statistiky osob.");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadStatistics(filters);
    }, []);

    if (loading) return <p>Načítám statistiky…</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div>
            <div className="d-flex gap-3 mt-4 mb-3">
                <NavLink
                    to="/invoices/statistics"
                    className={({ isActive }) =>
                        "btn btn-lg " + (isActive ? "btn-primary" : "btn-secondary")
                    }
                >
                    Statistiky faktur
                </NavLink>

                <NavLink
                    to="/persons/statistics"
                    className={({ isActive }) =>
                        "btn btn-lg " + (isActive ? "btn-primary" : "btn-secondary")
                    }
                >
                    Statistiky osob
                </NavLink>
            </div>

            <h1>Statistiky osob</h1>
            <hr />

            <form
                className="row g-3 mb-4 align-items-end"
                onSubmit={(e) => {
                    e.preventDefault();
                    loadStatistics(filters);
                }}
            >
                <div className="col-md-4">
                    <label className="form-label">Minimální tržby (revenue)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={filters.minRevenue}
                        onChange={(e) =>
                            setFilters({ ...filters, minRevenue: e.target.value })
                        }
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Maximální tržby (revenue)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={filters.maxRevenue}
                        onChange={(e) =>
                            setFilters({ ...filters, maxRevenue: e.target.value })
                        }
                    />
                </div>

                <div className="col-md-2 d-grid">
                    <button type="submit" className="btn btn-primary">
                        Filtrovat
                    </button>
                </div>

                <div className="col-md-2 d-grid">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            const empty = {
                                minRevenue: "",
                                maxRevenue: "",
                            };
                            setFilters(empty);
                            loadStatistics(empty);
                        }}
                    >
                        Zrušit filtr
                    </button>
                </div>
            </form>

            <PersonStatisticsTable
                label="Počet osob"
                items={rows}
            />
        </div>
    );
};

export default PersonStatistics;
