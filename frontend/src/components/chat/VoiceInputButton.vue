<template>
  <div class="relative flex items-center justify-center">
    <button
      type="button"
      @mousedown.prevent="onPressStart"
      @mouseup.prevent="onPressEnd"
      @mouseleave="onPressEnd"
      @touchstart.prevent="onPressStart"
      @touchend.prevent="onPressEnd"
      @touchcancel="onPressEnd"
      :class="buttonClasses"
      :title="buttonTitle"
    >
      <!-- Idle -->
      <MicIcon v-if="recorderState === 'idle'" class="w-5 h-5" />

      <!-- Recording -->
      <template v-if="recorderState === 'recording'">
        <MicIcon class="w-5 h-5 animate-pulse" />
        <span class="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></span>
      </template>

      <!-- Transcribing -->
      <LoaderIcon v-if="recorderState === 'transcribing'" class="w-5 h-5 animate-spin" />
    </button>

    <!-- Status label -->
    <span
      v-if="recorderState !== 'idle'"
      class="absolute -top-7 whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm"
      :class="recorderState === 'recording'
        ? 'bg-red-100 text-red-700'
        : 'bg-amber-100 text-amber-700'"
    >
      {{ recorderState === 'recording' ? 'Recording…' : 'Transcribing…' }}
    </span>
  </div>
</template>

<script setup>
import { watch, computed } from 'vue'
import { Mic as MicIcon, Loader2 as LoaderIcon } from 'lucide-vue-next'
import { useVoiceRecorder } from '@/composables/useVoiceRecorder'

const props = defineProps({
  language: { type: String, default: 'tw' },
  disabled: { type: Boolean, default: false },
})

const emits = defineEmits(['update:transcript', 'error'])

const {
  state: recorderState,
  transcript,
  error,
  startRecording,
  stopRecording,
  cancelRecording,
} = useVoiceRecorder()

const buttonClasses = computed(() => {
  const base = 'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm outline-none focus:ring-2 focus:ring-offset-2'

  if (props.disabled || recorderState.value === 'transcribing') {
    return `${base} bg-gray-200 text-gray-400 cursor-not-allowed`
  }
  if (recorderState.value === 'recording') {
    return `${base} bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`
  }
  return `${base} bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:border-green-300 focus:ring-green-500`
})

const buttonTitle = computed(() => {
  if (recorderState.value === 'transcribing') return 'Transcribing…'
  if (recorderState.value === 'recording') return 'Release to stop'
  return 'Hold to record'
})

function onPressStart() {
  if (props.disabled || recorderState.value !== 'idle') return
  startRecording()
}

function onPressEnd() {
  if (recorderState.value !== 'recording') return
  stopRecording(props.language)
}

watch(transcript, (val) => {
  if (val) emits('update:transcript', val)
})

watch(error, (val) => {
  if (val) {
    emits('error', val)
    setTimeout(() => cancelRecording(), 300)
  }
})
</script>
