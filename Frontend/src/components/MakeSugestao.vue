<template>
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
        <input type="text" class="input-text" required v-model="titulo">
        <span style="color: #ff5252; font-size: 12px;" v-if="false"> Título é um campo obrigatório.</span>
        <label class="label">Sugestão</label>
        <textarea v-model="sugestao" class="input-box">

        </textarea>
        <span style="color: #ff5252; font-size: 12px;" v-if="false">Sugestão é um campo obrigatório.</span>
        <div>
          <v-btn class="button" @click="sendSugestao">Submeter</v-btn>
        </div> 
      </div> 
    </form>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'

  export default {
    name: "MakeSugestao",
    data() {
      return {
        token: localStorage.getItem('jwt'),
        titulo:'',
        sugestao:''
        
      }
    },
    methods: {
      sendSugestao (){
        let user = jwt.decode(this.token)
        let body = {
          user: user._id,
          nr_utente: user.nr_utente,
          titulo: this.titulo,
          descricao: this.sugestao
        }
        axios.post("http://localhost:3333/sugestao", body, {headers:{'authorization':'Bearer '+ this.token}} )
        .then(() => {
          this.$route.go()
        })
        .catch(err => {
          console.log(JSON.stringify(err))
        })
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