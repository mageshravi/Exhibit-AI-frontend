<template>
  <div class="c-upload-progress">
    <div class="c-upload-progress__file-info">
      <span
        class="c-upload-progress__status-icon"
        :class="{
          'c-upload-progress__status-icon--queued': props.progress === 0,
          'c-upload-progress__status-icon--uploading': props.progress > 0 && props.progress < 100,
          'c-upload-progress__status-icon--complete': props.progress === 100,
          'c-upload-progress__status-icon--error': props.errors?.length,
        }"
      ></span>
      <span class="c-upload-progress__file-name">{{ props.file.name }}</span>
    </div>
    <div class="c-upload-progress__errors">
      <span
        class="c-upload-progress__error-item"
        v-for="(err, idx) in props.errors"
        :key="idx"
        v-text="err"
      ></span>
    </div>
    <div
      class="c-upload-progress__track"
      v-show="props.progress < 100 && props.errors?.length == 0"
    >
      <div
        class="c-upload-progress__fill"
        :class="{ 'is-complete': props.isProcessed }"
        :style="progressStyle(props.progress)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  file: File
  progress: number
  isProcessed: boolean
  errors: Array<string> | null
}

const props = defineProps<Props>()

const progressStyle = function (progress: number): string {
  return `--data-progress: ${progress}%`
}
</script>

<style lang="scss">
.c-upload-progress {
  display: flex;
  flex-flow: column;
  row-gap: 2px;

  &__file-info {
    display: flex;
    flex-flow: row;
    column-gap: 4px;
    max-width: 40vw;
  }

  &__status-icon {
    --icon-size: 24px;

    width: var(--icon-size);
    height: var(--icon-size);
    background-image: url('/sprite-upload-progress-icons.svg');
    background-size: calc(var(--icon-size) * 4) var(--icon-size);
    background-repeat: no-repeat;
    background-position: top left;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;

    &--queued {
      background-position-x: 0;
    }

    &--uploading {
      background-position-x: calc(-1 * var(--icon-size));
    }

    &--complete {
      background-position-x: calc(-2 * var(--icon-size));
    }

    &--error {
      background-position-x: calc(-3 * var(--icon-size));
    }
  }

  &__file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__track {
    border: 1px solid var(--ip-border-color);
    padding: 1px;
    border-radius: 4px;
    overflow: hidden;
  }

  &__fill {
    width: var(--data-progress, 1%);
    height: 4px;
    background-color: var(--alert-debug);
    overflow: hidden;

    &.is-complete {
      background-color: var(--alert-success);
    }
  }

  &__errors {
    padding-inline-start: 28px;
    color: var(--alert-error);
    font-style: italic;
  }
}
</style>
