<template>
  <div class="home">
    <v-btn v-if="testNivel()==true" class="button-principal" to="/noticia/publicar">
      <v-icon dense>mdi-newspaper</v-icon> Criar nova noticia
    </v-btn>
    <Noticia v-for="(noticia,n) in noticias" :noticia='noticia' @deleteMe="deleteMe" :timeAgo="timeAgo" :key="n" />
    <v-progress-circular
      v-if="loadingNews"
      indeterminate
      color="#800000"
    ></v-progress-circular>
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
      lastPage: false,
      loadingNews: true,
      noticias: [],
      timeAgo: null,
      token: localStorage.getItem('jwt'),
    }
  },
  created () {
    TimeAgo.addLocale(pt)
    this.timeAgo = new TimeAgo('pt-PT')

    axios.get('http://localhost:3333/noticias?visibilidade=0&skip=0')
      .then(data => {
        this.noticias = this.noticias.concat(data.data) 
        this.loadingNews = false;
      })
      .catch(err => console.log(err))
  },
  mounted () {
    window.onscroll = () => {
      let bottomOfWindow = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
      if (bottomOfWindow && !this.loadingNews && !this.lastPage) {
        this.loadingNews = true;
        this.getNextPage();
      }
    }
  },
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
    },
    getNextPage() {
      axios.get('http://localhost:3333/noticias?visibilidade=0&skip=' + this.noticias.length)
        .then(data => {
          if(!data.data || data.data.length < 10) this.lastPage = true
          this.noticias = this.noticias.concat(data.data) 
          this.loadingNews = false; 
        })
        .catch(err => console.log(err))
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