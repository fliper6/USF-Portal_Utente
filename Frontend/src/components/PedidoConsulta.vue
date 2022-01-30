<template>
  <div class="wrapper">
    <div class="title-area">
      <h1 class="h1">Pedido de Contacto</h1>
      <p class="p1">Preencha cuidadosamente o formulário.
Este formulário não pode ser usado para consulta no próprio dia (consulta urgente).</p>
    </div>
    <div class="form-area">
    <form id="formMed">
      <div class="info-area">
        <label class="label">1. Nome Completo</label>
        <input disabled type="text" class="input-text" required v-model="consulta.nome">
        <span style="color: #ff5252; font-size: 12px;" v-if="$v.consulta.nome.$invalid">Nome é um campo obrigatório.</span>
        <label class="label">2. Número de utente titular (Serviço Nacional de Saúde)</label>
        <input disabled type="number" class="input-text" required v-model="consulta.numUtente">
        <label class="label">3. Número de utente a pedir (Serviço Nacional de Saúde)</label>
        <p class="p2">Caso pretenda pedir um contacto para um utente do seu agregado familiar que não tenha capacidade para o fazer preencha este campo.</p>
        <input type="number" class="input-text" v-model="consulta.numUtentePedido" @input="checkNum = false" @click="checkNum = false">
        <span style="color: #ff5252; font-size: 12px;" v-if="checkNum">Número tem de ter 9 dígitos</span>
        <label class="label">4.Médico de Família</label>
        <div class="select-area">
          <v-select
          :items=meds
          @click= "removeSpanMedicos"
          v-model="consulta.medico"
          label="Médico de família"
          color=var(--secondary-dark-color)
          dense
          outlined
        ></v-select>
        <span style="color: #ff5252; font-size: 12px; margin-top:1px" v-if="medFlag" >Médico de família é um campo obrigatório.</span>
        </div>
        <label class="label">5.O que pretende?</label>
        <div class="select-area">
          <v-select
          :items=objs
          @click="removeSpanObj"
          v-model="consulta.objetivo"
          label="O que pretende?"
          color=var(--secondary-dark-color)
          dense
          outlined
        ></v-select>
        <span style="color: #ff5252; font-size: 12px;" v-if="objFlag" >Campo obrigatório.</span>
        </div>
        <label class="label">6. Forma em que pretende ser contactado</label>
      </div>
      <div class="check">
        <label for="SMS">SMS</label>
        <input type="radio" class="input-radio" @click="showTele = true; showEmail = false; contactoFlag = false; getContactos()" required v-model="consulta.contacto" value="SMS">
        <label for="Email">Email</label>
        <input type="radio" class="input-radio" @click="showEmail = true; showTele = false; contactoFlag = false; getContactos()" required v-model="consulta.contacto" value="Email">
      </div>
      <span style="color: #ff5252; font-size: 12px;" v-if="contactoFlag">Campo obrigatório.</span>
      <div v-if="showTele">
          <label class="label">Número de telemóvel</label>
          <input type="number" class="input-modal" v-model="consulta.valorContacto.telemovel" @click="checkTele = false; checkTele2 = false" @input="checkTele = false; checkTele2 = false">
          <span style="color: #ff5252; font-size: 12px;" v-if="checkTele">Número de Telémovel é um campo obrigatório.</span>
          <span style="color: #ff5252; font-size: 12px;" v-if="checkTele2">Número de Telémovel tem de conter 9 digitos.</span>
      </div>
      <div v-if="showEmail">
          <label class="label">Email</label>
          <input type="text" class="input-modal" v-model="consulta.valorContacto.email">
          <span style="color: #ff5252; font-size: 12px;" v-if="$v.consulta.valorContacto.email.$invalid">Email é um campo obrigatório.</span>
      </div>          
      <div>
        <v-btn class="button" @click="verifica">Submeter</v-btn>
      </div>  
    </form>
    <v-dialog
        v-model="dialog"
        :retain-focus="false"
        max-width="550">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">Confirmar</v-card-title> <br/>
          <v-col style="margin: auto; padding: 0px 50px;">
            <p style="margin-bottom: 5px; color:var(--grey3-color)">
              Pretende submeter o pedido de contacto?</p>
          </v-col>
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
            @click="sendPedidoCons(); dialog = false;">
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
             Pedido submetido com sucesso!</p>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            class="button-confirmar"
            text
            @click="dialog2 = false; reload()">
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
  </div>  
</template>

<script>
import axios from 'axios'
const host = require('../../../config.json').backend

import jwt from 'jsonwebtoken';
import { validationMixin } from 'vuelidate'
import { required, between } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  props: ["token"],
  validations: {
    consulta: {
      nome: { required },
      numUtente: { required },
      numUtentePedido: { between: between(100000000, 999999999)},
      medico: { required },
      objetivo: { required },
      contacto: { required },
      valorContacto: {
        email: { required },
      }      
    }
  },
  data() {
    return {
      consulta: {
        user: "",
        nome: "",
        numUtente: "",
        numUtentePedido: "",
        medico: "",
        contacto: "",
        valorContacto: {
          telemovel: "",
          email: ""
        },        
        objetivo: ""
      },
      objFlag: false,
      showEmail: false,
      showTele: false,
      medFlag: false,
      meds:[],
      objs: ["Agendar consulta médica", "Confirmar dia e hora da consulta (médica ou de enfermagem)", "Desmarcar consulta (médica ou de enfermagem)", 
        "Pedido de contato telefónico - médico", "Pedido de contato telefónico - enfermagem"],
      dialog: false,
      dialog2:false,
      dialogErr: false,
      checkNum: false,
      contactoFlag: false,
      checkTele: false,
      checkTele2:false,
    }  
  },
  methods: {
    reload(){
      this.$router.push("/")
    },
    getContactos(){
      axios.get(host + "/users/validar/" + this.token)
      .then( () => {
        this.consulta.valorContacto.email = jwt.decode(this.token).email
        this.consulta.valorContacto.telemovel = jwt.decode(this.token).nr_telemovel
      })
      .catch(() => {
        localStorage.clear()
        window.location.pathname = '/'
        alert("A sua sessão foi expirada!!")
      })
    },    
    removeSpanObj: function(){
      this.objFlag = false
    },
    removeSpanMedicos: function(){
      this.medFlag = false
    },
    verifica: function(){
      if(this.$v.consulta.medico.$invalid){
        this.medFlag = true
      }
      if(this.$v.consulta.objetivo.$invalid){
        this.objFlag = true
      }
      if(!this.$v.consulta.$invalid){
        this.dialog = true
      }
      if(this.$v.consulta.numUtentePedido.$invalid){
        this.checkNum = true
      }
      if(this.$v.consulta.contacto.$invalid){
        this.contactoFlag = true
      }
      if(this.consulta.contacto == "SMS" && this.consulta.valorContacto.telemovel == ""){
        this.checkTele = true
      }
      if(this.consulta.contacto == "SMS" && Math.ceil(Math.log10(this.consulta.valorContacto.telemovel)) != 9){
        this.checkTele2 = true
      } 
      if(!this.$v.consulta.$invalid && this.consulta.contacto == "SMS" && this.consulta.valorContacto.telemovel != ""){
        this.dialog = true
      }
      if(!this.$v.consulta.$invalid && this.consulta.contacto == "Email"){
        this.dialog = true
      }         
    },
    sendPedidoCons(){
      if(!this.$v.consulta.$invalid && this.consulta.contacto == "SMS" && this.consulta.valorContacto.telemovel != ""){
        axios({
          method: 'post',
          url: host + "/consultas",
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }, 
          data: {
            user: this.consulta.user,
            nome: this.consulta.nome,
            nr_utente_titular: parseInt(this.consulta.numUtente),
            nr_utente_pedido: this.parseNumOpcional(this.consulta.numUtentePedido),
            medico: this.consulta.medico,
            tipo: this.consulta.objetivo,
            contacto: {
              tipo: this.converteContacto(this.consulta.contacto),
              valor: this.consulta.valorContacto.telemovel
            }          
          }
        })
        .then(() => {
          this.dialog2 = true
        })
        .catch(err => {
          this.dialogErr = true
          console.log(err)
        })
         
      }
      else if(!this.$v.consulta.$invalid && this.consulta.contacto == "Email"){
        axios({
          method: 'post',
          url: host + "/consultas",
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }, 
          data: {
            user: this.consulta.user,
            nome: this.consulta.nome,
            nr_utente_titular: parseInt(this.consulta.numUtente),
            nr_utente_pedido: this.parseNumOpcional(this.consulta.numUtentePedido),
            medico: this.consulta.medico,
            tipo: this.consulta.objetivo,
            contacto: {
              tipo: this.converteContacto(this.consulta.contacto),
              valor: this.consulta.valorContacto.email
            }          
          }
        })
        .then(() => {
          this.dialog2 = true
        })
        .catch(err => {
          this.dialogErr = true
          console.log(err)
        })
                 
      }
    },
      
    converteContacto(cont){
      if(cont == "SMS"){
        return 1
      }
      else if (cont == "Email"){
        return 0
      }
    },

    parseNumOpcional(num){
      if(num == ""){
        return null
      }
      else{
        return parseInt(num)
      }
    }
    
    
    
  },
  created(){
    axios.get(host + "/users/validar/" + this.token)
      .then( () => {
        this.consulta.user = jwt.decode(this.token)._id
        this.consulta.numUtente = jwt.decode(this.token).nr_utente
        this.consulta.nome = jwt.decode(this.token).nome
      })
      .catch(() => {
        localStorage.clear()
        window.location.pathname = '/'
        alert("A sua sessão foi expirada!")
      })
      
    axios({
      method: 'get',
      url: host + "/medicos",
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }, 
      data: {}
      })
      .then(meds => {
        meds.data.forEach(med=> {
          this.meds.push(med.nome)
        });
      })
      .catch(err => {
        console.log(err)
      })
    
       
  }
}
</script>

<style>
  .wrapper{
    display: flex;
    align-content: center;
    flex-direction: column;
    width: 100%;
  }
  .title-area{
    display: flex;
    align-content: center;
    flex-direction: column;
    align-items: center;
    align-self: center;
    width: 50vw !important;
  }
  .form-area{
    display: flex;
    justify-content: center;
    align-self: center;
    width: 50vw !important;
  }
  .info-area{
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 50vw !important;
  }
  .info-area input {
    width: 100%;
  }
  .button{
    padding:  3px;
    background-color: var(--secondary-color) !important;
    margin-top: 30px;
  }
  .label{
    color: var(--grey3-color);
    display: inline-block;
    margin: 15px 0;
    font-size: 1em;
    letter-spacing: 0.5px;
    font-weight: bold;
  }
  .input-text {
    display: block;
    padding: 10px 6px;
    height:30px;
    box-sizing: border-box;
    border: 1px solid #96918F;
    color: var(--grey3-color);
  }
  .h1 {
    color: var(--primary-color);
    font-size: 3em;
  }
  .p1{
    font-size: 0.9em;
    text-align: center;
    color: var(--grey3-color);
  }
  .p2{
    color: var(--grey3-color);
  }
</style>
