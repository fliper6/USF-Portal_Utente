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

      <div class="separador">
        <v-img
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
      </div>
      
      <router-link to="/" class="titulo" >
        <div class="d-flex align-center">
        <span v-on:click="changePath('/')">
            <b :class="this.path=='/'? 'selected' : 'default'">Notícias</b>
        </span>
        </div>
      </router-link>

       <div class="separador">
        <v-img
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
      </div>

      <router-link to="/files" class="titulo">
        <div class="d-flex align-center">
        <span v-on:click="changePath('/files')">
            <b :class="this.path=='/files'? 'selected' : 'default'">Documentos</b>
        </span>
        </div>
      </router-link>

      <div class="separador">
        <v-img
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
      </div>

      <router-link to="/about" class="titulo">
        <div class="d-flex align-center">
        <span v-on:click="changePath('/about')">
            <b :class="this.path=='/about'? 'selected' : 'default'">Encontre-nos</b>
        </span>
        </div>
      </router-link>
      
      <div class="d-flex align-center" v-if="this.nivel!='admin'">
        
        <div class="separador">
          <v-img
              class="shrink mr-2"
              contain
              src="@/assets/separador.png"
              width="3"
            />
        </div>

        <router-link to="/balcao" class="titulo">
          <div class="d-flex align-center">
          <span v-on:click="changePath('/balcao')">
              <b :class="this.path=='/balcao'? 'selected' : 'default'">Balcão Eletrónico</b>
          </span>
          </div>
        </router-link>

      </div>

      
      <div class="d-flex align-center" v-if="this.nivel=='admin'">
        <div class="separador">
        <v-img
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
        </div>

        <router-link to="/medicacao" class="titulo">
          <div class="d-flex align-center">
          <span v-on:click="changePath('/medicacao')">
              <b :class="this.path=='/medicacao'? 'selected' : 'default'">Medicação</b>
          </span>
          </div>
        </router-link>

        <div class="separador">
          <v-img
              class="shrink mr-2"
              contain
              src="@/assets/separador.png"
              width="3"
            />
        </div>

        <router-link to="/consultas" class="titulo">
          <div class="d-flex align-center">
          <span v-on:click="changePath('/consultas')">
              <b :class="this.path=='/consultas'? 'selected' : 'default'">Consultas</b>
          </span>
          </div>
        </router-link>

        
        <div class="separador">
          <v-img
              class="shrink mr-2"
              contain
              src="@/assets/separador.png"
              width="3"
            />
        </div>

        <router-link to="/sugestoes" class="titulo">
          <div class="d-flex align-center">
          <span v-on:click="changePath('/sugestoes')">
              <b :class="this.path=='/sugestoes'? 'selected' : 'default'">Sugestões</b>
          </span>
          </div>
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center" v-if="this.nivel=='admin'">
        
        <router-link to="/utilizadores/privilegios" class="titulo">
          <div class="d-flex align-center">
          <span v-on:click="changePath('/utilizadores/privilegios')">
              <b :class="this.path=='/utilizadores/privilegios'? 'selected' : 'default'">Utilizadores</b>
          </span>
          </div>
        </router-link>

        <div class="separador">
          <v-img
              class="shrink mr-2"
              contain
              src="@/assets/separador.png"
              width="3"
            />
        </div>

      </div>
      

      <div v-if="this.token" class="dropdown">
          <Dropdown @clicked="changePath" :path="this.path.split('/')[1]"></Dropdown>
      </div>
      <div v-else>
          <Login></Login>
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
import jwt from 'jsonwebtoken';
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      token: localStorage.getItem('jwt'),
      nivel: "",
      path: window.location.pathname
    }
  },
  components: {
    Login,
    Dropdown
  },
  methods: {
    changePath(newPath) {
      this.path = newPath
    }
  },
  created(){
    if (this.token) {
      this.nivel = jwt.decode(this.token).nivel
      axios.get("http://localhost:3333/users/validar/" + this.token)
        .then( () => {
          console.log(this.nivel)
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

.separador{
    margin-left: 10px;
    margin-right: 10px;
}

.titulo{
    text-decoration: none;
    font-size: 20px;
}

.selected{
    color: #800000;
}

.default{
    color: #595959;
}
</style>


