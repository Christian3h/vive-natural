const formatoCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Para no mostrar decimales en números enteros
    maximumFractionDigits: 0,
});

export { formatoCOP };
