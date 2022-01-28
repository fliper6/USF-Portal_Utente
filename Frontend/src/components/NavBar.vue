<template>
  <v-app >
    
    <!-- MODAL DE ERRO -->
    <modal-message
      title="Erro"
      :visible="modalErro"
      @close="close()"
    >
      A sua sessão foi expirada!
    </modal-message>


    <v-app-bar app color="white">

      <v-app-bar-nav-icon @click="drawer = true" class="d-flex d-md-none"></v-app-bar-nav-icon>
      
      <!-- CASO SEJA PC -->
      <div class="d-none d-md-flex align-center">

        <!-- LOGO -->
        <router-link to="/">
          <v-img
            class="shrink mr-2"
            contain
            src="@/assets/logo.png"
            width="60"
          />
        </router-link>

        <!-- SEPARADOR -->
        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>

        <!-- NOTICIAS -->
        <router-link to="/" class="titulo" >
          <b :style="this.path==''? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Notícias</b>
        </router-link>

        <!-- SEPARADOR -->
        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>

        <!-- DOCUMENTOS -->
        <router-link to="/documentos" class="titulo">
          <b :style="this.path=='documentos'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Documentos</b>
        </router-link>

        <!-- SEPARADOR -->
        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>

        <!-- ENCONTRE-NOS -->
        <router-link to="/contactos" class="titulo">
          <b :style="this.path=='contactos'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Encontre-nos</b>
        </router-link>

        <!-- SEPARADOR -->
        <div style="height:40px; margin: 0px 15px;">
          <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
        </div>

        <!-- BALCAO ELETRONICO -->
        <div :style="this.path=='balcao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
          <DropBalcao :path="this.path"></DropBalcao>
        </div>

      </div>

      <v-spacer></v-spacer>

        <!-- APENAS PARA QUEM ESTÁ LOGGED IN -->
        <div v-if="this.token" class=" d-flex align-center">

          <!-- NOTIFICAÇÕES -->
          <Notificacao ></Notificacao>

          <!-- SEPARADOR -->
          <div style="height:40px; margin: 0px 15px;">
            <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
          </div>

        </div>
        
        <div v-if="this.token" class="d-none d-md-flex align-center">

          <!-- PARA QUEM TEM PRIVILÉGIOS ACIMA DE UTENTE -->
          <div v-if="this.nivel=='Administrador'||this.nivel=='Secretário'" class="d-none d-md-flex align-center">

            <!-- GESTÃO -->
            <div :style="this.path=='gestao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
              <DropGestao :path="this.path"></DropGestao>
            </div>  

            <!-- SEPARADOR -->
            <div style="height:40px; margin: 0px 15px;">
              <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
            </div>

          </div>

          <!-- PARA QUEM TEM PRIVILÉGIOS DE ADMIN -->
          <div v-if="this.nivel=='Administrador'" class="d-none d-md-flex align-center">

            <!-- UTILIZADORES -->
            <router-link to="/utilizadores/privilegios" class="titulo">
              <b :style="this.path=='utilizadores'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Utilizadores</b>
            </router-link>

            <!-- SEPARADOR -->
            <div style="height:40px; margin: 0px 15px;">
              <v-divider vertical style="border-width: 1px !important; border-color: var(--grey2-color) !important;"/>
            </div>

          </div>

        </div>


        <div div v-if="this.token" class="d-flex align-center">
        
          <!-- NOME -->
          <router-link to="/perfil" style="text-decoration: none;">
            <div style="margin-right:10px; ">
              <b :style="this.path=='perfil'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'"> {{nome.split(' ')[0]}} </b>
            </div>
          </router-link>

          <!-- DROPDOWN -->
          <Dropdown :path="this.path"></Dropdown>

        </div>

        <!-- PARA QUEM NÃO ESTÁ LOGGED IN -->
        <div v-else>
            <Login :isOpen="false" :show="true"></Login>
        </div>


      

      <!-- CASO SEJA TELEMOVEL -->

      <v-navigation-drawer
        v-model="drawer"
        absolute
        :height="tam"
        temporary
      >
      <v-list nav dense>
        <v-list-item-group>

          <v-list-item>
            <router-link to="/" class="titulo" >
              <b :style="this.path==''? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Notícias</b>
            </router-link>
          </v-list-item>

          <v-list-item>
            <router-link to="/documentos" class="titulo">
              <b :style="this.path=='documentos'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Documentos</b>
            </router-link>
          </v-list-item>


          <v-list-item>
            <router-link to="/contactos" class="titulo">
              <b :style="this.path=='contactos'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Encontre-nos</b>
            </router-link>
          </v-list-item>


          <v-list-item>
            <div :style="this.path=='balcao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
              <DropBalcao :path="this.path"></DropBalcao>
            </div>
          </v-list-item>
          

          <v-list-item v-if="this.nivel=='Administrador'||this.nivel=='Secretário'">
            <div :style="this.path=='gestao'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">
              <DropGestao :path="this.path"></DropGestao>
            </div> 
          </v-list-item>


          <v-list-item  v-if="this.nivel=='Administrador'">
            <router-link to="/utilizadores/privilegios" class="titulo">
              <b :style="this.path=='utilizadores'? 'color: var(--primary-color)' : 'color: var(--grey3-color)'">Utilizadores</b>
            </router-link>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer> 


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
import ModalMessage from '../components/ModalMessage.vue'; 
import jwt from 'jsonwebtoken';
import axios from 'axios'
const host = require('../../../config.json').backend
export default {
  name: 'App',
  data () {
    return {
      token: localStorage.getItem('jwt'),
      nivel: "",
      nome: "",
      path: window.location.pathname.split('/')[1],
      modalErro: false,
      drawer: false,
      tam: window.innerHeight
    }
  },
  components: {
    Login,
    Dropdown,
    DropBalcao,
    DropGestao,
    Notificacao,
    ModalMessage
  },
  watch: {
    $route() {
      this.path = window.location.pathname.split('/')[1]
      if (this.token) {
        axios.get(host + "/users/validar/" + this.token)
        .then( () => {
          this.nivel = jwt.decode(this.token).nivel
          this.nome = jwt.decode(this.token).nome
        })
        .catch(() => { 
          this.modalErro=true
        })
      }
    }
  },
  methods: {
    close(){
      localStorage.clear()
      window.location.pathname = '/'
    }
  },
  created(){
    if (this.token && !(window.location.pathname == 'recuperacao/password' || window.location.pathname ==  '/alterarEmail/confirmar' || window.location.pathname ==  '/alterarEmail/cancelar')) {
      axios.get(host + "/users/validar/" + this.token)
        .then( () => {
          this.nivel = jwt.decode(this.token).nivel
          this.nome = jwt.decode(this.token).nome
        })
        .catch(() => { 
          this.modalErro=true
        })
    }
  }
};
</script>


<style>
/** TITULO E OPCAO SÃO USADOS DENTRO DOS COMPONENTES DE DROPDOWN */ 

.titulo{
    text-decoration: none;
    font-size: 20px;
}

.opcao {
  text-decoration: none;
}

.opcao b{
  color:#595959
}

.opcao:hover{
  background-color: #ddd;
}

</style>


