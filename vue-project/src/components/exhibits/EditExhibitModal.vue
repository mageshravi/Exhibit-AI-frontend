<script setup lang="ts">
import type { Exhibit } from '@/types/list-exhibits-api'
import InputText from '../inputs/InputText.vue'
import IconExhibit from '../icons/IconExhibit.vue'
import { computed, reactive } from 'vue'
import { updateExhibitCode } from '@/utils/exhibit'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps<{ exhibit: Exhibit | null }>()
const fileDisplay = computed(() => {
  if (!props.exhibit) {
    return ''
  }
  const filename = props.exhibit.filename || props.exhibit.file.split('/').pop() || 'Unknown'
  return filename
})

const state = reactive({
  exhibitCode: props.exhibit?.exhibit_code || null,
  errors: [],
})

const emits = defineEmits<{
  (e: 'updateExhibit', exhibit: Exhibit): void
  (e: 'close'): void
}>()

const saveExhibitCode = () => {
  // reset error text
  state.errors = []

  const exhibitCode = state.exhibitCode?.trim() || null

  // call API to update exhibit code
  updateExhibitCode(route.params.caseUuid as string, props.exhibit?.id as number, exhibitCode)
    .then((response) => {
      alert('Exhibit code updated successfully.')
      emits('updateExhibit', response.data)
      emits('close')
    })
    .catch((error) => {
      state.errors = error.response?.data?.exhibit_code || ['Failed to update exhibit code.']
    })
}
</script>

<template>
  <div class="c-edit-exhibit">
    <div class="c-edit-exhibit__overlay"></div>
    <div class="c-edit-exhibit__modal u-dialog-box-shadow">
      <div class="c-edit-exhibit__title-bar">
        <IconExhibit :filename="fileDisplay" />
        <div class="c-edit-exhibit__file-info">
          <span v-if="props.exhibit?.exhibit_code" class="c-edit-exhibit__code">{{
            props.exhibit?.exhibit_code
          }}</span>
          <span class="c-edit-exhibit__name" :title="fileDisplay">{{ fileDisplay }}</span>
          <small class="c-edit-exhibit__status">{{ props.exhibit?.status }}</small>
        </div>
      </div>
      <div class="c-edit-exhibit__body">
        <input-text
          class="c-edit-exhibit__ip"
          label="Exhibit Code"
          v-model="state.exhibitCode"
          :error-text="state.errors.join('<br>')"
          @keyup.enter="saveExhibitCode"
        />
        <div class="c-edit-exhibit__btn-wrapper">
          <button
            type="button"
            class="c-edit-exhibit__btn m-btn m-btn--primary"
            @click="saveExhibitCode"
          >
            Save
          </button>
          <button
            type="button"
            class="c-edit-exhibit__btn m-btn m-btn--secondary"
            @click="emits('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.c-edit-exhibit {
  &__overlay {
    position: fixed;
    z-index: 100;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.25);
  }
  &__modal {
    position: fixed;
    z-index: 101;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: var(--panel-bg);
    width: 490px;
    border-radius: 10px;
    overflow: hidden;
  }
  &__title-bar {
    display: flex;
    flex-flow: row;
    column-gap: 12px;
    align-items: center;
    padding: 20px 26px 16px 20px;
    background-color: var(--body-bg);
  }
  &__code {
    margin-inline-end: 10px;
    font-weight: bold;
    color: var(--oxford-blue);
  }
  &__status {
    display: block;
    color: var(--body-txt--secondary);
  }
  &__body {
    display: flex;
    flex-flow: column;
    row-gap: 16px;
    padding: 16px 20px 20px 20px;
  }
  &__ip {
    width: 50%;
  }
  &__btn-wrapper {
    display: flex;
    flex-flow: row;
    column-gap: 12px;
  }
  &__btn {
    width: fit-content;
  }
}
</style>
