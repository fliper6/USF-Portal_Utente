<template>
  <div v-if="!loading">
    <!-- 
      Modals 
    -->
    <modal-message
      title="Publicar?"
      :visible="modalConfirm"
      options
      @close="modalConfirm = false"
      @confirm="submit"
    >
      Deseja editar esta notícia ?
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="goHome"
    >
      Notícia editada com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="goHome"
    >
      Erro ao editar a noticia.
    </modal-message>

    <!--
      Content
    -->
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
      @submit="confirmEdit" 
      :conteudo="noticia.corpo" 
      @new-file="upFile"
    />
  </div>
</template>

<script>
import Editor from "../components/Editor.vue"
import File from '../components/Editor/File.vue'
import ModalMessage from '../components/ModalMessage.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Editor,
    File,
    ModalMessage
  },
  data () {
    return {
      loading: true,
      noticia: null,
      files: [],

      modal: false,
      modalConfirm: false,
      modalError: false
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
    submit () {
      this.modalConfirm = false
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

      axios.put('http://localhost:3333/noticias/editar/' + this.noticia._id,
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(() => {
        this.modal = true

      }).catch(() => { this.modalError = true });
    },
    confirmEdit (content) {
      this.noticia.corpo = content
      this.modalConfirm = true
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
    },
    goHome () {
      this.modal = false
      this.modalErros = false
      this.$router.push('/')
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