<template>
<div>
  <h1 class="h1">Pedido de Medicação</h1>
  <p class="p">O seu pedido será enviado para o seu Médico de família que enviará a sua receita com medicação crónica dentro do seu horário laboral (8h-20h, dias úteis) num tempo máximo de 3 dias úteis. Preencha cuidadosamente o formulário. Não use outros meios (telefone ou e-mail) para fazer o mesmo pedido de medicação.</p>
  <form class="form">
      <label class="label">1. Nome Completo</label>
      <input type="text" required v-model="medicacao.nome" class="input">
      <label class="label">2. Número de utente (Serviço Nacional de Saúde)</label>
      <input type="text" required v-model="medicacao.numUtente" class="input">
      <label class="label">3.Médico de Família</label>
      <input type="text" required v-model="medicacao.numUtente" class="input">
      <label class="label">3.Medicamentos crónicos pretendidos</label>
      <input type="text" required v-model="medicacao.medicamentos" class="input">
  </form>
</div>  
</template>

<script>
export default {
  data() {
    return {
      medicacao: {
        nome: "",
        numUtent: "",
        medicamentos: ""
      }
    }  
  }
}
</script>

<style>
  .form {
    max-width: 420px;
    margin: 30px-auto;
    background: white;
    text-align: left;
    padding: 40px;
    border-radius: 10px;
    transform: translate(90%, -30%);
  }
  .label {
    color:black;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: bold;
  }
  .input {
    display: block;
    padding: 10px 6px;
    width: 200%;
    box-sizing: border-box;
    border: 1px solid black;
    color: #555
  }
  .h1 {
    color:lightseagreen;
    font-size: 2em;
    transform: translate(40%, 100%);
  }
  .p{
    font-size: 0.7em;
    max-width: 700px;
    margin: 20px-auto;
    padding: 100px 10px;
    transform: translate(60%, -20%);
  }
  .p2{
    font-size: 0.7em;
    max-width: 700px;
    margin: 20px-auto;
    padding: 100px 10px;
    transform: translate(-2%, -47%);
    width: 200%;
  }
</style>