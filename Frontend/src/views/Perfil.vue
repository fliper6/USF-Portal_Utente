  <!-- Vue SFC -->
<template>
  <div class="perfil">
    <v-container v-if="!this.editar">
      <v-card flat color="var(--grey1-color)">
          <v-card-title>
            <h1>{{this.nome}}</h1>
          </v-card-title>
          <v-card-text class="texto_perfil">
            <h3>Número SNS : <span class="infos">{{this.num}}</span></h3>
            <h3 style="margin:10px 0 0 0">Email : <span class="infos">{{this.email}}</span></h3>
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed @click="edita" style="background-color:var(--secondary-color)">
          Editar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-container v-else>
      <v-card flat color="var(--grey1-color)">
        <v-row>
        <v-col offset=1 cols=10>
            <v-text-field
            v-model="nome"
            label="Nome"
            required
            class="texto_perfil"
          ></v-text-field>
            <v-text-field
            v-model="num"
            label="Número SNS"
            required
            class="texto_perfil"
            ></v-text-field>
            <v-text-field
            v-model="email"
            label="E-Mail"
            required
            class="texto_perfil"
          ></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="save" style="background-color:var(--secondary-color)">
          Guardar
          </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
      </v-card>
    </v-container>
    
    <v-container v-if="this.nivel=== 'Utente'">
      <v-card flat color="var(--grey1-color)" style="font-size:120%;">
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
        <v-container v-for="(item,index) in list" v-bind:key="item.id" >
        <v-row :ref="item._id" v-if="item._id != ide">
          <v-col>
            <h3 v-if="!med">{{item.data_criacao.split('T')[0]}}</h3>
            <h3 v-if="!cons">{{item.nome}}</h3>
            <h3 v-if="!sug">{{item.titulo}}</h3>
          </v-col>
        </v-row>
        <v-row :ref="item._id" v-else>
          <v-col>
            <h2 class="noti" v-if="!med">{{item.data_criacao.split('T')[0]}}</h2>
            <h2 class="noti" v-if="!cons">{{item.nome}}</h2>
            <h2 class="noti" v-if="!sug">{{item.titulo}}</h2>
          </v-col>
        </v-row>
        <div class="text-subtitle-2" v-if="!med">{{item.medico}}</div>
        <div class="text-caption" v-if="!sug">{{item.data_criacao.split('T')[0]}}</div>
        <div class="text-subtitle-2" v-if="!cons">Tipo : {{item.tipo}}</div>
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
            <v-btn depressed color="var(--grey2-color)" @click="deleteEstado(item._id)">Cancelar Pedido</v-btn>
          </v-col>
          <v-col class="text-right" v-if="!cons">
            <div v-if="item.estado === 0" style="color:var(--grey3-color)">Pedido Pendente</div>
            <div v-if="item.estado === 1" style="color:var(--secondary-dark-color)">Consulta Aceite</div>
            <div v-if="item.estado === 2" style="color:var(--primary-color)">Consulta Recusada</div>
          </v-col>
          <v-col class="text-right" v-if="!sug" cols=2>
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  depressed 
                  style="background-color:var(--secondary-color)"
                  @click="editSug(item.titulo,item.descricao)"
                >
                  Editar
                </v-btn>
              </template>
        
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Editar
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    color="var(--primary-color)"
                    @click="deleteSug(item._id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-title>


                <v-container style="padding:20px;">
                  <v-text-field label="Título" v-model="titulo">
                  </v-text-field>

                <v-textarea label="Sugestão" v-model="descricao">
                </v-textarea>
                </v-container>
        
                <v-divider></v-divider>
        
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="button-cancelar"
                    text
                    @click="dialog = false"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    class="button-confirmar"
                    text
                    @click="saveSug(item._id)"
                  >
                    Confirmar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
        titulo:'',
        descricao:'',
        dialog:false,
        ide:this.$route.query.id
        
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
          if(this.$route.query.tipo === 'med' || this.$route.query.tipo === null ) {
          this.list = this.meds
          }
        })
        .catch(err => {
          console.log(err)
        })

      axios.get("http://localhost:3333/consultas/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.consulta = data.data
          if(this.$route.query.tipo === 'cons') {
          this.list = this.consulta
          }
        })
        .catch(err => {
          console.log(err)
        })
      axios.get("http://localhost:3333/sugestao/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.sugestao = data.data
          if(this.$route.query.tipo === 'sug') {
          this.list = this.sugestao
          }
        })
        .catch(err => {
          console.log(err)
        })
      if(this.$route.query.tipo === 'cons') {
        this.med = true
        this.cons = false
        this.sug = true
        this.list = this.consulta
      }
      if(this.$route.query.tipo === 'sug') {
        this.med = true
        this.cons = true
        this.sug = false
        this.list = this.sugestao
      }
      
    }
    },
    mounted() {
      if(this.$route.query.id){
        var id = this.$route.query.id
        setTimeout(() => {
            var element = this.$refs[id];
              console.log(this.$refs[id])
              var top = element[0].offsetTop;

              window.scrollTo(0, top);
              // {nav: VueComponent}
            // {}
          }, 1000)
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
    },
    deleteEstado (id){
        axios.delete("http://localhost:3333/medicacao/" + id,{headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
      },
      editSug(tit,desc){
        this.titulo=tit
        this.descricao=desc
      },
      deleteSug(id){
        axios.delete("http://localhost:3333/sugestao/" + id , {headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
      },
      saveSug(id){
        var data = {}
        data['_id'] = id
        data['titulo'] = this.titulo
        data['descricao'] = this.descricao
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
.infos {
  font-weight: normal;
}

.divider {
  margin-top: 100px;
}

.texto_perfil {
  font-size: 18px;
}

.noti {
  color: black;
  animation: example 0.5s;
  animation-iteration-count: 4;
}

@keyframes example {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

</style>
