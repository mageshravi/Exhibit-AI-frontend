<script setup lang="ts">
/*
 * Displays case-litigants in the case overview page.
 */
import type { CaseLitigant } from '@/types/retrieve-case-api'
interface LitigantCardProps {
  type: string
  litigants: Array<CaseLitigant>
}

const props = defineProps<LitigantCardProps>()

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="v-litigant-section">
    <h3>{{ toTitleCase(props.type) }}</h3>
    <div
      v-for="litigant in props.litigants"
      :key="litigant.litigant.id"
      class="v-litigant-section__card"
    >
      <h4 class="v-litigant-section__name" :title="litigant.is_our_client ? 'Our Client' : ''">
        <span class="secondary-txt" v-if="litigant.is_our_client">✅</span>
        {{ litigant.litigant.name }}
      </h4>
      <p class="v-litigant-section__bio">{{ litigant.litigant.bio }}</p>
      <p class="v-litigant-section__info">{{ litigant.litigant.address }}</p>
      <p class="v-litigant-section__info">{{ litigant.litigant.email }}</p>
      <p class="v-litigant-section__info">{{ litigant.litigant.phone }}</p>
    </div>
  </div>
</template>

<style lang="scss">
.v-litigant-section {
  &__name {
    margin-block-end: 0;
    font-family: var(--font-body);
    line-height: 1.5em;
  }
  &__bio {
    margin-block: 0;
  }
  &__info {
    margin-block: 0;
    color: var(--body-txt--secondary);
  }
}
</style>
