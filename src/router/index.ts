
import { createRouter, createWebHistory } from 'vue-router'
import CapturePage from '@/pages/CapturePage.vue'
import CollectionPage from '@/pages/CollectionPage.vue'
import DetailPage from '@/pages/DetailPage.vue'
import SerendipityPage from '@/pages/SerendipityPage.vue'

const routes = [
  {
    path: '/',
    name: 'capture',
    component: CapturePage,
  },
  {
    path: '/collection',
    name: 'collection',
    component: CollectionPage,
  },
  {
    path: '/inspiration/:id',
    name: 'detail',
    component: DetailPage,
  },
  {
    path: '/serendipity',
    name: 'serendipity',
    component: SerendipityPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
