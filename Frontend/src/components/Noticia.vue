<template>
  <div class="container">
    <!-- 
      Modals 
    -->
    <modal-message
      title="Remover?"
      :visible="modalConfirm"
      options
      @close="modalConfirm = false"
      @confirm="confirmDelete()"
    >
      Deseja remover esta notícia do feed?
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="modal = false"
    >
      Notícia removida com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="this.modalError = false"
    >
      Erro ao remover notícia
    </modal-message>

    <!-- 
      Conteudo
    -->
    <div class="meta">{{tempo}} por {{noticia.nome_autor}} </div>
    <div class="title-row">
      <div class="title">{{noticia.titulo}}</div>
       <v-menu
          bottom
          left
          v-if="testNivel() == true"
       >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item :to="'/noticia/editar/' + $props.noticia._id">
            <v-list-item-icon style="margin-right:5px">
              <v-icon small>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          <v-list-item @click="modalConfirm = true">
            <v-list-item-icon style="margin-right:5px">
              <v-icon small>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Apagar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
import jwt from 'jsonwebtoken'
import File from './Editor/File.vue'
import ModalMessage from './ModalMessage.vue'

export default {
  name: 'Noticia',
  props: ["noticia" , "timeAgo"],
  components: {
    File,
    ModalMessage
  },
  data () {
    return {
      token: localStorage.getItem('jwt'),
      tempo: '',

      modalConfirm: false,
      modal: false,
      modalError: false,
    }
  },
  mounted () {
    let created = new Date(this.$props.noticia.data_criacao)
    this.tempo = this.$props.timeAgo.format(created)
  },
  methods: {
    deleteNoticia () {
      axios.put('http://localhost:3333/noticias/' + this.$props.noticia._id,{},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(() => {
        this.$emit('deleteMe', this.$props.noticia._id);
        this.modal=true;
      }).catch(() => { this.modalError = true });
    },
    downloadFile (file) {
      axios.get('http://localhost:3333/noticias/download',
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
    confirmDelete() {
      this.modalConfirm = false
      this.deleteNoticia()
    }
  }
}
</script>

<style scoped>
.container {
  width: 80vw;
  border-bottom: 1px solid var(--primary-color);
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