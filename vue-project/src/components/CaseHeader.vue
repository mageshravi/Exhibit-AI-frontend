<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCaseExhibits_v2 } from '@/utils/case'

const route = useRoute()

const props = defineProps<{
  title: string
  editMode?: boolean
}>()

interface CaseHeaderState {
  exhibitsCount: number
}

const state = reactive<CaseHeaderState>({
  exhibitsCount: 1, // to avoid layout jumping
})

const displayTitle = computed(() => {
  return props.editMode ? `Edit Case` : props.title
})

const emits = defineEmits<{
  /* 'exhibits:count-updated' emitted when the number of exhibits changes.
   * Helps parent components to update exhibit-related UI elements accordingly
   * without duplicate API calls.
   */
  (e: 'exhibits:count-updated', count: number): void
}>()

onMounted(() => {
  const caseUuid = (route.params.caseUuid as string) || ''

  if (!caseUuid) {
    return
  }

  getCaseExhibits_v2(caseUuid).then((response) => {
    state.exhibitsCount = response.data?.count || 0
    emits('exhibits:count-updated', state.exhibitsCount)
  })
})
</script>
<template>
  <header class="c-case-header">
    <nav class="m-breadcrumbs">
      <span class="m-breadcrumbs__item">
        <router-link class="m-breadcrumbs__link" :to="{ name: 'Home' }">Cases</router-link>
      </span>
      <span class="m-breadcrumbs__item" v-if="props.editMode">
        <router-link
          class="m-breadcrumbs__link"
          :to="{ name: 'CaseDetail', params: { caseUuid: route.params.caseUuid } }"
        >
          {{ props.title }}
        </router-link>
      </span>
    </nav>
    <h1 class="c-case-header__title">{{ displayTitle }}</h1>
    <nav class="m-tabs" v-if="!props.editMode && state.exhibitsCount">
      <router-link
        class="m-tabs__tab"
        :to="{ name: 'CaseDetail', params: { caseUuid: $route.params.caseUuid } }"
        >Overview</router-link
      >
      <router-link
        class="m-tabs__tab"
        :to="{ name: 'Exhibits', params: { caseUuid: $route.params.caseUuid } }"
        >Exhibits</router-link
      >
      <router-link
        class="m-tabs__tab"
        :to="{ name: 'NewChat', params: { caseUuid: $route.params.caseUuid } }"
        >Chats</router-link
      >
      <router-link
        class="m-tabs__tab"
        :to="{ name: 'Timelines', params: { caseUuid: $route.params.caseUuid } }"
        >Timelines</router-link
      >
    </nav>
  </header>
</template>
<style lang="scss">
.m-breadcrumbs {
  display: flex;
  flex-flow: row;

  &__item {
    color: var(--body-txt--secondary);

    &::after {
      margin-inline: 6px;
      content: '>';
    }
  }

  &__link {
    color: var(--body-txt--secondary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.m-tabs {
  &__tab {
    &.router-link-active {
      border-color: var(--theme-tint);
    }

    &[aria-selected='true'],
    &.router-link-exact-active {
      color: white;
      background-color: var(--theme-tint);
    }
  }
}

.c-case-header {
  &__title {
    margin-block: 0;
  }

  &__title + .m-tabs {
    margin-block-start: 13px;
  }
}
</style>
