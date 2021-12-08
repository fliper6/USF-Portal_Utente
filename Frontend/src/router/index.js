import Vue from 'vue'
import VueRouter from 'vue-router'
import jwt from 'jsonwebtoken'
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
    path: '/contactos',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/documentos',
    name: 'Files',
    component: () => import(/* webpackChunkName: "about" */ '../views/Files.vue')
  },
  {
    path: '/documentos/:id',
    name: 'FileIndividual',
    component: () => import(/* webpackChunkName: "about" */ '../views/FileIndividual.vue')
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
    path: '/perfil',
    name: 'Perfil',
    component: () => import(/* webpackChunkName: "about" */ '../views/Perfil.vue')
  },
  {
    path: '/gestao/medicacao',
    name: 'PedidoM',
    component: () => import(/* webpackChunkName: "about" */ '../views/PedidoM.vue')
  },
  {
    path: '/gestao/consulta',
    name: 'PedidoC',
    component: () => import(/* webpackChunkName: "about" */ '../views/PedidoC.vue')
  },
  {
    path: '/gestao/sugestao',
    name: 'Sugestao',
    component: () => import(/* webpackChunkName: "about" */ '../views/Sugestao.vue')
  },
  {
    path: '/gestao/medicos',
    name: 'GestaoMedicos',
    component: () => import(/* webpackChunkName: "about" */ '../views/GestaoMedicos.vue')
  },
  {
    path: '/gestao/noticias',
    name: 'GestaoNoticias',
    component: () => import(/* webpackChunkName: "about" */ '../views/GestaoNoticias.vue')
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import(/* webpackChunkName: "about" */ '../views/Forbidden.vue')
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
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
})

router.beforeEach((to, from, next) => {
  let adminRoutes = ['EditarPrivilegiosUtilizador', 'GestaoMedicos']
  let medicoRoutes = ['Criar Notícia','Editar Noticia']
  let userRoutes = []
  let nivel = ''
  if (localStorage.getItem('jwt')) {
    nivel = jwt.decode(localStorage.getItem('jwt')).nivel
  }

  if (adminRoutes.indexOf(to.name) != -1 && nivel != 'Administrador') next({ name: 'Forbidden' })

  else if (medicoRoutes.indexOf(to.name) != -1 && (nivel != 'Administrador' && nivel != 'Secretário')) next({ name: 'Forbidden' })

  else if (userRoutes.indexOf(to.name) != -1 && (nivel != 'Administrador' && nivel != 'Secretário' && nivel != 'Utente')) next({ name: 'Forbidden' })

  else next()
})

export default router
