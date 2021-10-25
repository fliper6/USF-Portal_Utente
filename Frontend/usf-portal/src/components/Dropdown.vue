<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-icon 
              v-bind="attrs"
              v-on="on"
              size="50"
            >
              mdi-account-circle-outline
            </v-icon>
        </template>
        <v-list style="padding:0">
          <v-list-item class="opcao">
            <router-link class="opcao" :to="'/utilizador/' + email">
                <b>Perfil</b>
            </router-link>
          </v-list-item>
          <v-list-item class="opcao">
            <a class="opcao" v-on:click="handleLogout()" href="/">
                <b>Logout</b>
            </a>
          </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
//import jwt from 'jsonwebtoken'
    export default {
        name: "dropdown",
        data() {
          return {
            token: localStorage.getItem('jwt'),
            email: "joaobarreiro@gmail.com"
          }
        },
        created() {
        },
        methods: {
            handleLogout() {
                localStorage.clear();
            },
        },
          
    }
</script>

<style>

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