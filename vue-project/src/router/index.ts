import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/logout',
      name: 'Logout',
      component: () => import('../views/LogoutView.vue'),
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/case/new',
      name: 'NewCase',
      component: () => import('../views/NewCaseView.vue'),
    },
    {
      path: '/case/:caseUuid',
      name: 'CaseDetail',
      component: () => import('../views/CaseView.vue'),
    },
    {
      path: '/case/:caseUuid/edit',
      name: 'EditCase',
      component: () => import('../views/EditCaseView.vue'),
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
    {
      path: '/case/:caseUuid/timelines',
      component: () => import('../views/TimelineView.vue'),
      children: [
        {
          path: '',
          name: 'Timelines',
          component: () => import('../views/NewTimelineView.vue'),
        },
        {
          path: 'new',
          name: 'NewTimeline',
          component: () => import('../views/NewTimelineView.vue'),
        },
        {
          path: ':timelineId',
          name: 'TimelineDetail',
          component: () => import('../views/TimelineDetailView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const userStore = useUserStore()

  if (authRequired && !userStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
