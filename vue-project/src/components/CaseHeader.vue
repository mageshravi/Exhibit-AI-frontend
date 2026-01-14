<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getCaseExhibits_v2 } from '@/utils/case'

const route = useRoute()

const props = defineProps<{
  title: string
}>()

interface CaseHeaderState {
  exhibitsCount: number
}

const state = reactive<CaseHeaderState>({
  exhibitsCount: 1, // to avoid layout jumping
})

onMounted(() => {
  const caseUuid = (route.params.caseUuid as string) || ''

  if (!caseUuid) {
    return
  }

  getCaseExhibits_v2(caseUuid).then((response) => {
    state.exhibitsCount = response.data?.count || 0
  })
})
</script>
<template>
  <header class="c-case-header">
    <nav class="m-breadcrumbs">
      <span class="m-breadcrumbs__item">
        <router-link class="m-breadcrumbs__link" :to="{ name: 'Home' }">Cases</router-link>
      </span>
    </nav>
    <h1 class="c-case-header__title">{{ props.title }}</h1>
    <nav class="m-tabs" v-if="state.exhibitsCount">
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
    &[aria-selected='true'],
    &.router-link-active {
      color: white;
      background-color: var(--theme-tint);
    }
  }
}

.c-case-header {
  &__title {
    margin-block-start: 0;
    margin-block-end: 13px;
  }
}
</style>
