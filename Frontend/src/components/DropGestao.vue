<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center titulo" v-bind="attrs" v-on="on">
            <b>Gestão de Pedidos</b>
            <v-icon size="16" :color="path=='gestao'? '#800000' : '#595959'">mdi-arrow-down</v-icon>
          </div>
        </template>

        <v-list style="padding:0">
          <router-link class="opcao" :to="'/gestao/medicacao'">
            <v-list-item class="opcao">
                <span v-on:click="changePath('/gestao')">
                    <b>Pedidos de medicação</b>
                </span>
            </v-list-item>
          </router-link>
          <router-link class="opcao" :to="'/gestao/consulta'">
            <v-list-item class="opcao">
                <span v-on:click="changePath('/gestao')">
                    <b>Pedidos de consulta</b>
                </span>
            </v-list-item>
          </router-link>
          <router-link class="opcao" :to="'/gestao/sugestao'">
            <v-list-item class="opcao">
                <span v-on:click="changePath('/gestao')">
                    <b>Sugestões</b>
                </span>
            </v-list-item>
        </router-link>
        </v-list>
    </v-menu>
</template>

<script>
    export default {
        name: "dropgestao",
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