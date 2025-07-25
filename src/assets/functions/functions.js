export const formatDate = (date) => {
    const formattedDate = new Date(date);   
    return formattedDate.toLocaleDateString('pt-BR');
}

export const formatValue = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
