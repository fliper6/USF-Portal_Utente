<template>
    <div class="pedidoS">
        <v-card flat color="var(--grey1-color)" style="font-size:120%;">
          <v-container>
                <h1 style="color:var(--primary-color)">Sugestões</h1>
                <v-row justify="center">
                  <v-col class="text-right">
                    <v-btn depressed @click="color1=1; color2=0; lista=sugestao" v-bind:color="color1 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Sugestões Pendetes</v-btn>
                    <v-btn depressed @click="color1=0; color2=1; lista=sugestao_r" v-bind:color="color2 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Sugestões Respondidas</v-btn>
                  </v-col>
                </v-row>
          </v-container>
          <v-container>
                <v-divider/>
            </v-container>
          <div v-if="this.lista.length > 0">
        <v-container v-for="(item,index) in lista" v-bind:key="item.id">
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
          <v-col class="text-right" cols=2 v-if="item.estado===0">
  
                <!-- MODAL DE RESPONDER ÀS SUGESTÕES -->
                <v-dialog v-model="dialog"  width="500">
                  
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      depressed 
                      style="background-color:var(--secondary-color)"
                      @click="editSug(item.titulo,item.descricao)"
                    >
                      Responder
                    </v-btn>
                  </template>
  
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      Resposta
                    </v-card-title>
  
                    <v-container style="padding:20px;">
    
                      <!-- DESCRIÇÃO -->
                      <v-textarea 
                        label="Resposta" 
                        v-model="descricao">
                      </v-textarea>
                    </v-container>
  
                    <v-divider></v-divider>
  
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn class="button-cancelar" text @click="dialog = false"> Cancelar </v-btn>
                      <v-btn class="button-confirmar" text @click="saveSug(item._id)"> Confirmar </v-btn>
                    </v-card-actions> 
                  </v-card>
                </v-dialog>
              </v-col>
        </v-row>
        <v-row v-if="item.estado===1">
          <v-col cols=1><v-divider class="divisor" vertical></v-divider></v-col>
          <v-col>
            <v-row >
              <v-col> {{item.resposta}} </v-col>
            </v-row>
            <v-row>
              <v-col class="text-subtitle-2"> {{item.data_resposta.split('T')[0]}} </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="lista.length > 1 && index < lista.length - 1">
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
        sugestao:[], 
        sugestao_r :[],
        descricao:'', 
        lista:'', 
        color1: 1,
        color2: 0,
      }
    },
    created(){
        if (this.token) {
          axios.get("http://localhost:3333/sugestao/" , {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              data.data.forEach(element => {
                if(element.estado === 1){
                  this.sugestao_r.push(element)
                }
                else{
                  this.sugestao.push(element)
                }
              });
            })
            .catch(err => {
              console.log(err)
            })

            this.lista = this.sugestao
        }
    },
    methods: {
      saveSug(id){
        var data = {}
        data['_id'] = id
        data['resposta'] = this.descricao
        data['data_resposta'] = Date.now()
        data['estado'] = 1
        axios.put("http://localhost:3333/sugestao",data , {headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
}

</script>

<style>

.divisor {
  max-width: 100px !important;
  width: 30px !important;
    border-width: 0 4px 0 0 !important;

}
</style>