<template>
  <div>
    <v-card flat color="var(--grey1-color)" style="font-size:120%;">
        <v-container>
          <h1 style="color:var(--primary-color)">Notícias</h1>
            <v-row justify="center">
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
              <v-btn depressed style="background-color:var(--secondary-color);  margin:0 10px 0 0;" @click="dialogVer = true; noticia = n">Ver</v-btn>
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
        <VerNoticia :noticia='noticia' :timeAgo="timeAgo" :key="n" />       
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
            @click="dialog3 = false; deleteNoticia(idApagar); dialog5 = true">
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
              @click="putPublic(idVisibilidade); dialog2 = false; dialog4 = true">
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
    </div>
</template>

<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import VerNoticia from "../components/VerNoticia.vue"
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
      noticias: null,
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      dialogVer: false,
      noticia: null,
      nomeApagar: null,
      idApagar: null,
      nomeVisibilidade: null,
      idVisibilidade: null,
      nomeFlag: false
    }
  },
  created(){
    if (this.token) {
      axios.get("http://localhost:3333/noticias?visibilidade=false" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then( dados => {
          this.noticias = dados.data
        })
        .catch(err => {
          console.log(err)
        })
      } 
    },
  methods: {
    deleteNoticia(id){
      axios.delete('http://localhost:3333/noticias/' + id, {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then(() => {
          axios.get("http://localhost:3333/noticias?visibilidade=false" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
            .then( dados => {
              this.noticias = dados.data
          })
          .catch(err => {
            console.log(err)
          })
        })
        .catch(err => {
            console.log(err)
        })
    },
    putPublic(id){
      axios.put('http://localhost:3333/noticias/publica/' + id,{},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        })
        .then(() => {
          axios.get("http://localhost:3333/noticias?visibilidade=false" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
            .then( dados => {
              this.noticias = dados.data
          })
          .catch(err => {
            console.log(err)
          })
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