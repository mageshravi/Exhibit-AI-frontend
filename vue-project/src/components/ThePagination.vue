<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const props = defineProps<{
  current: number
  total: number
}>()

const route = useRoute()

const previous = computed(() => {
  if (props.current === 1) {
    return null
  }

  return props.current - 1
})

const next = computed(() => {
  if (props.current === props.total) {
    return null
  }

  return props.current + 1
})

function pageUrl(pageNumber: number | null) {
  const query = route.query

  // map the query object for all params other than page
  const queryParams = Object.keys(query)
    .filter((key) => key !== 'page')
    .map((key) => `${key}=${query[key]}`)

  // finally add the page
  if (pageNumber) {
    queryParams.push(`page=${pageNumber}`)
  }

  return `?${queryParams.join('&')}`
}
</script>
<template>
  <ul class="m-pagination" v-if="total > 1">
    <li
      class="m-pagination__item m-pagination__item--first"
      :class="{ 'is-hidden': 1 === props.current || 1 === previous }"
    >
      <router-link class="m-pagination__link first" :to="pageUrl(1)">1</router-link>
    </li>

    <li :class="{ 'm-pagination__item': true, 'is-hidden': !previous }">
      <router-link
        class="m-pagination__link previous"
        :to="pageUrl(previous)"
        :text="previous"
      ></router-link>
    </li>

    <li class="m-pagination__item">
      <router-link
        class="m-pagination__link current"
        :to="pageUrl(current)"
        :text="current"
      ></router-link>
    </li>

    <li :class="{ 'm-pagination__item': true, 'is-hidden': !next }">
      <router-link class="m-pagination__link next" :to="pageUrl(next)" :text="next"></router-link>
    </li>

    <li
      class="m-pagination__item m-pagination__item--last"
      :class="{ 'is-hidden': total === current || total === next }"
    >
      <router-link class="m-pagination__link last" :to="pageUrl(total)" :text="total"></router-link>
    </li>
  </ul>
</template>
