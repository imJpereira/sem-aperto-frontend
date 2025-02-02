<script setup>
</script>

<template>
    <div class="modal">
        <slot></slot>
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
color: var(--vt-c-text-dark-2);
background-color: #585858;
border: 1px solid #c4c4c4;
z-index: 1000;
}

</style>