<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-icon 
              v-bind="attrs"
              v-on="on"
              size="50"
              :color="path=='/perfil'? '#800000' : '#595959'"
            >
              mdi-account-circle-outline
            </v-icon>
        </template>
        <v-list style="padding:0">
          <router-link class="opcao" :to="'/perfil'">
            <v-list-item class="opcao">
                <span v-on:click="changePath('/perfil')">
                    <b>Perfil</b>
                </span>
            </v-list-item>
          </router-link>
          <v-list-item class="opcao" v-on:click="handleLogout()" href="/">
            <b>Terminar Sessão</b>
          </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>

    export default {
        name: "dropdown",
        data: () => ({
            token: localStorage.getItem('jwt'),
        }),
        props: {
          path: String
        },
        methods: {
            handleLogout() {
                localStorage.clear();
            },
            changePath (pathname) {
              this.$emit('clicked', pathname)
            }
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