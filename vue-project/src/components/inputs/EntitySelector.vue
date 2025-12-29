<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Entity } from './EntityTag.vue'
import EntityTag from './EntityTag.vue'

const props = defineProps<{
  addBtnLabel: string
  addEntityCallback: () => void
  entities?: Map<string, Entity>
}>()

const state = reactive<{
  entities: Map<string, Entity>
}>({
  entities: props.entities || new Map(),
})

const emits = defineEmits<{
  (e: 'update:entities', value: Map<string, Entity>): void
}>()

const removeEntity = (value: string) => {
  state.entities.delete(value)
  emits('update:entities', state.entities)
}

watch(
  () => props.entities,
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
        v-for="[id, entity] in state.entities"
        :key="id"
        :label="entity.label"
        :value="id"
        @remove="removeEntity"
      />
    </div>
    <button type="button" class="m-entity-selector__add-btn" @click="props.addEntityCallback">
      {{ props.addBtnLabel }}
    </button>
  </div>
</template>
