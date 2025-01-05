export const formatDate = (date) => {
    date = date.join('-')
    const formattedDate = new Date(date);   
    return formattedDate.toLocaleDateString('pt-BR');
}
  