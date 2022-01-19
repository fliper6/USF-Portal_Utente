<template>
  <div>
    <v-card flat color="var(--grey1-color)" style="font-size:120%;">
        <v-container>
          <h1 style="color:var(--primary-color)">Programação de notícias</h1>
            <v-row justify="center">
              <v-col class="text-right">
                <v-btn depressed @click="color1=1; color2=0; alteraLista()" v-bind:color="color1 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Notícias não programadas</v-btn>
                <v-btn depressed @click="color1=0; color2=1; alteraLista()" v-bind:color="color2 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Notícias programadas</v-btn>
              </v-col>
            </v-row>
        </v-container>
        <v-container>
          <v-divider/>
        </v-container>
        <div v-if="this.noticiasNormais.length > 0 && this.color1 == 1">
          <v-container v-for="(n,index) in noticiasNormais" v-bind:key="n._id">
          <v-row>
            <v-col>
              <h3>{{n.titulo}}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right">
              <v-btn depressed style="background-color:var(--secondary-color);  margin:0 10px 0 0;" @click="dialogVer = true; noticia = n">Ver Notícia</v-btn>
              <v-btn depressed style="background-color:var(--grey2-color);  margin:0 10px 0 0;" @click="modalProgNorm = true; noticia = n; nomeEdit = n.titulo">Programar publicação</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="noticiasNormais.length > 1 && index < noticiasNormais.length - 1">
            <v-col><v-divider>
                  
            </v-divider></v-col>

          </v-row>
          </v-container>
      </div>
        <div v-else-if="this.noticiasProg.length > 0 && this.color2 == 1">
          <v-container v-for="(n,index) in noticiasProg" v-bind:key="n._id">
          <v-row>
            <v-col>
              <h3>{{n.noticia.titulo}}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right">
              <v-btn depressed style="background-color:var(--secondary-color);  margin:0 10px 0 0;" @click="dialogVer = true; noticia = n.noticia">Ver Notícia</v-btn>
              <v-btn depressed style="background-color:var(--grey2-color);  margin:0 10px 0 0;" @click="buildEdit(n)">Editar programação de publicação</v-btn>
              <v-btn depressed style="background-color:var(--grey2-color);" @click="dialog = true; nomeApagar = n.noticia.titulo; idApagar = n._id; cancelaProg">Cancelar programação</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="noticiasProg.length > 1 && index < noticiasProg.length - 1">
            <v-col><v-divider>
                  
            </v-divider></v-col>

          </v-row>
          </v-container>
      </div>      
      <div v-else>
        <v-container>
          <v-row>
            <v-col>
              <h2 style="text-align:center;">Não há notícias programadas</h2>
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
        v-model="dialog"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Confirmação</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Pretende cancelar a programação da notícia "<b>{{nomeApagar}}</b>"?</p>
          </v-col>          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-cancelar"
            text
            @click="dialog = false;">
            Cancelar
            </v-btn>
            <v-btn
            class="button-confirmar"
            text
            @click="cancelaProg(); dialog = false">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>  
      <v-dialog
        v-model="dialog2"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Alerta</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Programação da notícia "<b>{{nomeApagar}}</b>" foi cancelada com sucesso!</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-confirmar"
            text
            @click="dialog2 = false;">
            Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>  
      <modal-message
        title="Programar publicação da notícia"
        :visible="modalProgNorm"
        options
        @close="revert"
        @confirm="checkDateCreate"
      >
        Quando deseja publicar esta notícia?
        <div class="parameters">
          <v-radio-group
            v-model="publishNow"
            column          
          >
            <v-radio
              label='Agora'
              :value='true'
              color="#800000"
            ></v-radio>
            <div class="publish-time">
              <v-radio
                label="Mais tarde"
                :value="false"
                color="#800000"
              ></v-radio>
              <date-picker
                :disabled="publishNow" 
                v-model="date"
              />
            </div>
          </v-radio-group>
          <v-divider class="publish-divider" />
          <div style="align-self: start">Deseja que esta notícia seja recorrente?</div>
          <div class="publish-time">
            <v-checkbox
              v-model="publishRepeat"
              label="Notícia recorrente"
              color="#800000"
            />
            <input-recurrence 
              v-model="recurrenceArray"
              :disabled="!publishRepeat"
            />
          </div>
        </div>
      </modal-message>
      <modal-message
        title="Editar publicação da notícia"
        :visible="modalProg"
        options
        @close="revertEdit"
        @confirm="checkDateEdit"
      >
        Editar data de publicação da noticia
        <div class="parameters">
          <v-radio-group
            v-model="publishNow"
            column          
          >
            <v-radio
              label='Agora'
              :value='true'
              color="#800000"
            ></v-radio>
            <div class="publish-time">
              <v-radio
                label="Mais tarde"
                :value="false"
                color="#800000"
              ></v-radio>
              <date-picker
                :disabled="publishNow" 
                v-model="dateP"
              />
            </div>
          </v-radio-group>
          <v-divider class="publish-divider" />
          <div style="align-self: start">Editar recorrência da notícia</div>
          <div class="publish-time">          
            <v-checkbox
              v-model="publishRepeat"
              label="Notícia recorrente"
              color="#800000"
            />            
            <input-recurrence
              v-model="recurrenceArrayP"
              :disabled="!publishRepeat"
            />
          </div>
        </div>
      </modal-message>      
      <v-dialog
        v-model="dialog3"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Sucesso</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Notícia "<b>{{nomeEdit}}</b>" programada com sucesso!</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-confirmar"
            text
            @click="dialog3 = false">
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
      <v-dialog
        v-model="dialogDataInvalida"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Erro</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Por favor introduza uma data futura válida.</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-confirmar"
            text
            @click="dialogDataInvalida = false">
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
import VerNoticia from '../components/VerNoticia.vue'
import ModalMessage from '../components/ModalMessage.vue'
import DatePicker from '../components/Editor/DatePicker.vue'
import InputRecurrence from '../components/Editor/InputRecurrence.vue'
export default {
  components: {
    VerNoticia,
    ModalMessage,
    DatePicker,
    InputRecurrence
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
      noticiasNormais: [],
      noticiasProg: [],
      idsOriginais: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialogVer: false,
      dialogErr: false,
      dialogDataInvalida: false,
      modalProgNorm: false,
      modalProg: false,
      noticia: null,
      nomeApagar: null,
      nomeEdit: null,
      idApagar: null,
      nomeVisibilidade: null,
      idVisibilidade: null,
      nomeFlag: false,
      color1: 1,
      color2: 0,
      date: Date.now(),
      recurrenceArray: [0,6,0,0,0,0],
      dateP:null,
      recurrenceArrayP: null,      
      publishNow: true,
      publishRepeat: false,
      n: null,
      lastPage: false,
      loading: true
    }
  },
  created(){
    if (this.token) {
      axios.get("http://localhost:3333/noticias_programadas" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then( dados => {
          this.noticiasNormais = dados.data.noticiasNormais
          this.noticiasProg = dados.data.noticiasProg
          this.ids_originais = this.noticiasProg.reduce((acc,cur) => {if ("id_original" in cur.noticia) acc.push(cur.noticia.id_original); return acc}, [])
          this.loading = false
        })
        .catch(err => {
          this.dialogErr = true
          console.log(err)
        })
      } 
    },
  mounted () {
    window.onscroll = () => {
      let bottomOfWindow = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
      if (bottomOfWindow && this.color1==1 && !this.loading && !this.lastPage) {
        this.loading = true;
        this.getNextPage();
      }
    }
  },
  methods: {
    revertEdit(){
      this.publishRepeat = false
      this.modalProg = false
    },
    revert(){
      this.modalProgNorm = false
      this.date = Date.now()
      this.recurrenceArray = [0,6,0,0,0,0]
      this.publishNow = true
      this.publishRepeat = false      
    },
    buildEdit(n){
      this.noticia = n
      this.recurrenceArrayP = n.recorrencia;
      if(this.checkRecurrenceArray(this.recurrenceArrayP)){
        this.publishRepeat = false
        this.publishNow = false
        this.recurrenceArrayP = [0,6,0,0,0,0]
      }
      else{
        this.publishRepeat = true
        this.publishNow = true
      }

      this.dateP = new Date(n.data_pub).toISOString()
      this.nomeEdit = n.noticia.titulo
      this.modalProg= true 
    },    
    checkRecurrenceArray(array){
      let res = true
      array.forEach(element => {
        if(element != 0){
          res = false
        }
      })
      return res
    },
    checkDateEdit(){
      if (!this.publishNow && new Date(this.dateP).getTime() < Date.now()){
        this.dialogDataInvalida = true
      }
      else {
        this.editaNotprog()
      }
    },
    checkDateCreate(){
      if (!this.publishNow && (new Date(this.date).getTime() < Date.now())){
        this.dialogDataInvalida = true
      }
      else {
        this.programaNot()
      }
    },    
    cancelaProg(){
      axios.delete('http://localhost:3333/noticias_programadas/' + this.idApagar, {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then(() => {
          this.noticiasProg.splice(this.noticiasProg.findIndex(x => x._id == this.idApagar), 1)
          this.dialog2 = true
        })
        .catch(err => {
          this.dialogErr = true
          console.log(err)          
        })
    },
    editaNotprog(){
      let data_pub = this.publishNow ? 'now' : this.dateP
      let rec_array = this.publishRepeat ? this.recurrenceArrayP : [0,0,0,0,0,0]
      let noticiaProg = {
        _id: this.noticia._id,
        recorrencia: rec_array.map(x => parseInt(x)),
        data_pub: data_pub,
        noticia: this.noticia.noticia
      }
      this.publishRepeat = false
      axios.put('http://localhost:3333/noticias_programadas/editar/' + this.noticia._id,
        noticiaProg,
        {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(() => {        
        this.modalProg = false
        this.dialog3 = true

        let indice_noticia = this.noticiasProg.findIndex(x => x._id == this.noticia._id)
        if (noticiaProg.data_pub == "now" && noticiaProg.recorrencia.every(x => !x)) this.noticiasProg.splice(indice_noticia, 1)
        else this.noticiasProg[indice_noticia] = noticiaProg
      }).catch((err) => {
          this.dialogErr = true
          console.log(err) 
        });      
    },
    programaNot(){
      let data_pub = this.publishNow ? 'now' : this.date
      let noticiaProg = {
        recorrencia: this.publishRepeat ? this.recurrenceArray.map(x => parseInt(x)) : [0,0,0,0,0,0],
        data_pub: data_pub,
        noticia: {
          titulo: this.noticia.titulo,
          corpo: this.noticia.corpo,
          _id_autor: this.noticia._id_autor,
          nome_autor: this.noticia.nome_autor,
          data_criacao: this.noticia.data_criacao,
          data_ultima_mod: this.noticia.data_ultima_mod,
          visibilidade: this.noticia.visibilidade,
          id_original: this.noticia._id,
          ficheiros: this.noticia.ficheiros,
        }
      }
      this.date = Date.now()
      this.recurrenceArray = [0,6,0,0,0,0]
      this.publishNow = true
      this.publishRepeat = false
      axios.put('http://localhost:3333/noticias_programadas/editar/' + this.noticia._id,
        noticiaProg,
        {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(() => {
        axios.get("http://localhost:3333/noticias_programadas" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
          .then( dados => {
            this.modalProgNorm = false
            this.dialog3 = true
            this.noticiasNormais = dados.data.noticiasNormais
            this.noticiasProg = dados.data.noticiasProg
            this.ids_originais = this.noticiasProg.reduce((acc,cur) => {if ("id_original" in cur.noticia) acc.push(cur.noticia.id_original); return acc}, [])
            this.loading = false
          })
          .catch(err => {
            this.dialogErr = true
            console.log(err)
          })
      }).catch((err) => {
          this.dialogErr = true 
          console.log(err) 
        });
    },
    alteraLista(){
      axios.get("http://localhost:3333/noticias_programadas" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then( dados => {
          this.noticiasNormais = dados.data.noticiasNormais
          this.noticiasProg = dados.data.noticiasProg
          this.ids_originais = this.noticiasProg.reduce((acc,cur) => {if ("id_original" in cur.noticia) acc.push(cur.noticia.id_original); return acc}, [])
          this.lastPage = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    getNextPage() {
      axios.post('http://localhost:3333/noticias_programadas/originais?skip=' + this.noticiasNormais.length, {ids_originais: this.ids_originais})
        .then(data => {
          if(!data.data || data.data.length < 10) this.lastPage = true
          this.noticiasNormais = this.noticiasNormais.concat(data.data) 
          this.loading = false; 
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

