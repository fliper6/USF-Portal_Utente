<template>

  <div v-if="this.token">
    <MakeSugestao/>   
  </div>


  <div v-else style="text-align: center;" >
    <h1> Para aceder a esta página é necessário iniciar sessão!</h1>
    <div>
      <Login :isOpen="true" :show="false"></Login>
    </div>
  </div>

</template>

<script>

import MakeSugestao from '../components/MakeSugestao.vue'
import Login from '@/views/Login.vue';

  export default {
    name: "Sugestao",
    data() {
      return {
        token: localStorage.getItem('jwt'),        
      }
    },
    components: {
      MakeSugestao,
      Login
    },
    methods: { 
    }
  
  }
</script>

<style>

</style>