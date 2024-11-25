<template>
  <div class="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition">
    <div class="w-12 h-12 mb-4 text-blue-600">
      <component :is="iconComponent" />
    </div>
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { RadarIcon, MapIcon, CloudIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const iconComponent = computed(() => {
      switch (props.icon) {
        case 'radar':
          return RadarIcon
        case 'plan':
          return MapIcon
        case 'weather':
          return CloudIcon
        default:
          return RadarIcon
      }
    })

    return {
      iconComponent
    }
  }
})
</script> 