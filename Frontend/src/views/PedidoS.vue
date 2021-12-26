<template>
    <div class="pedidoS">
        <v-card flat color="var(--grey1-color)" style="font-size:120%;">
          <v-container>
                <h1 style="color:var(--primary-color)">Sugestões</h1>
          </v-container>
          <v-container>
                <v-divider/>
            </v-container>
          <div v-if="this.sugestao.length > 0">
        <v-container v-for="(item,index) in sugestao" v-bind:key="item.id">
        <v-row>
          <v-col>
            <h3>{{item.titulo}}</h3>
          </v-col>
        </v-row>
        <div class="text-caption">{{item.data_criacao.split('T')[0]}}</div>
        <v-row>
          <v-col>
            {{item.descricao}}
          </v-col> 
        </v-row>
        <v-row v-if="sugestao.length > 1 && index < sugestao.length - 1">
          <v-col><v-divider>

          </v-divider></v-col>
          
        </v-row>
        
      </v-container>
      </div>
      <div v-else>
        <v-container>
          <v-row>
            <v-col>
              <h2 style="text-align:center;">Não existem sugestões</h2>
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
    name: "Sugestao",
    data() {
      return {
        token: localStorage.getItem('jwt'),
        sugestao:'',   
      }
    },
    created(){
        if (this.token) {
          axios.get("http://localhost:3333/sugestao/" , {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              this.sugestao = data.data
              console.log(data.data)
            })
            .catch(err => {
              console.log(err)
            })
        } 
    }
}

</script>

<style>

</style>