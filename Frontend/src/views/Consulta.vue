<template>
  <div v-if="this.token">
    <PedidoConsulta :token="this.token"/>
  </div>

  <div v-else style="text-align: center;" >
    <h1> Para aceder a esta página é necessário iniciar sessão!</h1>
    <div>
      <Login :isOpen="true" :show="false"></Login>
    </div>
  </div>
</template>  

<script>
import PedidoConsulta from '../components/PedidoConsulta.vue'
import Login from '@/views/Login.vue';

export default {
  name: 'Consulta',
  data () {
    return {
      token: localStorage.getItem('jwt')
    }
  },
  components: {
    PedidoConsulta,
    Login
  }
}
</script>

<style>
</style>