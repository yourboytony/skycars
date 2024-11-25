<template>
  <div class="p-6 rounded-xl bg-white shadow">
    <div class="text-4xl font-bold text-blue-600 mb-2">
      {{ formattedValue }}
    </div>
    <div class="text-gray-600 font-medium">
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    formattedValue() {
      return new Intl.NumberFormat().format(this.value)
    }
  }
}
</script> 