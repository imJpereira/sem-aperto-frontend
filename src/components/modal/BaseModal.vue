<script setup>
</script>

<template>
    <div class="modal">
        <slot></slot>
    </div>
</template>    

<style scoped>

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(90%, 400px);
  max-height: 70vh; 
  padding: 2rem;
  border-radius: 12px;
  background-color: #fff;
  color: #333;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); 
  overflow-y: auto;

  z-index: 1000;
}


</style>