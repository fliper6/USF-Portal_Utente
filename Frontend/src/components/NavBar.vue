<template>
  <v-app >
    <v-app-bar
    app
    color="white"
    >
      <router-link to="/">
        <div class="d-flex align-center">
        <v-img
          v-on:click="changePath('/')"
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
        <span v-on:click="changePath('/')">
            <b :style="this.path=='/'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Notícias</b>
        </span>
        </div>
      </router-link>

      <div style="height:40px; margin: 0px 15px;">
        <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
      </div>

      <router-link to="/documentos" class="titulo">
        <div class="d-flex align-center">
        <span v-on:click="changePath('/documentos')">
            <b :style="this.path=='/documentos'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Documentos</b>
        </span>
        </div>
      </router-link>

      <div style="height:40px; margin: 0px 15px;">
        <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
      </div>

      <router-link to="/about" class="titulo">
        <div class="d-flex align-center">
        <span v-on:click="changePath('/about')">
            <b :style="this.path=='/about'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Encontre-nos</b>
        </span>
        </div>
      </router-link>
      
      <div class="d-flex align-center">
        
      <div style="height:40px; margin: 0px 15px;">
        <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
      </div>

        <div class="dropdown" :style="this.path.split('/')[1]=='balcao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
          <DropBalcao @clicked="changePath" :path="this.path.split('/')[1]"></DropBalcao>
        </div>

      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center" v-if="this.nivel=='Administrador'||this.nivel=='Secretário'">

        <div class="dropdown" :style="this.path.split('/')[1]=='gestao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
          <DropGestao @clicked="changePath" :path="this.path.split('/')[1]"></DropGestao>
        </div>  

        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>
      </div>

      <div class="d-flex align-center" v-if="this.nivel=='Administrador'">
        
        <router-link to="/utilizadores/privilegios" class="titulo">
          <div class="d-flex align-center">
          <span v-on:click="changePath('/utilizadores/privilegios')">
              <b :style="this.path=='/utilizadores/privilegios'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Utilizadores</b>
          </span>
          </div>
        </router-link>

        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>
      </div>
      
      <router-link to="/perfil" style="text-decoration: none;">
        <div v-on:click="changePath('/perfil')" class="d-flex align-center" style="margin-right:10px; ">
          <b :style="this.path=='/perfil'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'"> {{nome.split(' ')[0]}} </b>
        </div>
      </router-link>

      <div v-if="this.token" class="dropdown">
          <Dropdown @clicked="changePath" :path="this.path"></Dropdown>
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
import jwt from 'jsonwebtoken';
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      token: localStorage.getItem('jwt'),
      nivel: "",
      nome: "",
      path: window.location.pathname
    }
  },
  components: {
    Login,
    Dropdown,
    DropBalcao,
    DropGestao
  },
  methods: {
    changePath(newPath) {
      this.path = newPath
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


