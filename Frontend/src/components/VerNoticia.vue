<template>
  <div class="container">
    <div class="meta">{{tempo}} por {{noticia.nome_autor}} </div>
    <div class="title-row">
      <div class="title">{{noticia.titulo}}</div>
    </div>
    <div v-html="noticia.corpo" />
    <div class="files">
      <File 
        v-for="file,index in $props.noticia.ficheiros"  
        :key="index" 
        :file="file" 
        icon="mdi-download"
        @click-action="downloadFile"
      />
    </div>
  </div>
</template>  

<script>
import axios from 'axios'
const host = require('../../../config.json').backend
import jwt from 'jsonwebtoken'
import File from './Editor/File.vue'

export default {
  name: 'VerNoticia',
  props: ["noticia" , "timeAgo"],
  components: {
    File
  },
  data () {
    return {
      token: localStorage.getItem('jwt'),
      tempo: ''
    }
  },
  methods: {
    downloadFile (file) {
      axios.get(host + '/noticias/download',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          },
          params: {
            id_noticia: this.$props.noticia._id,
            id_ficheiro: file._id
          },
          responseType: 'blob'
        })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.nome_ficheiro); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => console.log(err))
    },
    testNivel () {
      if(this.token) {
        this.nivel = jwt.decode(this.token).nivel
        if(this.nivel=='Administrador'||this.nivel=='Secretário')
          return true
      }
      return false
    },
  }
}
</script>

<style scoped>
.container {
  width: 80vw;
  padding-bottom: 30px;
  margin-bottom: 20px
}

.meta {
  font-size: 0.7em !important;
  color: var(--gray);
  margin-left:3px;
  margin-bottom:5px;
}

.title-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-size: 2em !important;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.dropdown {
  display: flex;
  flex-direction: column;
}

.text {
  margin-bottom: 20px;
}

.attachments {
  display: flex;
  justify-content: center;
}

.container >>> img {
  display: block;
  margin: 10px auto;
  max-width: 50vw;
  max-height: 60vh;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.container >>> video {
  display: block;
  margin: 10px auto;
  max-width: 50vw;
  max-height: 60vh;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.files {
  width:100%;
  display: grid;
  grid-template-columns: repeat(6, 150px);
  gap: 17px;
  margin: 32px 0;
}
</style>