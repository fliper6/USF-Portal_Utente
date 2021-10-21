<template>
  <v-app>
    <v-app-bar
    app
    >
      <router-link to="/">
        <div class="d-flex align-center">
        <v-img
          v-on:click="changeColor('/')"
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          width="60"
        />
        </div>
      </router-link>

      <div class="separador">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
      </div>
      
      <router-link to="/" class="titulo" >
        <div class="d-flex align-center">
        <span v-on:click="changeColor('/')">
            <b :class="this.color=='/'? 'selected' : 'default'">Notícias</b>
        </span>
        </div>
      </router-link>

       <div class="separador">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
      </div>

      <router-link to="/files" class="titulo">
        <div class="d-flex align-center">
        <span v-on:click="changeColor('/files')">
            <b :class="this.color=='/files'? 'selected' : 'default'">Ficheiros</b>
        </span>
        </div>
      </router-link>

      <div class="separador">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
      </div>

      <router-link to="/about" class="titulo">
        <div class="d-flex align-center">
        <span v-on:click="changeColor('/about')">
            <b :class="this.color=='/about'? 'selected' : 'default'">Encontre-nos</b>
        </span>
        </div>
      </router-link>

      <div class="separador">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/separador.png"
            width="3"
          />
      </div>

      <router-link to="/balcao" class="titulo">
        <div class="d-flex align-center">
        <span v-on:click="changeColor('/balcao')">
            <b :class="this.color=='/balcao'? 'selected' : 'default'">Balcão Eletrónico</b>
        </span>
        </div>
      </router-link>

      <v-spacer></v-spacer>
      <div v-if="this.token" class="dropdown">
        <Dropdown></Dropdown>
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
import Dropdown from '@/components/Dropdown.vue'
export default {
  name: 'App',
  data: () => ({
    token:localStorage.getItem('jwt'),
    color: '/'
  }),
  components: {
    Login,
    Dropdown
  },
  methods: {
      changeColor(path) {
          this.color = path
          console.log(this.color)
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


