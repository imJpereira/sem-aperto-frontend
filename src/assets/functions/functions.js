import { useLoginStore } from "@/stores/loginStore";
import axios from "axios";

export const formatDate = (date) => {
    const formattedDate = new Date(date);   
    return formattedDate.toLocaleDateString('pt-BR');
}

export const formatValue = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
  
export const getCategoriesByPlanId = async (planId) => {
    const loginStore = useLoginStore();
    
    const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

    try {
        let categories = await axios(`${baseApiUrl}/categories/plan/${planId}`, {
            headers: {
                Authorization: `Bearer ${loginStore.jsonWebToken}`
            }
        })
        return categories.data;
        
    } catch (e) {
        console.log(e)
      }
}