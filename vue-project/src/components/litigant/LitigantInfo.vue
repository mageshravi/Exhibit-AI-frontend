<script setup lang="ts">
import { type Litigant } from '@/types/list-litigants-api'
import { ref, onMounted } from 'vue'

const props = defineProps<{
  litigant: Litigant
  type: 'plaintiff' | 'defendant' | 'witness'
}>()

const useBtn = ref<HTMLButtonElement | null>(null)

const emits = defineEmits<{
  (e: 'confirm', litigant: Litigant): void
  (e: 'modal:close'): void
}>()

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

onMounted(() => {
  useBtn.value?.focus()
})
</script>

<template>
  <div class="c-litigant-info">
    <h1 class="c-litigant-info__title">{{ props.litigant.name }}</h1>
    <div class="c-litigant-info__field">
      <span class="c-litigant-info__label">Bio</span>
      <p class="c-litigant-info__value">{{ props.litigant.bio }}</p>
    </div>
    <div class="c-litigant-info__field">
      <span class="c-litigant-info__label">Address</span>
      <p class="c-litigant-info__value">{{ props.litigant.address }}</p>
    </div>
    <div class="c-litigant-info__field">
      <span class="c-litigant-info__label">Email</span>
      <p class="c-litigant-info__value">{{ props.litigant.email }}</p>
    </div>
    <div class="c-litigant-info__field">
      <span class="c-litigant-info__label">Mobile</span>
      <p class="c-litigant-info__value">{{ props.litigant.phone }}</p>
    </div>
    <div class="c-litigant-info__field">
      <span class="c-litigant-info__label">Notes</span>
      <p v-if="props.litigant.notes" class="c-litigant-info__value">{{ props.litigant.notes }}</p>
      <p v-else class="c-litigant-info__value"><em>None</em></p>
    </div>

    <div>
      <button
        type="button"
        class="m-btn m-btn--primary"
        @click="emits('confirm', props.litigant)"
        ref="useBtn"
      >
        Use as {{ toTitleCase(props.type) }}
      </button>
      &nbsp;
      <button type="button" class="m-btn m-btn--secondary" @click="emits('modal:close')">
        Cancel
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.c-litigant-info {
  margin-block-start: 20px;
  margin-inline: auto;
  padding: 20px 24px;
  background-color: var(--body-bg);
  max-width: 450px;
  border-radius: 1rem;

  &__title {
    margin-block-start: 0;
    color: var(--heading-txt);
  }

  &__field {
    margin-block-end: 16px;
  }

  &__label {
    color: var(--body-txt--secondary);
    font-weight: bold;
    display: block;
  }

  &__value {
    margin: 0;
  }
}
</style>
