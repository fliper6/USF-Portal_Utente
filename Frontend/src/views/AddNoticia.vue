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
            label="Notícia recorrente"
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
      {{modalMessage}}
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="modalError=false"
    >
      {{errorMessage}}
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
      date: new Date(Date.now()).toISOString(),
      recurrenceArray: [0,6,0,0,0,0],

      publishNow: true,
      publishRepeat: false,

      modal: false,
      modalMessage: "",
      errorMessage: "",
      modalConfirm: false,
      modalError:false,

    }
  },
  methods: {
    prompt (content) {
      if(this.titulo) {
        this.conteudo = content
        this.modalConfirm = true
      } else {
        this.errorMessage = "Por favor introduza um título para a notícia."
        this.modalError = true;
      }
    },
    submit () {
      this.modalConfirm=false
      if (!this.publishNow && (new Date(this.date).getTime() < Date.now())) {
        this.errorMessage = "Por favor introduza uma data futura válida."
        this.modalError=true
      } else {
        this.submitNoticia();
      }
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
    submitNoticia() {
      let formData = new FormData();
      for (const i of Object.keys(this.files)) {
        formData.append('ficheiros', this.files[i])
      }
      formData.append('corpo', this.conteudo)
      formData.append('titulo',this.titulo)
      let data_pub = this.publishNow ? 'now' : this.date
      formData.append('data_pub', data_pub)
      let rec_array = this.publishRepeat ? this.recurrenceArray : [0,0,0,0,0,0]
      formData.append('recorrencia', rec_array)
      axios.post('http://localhost:3333/noticias',
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(() => {
        this.modalMessage = `Noticia ${!this.publishNow ? 'agendada' : 'publicada'} ${this.publishNow && this.publishRepeat ? 'e agendada' : ''} com sucesso` 
        this.modal = true
      }).catch(() => { 
        this.errorMessage = "Erro ao publicar a noticia."
        this.modalError = true 
      })
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