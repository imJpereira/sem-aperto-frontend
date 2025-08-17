<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  inputValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Capital'
  },
  onBlur: {
    type: Function,
    required: true
  }
});

const inputValue = ref(props.inputValue);

const handleBlur = () => {
  if (inputValue.value === props.inputValue) return;  
  props.onBlur(inputValue.value);
};


watch(() => props.inputValue, (newVal) => {
  inputValue.value = newVal;
});

</script>

<template>
    <div class="plan-info-card">
        <label class="plan-label" for="">{{ props.label }}</label>
        <div class="input-container">
            <input
                v-model="inputValue"
                class="plan-input"
                type="text"
                @blur="handleBlur"
            />
        </div>
    </div>
</template>

<style scoped>

</style>