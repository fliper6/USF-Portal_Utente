<template>
  <div class="wrapper">
    <div class="title-area">
      <h1 class="h1">Pedido de Contato</h1>
      <p class="p1">Preencha cuidadosamente o formulário.
Este formulário não pode ser usado para consulta no próprio dia (consulta urgente).</p>
    </div>
    <div class="form-area">
    <form id="formMed">
      <div class="info-area">
        <label class="label">1. Nome Completo</label>
        <input type="text" class="input-text" required v-model="consulta.nome">
        <label class="label">2. Número de utente (Serviço Nacional de Saúde)</label>
        <input type="number" class="input-text" required v-model="consulta.numUtente">
        <label class="label">3.Médico de Família</label>
        <div class="select-area">
          <v-select
          :items="consulta.medico"
          label="Médico de família"
          dense
          outlined
        ></v-select>
        </div>
        <label class="label">4.O que pretende?</label>
        <div class="select-area">
          <v-select
          :items="consulta.objetivo"
          label="O que pretende?"
          dense
          outlined
        ></v-select>
        </div>
      </div>    
      <div><button type="submit" class="button">Submeter</button></div>  
    </form>
    </div>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      consulta: {
        nome: "",
        numUtent: "",
        medico: ["Nuno Cunha", "Pedro Parente", "Joaquim Silva"],
        objetivo: ["Agendar consulta médica", "Confirmar dia e hora da consulta (médica ou de enfermagem)", "Desmarcar consulta (médica ou de enfermagem)", 
        "Pedido de contato telefónico - médico", "Pedido de contato telefónico - enfermagem"]
      }
    }  
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
    background-color: lightseagreen;
    border: 1px solid lightseagreen;
    border-radius: 5px;
    margin-top: 5px;
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