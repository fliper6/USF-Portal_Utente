  <!-- Vue SFC -->
<template>
  <div class="perfil">
    <v-container>
      <v-row>
        <v-col offset =2 cols=2>
          <v-avatar size=120>
            <v-icon dark size=120 color="var(--grey3-color)">
              mdi-account-circle-outline
            </v-icon>
          </v-avatar>
        </v-col>
        <v-col>
          <v-row>
            <h1>{{this.nome}}</h1>
          </v-row>
          <v-row>
            <h3>Número SNS:<span class="infos">{{this.num}}</span></h3>
          </v-row>
          <v-row>
            <h3>Email:<span class="infos">{{this.email}}</span></h3>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-divider/>
      </v-row>
      
    </v-container>
    <v-container>
      <v-card flat color="var(--grey1-color)">
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="med ? 'var(--grey2-color)' : 'var(--secondary-color)'"
                @click="pedidoM"
              >
                Pedidos de Medicação
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="cons ? 'var(--grey2-color)' : 'var(--secondary-color)'"
                @click="pedidoC"
              >
                Pedidos de Consulta
              </v-btn>
            </v-col>
            <v-col v-if="this.nivel=='utente'">
              <v-btn
                block
                depressed
                v-bind:color="sug ? 'var(--grey2-color)' : 'var(--secondary-color)'"
                @click="sugestoes"
              >
                Sugestões
              </v-btn>
            </v-col>
          </v-row>
        
      </v-card-actions>
      <v-container>
        <v-row>
          <v-col><h3>09/11/21</h3></v-col>
        </v-row>
        <v-row>
          <v-col>
            Metformina 500 mg, 60 comprimidos, 2 caixas
          </v-col>
          <v-col class="text-right">
            <v-btn depressed color="var(--grey2-color)">Cancelar Pedido</v-btn>
          </v-col>
        </v-row>
      </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import jwt from 'jsonwebtoken';
import axios from 'axios'


  //npm install --save @riophae/vue-treeselect
  export default {
    name: "Perfil",
    data() {
      return {
        value: null,
        token: localStorage.getItem('jwt'),
        med:false,
        cons:true,
        sug:true,
        id:'',
        nome:'',
        num:'',
        email:'',
        nivel:'',
        medicacao:'',
        
      }
    },
    created(){
    if (this.token) {
      this.id = jwt.decode(this.token)._id
      this.nome = jwt.decode(this.token).nome
      console.log('oi')
      this.email = jwt.decode(this.token).email
      this.num = jwt.decode(this.token).nr_utente
      this.nivel = jwt.decode(this.token).nivel
      axios.get("http://localhost:3333/medicacao/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.medicacao = data.data
          console.log(data.data)
        })
        .catch(() => {
        })
    }
    },
    methods: {
    pedidoM() {
      this.med = false
      this.cons = true
      this.sug = true
    },
    pedidoC() {
      this.med = true
      this.cons = false
      this.sug = true
    },
    sugestoes() {
      this.med = true
      this.cons = true
      this.sug = false
    }
  }
  
  }
</script>

<style>
.infos {
  font-weight: normal;
}

.divider {
  margin-top: 100px;
}
</style>
