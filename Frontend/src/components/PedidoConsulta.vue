<template>
  <div class="wrapper">
    <div class="title-area">
      <h1 class="h1">Pedido de Consulta</h1>
      <p class="p1">Preencha cuidadosamente o formulário.
Este formulário não pode ser usado para consulta no próprio dia (consulta urgente).</p>
    </div>
    <div class="form-area">
    <form id="formMed">
      <div class="info-area">
        <label class="label">1. Nome Completo</label>
        <input type="text" class="input-text" required v-model="consulta.nome">
        <label class="label">2. Número de utente titular (Serviço Nacional de Saúde)</label>
        <input type="number" class="input-text" required v-model="consulta.numUtente">
        <label class="label">3. Número de utente a pedir (Serviço Nacional de Saúde)</label>
        <p class="p2">Caso pretenda pedir medicação para um utente do seu agregado familiar que não tenha capacidade para o fazer preencha este campo.</p>
        <input type="number" class="input-text" v-model="consulta.numUtentePedido">
        <label class="label">4.Médico de Família</label>
        <div class="select-area">
          <v-select
          :items=meds
          v-model="consulta.medico"
          label="Médico de família"
          dense
          outlined
        ></v-select>
        </div>
        <label class="label">5.O que pretende?</label>
        <div class="select-area">
          <v-select
          :items=objs
          v-model="consulta.objetivo"
          label="O que pretende?"
          dense
          outlined
        ></v-select>
        </div>
      </div>    
      <div>
        <v-btn
        class="button"
        @click="sendPedidoCons">
        Submeter
        </v-btn>
      </div>  
    </form>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken';
export default {
  props: ["token"],
  data() {
    return {
      consulta: {
        nome: "",
        numUtent: "",
        numUtentePedido: "",
        medico: "",
        objetivo: ""
      },
      meds:[],
      objs: ["Agendar consulta médica", "Confirmar dia e hora da consulta (médica ou de enfermagem)", "Desmarcar consulta (médica ou de enfermagem)", 
        "Pedido de contato telefónico - médico", "Pedido de contato telefónico - enfermagem"]
    }  
  },
  methods: {
    sendPedidoCons: function(){
      axios({
      method: 'post',
      url: "http://localhost:3333/consultas",
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }, 
      data: {
        nome: this.consulta.nome,
        nr_utente_titular: parseInt(this.consulta.numUtente),
        nr_utente_pedido: parseNumOpcional(this.consulta.numUtentePedido),
        medico: this.consulta.medico,
        tipo: this.consulta.objetivo
      }
    })
    function parseNumOpcional(num){
      if(num == ""){
        return null
      }
      else{
        return parseInt(num)
      }
    }
    this.$router.push("/formConfirm")
    }
  },
  created(){
    axios.get("http://localhost:3333/users/validar/" + this.token)
      .then( () => {
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
      url: "http://localhost:3333/users/listarMedicos",
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
    background-color: lightseagreen !important;
    margin-top: 10px;
  }

  .label{
    color:black;
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
    color: #555
  }

  .h1 {
    color:lightseagreen;
    font-size: 3em;
  }
  
  .p1{
    font-size: 0.9em;
    text-align: center;
  }

  .select{
    width:200px;
    height:30px;
    border: 1px solid black;
  }

</style>