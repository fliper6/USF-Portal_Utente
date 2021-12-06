<template>
  <div>
    <v-card flat color="var(--grey1-color)" style="font-size:120%;">
        <v-container>
          <h1 style="color:var(--primary-color)">Médicos</h1>
            <v-row justify="center">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-col class="text-right">
                <v-btn
                  depressed
                  style="background-color:var(--secondary-color); margin:0 10px 0 0;"
                  v-bind="attrs"
                  v-on="on">
                  Adicionar médico
                </v-btn>
              </v-col>
            </template>
            <v-card>
              <v-card-title style="color: var(--primary-color)" class="text-h5 grey lighten-2">
                <span>Adicionar médico</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col style="margin: auto; padding: 0px 50px;">
                      <v-text-field
                        color=var(--secondary-dark-color)
                        label="Nome"
                        @input="nomeFlag = false"
                        v-model="medico.nome"
                        required
                      ></v-text-field>
                      <span style="color: #ff5252; font-size: 12px; margin-top:1px" v-if="nomeFlag" >Nome é um campo obrigatório.</span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="button-cancelar"
                  text
                  @click="dialog = false; nomeFlag = false; medico.nome = ''">
                  Cancelar
                </v-btn>
                <v-btn
                  class="button-confirmar"
                  text
                  @click="addMedico();">
                  Criar
                </v-btn>
              <v-dialog
                v-model="dialog2"
                max-width="290">
                <v-card>
                  <v-card-title style="color: var(--primary-color)" class="text-h5 grey lighten-2">
                    Médico(a) criado(a)!
                  </v-card-title>
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
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        </v-container>
              <v-container>
                  <v-divider/>
              </v-container>
              <div v-if="this.medicos.length > 0">
                <v-container v-for="(m,index) in medicos" v-bind:key="m._id">
                <v-row>
                  <v-col>
                    <h3>{{m.nome}}</h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-right">
                    <v-btn depressed style="background-color:var(--grey2-color);" @click="dialog3 = true; nomeApagar = m.nome; idApagar = m._id">Eliminar</v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="medicos.length > 1 && index < medicos.length - 1">
                  <v-col><v-divider>
                  
                  </v-divider></v-col>

                </v-row>
                </v-container>
              </div>
              <div v-else>
                <v-container>
                  <v-row>
                    <v-col>
                      <h2 style="text-align:center;">Não existem médicos</h2>
                    </v-col>
                  </v-row>
                </v-container>
              </div>
      </v-card>
      <v-dialog
        v-model="dialog3"
        :retain-focus="false"
        max-width="400">
        <v-card>
          <v-card-title style="color: var(--primary-color)" class="text-h5 grey lighten-2">Pretende eliminar o(a) médico(a) {{nomeApagar}}?</v-card-title>
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
            @click="dialog3 = false; deleteMedico(idApagar)">
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
      medicos: '',
      dialog: false,
      dialog2: false,
      dialog3: false,
      medico: {
        nome: null
      },
      nomeApagar: null,
      idApagar: null,
      nomeFlag: false
    }
  },
  created(){
    if (this.token) {
      axios.get("http://localhost:3333/medicos/" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then( dados => {
          this.medicos = dados.data
        })
        .catch(err => {
          console.log(err)
        })
      } 
    },
  methods: {
    deleteMedico(id){
      axios.delete('http://localhost:3333/medicos/' + id, {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then(() =>{
          axios.get("http://localhost:3333/medicos/" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
            .then( dados => {
              this.medicos = dados.data
          })
          .catch(err => {
            console.log(err)
          })
        })
        .catch(err => {
            console.log(err)
        })
    },
    addMedico(){
      if(this.$v.medico.$invalid){
        this.nomeFlag = true
        this.medico.nome = ''
      }
      else{
        this.dialog = false
        this.dialog2 = true
        this.nomeFlag = false   
        axios.post("http://localhost:3333/medicos", {nome:this.medico.nome}, {
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}})
          .then(() => {
            axios.get("http://localhost:3333/medicos/" , {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
              .then( dados => {
                this.medicos = dados.data
                this.medico.nome = ''
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
}
</script>

<style>

</style>