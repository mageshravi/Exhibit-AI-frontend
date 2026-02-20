<template>
  <div class="c-timeline-event">
    <span class="c-timeline-event__date">10 Mar 2023&nbsp;&nbsp;01:52 PM</span>
    <p class="c-timeline-event__title">
      <strong>Proposal for building an Order Tracking System - Solisar & Co.</strong>
    </p>
    <p class="c-timeline-event__description">
      Magesh is following up on a previous conversation and has attached a proposal document for
      building an Order Tracking System for Solisar & Co. The proposal outlines the project scope,
      timeline, and deliverables.
    </p>
  </div>
</template>

<style lang="scss">
.c-timeline-event {
  margin-block-end: 48px;
  padding-inline: 12px;

  &__date {
    color: var(--body-txt--secondary);
    font-size: 14px;
  }

  &__title {
    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: -28px;
      width: 6px;
      height: 6px;
      border: 2px solid;
      background-color: var(--body-bg);
      transform: rotate(45deg);
    }

    position: relative;
    margin-block: 4px;
    color: var(--heading-txt);
  }
  &__description {
    margin-block-start: 0;
  }
}
</style>
