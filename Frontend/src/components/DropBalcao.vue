<template>
    <v-menu offset-y>

        <!-- BOTÃO DROPDOWN -->
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-center titulo" v-bind="attrs" v-on="on">
            <b>Balcão Eletrónico</b>
            <v-icon size="16" :color="path=='balcao'? '#800000' : '#595959'"> mdi-arrow-down </v-icon>
          </div>
        </template>

        <!-- LISTA DROPDOWN -->
        <v-list style="padding:0">

          <!-- PEDIDO MEDICAÇÃO -->
          <router-link class="opcao" :to="'/balcao/medicacao'">
            <v-list-item class="opcao">
              <b>Pedido de medicação</b>
            </v-list-item>
          </router-link>

          <!-- PEDIDO CONTACTO -->
          <router-link class="opcao" :to="'/balcao/consulta'">
            <v-list-item class="opcao">
              <b>Pedido de contacto</b>
            </v-list-item>
          </router-link>

          <!-- SUGESTÃO -->
          <router-link class="opcao" :to="'/balcao/sugestao'">
            <v-list-item class="opcao">
              <b>Sugestão</b>
            </v-list-item>
          </router-link>

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
        }       
    }
</script>


<style scoped>

</style>