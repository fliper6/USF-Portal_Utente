<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center titulo" v-bind="attrs" v-on="on">
            <b>Gestão</b>
            <v-icon size="16" :color="path=='gestao'? '#800000' : '#595959'">mdi-arrow-down</v-icon>
          </div>
        </template>

        <v-list style="padding:0">
          <router-link class="opcao" :to="'/gestao/medicacao'">
            <v-list-item class="opcao">
              <b>Pedidos de medicação</b>
            </v-list-item>
          </router-link>
          <router-link class="opcao" :to="'/gestao/consulta'">
            <v-list-item class="opcao">
              <b>Pedidos de consulta</b>
            </v-list-item>
          </router-link>
          <router-link class="opcao" :to="'/gestao/medicos'">
            <v-list-item class="opcao">
              <b>Médicos</b>
            </v-list-item>
          </router-link>
          <router-link class="opcao" :to="'/gestao/noticias'">
            <v-list-item class="opcao">
              <b>Notícias</b>
            </v-list-item>
          </router-link>
          <router-link class="opcao" :to="'/gestao/sugestao'">
            <v-list-item class="opcao">
              <b>Sugestões</b>
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
        }        
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