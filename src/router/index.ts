import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/views/Main.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main,
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/AllCourses.vue'),
    },{
      path: '/course/:id',
      name: 'course',
      component: () => import('../views/Course.vue'),
    },
  ],
})

export default router
