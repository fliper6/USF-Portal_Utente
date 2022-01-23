<template>
  <div>
    <v-card flat color="var(--grey1-color)" style="font-size:120%;">
        <v-container>
          <h1 style="color:var(--primary-color)">Notícias removidas</h1>
            <v-row justify="center">
              <v-col class="text-right">
              </v-col>
            </v-row>
        </v-container>
        <v-container>
          <v-divider/>
        </v-container>
        <div v-if="this.noticias.length > 0">
          <v-container v-for="(n,index) in noticias" v-bind:key="n._id">
          <v-row>
            <v-col>
              <h3>{{n.titulo}}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right">
              <v-btn depressed style="background-color:var(--secondary-color);  margin:0 10px 0 0;" @click="dialogVer = true; noticia = n">Ver Notícia</v-btn>
              <v-btn depressed style="background-color:var(--grey2-color);  margin:0 10px 0 0;" @click="dialog2 = true; nomeVisibilidade = n.titulo; idVisibilidade = n._id">Colocar pública</v-btn>
              <v-btn depressed style="background-color:var(--grey2-color);" @click="dialog3 = true; nomeApagar = n.titulo; idApagar = n._id">Eliminar</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="noticias.length > 1 && index < noticias.length - 1">
            <v-col><v-divider>
                  
            </v-divider></v-col>

          </v-row>
          </v-container>
      </div>     
      <div v-else>
        <v-container>
          <v-row>
            <v-col>
              <h2 style="text-align:center;">Não existem notícias</h2>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-progress-circular
        v-if="loadingNews"
        indeterminate
        color="#800000"
      ></v-progress-circular> 
      </v-card>
      <v-dialog
        v-model="dialogVer"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
      <v-card>
        
        <v-card-title class="text-h5 grey lighten-2">
          Ver Notícia
          <v-spacer></v-spacer> 
          <v-btn
            icon
            red
            @click="dialogVer = false"
          >
            <v-icon style="color: var(--primary-color)">mdi-close</v-icon>
          </v-btn>         
        </v-card-title>
        <VerNoticia :noticia='noticia' :key="n" />      
      </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog3"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Confirmação</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Pretende eliminar permanentemente a notícia "<b>{{nomeApagar}}</b>"?</p>
          </v-col>          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-cancelar"
            text
            @click="dialog3 = false;">
            Cancelar
            </v-btn>
            <v-btn
            class="button-confirmar"
            text
            @click="dialog3 = false; deleteNoticia(idApagar);">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      <v-dialog
        v-model="dialog5"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Alerta</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Notícia "<b>{{nomeApagar}}</b>" foi eliminada permanentemente.</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-confirmar"
            text
            @click="dialog5 = false;">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>  
      </v-dialog>
      <v-dialog
        v-model="dialog2"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Confirmação</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Pretende colocar pública a notícia "<b>{{nomeVisibilidade}}</b>"?</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="button-cancelar"
              text
              @click="dialog2 = false;">
              Cancelar
            </v-btn>
            <v-btn
              class="button-confirmar"
              text
              @click="putPublic(idVisibilidade); dialog2 = false;">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog4"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Alerta</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Visibilidade da notícia "<b>{{nomeVisibilidade}}</b>" foi alterada para pública.</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-confirmar"
            text
            @click="dialog4 = false;">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogErr"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Erro</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Ocorreu um erro na operação.</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-confirmar"
            text
            @click="dialogErr = false">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>        
    </div>
</template>

<script>
import axios from 'axios'
const host = require('../../../config.json').backend
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import VerNoticia from '../components/VerNoticia.vue'
export default {
  components: {
    VerNoticia
  },
  mixins: [validationMixin],
  validations: {
    medico: {
      nome: { required }
    }
  },
  data(){
    return {
      token: localStorage.getItem('jwt'),
      noticias: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      dialog6: false,
      dialogVer: false,
      dialogErr: false,
      noticia: null,
      nomeApagar: null,
      nomeEdit: null,
      idApagar: null,
      nomeVisibilidade: null,
      idVisibilidade: null,
      nomeFlag: false,
      n: null,
      lastPage: false,
      loadingNews: true
    }
  },
  created(){
    if (this.token) {
      axios.get(host + `/noticias?visibilidade=1&skip=0` , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then( dados => {
          this.noticias = this.noticias.concat(dados.data)
          this.loadingNews = false;
        })
        .catch(err => {
          console.log(err)
        })
      } 
    },
  mounted () {
    window.onscroll = () => {
      let bottomOfWindow = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
      if (bottomOfWindow && !this.loadingNews && !this.lastPage) {
        this.loadingNews = true;
        this.getNextPage();
      }
    }
  },
  methods: {
    deleteNoticia(id){
      axios.put(host + '/noticias/' + id + '?visibilidade=2', {}, {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then(() => {
          this.dialog5 = true
          this.noticias.splice(this.noticias.findIndex(x => x._id == id), 1)
        })
        .catch(err => {
            this.dialogErr = true
            console.log(err)
        })
    },
    putPublic(id){
      axios.put(host + '/noticias/' + id + '?visibilidade=0', {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        })
        .then(() => {
          this.dialog4 = true
          this.noticias.splice(this.noticias.findIndex(x => x._id == id), 1)
        })
        .catch(err => {
          this.dialogErr = true
          console.log(err)
        })        
    },
    getNextPage() {
      axios.get(host + '/noticias?visibilidade=1&skip=' + this.noticias.length)
        .then(data => {
          if(!data.data || data.data.length < 10) this.lastPage = true
            this.noticias = this.noticias.concat(data.data) 
            this.loadingNews = false; 
          })
        .catch(err => console.log(err))
    }
  }  
}
</script>

<style>
.parameters {
  display: flex;
  flex-direction: column;
  align-items: center;
  width:auto;
  height:auto;
}

.publish-divider {
  margin-bottom: 30px;
  width:100%;
}

.publish-time {
  display: flex;
}
</style>

