import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiGet } from "../utils/api";
import { formatCurrency } from "../utils/currencyFormatter";
import InvoiceSummaryChart from "./InvoiceStatisticsSummaryChart";

const InvoiceStatistics = () => {
    const [stats, setStats] = useState({
        currentYearSum: 0,
        allTimeSum: 0,
        invoicesCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiGet("/api/invoices/statistics")
            .then((data) => {
                setStats({
                    currentYearSum: data.currentYearSum ?? 0,
                    allTimeSum: data.allTimeSum ?? 0,
                    invoicesCount: data.invoicesCount ?? 0,
                });
                setLoading(false);
            })
            .catch((err) => {   
                console.error(err);
                setError("Nepodařilo se načíst statistiky.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Načítám statistiky…</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <>
            <div>
                <div className="d-flex flex-column flex-md-row gap-3 mt-4">
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
                <p></p>

                <h1>Statistiky faktur</h1>
                <hr/>
                <h3>Přehled</h3>
                <p>
                    <strong>Počet faktur celkem:</strong>
                    <br/>
                    {stats.invoicesCount}
                </p>
                <p>
                    <strong>Součet za aktuální rok:</strong>
                    <br/>
                    {formatCurrency(stats.currentYearSum)}
                </p>
                <p>
                    <strong>Součet za celé období:</strong>
                    <br/>
                    {formatCurrency(stats.allTimeSum)}
                </p>
                <InvoiceSummaryChart
                    currentYearSum={stats.currentYearSum}
                    allTimeSum={stats.allTimeSum}
                />
            </div>
        </>
    );
};

export default InvoiceStatistics;
