<template>
  <div>
    <!-- 
      Modals 
    -->
    <modal-message
      title="Submeter?"
      :visible="modalConfirm"
      options
      @close="modalConfirm = false"
      @confirm="sendSugestao"
    >
      Deseja submeter esta sugestão?
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="goHome"
    >
      Sugestão enviada com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="this.modalError = false"
    >
      Erro ao enviar sugestão
    </modal-message>

    <!-- 
      Conteudo
    -->
    <div class="wrapper">
      <div class="title-area">
        <h1 class="h1">Enviar Sugestão</h1>
        <p class="p1">
          Este formulário serve para comunicar diretamente com a USF.</p>
      </div>
      <div class="form-area">
      <form id="formMed">
        <div class="info-area">
          <label class="label">Título</label>
          <v-text-field outlined color=var(--secondary-dark-color) @input="$v.titulo.$touch()" @blur="$v.titulo.$touch()" :error-messages="tituloErrors" maxlength="100" counter="100" v-model="titulo"></v-text-field> <br/>
          <label class="label">Sugestão</label>
          <v-textarea outlined color=var(--secondary-dark-color) @input="$v.sugestao.$touch()" @blur="$v.sugestao.$touch()" :error-messages="sugestaoErrors" v-model="sugestao"></v-textarea>
          <div>
            <v-btn class="button" @click="modalConfirm=true">Submeter</v-btn>
          </div> 
        </div> 
      </form>
      </div>
    </div>  
  </div>
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'
import ModalMessage from './ModalMessage.vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'


  export default {
    mixins: [validationMixin],
    name: "MakeSugestao",
    components: {
      ModalMessage
    },
    validations: {
      titulo: { required },
      sugestao: { required },
    },

    data() {
      return {
        token: localStorage.getItem('jwt'),
        titulo:'',
        sugestao:'',
        missTitulo: false,
        missSugestao: false,

        modal: false,
        modalConfirm: false,
        modalError: false
      }
    },
    
    computed: {
      tituloErrors () {
        const errors = []
        if (!this.$v.titulo.$dirty) return errors
        !this.$v.titulo.required && errors.push('Título é um campo obrigatório.')
        return errors
      },
      sugestaoErrors () {
        const errors = []
        if (!this.$v.sugestao.$dirty) return errors
        !this.$v.sugestao.required && errors.push('Corpo da sugestão é um campo obrigatório.')
        return errors
      },
    },

    methods: {
      sendSugestao (){
        this.$v.$touch()
        if (this.$v.titulo.required && this.$v.sugestao.required) {
          let user = jwt.decode(this.token)
          let body = {
            user: user._id,
            nr_utente: user.nr_utente,
            titulo: this.titulo,
            descricao: this.sugestao
          }
          axios.post("http://localhost:3333/sugestao", body, {headers:{'authorization':'Bearer '+ this.token}} )
          .then(() => {
            this.modalConfirm = false
            this.modal = true
          })
          .catch(err => {
            this.modalConfirm = false
            this.modalError = true
            console.log(JSON.stringify(err))
          })
        }
      },
      goHome () {
        this.modal=false
        this.$router.push('/')
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