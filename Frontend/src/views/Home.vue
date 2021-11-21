<template>
  <div class="home">
    <Noticia v-for="(noticia,n) in noticias" :noticia='noticia' :timeAgo="timeAgo" :key="n" />
  </div>
</template>

<script>
import axios from 'axios'
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
      timeAgo: null
    }
  },
  mounted () {
    TimeAgo.addDefaultLocale(pt)
    this.timeAgo = new TimeAgo('pt-PT')

    axios.get('http://localhost:3333/noticias')
      .then(data => {console.log(data.data); this.noticias = data.data })
      .catch(err => console.log(err))
  } 
}
</script>
