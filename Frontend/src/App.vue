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

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

</style>