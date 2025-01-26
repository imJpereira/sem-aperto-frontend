<script setup>
import axios from 'axios';
import { ref } from 'vue';

const emit = defineEmits(["close"]);

const title = ref("");
const startDate = ref("");
const finalDate = ref("");
const capital = ref("");

const isFormValid = () => title.value && startDate.value && finalDate.value && capital.value;

const createPlan = async () => {
    alert(await planPostRequest()); 
    closeModal();
}

const closeModal = () => emit("close");

const planPostRequest = async () => {
    if (!title.value) return "Título inválido";
    if (startDate.value === null) return "Data Inicial Inválida";
    if (finalDate.value === null) return "Data Final Inválida";
    if (new Date(startDate.value) > new Date(finalDate.value)) return "Data final maior que a data inicial";
    if (capital.value < 0) return "O Capital não pode ser menor que 0";
    
    try {
        axios.post("http://192.168.100.17:8080/plans/create", {
                        title : title.value,
                        startDate : startDate.value,
                        finalDate : finalDate.value,
                        initialCapital : capital.value
                    });
        return "Plano criado com sucesso";
    } catch(e) {
        return e;
    }

}

</script>

<template>
    <div class="modal">
        <img class="close" @click="closeModal()" width="20" height="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBCGYU/RSq9Yj1uwPc1bRBcirWicv4T5Vm6UeVCTGdJ1mUwm00yAJ9AHqKOfaim9eWDO6IlhRkw1TBlKHnADXssDPsBDpdL9Gu6rGt7FNXhikEJ4YpBGeGDQQlhi0EZYYMwQmhhzhAbGDSGJcUdIYMIgrmDCIUowYRFnMOERRzDVIPYw1SH+zBDj5tp9ULvyZup6E+tsPiezEUA0TXxa/PixI4zNp7K3OlWD4cASGx7DiX0iLIaCzS4chgs7dhgMAm2HOwbB3skNg0IDaI5BsYs1w2DQiqONsZwn0MJ4DEVIYzwnO6QwEcZTJDDNHL01cxiayWQyXcR8AfkY5euVO0c7AAAAAElFTkSuQmCC" alt="delete-sign--v1">
        <form action="POST" @submit.prevent="createPlan()">
            <div>
                <label for="">Título</label>
                <input v-model="title" class="form-control" type="text">
            </div>
            <div>
                <label for="">Início</label>
                <input v-model="startDate" class="form-control" type="date">
            </div>
            <div>
                <label for="">Fim</label>
                <input v-model="finalDate" class="form-control" type="date">
            </div>
            <div>
                <label for="">Capital</label>
                <input v-model="capital" class="form-control" type="number" step="0.01">
            </div>
            <div class="d-flex align-items-center justify-content-center">
                <button class="btn btn-dark btn-lg" type="submit" :disabled="!isFormValid()">Criar</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .modal {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 40%;
        left: 10%;
        transform: translate(-50%, -50%);
        height: 50vh;
        width: 20%;
        padding: 2rem;
        border-radius: 10px;
        color:var(--vt-c-text-dark-2);
        background-color: #585858;
        border: 1px solid #c4c4c4;
        z-index: 1000;
    }

    .close {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        transition: all 100ms ease-in-out;
    }

    .close:hover {
        transform: scale(1.05);
     }

    form {
        gap: 1rem;
    }

    form > :nth-child(1),
    form > :nth-child(5) {
        flex-basis: 100%;
    }

    form > :nth-child(2),
    form > :nth-child(3),
    form > :nth-child(4) {
        flex-grow: 1;
    }
    

</style>