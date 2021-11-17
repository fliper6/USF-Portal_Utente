<template>
  <div v-if="this.token">
    <PedidoMedicacao :token="this.token"/>
  </div>

  <div v-else style="text-align: center;" >
    <h1> Para aceder a esta página é necessário iniciar sessão!</h1>
    <div>
      <Login></Login>
    </div>
  </div>
</template>  

<script>

import PedidoMedicacao from '../components/PedidoMedicacao.vue'
import Login from '@/views/Login.vue';

export default {
  name: 'Medicacao',
  data () {
    return {
      token: localStorage.getItem('jwt')
    }
  },
  components: {
    PedidoMedicacao,
    Login
  }
}
</script>

<style>
</style>