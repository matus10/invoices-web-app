export const formatCurrency = (value) =>
    new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency: "CZK",
        minimumFractionDigits: 0,
    }).format(Number(value) || 0);
