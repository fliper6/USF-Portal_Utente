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
        <span style="color: #ff5252; font-size: 12px;" v-if="$v.medicacao.nome.$invalid">Nome é um campo obrigatório.</span>
        <label class="label">2. Número de utente titular (Serviço Nacional de Saúde)</label>
        <input type="number" class="input-text" required v-model="medicacao.numUtente">
        <span style="color: #ff5252; font-size: 12px;" v-if="$v.medicacao.numUtente.$invalid">Número de utente é um campo obrigatório.</span>
        <label class="label">3. Número de utente a pedir (Serviço Nacional de Saúde)</label>
        <p class="p2">Caso pretenda pedir medicação para um utente do seu agregado familiar que não tenha capacidade para o fazer preencha este campo.</p>
        <input type="number" class="input-text" v-model="medicacao.numUtentePedido">
        <label class="label">4.Médico de Família</label>
        <div class="select-area">
          <v-select
          :items= meds
          @click="removeSpanMedicos"
          v-model="medicacao.medico"
          label="Médico de família"
          dense
          outlined
        ></v-select>
        <span style="color: #ff5252; font-size: 12px; margin-top:1px" v-if="medFlag" >Médico de família é um campo obrigatório.</span>
        </div>
        <label class="label">5.Medicamentos crónicos pretendidos</label>
        <p class="p2">Por favor escreva o nome do medicamento, a dosagem (em mg ou gr), o número de comprimidos e o número de embalagens que pretende.
Ex: Metformina 500 mg, 60 comprimidos, 2 caixas.</p>
        <input @input="removeSpanMedicamentos" type="text" class="input-text" required v-model="medicacao.medicamentos">
        <span style="color: #ff5252; font-size: 12px;" v-if="medicamentosFlag">Medicamentos é um campo obrigatório.</span>
        <label class="label">6. Forma em que pretende que lhe sejam enviadas as receitas</label>
      </div>    
          <div class="check">
            <label for="SMS">SMS</label>
            <input type="radio" class="input-radio" @click="showTele = true; showEmail = false; contactoFlag = false; getContactos()" required v-model="medicacao.contacto" value="SMS">
            <label for="Email">Email</label>
            <input type="radio" class="input-radio" @click="showEmail = true; showTele = false; contactoFlag = false; getContactos()" required v-model="medicacao.contacto" value="Email">
          </div>
          <span style="color: #ff5252; font-size: 12px;" v-if="contactoFlag">Campo obrigatório.</span>
          <modal v-if="showTele">
              <label class="label">Número de telemóvel</label>
              <input type="text" class="input-modal" v-model="medicacao.valorContacto.telemovel">
              <span style="color: #ff5252; font-size: 12px;" v-if="$v.medicacao.valorContacto.telemovel.$invalid">Número de Telémovel é um campo obrigatório.</span>
          </modal>
          <modal v-if="showEmail">
              <label class="label">Email</label>
              <input type="text" class="input-modal" v-model="medicacao.valorContacto.email">
              <span style="color: #ff5252; font-size: 12px;" v-if="$v.medicacao.valorContacto.email.$invalid">Email é um campo obrigatório.</span>
          </modal>
        <div>
          <v-btn class="button" @click="verifica()">Submeter</v-btn>
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
              Pretende submeter o pedido de medicação?</p>
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
            @click="sendPedidoMed(); dialog = false;">
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
    medicacao: {
      nome: { required },
      numUtente: { required },
      medicamentos: { required },
      contacto: { required },
      medico: {required},
      valorContacto: {
        email: {
          required (v) {
            return this.medicacao.valorContacto.email || required(v)
          }
        },
        telemovel: {
          required (v) {
            return this.medicacao.valorContacto.telemovel || required(v)
          }
        }
      }
    }
  },
  data() {
    return {
      medicacao: {
        user: "",
        nome: "",
        numUtente: "",
        numUtentePedido: "",
        medicamentos: "",
        medico: "",
        contacto: "",
        valorContacto: {
          telemovel: "",
          email: ""
        }
      },
      meds: [],
      showEmail: "",
      showTele: "",
      medFlag: false,
      medicamentosFlag: false,
      contactoFlag: false,
      dialog: false,
      dialog2:false
    }  
  },
  methods: {
    reload(){
      this.$router.push("/")
    },
    getContactos(){
      axios.get("http://localhost:3333/users/validar/" + this.token)
      .then( () => {
        this.medicacao.valorContacto.email = jwt.decode(this.token).email
        this.medicacao.valorContacto.telemovel = jwt.decode(this.token).nr_telemovel
      })
      .catch(() => {
        localStorage.clear()
        window.location.pathname = '/'
        alert("A sua sessão foi expirada!!")
      })
    },
    removeSpanMedicamentos: function(){
      this.medicamentosFlag = false
    },
    removeSpanMedicos: function(){
      this.medFlag = false
    },
    verifica: function(){
      if(this.$v.medicacao.medico.$invalid){
        this.medFlag = true
      }
      if(this.$v.medicacao.medicamentos.$invalid){
        this.medicamentosFlag = true
      }
      if(this.$v.medicacao.contacto.$invalid){
        this.contactoFlag = true
      }
      if(!this.$v.medicacao.$invalid){
        this.dialog = true
      }
    },
    sendPedidoMed(){
      if(!this.$v.medicacao.$invalid){
        axios({
          method: 'post',
          url: "http://localhost:3333/medicacao",
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }, 
          data: {
            nome: this.medicacao.nome,
            user: this.medicacao.user,
            nr_utente_titular: parseInt(this.medicacao.numUtente),
            nr_utente_pedido: this.parseNumOpcional(this.medicacao.numUtentePedido),
            medicacao: this.medicacao.medicamentos,
            medico: this.medicacao.medico,
            contacto: {
              tipo: this.converteContacto(this.medicacao.contacto),
              valor: (this.medicacao.contacto == 'SMS') ?  this.medicacao.valorContacto.telemovel : this.medicacao.valorContacto.email
            }
          }
        })
         this.dialog2 = true
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
    axios.get("http://localhost:3333/users/validar/" + this.token)
      .then( () => {
        this.medicacao.numUtente = jwt.decode(this.token).nr_utente
        this.medicacao.nome = jwt.decode(this.token).nome
        this.medicacao.user = jwt.decode(this.token)._id
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
        meds.data.forEach(med => {
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
  .info-area button {
    padding: 1em;
    margin-bottom: 1em;
  }
  .button{
    padding:  3px;
    background-color: var(--secondary-color) !important;
    margin-top: 30px;
  }
  .label{
    color: var(--grey3-color);
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
    color: var(--grey3-color)
  }
  .input-modal {
    display: block;
    padding: 10px 6px;
    width: 96%;
    height:30px;
    box-sizing: border-box;
    border: 1px solid #96918F;
    color: var(--grey3-color)
  }
  .check{
    display: flex;
    flex-direction: row;
    color: var(--grey3-color);
    align-content: center;
    align-items: center;
  }
  .h1 {
    color: var(--primary-color);
    font-size: 3em;
  }
  .p1{
    font-size: 0.9em;
    color: var(--grey3-color);
    text-align: center;
    padding: 10px 30px;
  }
  .p2{
    font-size: 1em;
    color: var(--grey3-color);
    max-width: 700px;
    width: 200%;
  }
  .input-radio{
    margin: 10px;
    padding: 5%;
  }
</style>