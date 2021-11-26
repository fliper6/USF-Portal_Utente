import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/noticia/publicar',
    name: 'Criar Notícia',
    component: () => import(/* webpackChunkName: "about" */ '../views/AddNoticia.vue')
  },
  {
    path: '/noticia/editar/:id',
    name: 'Editar Notícia',
    component: () => import(/* webpackChunkName: "about" */ '../views/EditNoticia.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/files',
    name: 'Files',
    component: () => import(/* webpackChunkName: "about" */ '../views/Files.vue')
  },
  {
    path: '/balcao',
    name: 'Balcao',
    component: () => import(/* webpackChunkName: "about" */ '../views/Balcao.vue')
  },
  {
    path: '/balcao/medicacao',
    name: 'Medicacao',
    component: () => import(/* webpackChunkName: "about" */ '../views/Medicacao.vue')
  },
  {
    path: '/formConfirm',
    name: 'FormConfirm',
    component: () => import(/* webpackChunkName: "about" */ '../views/FormConfirm.vue')
  },
  {
    path: '/balcao/consulta',
    name: 'Consulta',
    component: () => import(/* webpackChunkName: "about" */ '../views/Consulta.vue')
  },
  {
    path: '/utilizadores/privilegios',
    name: 'EditarPrivilegiosUtilizador',
    component: () => import(/* webpackChunkName: "about" */ '../views/EditPrivUsers.vue')
  },
  {
    path: '/utilizador/:id',
    name: 'Perfil',
    component: () => import(/* webpackChunkName: "about" */ '../views/Perfil.vue')
  },
  {
    path: '*',
    name: 'Error',
    component: () => import(/* webpackChunkName: "about" */ '../views/Error.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
