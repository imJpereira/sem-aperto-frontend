export const formatDate = (date) => {
    const formattedDate = new Date(date);   
    return formattedDate.toLocaleDateString('pt-BR');
}

export const formatValue = (value) => {
  if (value == null || value === '') return "0,00";

  let numberValue = parseFloat(value.toString().replace(',', '.'));
  if (isNaN(numberValue)) return "0,00";

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numberValue);
}


export const removeDots = (value) => {
  return value.replace(/\./g, '');
}
