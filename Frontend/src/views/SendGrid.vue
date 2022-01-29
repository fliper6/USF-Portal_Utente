<template>
    <div id="sendgrid" class="pa-0">
        <v-container>

            <!-- MODAL DE SUCESSO -->
            <modal-message
              title="Sucesso"
              :visible="modalSucesso"
              @close="alteracaoSucesso()"
            >
              A chave foi alterada com sucesso!
            </modal-message>

            <!-- MODAL DE ERRO -->
            <modal-message
              title="Erro"
              :visible="modalErro"
              @close="cancelar()"
            >
              Não foi possível alterar a chave!
            </modal-message>
            
            <a href="https://sendgrid.com" target="_blank" style="align:center">
                <v-img 
                    :aspect-ratio="16/9"
                    width="300"
                    class="mx-auto"
                    src="https://d15tnd3q55f8nl.cloudfront.net/static/SG_Twilio_Lockup_Social-56f3cfd2f6b0c62422980170d57fac64.png"
                > 
                </v-img>
            </a>
            

            <div style="font-size:26px; margin-top:50px; text-align:center">
                <b> Chave atual: </b> {{ key.key }}
            </div>

            <v-container>
                <div style="font-size:26px; margin-top:100px; text-align:center">
                    <span> Clique </span>
                    <a href="https://app.sendgrid.com/settings/api_keys" target="_blank">aqui</a>
                    <span> para gerar uma nova chave </span>
                </div>
            </v-container>

            <br>
            <br>

            <!-- MODAL DE ALTERAR CHAVE -->
            <v-dialog v-model="dialog" width="400">

              <v-card>
                <v-card-title class="text-h5 grey lighten-2">Guardar chave</v-card-title> <br/>
                
                <v-col style="margin: auto; padding: 0px 50px;">
                       
                  <!-- NOVA CHAVE -->
                  <v-text-field  
                  color=var(--secondary-dark-color)
                  type="text"
                  v-model="newKey" 
                  label="Nova chave">
                  </v-text-field>
        
                </v-col>
                
                <v-divider></v-divider>
        
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="button-cancelar" text @click="cancelar()"> Cancelar </v-btn>
                  <v-btn class="button-confirmar" :loading="loading" text @click="changeKey()"> Confirmar </v-btn>
                </v-card-actions> 
        
              </v-card>
            </v-dialog> 

            

            <v-container>
                <div style="font-size:26px; margin-top:60px; text-align:center">
                    <v-btn class="button-principal" @click="dialog=true">
                        Guardar nova chave
                    </v-btn>
                </div>
            </v-container>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'
import ModalMessage from '../components/ModalMessage.vue'
const host = require('../../../config.json').backend

export default {
  name: 'sendgrid',
  data(){
    return {
      token: localStorage.getItem('jwt'),
      key: "",
      newKey: null,
      modalErro: false,
      modalSucesso: false,
      dialog: false,
      loading: false,
    }
  },
  components: {
    ModalMessage
  },
  created(){
    if (this.token) {
      axios.get(host + "/sendgrid", {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
        .then( dados => {
          this.key = dados.data
        })
        .catch(err => {
          console.log(err)
        })
      } 
    },
  methods: {
    changeKey(){
        var json = {}
        json['key'] = this.newKey
        axios.put(host + "/sendgrid" , json,  {headers:{'Authorization':'Bearer '+ localStorage.getItem('jwt')}})
            .then( () => {
              this.modalSucesso = true
            })
            .catch(err => {
              this.modalErro = true
              console.log(err)
            })
    },
    alteracaoSucesso() {
      this.modalSucesso = false 
      this.dialog = false
      this.$router.go()
    },
    cancelar() {
      this.newKey = ""
      this.dialog = false 
      this.modalSucesso = false 
      this.modalErro = false
    }
  }  
}
</script>

<style>

</style>