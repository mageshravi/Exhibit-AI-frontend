<template>
  <div class="c-upload-file">
    <h3>Documents / Exhibits</h3>
    <div
      class="c-upload-file__dropzone"
      :class="{ 'c-upload-file__dropzone--compact': props.compact, 'is-dragging': isDragging }"
      @click="openFileSelection"
      @dragover.prevent
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop.prevent="handleFileDrop"
    >
      <div class="c-upload-file__dropzone-help">
        <img class="c-upload-file__dropzone-icon" src="/CloudUploadOutline.png" alt="Upload icon" />
        <p>Drag and drop files here to upload</p>
        <input type="file" ref="fileInput" @change="handleFileSelection" multiple hidden />
      </div>
    </div>
    <div class="c-upload-file__queue-wrapper u-dialog-box-shadow" v-if="state.queuedFiles">
      <h3>Uploading files... Please wait...</h3>
      <div class="c-upload-file__queue-item" v-for="(file, idx) in state.queuedFiles" :key="idx">
        <span class="c-upload-file__queue-item-name">{{ file.file.name }}</span>
        <div class="c-upload-file__queue-track">
          <div
            class="c-upload-file__queue-progress"
            :class="{ 'is-complete': file.isProcessed }"
            :style="progressStyle(file.progress)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { uploadFileWithProgress } from '@/utils/common'

const route = useRoute()

interface Props {
  compact?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

class QueuedFile {
  file: File
  progress: number
  isProcessed: boolean

  constructor(file: File) {
    this.file = file
    this.progress = 0
    this.isProcessed = false
  }
}
interface UploadFilesState {
  queuedFiles: Array<QueuedFile> | null
}
const state = reactive<UploadFilesState>({
  queuedFiles: null,
})

const fileInput = ref<HTMLInputElement | null>(null)
const dragCounter = ref<number>(0)
const isDragging = ref(false)

const handleDragEnter = (ev: DragEvent): void => {
  if (ev.currentTarget === ev.target) {
    dragCounter.value = 0
  }

  dragCounter.value++

  if (!isDragging.value) {
    isDragging.value = true
  }
}

const handleDragLeave = (): void => {
  dragCounter.value--

  if (dragCounter.value <= 0) {
    isDragging.value = false
    dragCounter.value = 0
  }
}

const openFileSelection = (): void => {
  fileInput.value?.click()
}

const handleFileSelection = (ev: Event): void => {
  const target = ev.target as HTMLInputElement
  const files = target.files
  if (files) {
    const queuedFiles = []
    for (const file of files) {
      queuedFiles.push(new QueuedFile(file))
    }

    state.queuedFiles = queuedFiles
  }
  target.value = ''
}

const handleFileDrop = function (ev: DragEvent) {
  isDragging.value = false
  dragCounter.value = 0

  const files = ev.dataTransfer?.files

  if (files) {
    const queuedFiles = []
    for (const file of files) {
      queuedFiles.push(new QueuedFile(file))
    }
    state.queuedFiles = queuedFiles
  }
}

const progressStyle = function (progress: number): string {
  return `--data-progress: ${progress}%`
}

watch(
  () => state.queuedFiles,
  () => {
    processFiles()
  },
)

const processFiles = function () {
  if (!state.queuedFiles?.length) {
    return
  }

  for (const item of state.queuedFiles) {
    if (item.isProcessed) {
      continue
    }

    uploadFile(item)
  }
}

const uploadFile = function (queuedFile: QueuedFile) {
  const caseUuid = route.params?.caseUuid

  if (!caseUuid) {
    console.error('Missing required URL param "caseUuid"')
    return
  }

  const formData = new FormData()
  formData.append('file', queuedFile.file)
  uploadFileWithProgress(`/api/poc/cases/${caseUuid}/exhibits/`, formData, function (progress) {
    queuedFile.progress = progress

    if (progress == 100) {
      queuedFile.isProcessed = true
    }
  })
}
</script>

<style lang="scss">
.c-upload-file {
  &__dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4eef9;
    height: 220px;
    border-radius: 1rem;

    &--compact {
      height: 170px;
    }

    &.is-dragging {
      border: 2px dashed;
    }

    &.is-dragging &-icon {
      animation-name: infinite-bounce;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-fill-mode: alternate; /* Crucial: Keeps the 100% state after animation ends */

      /* The elastic timing function for a springy feel */
      animation-timing-function: ease-in-out;
    }
  }

  &__dropzone-help {
    text-align: center;
    color: #7e5c9b;

    p {
      margin-block: 10px;
      color: #7e5c9b;
    }
  }

  &__queue-wrapper {
    display: flex;
    flex-flow: column;
    row-gap: 12px;

    position: fixed;
    bottom: 40px;
    right: 40px;
    padding: 13px 32px 30px 32px;
    background-color: var(--panel-bg);
    border-radius: 1rem;
  }

  &__queue-track {
    border: 1px solid var(--ip-border-color);
    padding: 1px;
    border-radius: 4px;
    overflow: hidden;
  }

  &__queue-progress {
    width: var(--data-progress, 1%);
    height: 4px;
    background-color: var(--alert-debug);
    overflow: hidden;

    &.is-complete {
      background-color: var(--alert-success);
    }
  }
}

@keyframes infinite-bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
