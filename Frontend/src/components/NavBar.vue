<template>
  <v-app >
    <v-app-bar
    app
    color="white"
    >
      <router-link to="/">
        <div class="d-flex align-center">
        <v-img
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          width="60"
        />
        </div>
      </router-link>

      <div style="height:40px; margin: 0px 15px;">
        <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
      </div>
 
      <router-link to="/" class="titulo" >
        <div class="d-flex align-center">
            <b :style="this.path==''? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Notícias</b>
        </div>
      </router-link>

      <div style="height:40px; margin: 0px 15px;">
        <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
      </div>

      <router-link to="/documentos" class="titulo">
        <div class="d-flex align-center">
            <b :style="this.path=='documentos'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Documentos</b>
        </div>
      </router-link>

      <div style="height:40px; margin: 0px 15px;">
        <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
      </div>

      <router-link to="/contactos" class="titulo">
        <div class="d-flex align-center">
            <b :style="this.path=='contactos'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Encontre-nos</b>
        </div>
      </router-link>
      
      <div class="d-flex align-center">
        
      <div style="height:40px; margin: 0px 15px;">
        <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
      </div>

        <div class="dropdown" :style="this.path=='balcao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
          <DropBalcao :path="this.path"></DropBalcao>
        </div>

      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center" v-if="this.token">
        
        <Notificacao ></Notificacao>

        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>

      </div>

      

      <div class="d-flex align-center" v-if="this.nivel=='Administrador'||this.nivel=='Secretário'">

        <div class="dropdown" :style="this.path=='gestao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
          <DropGestao :path="this.path"></DropGestao>
        </div>  

        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>
      </div>

      <div class="d-flex align-center" v-if="this.nivel=='Administrador'">
        
        <router-link to="/utilizadores/privilegios" class="titulo">
          <div class="d-flex align-center">
              <b :style="this.path=='utilizadores'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Utilizadores</b>
          </div>
        </router-link>

        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>
      </div>
      
      <router-link to="/perfil" style="text-decoration: none;">
        <div class="d-flex align-center" style="margin-right:10px; ">
          <b :style="this.path=='perfil'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'"> {{nome.split(' ')[0]}} </b>
        </div>
      </router-link>

      <div v-if="this.token" class="dropdown">
          <Dropdown :path="this.path"></Dropdown>
      </div>
      <div v-else>
          <Login :isOpen="false" :show="true"></Login>
      </div>

    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import Login from '@/views/Login.vue';
import Dropdown from '@/components/Dropdown.vue';
import DropBalcao from '@/components/DropBalcao.vue';
import DropGestao from '@/components/DropGestao.vue';
import Notificacao from '@/components/Notificacao.vue';
import jwt from 'jsonwebtoken';
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      token: localStorage.getItem('jwt'),
      nivel: "",
      nome: "",
      path: window.location.pathname.split('/')[1]
    }
  },
  components: {
    Login,
    Dropdown,
    DropBalcao,
    DropGestao,
    Notificacao
  },
  watch: {
    $route() {
      this.path = window.location.pathname.split('/')[1]
    }
  },
  created(){
    if (this.token) {
      axios.get("http://localhost:3333/users/validar/" + this.token)
        .then( () => {
          this.nivel = jwt.decode(this.token).nivel
          this.nome = jwt.decode(this.token).nome
        })
        .catch(() => {
          localStorage.clear()
          window.location.pathname = '/'
          alert("A sua sessão foi expirada!")
        })
    }
  }
};
</script>


<style>

.titulo{
    text-decoration: none;
    font-size: 20px;
}

</style>


