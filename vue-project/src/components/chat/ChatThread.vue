<template>
  <div class="c-chat-thread">
    <div class="c-chat-thread__messages">
      <div class="c-chat-thread__human-message">
        How many emails exchanged between the plaintiff and the defendant?
      </div>
      <div class="c-chat-thread__ai-message">
        Emails sent by plaintiff: 27<br />
        Emails/respondences from defendants: 7
      </div>
      <div class="c-chat-thread__human-message">
        Give me the details of payments made by defendant to the plaintiff till date.
      </div>
      <div class="c-chat-thread__ai-message">
        <p>
          Records indicate the defendant paid Rs. 70,000 on 03 Apr 2023. No mentions of other
          payments till date.
        </p>
        <em> Source: E-mail "<a href="#">Statement of accounts</a>" dated 10 May 2023. </em>
      </div>
      <!-- duplicate -->
      <div class="c-chat-thread__human-message">
        How many emails exchanged between the plaintiff and the defendant?
      </div>
      <div class="c-chat-thread__ai-message">
        Emails sent by plaintiff: 27<br />
        Emails/respondences from defendants: 7
      </div>
      <div class="c-chat-thread__human-message">
        Give me the details of payments made by defendant to the plaintiff till date.
      </div>
      <div class="c-chat-thread__ai-message">
        <p>
          Records indicate the defendant paid Rs. 70,000 on 03 Apr 2023. No mentions of other
          payments till date.
        </p>
        <em> Source: E-mail "<a href="#">Statement of accounts</a>" dated 10 May 2023. </em>
      </div>
      <div class="c-chat-thread__human-message">
        How many emails exchanged between the plaintiff and the defendant?
      </div>
      <div class="c-chat-thread__ai-message">
        Emails sent by plaintiff: 27<br />
        Emails/respondences from defendants: 7
      </div>
      <div class="c-chat-thread__human-message">
        Give me the details of payments made by defendant to the plaintiff till date.
      </div>
      <div class="c-chat-thread__ai-message">
        <p>
          Records indicate the defendant paid Rs. 70,000 on 03 Apr 2023. No mentions of other
          payments till date.
        </p>
        <em> Source: E-mail "<a href="#">Statement of accounts</a>" dated 10 May 2023. </em>
      </div>
    </div>
    <textarea class="c-chat-thread__new-message" placeholder="Ask anything" autofocus></textarea>
  </div>
</template>
<style lang="scss">
.c-chat-thread {
  display: flex;
  flex-flow: column;
  row-gap: 1rem;
  padding: 15px;
  background-color: var(--panel-bg);
  border-radius: 1rem;
  height: calc(100vh - 165px - 44px);

  &__messages {
    display: flex;
    flex-flow: column;
    row-gap: 1rem;
    flex-grow: 1;
    overflow-y: auto;
  }

  &__human-message {
    font-family: var(--font-heading);
    font-size: 1.16875rem; /* same as h3 */
    line-height: 120%;
    color: black;
  }

  &__new-message {
    border-width: var(--ip-border-width);
    border-color: var(--ip-border-color);
    padding: 15px;
    height: 66px;
    font-family: var(--font-body);
    border-radius: 6px;

    &:focus {
      outline: none;
      padding: 14px;
      border-width: var(--ip-border-width--focused);
      border-color: var(--ip-border-color--focused);
    }
  }
}
</style>
