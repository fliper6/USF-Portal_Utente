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
          <select v-model="consulta.medico" form="formMed" class="select">
            <option value="volvo"></option>
            <option value="saab">Nuno Cunha</option>
            <option value="opel">Pedro Parente</option>
            <option value="audi">Joaquim Silva</option>
          </select>
        </div>
        <label class="label">4.O que pretende?</label>
        <div class="select-area">
          <select v-model="consulta.objetivo" form="formMed" class="select">
            <option value="agendar">Agendar consulta médica</option>
            <option value="confirmar">Confirmar dia e hora da consulta (médica ou de enfermagem)</option>
            <option value="desmarcar">Desmarcar consulta (médica ou de enfermagem)</option>
            <option value="telmed">Pedido de contato telefónico - médico</option>
            <option value="telenf">Pedido de contato telefónico - enfermagem</option>
          </select>
        </div>
        <p class="p2">Por favor escreva o nome do medicamento, a dosagem (em mg ou gr), o número de comprimidos e o número de embalagens que pretende.
Ex: Metformina 500 mg, 60 comprimidos, 2 caixas</p>
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
        medico: "",
        objetivo: ""
      }
    }  
  }
}
</script>

<style>
  .wrapper{
    width: 800px;
    margin: 5% auto;
  }
  .title-area{
    display: flex;
    align-content: center;
    flex-direction: column;
    align-items: center;
  }
  .form-area{
    display: flex;
    justify-content: center;
  }
  .info-area{
    flex-direction: column;
    flex:1;
    order:1;
    margin-right:2em;
  }
  .info-area input {
    width: 100%;
  }
  .info-area button {
    padding: 1em;
    margin-bottom: 1em;
  }
  .button{
    padding:  3px;
    background-color: lightseagreen;
    border: 1px solid lightseagreen;
    border-radius: 5px;
    width: 12%;
  }
  .cab-area{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
  }
  .label{
    color:black;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.8em;
    letter-spacing: 0.5px;
    font-weight: bold;
  }
  .input-text {
    display: block;
    padding: 10px 6px;
    height:30px;
    max-width: 700px;
    box-sizing: border-box;
    border: 1px solid black;
    color: #555
  }
  .check{
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
  }
  .h1 {
    color:lightseagreen;
    font-size: 2em;
  }
  .p1{
    font-size: 0.7em;
    text-align: center;
    max-width: 700px;
    padding: 10px 30px;
  }

  .select{
    width:200px;
    height:30px;
    border: 1px solid black;
  }
  .sub{
    padding:  3px;
    background-color: lightseagreen;
    border: 1px solid lightseagreen;
    border-radius: 5px;
    width: 23%;
  }
  .input-radio{
    margin: 10px;
    padding: 5%;
  }
</style>