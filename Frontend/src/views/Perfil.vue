  <!-- Vue SFC -->
<template>
  <div class="perfil">
    <v-container v-if="!this.editar">
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
            <h3>Número SNS : <span class="infos">{{this.num}}</span></h3>
          </v-row>
          <v-row>
            <h3>Email : <span class="infos">{{this.email}}</span></h3>
          </v-row>
        </v-col>
        <v-col>
          <v-btn icon @click="edita"><v-icon dark>
          mdi-pencil
        </v-icon></v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-divider/>
      </v-row>
      
    </v-container>
    <v-container v-else>
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
            <v-text-field
            v-model="nome"
            label="Nome"
            required
          ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
            v-model="num"
            label="Número SNS"
            required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
            v-model="email"
            label="E-Mail"
            required
          ></v-text-field>
          </v-row>
        </v-col>
        <v-col>
          <v-btn icon @click="save"><v-icon dark>
          mdi-content-save
        </v-icon></v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-divider/>
      </v-row>
      
    </v-container>
    <v-container v-if="this.nivel=== 'Utente'">
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
            <v-col>
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
      <div v-if="this.list.length > 0">
        <v-container v-for="(item,index) in list" v-bind:key="item.id">
        <v-row>
          <v-col>
            <h3 v-if="!med">{{item.data_criacao.split('T')[0]}}</h3>
            <h3 v-if="!cons">{{item.nome}}</h3>
            <h3 v-if="!sug">{{item.titulo}}</h3>
          </v-col>
        </v-row>
        <div class="text-caption" v-if="!sug">{{item.data_criacao.split('T')[0]}}</div>
        <div class="text-caption" v-if="!cons">Tipo : {{item.tipo}}</div>
        <v-row>
          <v-col v-if="!med">
            {{item.medicacao}}
          </v-col>
          <v-col v-if="!cons">
            {{item.medico}}
          </v-col>
          <v-col v-if="!sug">
            {{item.descricao}}
          </v-col>
          <v-col class="text-right" v-if="!med">
            <v-btn depressed color="var(--grey2-color)">Cancelar Pedido</v-btn>
          </v-col>
          <v-col class="text-right" v-if="!cons">
            <div v-if="item.estado === 0" style="color:var(--grey3-color)">Pedido Pendente</div>
            <div v-if="item.estado === 1" style="color:var(--secondary-dark-color)">Consulta Aceite</div>
            <div v-if="item.estado === 2" style="color:var(--primary-color)">Consulta Recusada</div>
          </v-col>
        </v-row>
        <v-row v-if="list.length > 1 && index < list.length - 1">
          <v-col><v-divider>

          </v-divider></v-col>
          
        </v-row>
        
      </v-container>
      </div>
      <div v-else>
        <v-container>
          <v-row>
            <v-col>
              <h2 v-if="!med || !cons" style="text-align:center;">Não existem pedidos</h2>
              <h2 v-else style="text-align:center;">Não existem sugestões</h2>
            </v-col>
          </v-row>
        </v-container>
      </div>
      
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
        meds:'',
        consulta:'',
        sugestao:'',
        editar:false,
        list:'',
        
      }
    },
    created(){
    if (this.token) {
      this.id = jwt.decode(this.token)._id
      this.nome = jwt.decode(this.token).nome
      this.email = jwt.decode(this.token).email
      this.num = jwt.decode(this.token).nr_utente
      this.nivel = jwt.decode(this.token).nivel
      axios.get("http://localhost:3333/medicacao/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.meds = data.data
          this.list = this.meds
          console.log(data.data)
        })
        .catch(err => {
          console.log(err)
        })

      axios.get("http://localhost:3333/consultas/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.consulta = data.data
          console.log(data.data)
        })
        .catch(err => {
          console.log(err)
        })
      axios.get("http://localhost:3333/sugestao/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.sugestao = data.data
          console.log(data.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    },
    methods: {
    pedidoM() {
      this.list = this.meds
      this.med = false
      this.cons = true
      this.sug = true
    },
    pedidoC() {
      this.med = true
      this.cons = false
      this.sug = true
      this.list = this.consulta
    },
    sugestoes() {
      this.med = true
      this.cons = true
      this.sug = false
      this.list = this.sugestao
    },
    edita(){
      this.editar = true
    },
    save(){
      var data = {}
      data['nome'] = this.nome
      data['nr_utente'] = this.num
      data['email'] = this.email
      axios.put("http://localhost:3333/users/alterar/" + this.id, data,{headers:{'authorization':'Bearer '+ this.token}})
        .then(data => {
          localStorage.setItem('jwt',data.data.token)
        })
        .catch(err => {
          console.log(err)
        })
      this.editar = false
      //this.$router.go()
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
