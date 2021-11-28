<template>
  <div>
    <v-text-field color="#000000" v-model="titulo" label="Titulo" required hide-details outlined dense></v-text-field>
    <div class="files">
      <File 
        v-for="file,index in files" 
        :key="index" 
        :file="file" 
        icon="mdi-delete"
        @click-action="deleteFile"
      />
    </div>
    <Editor @submit="submit" @new-file="upFile"/>
  </div>
</template>

<script>
import Editor from "../components/Editor.vue"
import File from "../components/Editor/File.vue"
import axios from 'axios'
export default {
  name: 'Home',
  components: {
    Editor,
    File
  },
  data () {
    return {
      titulo: "",
      files: []
    }
  },
  methods: {
    submit (content) {
      let formData = new FormData();
      for (const i of Object.keys(this.files)) {
        formData.append('ficheiros', this.files[i])
      }
      formData.append('corpo', content)
      formData.append('titulo',this.titulo)

      axios.post('http://localhost:3333/noticias',
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
      console.log(this.files)
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