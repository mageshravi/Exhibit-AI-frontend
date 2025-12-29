<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { type Litigant } from '@/types/list-litigants-api'
import InputCheckbox from '@/components/inputs/InputCheckbox.vue'

const props = defineProps<{
  litigant: Litigant
  type: 'plaintiff' | 'defendant' | 'witness'
  ourClientRole: 'plaintiff' | 'defendant' | null
}>()

const state = reactive<{
  isOurClient: boolean
}>({
  isOurClient: false,
})

const useBtn = ref<HTMLButtonElement | null>(null)

const emits = defineEmits<{
  (e: 'confirm', litigant: Litigant, isOurClient: boolean): void
  (e: 'modal:close'): void
}>()

const isCheckboxVisible = () => {
  if (props.ourClientRole === null) {
    return true
  }
  return props.ourClientRole === props.type
}

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const confirmSelection = () => {
  emits('confirm', props.litigant, state.isOurClient)
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
    <div class="c-litigant-info__field" v-if="isCheckboxVisible()">
      <InputCheckbox name="is_our_client" label="Our Client" v-model="state.isOurClient" />
    </div>
    <div>
      <button type="button" class="m-btn m-btn--primary" @click="confirmSelection" ref="useBtn">
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
