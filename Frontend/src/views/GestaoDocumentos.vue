<template>
  <div>
    <v-card flat color="var(--grey1-color)" style="font-size:120%;">
        <v-container>
          <h1 style="color:var(--primary-color)">Documentos removidos</h1>
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
              <v-btn depressed style="background-color:var(--secondary-color);  margin:0 10px 0 0;" @click="dialogVer = true; changeVarDoc(d)">Ver</v-btn>
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
              <h2 style="text-align:center;">Não há documentos removidos</h2>
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
            @click="dialog3 = false; deleteDocumento(idApagar);">
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
        max-width="550"
      >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">{{docTitulo}}</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <v-row> <h3>Criador: <span class="infos">{{docNome}}</span></h3> </v-row>
            <v-row> <h3>Data de data publicação: <span class="infos">{{docData}}</span></h3> </v-row>
            <v-row> <h3>Nome do ficheiro: <span class="infos">{{docNomeFile}}</span></h3> </v-row>
            <v-row> <h3>Tamanho do ficheiro: <span class="infos">{{docTamanho}}</span></h3> </v-row>
          </v-col> 
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
          class="button-cancelar"
          text
          @click="dialogVer = false;">
          Cancelar
          </v-btn>
          <v-btn
            class="button-confirmar"
            text
            @click="download">
            Transferir <v-icon>mdi-download</v-icon>
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  validations: {
    medico: {
      nome: { required }
    }
  },
  data(){
    return {
      token: localStorage.getItem('jwt'),
      documentos: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      dialogVer: false,
      dialogErr: false,
      nomeApagar: null,
      idApagar: null,
      nomeVisibilidade: null,
      idVisibilidade: null,
      nomeFlag: false,
      idVer: null,
      docId: null,
      docTitulo: null,
      docData: null,
      docNome: null,
      docNomeFile: null,
      docTamanho: null
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
    download(){
        axios.get('http://localhost:3333/documentos/download/' + this.docId,
        {
          responseType: 'blob'
        })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.docNomeFile); //or any other extension
            document.body.appendChild(link);
            link.click();
            this.dialogVer = false;
          })
        .catch(err => {
          this.dialogErr = true
          console.log(err)
        })
    },     
    changeVarDoc(d){
      this.docTitulo =  d.titulo,
      this.docData =  d.data_publicacao.slice(0,10),
      this.docNomeFile =  d.ficheiro.nome_ficheiro,
      this.docNome = d.nome_autor,
      this.docTamanho =  d.ficheiro.tamanho
      this.docId = d._id
    },
    deleteDocumento(id){
      axios.delete('http://localhost:3333/documentos/' + id, {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then(() => {
          axios.get("http://localhost:3333/documentos?visibilidade=1" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
            .then( dados => {
              this.dialog5 = true
              this.documentos = dados.data
          })
          .catch(err => {
            this.dialogErr = true
            console.log(err)
          })
        })
        .catch(err => {
            this.dialogErr = true
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
              this.dialog4 = true
              this.documentos = dados.data
          })
          .catch(err => {
            this.dialogErr = true
            console.log(err)
          })
        })
        .catch(err => {
            this.dialogErr = true
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
</style>