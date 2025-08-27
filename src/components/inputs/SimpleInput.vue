<script setup>
import { formatValue, removeDots } from '@/assets/functions/functions';
import { onMounted } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  decimal: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['update:modelValue']);

</script>
<template>
  <div class="mb-3">
    <label class="form-label ">{{ props.label }}</label>
    <input 
      :value="modelValue" 
      class="form-control"
      type="text"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="props.decimal ? $event.target.value = removeDots($event.target.value) : null"
      @blur="props.decimal ? $event.target.value = formatValue($event.target.value) : null"
    >
  </div>
</template>
