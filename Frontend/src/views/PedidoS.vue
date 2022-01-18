<template>
    <div class="pedidoS">

        <!-- MODAL DE CONFIRMAÇÃO DE EDIÇÃO DE SUGESTÃO-->
        <modal-message
          title="Sucesso"
          :visible="modalResponderSug"
          @close="$router.go()"
        >
          Sugestão respondida com sucesso.
        </modal-message>

        <!-- MODAL DE RESPONDER ÀS SUGESTÕES -->
        <v-dialog v-model="dialog"  width="500">

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Resposta
            </v-card-title>

            <v-container style="padding:20px;">

              <!-- DESCRIÇÃO -->
              <v-textarea 
                color="var(--secondary-dark-color)"
                label="Resposta" 
                v-model="descricao">
              </v-textarea>
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="button-cancelar" text @click="dialog = false; descricao=''"> Cancelar </v-btn>
              <v-btn class="button-confirmar" text @click="saveSug(id, user)"> Confirmar </v-btn>
            </v-card-actions> 
          </v-card>
        </v-dialog> 

        <v-card flat color="var(--grey1-color)" style="font-size:120%;">
          <v-container>
                <h1 style="color:var(--primary-color)">Sugestões</h1>
                <v-row justify="center">
                  <v-col>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Descendente" v-if="up" icon @click="orderData(0)" ><v-icon>mdi-arrow-down</v-icon></v-btn>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Ascendente" v-else icon @click="orderData(1)"><v-icon>mdi-arrow-up</v-icon></v-btn>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn depressed @click="changeTab('pendentes')" v-bind:color="color1 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Sugestões Pendentes</v-btn>
                    <v-btn depressed @click="changeTab('respondidas')" v-bind:color="color2 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Sugestões Respondidas</v-btn>
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
            <v-btn
              depressed
              style="background-color:var(--secondary-color)"
              @click="resp(item._id, item.user)"
            >
              Responder
            </v-btn>
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
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="#800000"
      ></v-progress-circular> 
    </v-card>
    </div>

</template>

<script>
import axios from 'axios'
import ModalMessage from '../components/ModalMessage.vue'

  //npm install --save @riophae/vue-treeselect
export default {
    name: "Sugestao",
    data() {
      return {
        token: localStorage.getItem('jwt'),
        descricao:'', 
        lista: [], 
        color1: 1,
        color2: 0,
        modalResponderSug:false,
        dialog:false,
        id:'',
        user:'',
        up:false,
        lastPage: false,
        loading: true
      }
    },
    components: {
      ModalMessage
    },
    created(){
        if (this.token) {
          axios.get("http://localhost:3333/sugestao?estado=0&skip=0", {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              this.lista = this.lista.concat(data.data)
              this.loading = false;
            })
            .catch(err => {
              console.log(err)
            })
        }
    },
    mounted () {
      window.onscroll = () => {
        let bottomOfWindow = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
        if (bottomOfWindow && !this.loading && !this.lastPage) {
          this.loading = true;
          this.getNextPage();
        }
      }
    },
    methods: {
      saveSug(id,user){
        var data = {}
        data['_id'] = id
        data['user'] = user
        data['resposta'] = this.descricao
        data['data_resposta'] = Date.now()
        data['estado'] = 1
        axios.put("http://localhost:3333/sugestao/altE",data , {headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.modalResponderSug=true
        })
        .catch(err => {
          console.log(err)
        })
      },
      resp(id, user){
        this.id = id
        this.user = user
        this.dialog = true
      },
      orderData(bol){
        if(bol) {
          this.lista.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        else {
          this.lista.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        this.up=!this.up
      },
      changeTab(to) {
        if (!this.color1 && to == "pendentes") {
          this.color1 = 1; this.color2 = 0
          this.loading = true

          axios.get("http://localhost:3333/sugestao?estado=0&skip=0", {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              this.lista = data.data
              this.loading = false;
              this.lastPage = false
            })
            .catch(err => {
              console.log(err)
            })
        }
        
        if (!this.color2 && to == "respondidas") {
          this.color1 = 0; this.color2 = 1
          this.loading = true

          axios.get("http://localhost:3333/sugestao?estado=1&skip=0", {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              this.lista = data.data
              this.loading = false;
              this.lastPage = false
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      getNextPage() {
        axios.get(`http://localhost:3333/sugestao?estado=${!this.color2 ? 0 : 1}&skip=` + this.lista.length, {headers:{'authorization':'Bearer '+ this.token}})
          .then(data => {
            if(!data.data || data.data.length < 10) this.lastPage = true
            this.lista = this.lista.concat(data.data)
            this.loading = false;
          })
          .catch(err => console.log(err))
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