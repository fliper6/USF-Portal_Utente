<template>
  <div v-if="!loading">
    <v-text-field class="label" color="#000000" v-model="noticia.titulo" label="Titulo" required hide-details outlined dense></v-text-field>
    <div class="files">
      <File 
        v-for="file in noticia.ficheiros" 
        :key="file._id" 
        :file="file" 
        icon="mdi-delete"
        @click-action="deleteExistingFile"
      />
      <File 
        v-for="file,index in this.files" 
        :key="index" 
        :file="file" 
        icon="mdi-delete"
        @click-action="deleteExistingFile"
      />
    </div>
    <Editor
      @submit="submit" 
      :conteudo="noticia.corpo" 
      @new-file="upFile"
    />
  </div>
</template>

<script>
import Editor from "../components/Editor.vue"
import File from '../components/Editor/File.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Editor,
    File
  },
  data () {
    return {
      loading: true,
      noticia: null,
      files: [],
    }
  },
  created () {
   axios.get('http://localhost:3333/noticias/' + this.$route.params.id)
    .then(data => {
       this.noticia = data.data
       this.loading = false
      })
    .catch(err => console.log(err))
  },
  methods: {
    submit (content) {
      this.noticia.corpo = content
      let formData = new FormData();
      for (const key of Object.keys(this.noticia)) {
        if(Array.isArray(this.noticia[key])){
          formData.append(key, JSON.stringify(this.noticia[key]))
        } else {
          formData.append(key, this.noticia[key])
        }
      }
      for (const i of Object.keys(this.files)) {
        formData.append('ficheiros', this.files[i])
      }

      axios.post('http://localhost:3333/noticias/editar/' + this.noticia._id,
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(() => {
        this.$router.push('/')

      }).catch(err => { console.log(err) });
    },
    upFile(file) {
      this.files.push(file)

    },
    deleteExistingFile(file) {
      let id = this.noticia.ficheiros.indexOf(file)
      this.noticia.ficheiros.splice(id, 1);
    },
    deleteFile(file) {
      let id = this.files.indexOf(file)
      this.files.splice(id, 1);
    }
  }
}
</script>

<style scoped>

.files {
  width:100%;
  display: grid;
  grid-template-columns: repeat(6, 150px);
  gap: 17px;
  margin: 16px 0;
}

</style>