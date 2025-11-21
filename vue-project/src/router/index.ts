import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/case/:caseUuid',
      name: 'CaseDetail',
      component: () => import('../views/CaseView.vue'),
    },
    {
      path: '/case/:caseUuid/exhibits',
      name: 'Exhibits',
      component: () => import('../views/ExhibitsView.vue'),
    },
    {
      path: '/case/:caseUuid/chat',
      name: 'Chat',
      component: () => import('../views/ChatView.vue'),
    },
    {
      path: '/case/:caseUuid/chat/new',
      name: 'NewChat',
      component: () => import('../views/NewChatView.vue'),
    },
    {
      path: '/case/:caseUuid/chat/:threadUuid',
      name: 'CaseChat',
      component: () => import('../views/ChatView.vue'),
    },
  ],
})

export default router
