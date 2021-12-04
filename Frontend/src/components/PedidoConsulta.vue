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
        <input type="text" class="input-text" required v-model="consulta.nome">
        <span style="color: #ff5252; font-size: 12px;" v-if="$v.consulta.nome.$invalid">Nome é um campo obrigatório.</span>
        <label class="label">2. Número de utente titular (Serviço Nacional de Saúde)</label>
        <input type="number" class="input-text" required v-model="consulta.numUtente">
        <span style="color: #ff5252; font-size: 12px;" v-if="$v.consulta.numUtente.$invalid">Número de utente é um campo obrigatório.</span>
        <label class="label">3. Número de utente a pedir (Serviço Nacional de Saúde)</label>
        <p class="p2">Caso pretenda pedir uma consulta para um utente do seu agregado familiar que não tenha capacidade para o fazer preencha este campo.</p>
        <input type="number" class="input-text" v-model="consulta.numUtentePedido">
        <label class="label">4.Médico de Família</label>
        <div class="select-area">
          <v-select
          :items=meds
          @click= "removeSpanMedicos"
          v-model="consulta.medico"
          label="Médico de família"
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
          dense
          outlined
        ></v-select>
        <span style="color: #ff5252; font-size: 12px;" v-if="objFlag" >Campo obrigatório.</span>
        </div>
      </div>    
      <div>
        <v-btn class="button" @click="verifica">Submeter</v-btn>
      </div>  
    </form>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken';
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  mixins: [validationMixin],
  props: ["token"],
  validations: {
    consulta: {
      nome: { required },
      numUtente: { required },
      medico: { required },
      objetivo: { required }
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
        objetivo: ""
      },
      objFlag: false,
      medFlag: false,
      meds:[],
      objs: ["Agendar consulta médica", "Confirmar dia e hora da consulta (médica ou de enfermagem)", "Desmarcar consulta (médica ou de enfermagem)", 
        "Pedido de contato telefónico - médico", "Pedido de contato telefónico - enfermagem"]
    }  
  },
  methods: {
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
      else{
        this.sendPedidoCons()
      }
    },
    sendPedidoCons: function(){
      if(!this.$v.consulta.$invalid){
        axios({
        method: 'post',
        url: "http://localhost:3333/consultas",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }, 
        data: {
          user: this.consulta.user,
          nome: this.consulta.nome,
          nr_utente_titular: parseInt(this.consulta.numUtente),
          nr_utente_pedido: parseNumOpcional(this.consulta.numUtentePedido),
          medico: this.consulta.medico,
          tipo: this.consulta.objetivo
        }
      })
      this.$router.push("/formConfirm")
    }
      
    function parseNumOpcional(num){
      if(num == ""){
        return null
      }
      else{
        return parseInt(num)
      }
    }
    }
  },
  created(){
    axios.get("http://localhost:3333/users/validar/" + this.token)
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
      url: "http://localhost:3333/medicos",
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
    margin-top: 10px;
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