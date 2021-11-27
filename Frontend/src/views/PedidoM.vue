<template>
    <div class="pedidoM">
        <v-card flat color="var(--grey1-color)">
            <v-container>
                <h1>Pedidos de Medicação</h1>
            </v-container>
            <v-container>
                <v-divider/>
            </v-container>
            <div v-if="this.medicacao.length > 0">
              <v-container v-for="(item,index) in medicacao" v-bind:key="item.id">
              <v-row>
                <v-col><h3>{{item.data_criacao.split('T')[0]}}</h3></v-col>
              </v-row>
              <v-row>
                <v-col>
                  {{item.medicacao}}
                </v-col>
                <v-col class="text-right">
                  <v-btn depressed color="var(--grey2-color)">Cancelar Pedido</v-btn>
                </v-col>
              </v-row>
              <v-row v-if="medicacao.length > 1 && index < medicacao.length - 1">
                <v-col><v-divider>
                
                </v-divider></v-col>

              </v-row>

            </v-container>
            </div>
            <div v-else>
              <v-container>
                <v-row>
                  <v-col>
                    <h2 style="text-align:center;">Não existem pedidos</h2>
                  </v-col>
                </v-row>
              </v-container>
            </div>

      </v-card>
    </div>
</template>

<script>
import axios from 'axios'


  //npm install --save @riophae/vue-treeselect
  export default {
    name: "PedidoM",
    data() {
      return {
        token: localStorage.getItem('jwt'),
        medicacao:'',
        
      }
    },
    created(){
    if (this.token) {
      axios.get("http://localhost:3333/medicacao/" , {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.medicacao = data.data
          console.log(data.data)
        })
        .catch(err => {
          console.log(err)
        })

      
    }
    },
    methods: {
    
  }
  
  }
</script>