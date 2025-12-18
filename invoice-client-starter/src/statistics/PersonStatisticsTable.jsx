import React from "react";
import {Link} from "react-router-dom";
import { formatCurrency } from "../utils/currencyFormatter.js";

const PersonStatisticsTable = ({label, items}) => {
    return (
        <div>
            <p>
                {label} {items.length}
            </p>

            <table className="table w-1200px mx-auto table-bordered text-center">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Jméno</th>
                    <th>Tržby</th>
                </tr>
                </thead>

                <tbody>
                {items.map((person, index) => (
                    <tr key={person.personId}>
                        <td>{index + 1}</td>
                        <td>{person.personName}</td>
                        <td>{formatCurrency(person.revenue)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonStatisticsTable;
