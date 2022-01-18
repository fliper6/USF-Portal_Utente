<template>
  <div>
    <!-- 
      Modals 
    -->
    <modal-message
      title="Remover?"
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
          <input type="text" class="input-text" required v-model="titulo" @blur="checkTitulo" @input="missTitulo=false" />
          <span style="color: #ff5252; font-size: 12px;" v-if="missTitulo"> Título é um campo obrigatório.</span>

          <label class="label">Sugestão</label>
          <textarea required v-model="sugestao" class="input-box" @blur="checkSugestao" @input="missSugestao=false" />
          <span style="color: #ff5252; font-size: 12px;" v-if="missSugestao">Sugestão é um campo obrigatório.</span>

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

  export default {
    name: "MakeSugestao",
    components: {
      ModalMessage
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
    methods: {
      sendSugestao (){
        if(!this.checkRequired()) return false
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
      },
      checkRequired () {
        let titulo = this.checkTitulo()
        let sugestao = this.checkSugestao()

        if(!titulo)
          return false
        if(!sugestao)
          return false
        return true
      },
      checkTitulo () {
        if(!this.titulo) {
          this.missTitulo = true
          return false
        }
        return true
      },
      checkSugestao () {
        if(!this.sugestao) {
          this.missSugestao = true
          return false
        }
        return true
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
  .input-text {
    display: block;
    padding: 10px 6px;
    height:30px;
    box-sizing: border-box;
    border: 1px solid #96918F;
    color: var(--grey3-color);
  }

  .input-box {
    display: block;
    padding: 10px 6px;
    height:200px;
    box-sizing: border-box;
    border: 1px solid #96918F;
    color: var(--grey3-color);
    resize:none;
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