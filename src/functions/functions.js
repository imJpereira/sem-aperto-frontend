import axios from "axios";

export const formatDate = (date) => {
    const formattedDate = new Date(date);   
    return formattedDate.toLocaleDateString('pt-BR');
}
  
export const getCategoriesByPlanId = async (planId) => {
    try {
        let categories = await axios(`http://192.168.100.17:8080/categories/plan/${planId}`)
        return categories.data;
        
    } catch (e) {
        console.log(e)
      }
}