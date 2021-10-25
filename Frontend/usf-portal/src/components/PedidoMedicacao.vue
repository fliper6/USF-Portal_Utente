<template>
  <div>
    <h1 class="h1">Pedido de Medicação</h1>
    <div><p class="p1">O seu pedido será enviado para o seu Médico de família que enviará a sua receita com medicação crónica dentro do seu horário laboral (8h-20h, dias úteis) num tempo máximo de 3 dias úteis. Preencha cuidadosamente o formulário. Não use outros meios (telefone ou e-mail) para fazer o mesmo pedido de medicação.</p></div>
    <form class="form" id="formMed">
        <label class="label">1. Nome Completo</label>
        <input type="text" required v-model="medicacao.nome" class="inputText">
        <label class="label">2. Número de utente (Serviço Nacional de Saúde)</label>
        <input type="number" required v-model="medicacao.numUtente" class="inputText">
        <label class="label">3.Médico de Família</label>
        <div>
          <select v-model="medicacao.medico" form="formMed" class="select">
            <option value="volvo"></option>
            <option value="saab">Saab</option>
            <option value="opel">Opel</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <label class="label">4.Medicamentos crónicos pretendidos</label>
        <p class="p2">Por favor escreva o nome do medicamento, a dosagem (em mg ou gr), o número de comprimidos e o número de embalagens que pretende.
Ex: Metformina 500 mg, 60 comprimidos, 2 caixas</p>
        <input type="text" required v-model="medicacao.medicamentos" class="inputText">
        <label class="label">5. Forma em que pretende que lhe sejam enviadas as receitas</label>
        <input type="radio" required v-model="medicacao.formato" value="SMS">
        <label for="SMS" class="labelOp">SMS</label>
        <input type="radio" required v-model="medicacao.formato" value="Email">
        <label for="Email" class="labelOp">Email</label>
        <div class="sub">
          <input type="submit" value="Submeter">
        </div>
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
        medicamentos: "",
        medico: "",
        formato: ""
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
    transform: translate(90%, -26%);
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
  .inputText {
    display: block;
    padding: 10px 6px;
    width: 200%;
    height:30px;
    box-sizing: border-box;
    border: 1px solid black;
    color: #555
  }
  .h1 {
    color:lightseagreen;
    font-size: 2em;
    transform: translate(34%, 100%);
  }
  .p1{
    font-size: 0.7em;
    text-align: center;
    max-width: 700px;
    margin: 20px-auto;
    padding: 100px 30px;
    transform: translate(60%, -20%);
  }
  .p2{
    font-size: 0.7em;
    max-width: 700px;
    width: 200%;
  }
  .labelOp{
    padding:10px;
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
    transform: translate(780%, 24%);
  }
</style>