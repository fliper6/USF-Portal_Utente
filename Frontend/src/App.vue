<template>
  <v-app id="app">
    <Navbar/>
  </v-app>
</template>

<script>
import Navbar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
@import './utils/colors.css';


#app{
  margin: 2% 5%;
}
</style>