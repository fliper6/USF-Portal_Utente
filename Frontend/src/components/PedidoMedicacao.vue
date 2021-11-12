<template>
  <div class="wrapper">
    <div class="title-area">
      <h1 class="h1">Pedido de Medicação</h1>
      <p class="p1">O seu pedido será enviado para o seu Médico de família que enviará a sua receita com medicação crónica dentro do seu horário laboral (8h-20h, dias úteis) num tempo máximo de 3 dias úteis. Preencha cuidadosamente o formulário. Não use outros meios (telefone ou e-mail) para fazer o mesmo pedido de medicação.</p>
    </div>
    <div class="form-area">
    <form id="formMed">
      <div class="info-area">
        <label class="label">1. Nome Completo</label>
        <input type="text" class="input-text" required v-model="medicacao.nome">
        <label class="label">2. Número de utente (Serviço Nacional de Saúde)</label>
        <input type="number" class="input-text" required v-model="medicacao.numUtente">
        <label class="label">3.Médico de Família</label>
        <div class="select-area">
          <select v-model="medicacao.medico" form="formMed" class="select">
            <option value="volvo"></option>
            <option value="saab">Nuno Cunha</option>
            <option value="opel">Pedro Parente</option>
            <option value="audi">Joaquim Silva</option>
          </select>
        </div>
        <label class="label">4.Medicamentos crónicos pretendidos</label>
        <p class="p2">Por favor escreva o nome do medicamento, a dosagem (em mg ou gr), o número de comprimidos e o número de embalagens que pretende.
Ex: Metformina 500 mg, 60 comprimidos, 2 caixas</p>
        <input type="text" class="input-text" required v-model="medicacao.medicamentos">
          <label class="label">5. Forma em que pretende que lhe sejam enviadas as receitas</label>
      </div>    
          <div class="check">
            <label for="SMS">SMS</label>
            <input type="radio" class="input-radio" required v-model="medicacao.formato" value="SMS">
            <label for="Email">Email</label>
            <input type="radio"  class="input-radio" required v-model="medicacao.formato" value="Email">
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
      medicacao: {
        nome: "",
        numUtent: "",
        medicamentos: "",
        medico: "",
        formato: ""
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
    width: 200%;
    height:30px;
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
  .p2{
    font-size: 0.7em;
    max-width: 700px;
    width: 200%;
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