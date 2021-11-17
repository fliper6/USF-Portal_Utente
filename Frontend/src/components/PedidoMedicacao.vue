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
        <label class="label">2. Número de utente titular (Serviço Nacional de Saúde)</label>
        <input type="number" class="input-text" required v-model="medicacao.numUtente">
        <label class="label">3. Número de utente a pedir (Serviço Nacional de Saúde)</label>
        <p class="p2">Caso pretenda pedir medicação para um utente do seu agregado familiar que não tenha capacidade para o fazer preencha este campo.</p>
        <input type="number" class="input-text" v-model="medicacao.numUtentePedido">
        <label class="label">4.Médico de Família</label>
        <div class="select-area">
          <v-select
          :items= meds
          v-model="medicacao.medico"
          label="Médico de família"
          dense
          outlined
        ></v-select>
        </div>
        <label class="label">5.Medicamentos crónicos pretendidos</label>
        <p class="p2">Por favor escreva o nome do medicamento, a dosagem (em mg ou gr), o número de comprimidos e o número de embalagens que pretende.
Ex: Metformina 500 mg, 60 comprimidos, 2 caixas.</p>
        <input type="text" class="input-text" required v-model="medicacao.medicamentos">
          <label class="label">6. Forma em que pretende que lhe sejam enviadas as receitas</label>
      </div>    
          <div class="check">
            <label for="SMS">SMS</label>
            <input type="radio" class="input-radio" @click="showTele = true; showEmail = false" required v-model="medicacao.contacto" value="SMS">
            <label for="Email">Email</label>
            <input type="radio"  class="input-radio" @click="showEmail = true; showTele = false" required v-model="medicacao.contacto" value="Email">
          </div>
          <modal v-if="showTele" @close="showTele = false">
              <label class="label">Número de telemóvel</label>
              <input type="text" class="input-modal" v-model="medicacao.telemovel">
          </modal>
          <modal v-if="showEmail" @close="showEmail = false">
              <label class="label">Email</label>
              <input type="text" class="input-modal" v-model="medicacao.email">
          </modal>
        <div>
          <v-btn
          class="button"
          @click="sendPedidoMed">
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
      medicacao: {
        nome: "",
        numUtente: "",
        numUtentePedido: "",
        medicamentos: "",
        medico: "",
        contacto: "",
        telemovel: "",
        email: ""
      },
      meds: [],
      showEmail: "",
      showTele: "",
    }  
  },
  methods: {
    sendPedidoMed: function(){
      axios({
      method: 'post',
      url: "http://localhost:3333/medicacao",
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }, 
      data: {
        nome: this.medicacao.nome,
        nr_utente_titular: parseInt(this.medicacao.numUtente),
        nr_utente_pedido: parseNumOpcional(this.medicacao.numUtentePedido),
        medicacao: this.medicacao.medicamentos,
        medico: this.medicacao.medico,
        contacto: {
          tipo: converteContacto(this.medicacao.contacto),
          valor: (this.medicacao.contacto == 'SMS') ?  this.medicacao.telemovel : this.medicacao.email
        }
      }
    })
    function converteContacto(cont){
      if(cont == "SMS"){
        return 1
      }
      else if (cont == "Email"){
        return 0
      }
    }

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
        this.medicacao.numUtente = jwt.decode(this.token).nr_utente
        this.medicacao.email = jwt.decode(this.token).email
        this.medicacao.telemovel = jwt.decode(this.token).nr_telemovel
        this.medicacao.nome = jwt.decode(this.token).nome
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
    background-color: lightseagreen !important;
    margin-top: 20px;
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
    font-size: 1em;
    letter-spacing: 0.5px;
    font-weight: bold;
  }
  .input-text {
    display: block;
    padding: 10px 6px;
    width: 100%;
    height:30px;
    box-sizing: border-box;
    border: 1px solid #96918F;
    color: #555
  }
  .input-modal {
    display: block;
    padding: 10px 6px;
    width: 96%;
    height:30px;
    box-sizing: border-box;
    border: 1px solid #96918F;
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
    font-size: 3em;
  }
  .p1{
    font-size: 0.9em;
    text-align: center;
    padding: 10px 30px;
  }
  .p2{
    font-size: 1em;
    max-width: 700px;
    width: 200%;
  }
  .sub{
    padding:  3px;
    background-color: lightseagreen;
    width: 23%;
  }
  .input-radio{
    margin: 10px;
    padding: 5%;
  }
</style>