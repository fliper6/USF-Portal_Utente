<template>
<div class="wrapper">
    <div class="title-area">
      <h1 class="h1">Enviar Sugestão</h1>
      <p class="p1">Preencha cuidadosamente o formulário.
        Este formulário não pode ser usado para consulta no próprio dia (consulta urgente).</p>
    </div>
    <div class="form-area">
    <form id="formMed">
      <div class="info-area">
        <label class="label">1. Nome Completo</label>
        <input type="text" class="input-text" required v-model="consulta.nome">
        <span style="color: #ff5252; font-size: 12px;" v-if="$v.consulta.nome.$invalid"> Titulo é um campo obrigatório.</span>
        <label class="label">Sugestão</label>
        <v-textarea>

        </v-textarea>
        <span style="color: #ff5252; font-size: 12px;" v-if="$v.consulta.nome.$invalid">Sugestão é um campo obrigatório.</span>
        <div>
          <v-btn class="button" @click="verifica">Submeter</v-btn>
        </div> 
      </div> 
    </form>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'

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
      alteraEstado (){
        axios.put("http://localhost:3333/consultas/altE",{headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          //this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
      }
   }
  
  }
</script>