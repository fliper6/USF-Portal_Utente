<template>
  <v-app id="app">
    <Navbar/>
    <router-view/>
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


</style>