<template>
  <div>
    <v-card flat color="var(--grey1-color)" style="font-size:120%;">
        <v-container>
          <h1 style="color:var(--primary-color)">Documentos</h1>
            <v-row justify="center">
            </v-row>
        </v-container>
        <v-container>
          <v-divider/>
        </v-container>
        <div v-if="this.documentos.length > 0">
          <v-container v-for="(d,index) in documentos" v-bind:key="d._id">
          <v-row>
            <v-col>
              <h3>{{d.titulo}}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right">
              <v-btn depressed style="background-color:var(--secondary-color);  margin:0 10px 0 0;" @click="dialogVer = true; documento = d">Ver</v-btn>
              <v-btn depressed style="background-color:var(--grey2-color);  margin:0 10px 0 0;" @click="dialog2 = true; nomeVisibilidade = d.titulo; idVisibilidade = d._id">Colocar público</v-btn>
              <v-btn depressed style="background-color:var(--grey2-color);" @click="dialog3 = true; nomeApagar = d.titulo; idApagar = d._id">Eliminar</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="documentos.length > 1 && index < documentos.length - 1">
            <v-col><v-divider>
                  
            </v-divider></v-col>

          </v-row>
          </v-container>
      </div>
      <div v-else>
        <v-container>
          <v-row>
            <v-col>
              <h2 style="text-align:center;">Não existem documentos</h2>
            </v-col>
          </v-row>
        </v-container>
      </div>
      </v-card>
      <v-dialog
        v-model="dialog3"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Confirmação</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Pretende eliminar permanentemente o documento "<b>{{nomeApagar}}</b>"?</p>
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
            @click="dialog3 = false; deleteDocumento(idApagar); dialog5 = true">
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
              Documento "<b>{{nomeApagar}}</b>" foi eliminado permanentemente.</p>
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
              Pretende colocar público o documento "<b>{{nomeVisibilidade}}</b>"?</p>
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
              Visibilidade do documento "<b>{{nomeVisibilidade}}</b>" foi alterada para pública.</p>
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
        v-model="dialogVer"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
      <v-card>
        
        <v-card-title class="text-h5 grey lighten-2">
          Ver documento
          <v-spacer></v-spacer> 
          <v-btn
            icon
            red
            @click="dialogVer = false;"
          >
            <v-icon style="color: var(--primary-color)">mdi-close</v-icon>
          </v-btn>         
        </v-card-title>
          <VerDocumento :documento="documento"/>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import VerDocumento from "../components/VerDocumento.vue"
export default {
  components: {
    VerDocumento
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
      documentos: null,
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      dialogVer: false,
      documento: null,
      nomeApagar: null,
      idApagar: null,
      nomeVisibilidade: null,
      idVisibilidade: null,
      nomeFlag: false,
      idVer: null,
    }
  },
  created(){
    if (this.token) {
      axios.get("http://localhost:3333/documentos?visibilidade=1" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then( dados => {
          this.documentos = dados.data
        })
        .catch(err => {
          console.log(err)
        })
      } 
    },
  methods: {
    deleteDocumento(id){
      axios.delete('http://localhost:3333/documentos/' + id, {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then(() => {
          axios.get("http://localhost:3333/documentos?visibilidade=1" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
            .then( dados => {
              this.documentos = dados.data
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
      axios.put('http://localhost:3333/documentos/adicionar/' + id,{},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        })
        .then(() => {
          axios.get("http://localhost:3333/documentos?visibilidade=1" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
            .then( dados => {
              this.documentos = dados.data
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