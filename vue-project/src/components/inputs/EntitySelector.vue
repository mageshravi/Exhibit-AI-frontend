<script setup lang="ts">
import { reactive } from 'vue'
import EntityTag, { type Entity } from './EntityTag.vue'

const props = defineProps<{
  addBtnLabel: string
  addEntityCallback: () => void
  entites?: Entity[]
}>()

const state = reactive<{
  entities: Entity[]
}>({
  entities: props.entites || [],
})

const emits = defineEmits<{
  (e: 'update:entities', value: Entity[]): void
}>()

const removeEntity = (value: string) => {
  state.entities = state.entities.filter((entity) => entity.value !== value)
  emits('update:entities', state.entities)
}
</script>

<template>
  <div class="m-entity-selector {{ modifier_class }}">
    <label class="m-entity-selector__label"><slot></slot></label>
    <div class="m-entity-selector__selected-entities">
      <EntityTag
        v-for="entity in state.entities"
        :key="entity.value"
        v-bind="entity"
        @remove="removeEntity"
      />
    </div>
    <button type="button" class="m-entity-selector__add-btn" @click="props.addEntityCallback">
      {{ props.addBtnLabel }}
    </button>
  </div>
</template>
