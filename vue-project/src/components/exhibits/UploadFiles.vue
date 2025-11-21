<script setup lang="ts">
interface Props {
  compact?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  compact: false,
})
</script>

<template>
  <div class="c-upload-file">
    <h3>Documents / Exhibits</h3>
    <div
      class="c-upload-file__dropzone"
      :class="{ 'c-upload-file__dropzone--compact': props.compact }"
    >
      <div class="c-upload-file__dropzone-help">
        <img src="/CloudUploadOutline.png" alt="Upload icon" />
        <p>Drag and drop files here to upload</p>
      </div>
    </div>
  </div>
</template>

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
  }

  &__dropzone-help {
    text-align: center;
    color: #7e5c9b;

    p {
      margin-block: 10px;
      color: #7e5c9b;
    }
  }
}
</style>
