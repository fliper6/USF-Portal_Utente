<template>
    <v-menu offset-y>

        <!-- BOTÃO DROPDOWN -->
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center titulo" v-bind="attrs" v-on="on">
            <b>Gestão</b>
            <v-icon size="16" :color="path=='gestao'? '#800000' : '#595959'">mdi-arrow-down</v-icon>
          </div>
        </template>

        <!-- LISTA DROPDOWN -->
        <v-list style="padding:0">

          <!-- PEDIDO MEDICAÇÃO -->
          <router-link class="opcao" :to="'/gestao/medicacao'">
            <v-list-item class="opcao">
              <b>Pedidos de medicação</b>
            </v-list-item>
          </router-link>

          <!-- PEDIDO CONTACTO -->
          <router-link class="opcao" :to="'/gestao/consulta'">
            <v-list-item class="opcao">
              <b>Pedidos de contacto</b>
            </v-list-item>
          </router-link>

          <!-- MÉDICOS -->
          <router-link class="opcao" :to="'/gestao/medicos'">
            <v-list-item class="opcao">
              <b>Médicos</b>
            </v-list-item>
          </router-link>

          <!-- NOTÍCIAS -->
          <router-link class="opcao" :to="'/gestao/noticias'">
            <v-list-item class="opcao">
              <b>Notícias</b>
            </v-list-item>
          </router-link>

          <router-link class="opcao" :to="'/gestao/programacao'">
            <v-list-item class="opcao">
              <b>Programação de notícias</b>
            </v-list-item>
          </router-link>          

          <!-- DOCUMENTOS -->
          <router-link class="opcao" :to="'/gestao/documentos'">
            <v-list-item class="opcao">
              <b>Documentos</b>
            </v-list-item>
          </router-link>

          <!-- CATEGORIAS -->
          <router-link class="opcao" :to="'/gestao/categorias'">
            <v-list-item class="opcao">
              <b>Categorias</b>
            </v-list-item>
          </router-link>

          <!-- SUGESTÕES -->
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


<style scoped>

</style>