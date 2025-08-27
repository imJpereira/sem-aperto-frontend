<script setup>

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: String,
        default: ''
    },
});

const emit = defineEmits(['update:modelValue']);

</script>

<template>
    <div class="mb-3">
        <label class="form-label ">{{ props.label }}</label>
        <input 
            :value="modelValue" 
            class="form-control custom-input"
            type="date"
            @input="$emit('update:modelValue', $event.target.value)"
        >
  </div>
</template>
