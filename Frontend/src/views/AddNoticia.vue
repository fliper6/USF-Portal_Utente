<template>
  <div>
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
      Quando deseja publicar esta notícia?
      <div class="parameters">
        <v-radio-group
          v-model="publishNow"
          column          
        >
          <v-radio
            label='Agora'
            :value='true'
            color="#800000"
          ></v-radio>
          <div class="publish-time">
            <v-radio
              label="Mais tarde"
              :value="false"
              color="#800000"
            ></v-radio>
            <date-picker
              :disabled="publishNow" 
              v-model="date"
            />
          </div>
        </v-radio-group>
        <v-divider class="publish-divider" />
        <div style="align-self: start">Deseja que esta notícia seja recorrente?</div>
        <div class="publish-time">
          <v-checkbox
            v-model="publishRepeat"
            label="Noticia recorrente"
            color="#800000"
          />
          <input-recurrence 
            v-model="recurrenceArray"
            :disabled="!publishRepeat"
          />
        </div>
      </div>
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="goHome"
    >
      Notícia publicada com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="goHome"
    >
      Erro ao publicar notícia
    </modal-message>

    <!--
      Content
    -->
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
    <Editor @submit="prompt" @new-file="upFile"/>
  </div>
</template>

<script>
import Editor from "../components/Editor.vue"
import File from "../components/Editor/File.vue"
import ModalMessage from '../components/ModalMessage.vue'
import DatePicker from '../components/Editor/DatePicker.vue'
import InputRecurrence from '../components/Editor/InputRecurrence.vue'

import axios from 'axios'
export default {
  name: 'Home',
  components: {
    Editor,
    File,
    ModalMessage,
    DatePicker,
    InputRecurrence
  },
  data () {
    return {
      titulo: "",
      files: [],
      conteudo: "",
      date: Date.now(),
      recurrenceArray: [0,0,0,0,0,0],

      publishNow: true,
      publishRepeat: false,

      modal: false,
      modalConfirm: false,
      modalError:false,

    }
  },
  methods: {
    prompt (content) {
      this.conteudo = content
      this.modalConfirm = true
    },
    submit () {
      this.modalConfirm=false
      let formData = new FormData();
      for (const i of Object.keys(this.files)) {
        formData.append('ficheiros', this.files[i])
      }
      formData.append('corpo', this.conteudo)
      formData.append('titulo',this.titulo)
      let data_pub = this.publishNow ? 'now' : this.date
      formData.append('data_pub', data_pub)
      formData.append('recorrencia', this.recurrenceArray)

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
      }).catch(() => { this.modalError = true });
    },
    goHome() {
      this.modal=false
      this.modalError=false
      this.$router.push('/')
    },
    upFile(file) {
      this.files.push(file)
    },
    deleteFile(file) {
      let id = this.files.indexOf(file)
      this.files.splice(id, 1);
    },
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

.parameters {
  display: flex;
  flex-direction: column;
  align-items: center;
  width:auto;
  height:auto;
}

.publish-divider {
  margin-bottom: 30px;
  width:100%;
}

.publish-time {
  display: flex;
}

</style>