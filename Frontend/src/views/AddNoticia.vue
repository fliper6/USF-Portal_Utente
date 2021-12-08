<template>
  <div>
    <modal-message
      :title="modalConfirmTitle"
      :visible="modalConfirm"
      options
      @close="modalconfirm = false"
      @confirm="submit"
    >
      {{modalConfirmMessage}}
    </modal-message>
    <modal-message
      :title="modalTitle"
      :visible="modal"
      @close="goHome"
    >
      {{modalMessage}}
    </modal-message>
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
    <Editor @submit="modalConfirm=true" @new-file="upFile"/>
  </div>
</template>

<script>
import Editor from "../components/Editor.vue"
import File from "../components/Editor/File.vue"
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
      titulo: "",
      files: [],

      modal: false,
      modalTitle: "Sucesso",
      modalMessage: "Notícia publicada com sucesso",

      modalConfirm: false,
      modalConfirmTitle: "Publicar?",
      modalConfirmMessage: "Deseja publicar esta notícia publicamente no feed?"
    }
  },
  methods: {
    submit (content) {
      this.modalConfirm=false
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
        this.modal = true
      }).catch(err => { console.log(err) });
    },
    goHome() {
      this.modal=false
      this.$router.push('/')
    },
    upFile(file) {
      this.files.push(file)
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