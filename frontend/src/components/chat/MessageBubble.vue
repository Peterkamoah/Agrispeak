<template>
  <div
    :class="cn(
      'flex w-full mb-4',
      isUser ? 'justify-end' : 'justify-start'
    )"
  >
    <div
      :class="cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        isUser 
          ? 'bg-green-600 text-white rounded-br-sm' 
          : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200',
        isError ? 'bg-red-50 text-red-600 border-red-200' : ''
      )"
    >
      <div class="text-sm">
        <slot></slot>
      </div>
      <div 
        :class="cn(
          'text-[10px] mt-1 text-right',
          isUser ? 'text-green-100' : 'text-gray-400'
        )"
      >
        {{ timeString }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  isUser: {
    type: Boolean,
    default: false
  },
  isError: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: () => new Date()
  }
})

const timeString = computed(() => {
  if (!props.timestamp) return ''
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(props.timestamp)
})
</script>
