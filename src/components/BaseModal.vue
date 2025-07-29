<script setup>
</script>

<template>
    <div class="modal">
        <slot></slot>
    </div>
</template>    

<style scoped>

.modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    transform: translate(-50%, -50%);
    height: 65vh;
    width: 20%;
    padding: 2.5rem;
    border-radius: 10px;
    color: var(--vt-c-text-dark-2);
    background-color: #585858;
    border: 1px solid #c4c4c4;
    z-index: 1000;
}

</style>