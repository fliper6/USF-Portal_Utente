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
      Deseja publicar esta notícia publicamente no feed?
      <div class="parameters">
        <v-radio-group
          v-model="publishNow"
          column
          @change="changePublishDate"
        >
          <v-radio
            label='Agora'
            :value='true'
          ></v-radio>
          <div class="publish-time">
            <v-radio
              label="Mais tarde"
              :value="false"
            ></v-radio>
            <date-picker
              :disabled="publishNow" 
              v-model="date"
            />
          </div>
        </v-radio-group>
        <v-divider class="divider" />
        <v-checkbox
          v-model="publishRepeat"
          label="Noticia recorrente"
        />
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
      Erro ao publicar noticia
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

// import axios from 'axios'
export default {
  name: 'Home',
  components: {
    Editor,
    File,
    ModalMessage,
    DatePicker
  },
  data () {
    return {
      titulo: "",
      files: [],
      conteudo: "",
      date: Date.now(),

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
      console.log(this.date)
      // this.modalConfirm=false
      // let formData = new FormData();
      // for (const i of Object.keys(this.files)) {
      //   formData.append('ficheiros', this.files[i])
      // }
      // formData.append('corpo', this.conteudo)
      // formData.append('titulo',this.titulo)

      // axios.post('http://localhost:3333/noticias',
      //   formData,
      //   {
      //     headers: {
      //         'Content-Type': 'multipart/form-data',
      //         'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      //     }
      //   }
      // ).then(() => {
      //  this.modal = true
      // }).catch(() => { this.modalError = true });
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
    changePublishDate (val) {
      if(val)
        this.date = 'now' 
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

.divider {
  width:100%;
}

.publish-time {
  display: flex;
}

</style>