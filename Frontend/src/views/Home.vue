<template>
  <div class="home">
    <v-btn v-if="testNivel()==true" class="button-principal" to="/noticia/publicar">
      <v-icon dense>mdi-newspaper</v-icon> Criar nova noticia
    </v-btn>
    <Noticia v-for="(noticia,n) in noticias" :noticia='noticia' @deleteMe="deleteMe" :timeAgo="timeAgo" :key="n" />
    <div v-if="noticias.length < 1 || !noticias">
      <br/> Não existem noticias neste momento
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'
import TimeAgo from 'javascript-time-ago'
import pt from 'javascript-time-ago/locale/pt.json'
import Noticia from "../components/Noticia.vue"

export default {
  name: 'Home',
  components: {
    Noticia
  },
  data () {
    return {
      noticias: [],
      timeAgo: null,
      token: localStorage.getItem('jwt'),
    }
  },
  mounted () {
    TimeAgo.addDefaultLocale(pt)
    this.timeAgo = new TimeAgo('pt-PT')

    axios.get('http://localhost:3333/noticias')
      .then(data => {
        console.log(data)
        this.noticias = data.data 
      })
      .catch(err => console.log(err))
  } ,
  methods: {
    testNivel () {
      if(this.token) {
        this.nivel = jwt.decode(this.token).nivel
        if(this.nivel=='Administrador'||this.nivel=='Secretário')
          return true
      }
      return false
    },
    deleteMe(id) {
      this.noticias = this.noticias.filter(elem => elem._id != id)
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%
}
</style>