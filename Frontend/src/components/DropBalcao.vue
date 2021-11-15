<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center titulo" v-bind="attrs" v-on="on">
            <b>Balcão Eletrónico</b>
            <v-icon size="16" :color="path=='balcao'? '#800000' : '#595959'">mdi-arrow-down</v-icon>
          </div>
        </template>

        <v-list style="padding:0">
          <v-list-item class="opcao">
            <router-link class="opcao" :to="'/balcao/medicacao'">
                <span v-on:click="changePath('/balcao')">
                    <b>Pedido de medicação</b>
                </span>
            </router-link>
          </v-list-item>
          <v-list-item class="opcao">
            <router-link class="opcao" :to="'/balcao/consulta'">
                <span v-on:click="changePath('/balcao')">
                    <b>Pedido de consulta</b>
                </span>
            </router-link>
          </v-list-item>
          <v-list-item class="opcao">
            <router-link class="opcao" :to="'/balcao/sugestao'">
                <span v-on:click="changePath('/balcao')">
                    <b>Sugestão</b>
                </span>
            </router-link>
          </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
    export default {
        name: "dropbalcao",
        data: () => ({
            token: localStorage.getItem('jwt'),
        }),
        props: {
          path: String
        },
        methods: {
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