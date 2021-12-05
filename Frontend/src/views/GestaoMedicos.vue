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
                  style="background-color:var(--secondary-color); margin:0 10px 0 0;"
                  v-bind="attrs"
                  v-on="on">
                  Adicionar médico
                </v-btn>
              </v-col>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Adicionar médico</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col style="margin: auto; padding: 0px 50px;">
                      <v-text-field
                        color=var(--secondary-dark-color)
                        label="Nome"
                        v-model="medico.nome"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  class="button-cancelar"
                  text
                  @click="dialog = false">
                  Cancelar
                </v-btn>
                <v-btn
                  class="button-confirmar"
                  text
                  @click="dialog = false; addMedico(); dialog2 = true">
                  Criar
                </v-btn>
              <v-dialog
                v-model="dialog2"
                max-width="290">
                <v-card>
                  <v-card-title style="color: var(--primary-color)" class="text-h5">
                    Médico criado!
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                  <v-btn
                    cclass="button-confirmar"
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
                    <v-btn depressed style="background-color:var(--grey2-color)" @click="dialog3 = true; deleteMedico(m._id)">Eliminar</v-btn>
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
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {
      token: localStorage.getItem('jwt'),
      medicos: '',
      dialog: false,
      dialog2: false,
      dialog3: false,
      medico: {
        nome: null
      }
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
</script>

<style>

</style>