<script setup lang="ts">
import { reactive, watch } from 'vue'
import EntityTag from './EntityTag.vue'

const props = defineProps<{
  addBtnLabel: string
  addEntityCallback: () => void
  entites?: Map<string, string>
}>()

const state = reactive<{
  entities: Map<string, string>
}>({
  entities: props.entites || new Map(),
})

const emits = defineEmits<{
  (e: 'update:entities', value: Map<string, string>): void
}>()

const removeEntity = (value: string) => {
  state.entities.delete(value)
  emits('update:entities', state.entities)
}

watch(
  () => props.entites,
  (newVal) => {
    if (newVal) {
      state.entities = newVal
    }
  },
  { deep: true },
)
</script>

<template>
  <div class="m-entity-selector {{ modifier_class }}">
    <label class="m-entity-selector__label"><slot></slot></label>
    <div v-if="state.entities" class="m-entity-selector__selected-entities">
      <EntityTag
        v-for="[value, label] in state.entities"
        :key="value"
        :label="label"
        :value="value"
        @remove="removeEntity"
      />
    </div>
    <button type="button" class="m-entity-selector__add-btn" @click="props.addEntityCallback">
      {{ props.addBtnLabel }}
    </button>
  </div>
</template>
