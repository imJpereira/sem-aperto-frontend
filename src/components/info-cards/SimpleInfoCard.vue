<script setup>
import { removeDots, formatValue } from '@/assets/functions/functions';
import { onMounted, ref, watch } from 'vue';

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
const inputValueDisplay = ref(formatValue(props.inputValue));

const handleBlur = () => {
  if (inputValueDisplay.value === formatValue(props.inputValue)) return;

  const cleanValue = inputValueDisplay.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  inputValue.value = cleanValue;

  props.onBlur(inputValue.value);

  const formatted = formatValue(cleanValue);
  inputValueDisplay.value = formatted;
};

const handleFocus = () => {
    inputValueDisplay.value = removeDots(inputValueDisplay.value);
}

watch(() => props.inputValue, (newVal) => {
  inputValueDisplay.value = formatValue(newVal);
});

onMounted(() => {
    const formatted = formatValue(props.inputValue);
    inputValueDisplay.value = formatted;
});

</script>

<template>
    <div class="plan-info-card">
        <label class="plan-label" for="">{{ props.label }}</label>
        <div class="input-container">
            <input
                v-model="inputValueDisplay"
                class="plan-input"
                type="text"
                @blur="handleBlur"
                @focus="handleFocus"
            />
        </div>
    </div>
</template>

<style scoped>

</style>