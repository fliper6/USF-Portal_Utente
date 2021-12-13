<template>
  <div class="file">
    <modal-message
      title="Remover?"
      :visible="modalConfirm"
      options
      @close="modalConfirm = false"
      @confirm="deleteDocumento()"
    >
      Deseja remover este documento?
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="closeSucesso()"
    >
      Documento removido com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="this.modalError = false"
    >
      Erro ao remover documento
    </modal-message>

    <v-row class="doc-container">
      <v-col>
        <v-row style="margin-bottom: 10px"> <h1 class="tituloDoc">{{this.titulo}}</h1> </v-row>
        <v-row> <h3>Criador: <span class="infos">{{this.nome_autor}}</span></h3> </v-row>
        <v-row> <h3>Data de data publicação: <span class="infos">{{this.data_publicacao}}</span></h3> </v-row>
        <v-row> <h3>Nome do ficheiro: <span class="infos">{{this.nome_ficheiro}}</span></h3> </v-row>
        <v-row> <h3>Tamanho do ficheiro: <span class="infos">{{this.tamanho}}</span></h3> </v-row>
      </v-col>
      
      <v-btn @click="download()" style="background:#f5f5f500; box-shadow: none;">
        <svg viewBox="0 0 30 30">
          <g>
            <path d="m14.035 23.238c0.03125 0.03125 0.066406 0.058594 0.10156 0.089844 0.015625 0.011719 0.03125 0.023437 0.046875 0.035156 0.019531 0.015625 0.039062 0.03125 0.058594 0.042969 0.019531 0.011719 0.039062 0.023438 0.058593 0.035156 0.019531 0.011719 0.039063 0.023438 0.054688 0.035156 0.023437 0.007813 0.042969 0.019532 0.0625 0.027344 0.019531 0.011719 0.039062 0.019532 0.058593 0.027344 0.023438 0.007812 0.042969 0.015625 0.0625 0.023438 0.023438 0.007812 0.042969 0.015624 0.066407 0.023437 0.019531 0.003906 0.039062 0.011719 0.058593 0.015625 0.023438 0.003906 0.046876 0.011719 0.070313 0.015625s0.046875 0.007813 0.070313 0.011719c0.019531 0.003906 0.039062 0.007812 0.058593 0.007812 0.046875 0.003906 0.089844 0.007813 0.13672 0.007813 0.042969 0 0.089844-0.003907 0.13281-0.007813 0.023438 0 0.042969-0.003906 0.0625-0.007812 0.023438-0.003906 0.046876-0.007813 0.070313-0.011719s0.046875-0.011719 0.070313-0.015625c0.019531-0.007812 0.039062-0.011719 0.058593-0.015625 0.023438-0.007813 0.042969-0.015625 0.066407-0.023437 0.019531-0.007813 0.039062-0.015626 0.058593-0.023438 0.023438-0.007812 0.042969-0.015625 0.0625-0.027344 0.019531-0.007812 0.039063-0.019531 0.058594-0.027344 0.019531-0.011718 0.039063-0.023437 0.058594-0.035156 0.019531-0.011718 0.039062-0.023437 0.058593-0.035156 0.019532-0.011719 0.039063-0.027344 0.058594-0.042969 0.015625-0.011719 0.03125-0.023437 0.046875-0.035156 0.035157-0.027344 0.066407-0.058594 0.097657-0.085937 0-0.003907 0-0.003907 0.003906-0.003907l6.3633-6.3633c0.53125-0.53516 0.53125-1.3984 0-1.9297s-1.3945-0.53125-1.9297 0l-4.0352 4.0352v-16.707c0-0.75391-0.60938-1.3633-1.3633-1.3633s-1.3633 0.60938-1.3633 1.3633v16.707l-4.0352-4.0352c-0.53516-0.53125-1.3984-0.53125-1.9297 0s-0.53125 1.3945 0 1.9297z"/>
            <path d="m28.637 14.547c-0.75391 0-1.3633 0.60938-1.3633 1.3633v10.453h-24.547v-10.453c0-0.75391-0.60937-1.3633-1.3633-1.3633-0.75391 0-1.3633 0.60938-1.3633 1.3633v11.816c0 0.75391 0.60938 1.3633 1.3633 1.3633h27.273c0.75391 0 1.3633-0.60938 1.3633-1.3633v-11.816c0-0.75391-0.60938-1.3633-1.3633-1.3633z"/>
          </g>
        </svg>
      </v-btn>
    
      <v-menu bottom left v-if="testNivel() == true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="modalConfirm = true">
            <v-list-item-icon style="margin-right:5px">
              <v-icon small>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Apagar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
    
    <br/>
    <div v-if="formato == 'pdf'" class="container" style="">
      <template>
        <vue-pdf-app 
          page-scale="100" 
          theme="light"
          :pdf="diretoria">
        </vue-pdf-app>
      </template>
    </div>
    <div v-else>
      <v-img class="container2" 
        contain
        :src="diretoria"
        max-height="2000"
        max-width="1000"
      ></v-img>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import VuePdfApp from "vue-pdf-app";
  import ModalMessage from '../components/ModalMessage.vue'; 
  import "vue-pdf-app/dist/icons/main.css";
  import jwt from 'jsonwebtoken'
  export default {
    name: "FileIndividual",
    components: {
      VuePdfApp,
      ModalMessage
    },
    data() {
      return {
        token: localStorage.getItem('jwt'),

        id_documento: this.$route.params.id,
        data_publicacao: null, 
        id_categoria: null,
        nome_autor: null, 
        id_autor: null,
        titulo: null, 
        visibilidade: null, 
        diretoria: null, 
        nome_ficheiro: null,
        formato: null,
        tamanho: null, 
        tipo_mime: null,

        modalConfirm: false,
        modal: false,
        modalError: false
      }
    },

    methods: {
        download: function () {
          window.open("http://localhost:3333/documentos/download/" + this.id_documento)
          /* axios.get("http://localhost:3333/documentos/download/" + this.id_documento)
            .then(() => {
              
            })
            .catch(() => {
              console.log("Ocorreu um erro ao fazer download do documento.")
            }) */
        },
        closeSucesso () {
          this.modal = false
          this.$router.push("/documentos")
        },
        testNivel () {
          if(this.token) {
            this.nivel = jwt.decode(this.token).nivel
            if(this.nivel=='Administrador'||this.nivel=='Secretário')
              return true
          }
          return false
        },
        deleteDocumento () {
          axios.put("http://localhost:3333/documentos/remover/" + this.id_documento, {
            headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            }).then(() => {
              this.modal = true;
            }).catch(() => { this.modalError = true });
        },
    },
    created() {
      // Obter dados do documento
      axios.get("http://localhost:3333/documentos/" + this.$route.params.id)
        .then(data => {
          this.data_publicacao = data.data.data_publicacao.slice(0,10)
          this.id_categoria = data.data.id_categoria
          this.nome_autor = data.data.nome_autor
          this.id_autor = data.data.id_autor
          this.titulo = data.data.titulo
          this.visibilidade = data.data.visibilidade
          this.diretoria = "http://localhost:3333" + data.data.ficheiro.diretoria.substring(6)
          this.nome_ficheiro = data.data.ficheiro.nome_ficheiro
          this.formato = this.nome_ficheiro.split(".")[1]
          this.tamanho = data.data.ficheiro.tamanho
          this.tipo_mime = data.data.ficheiro.tipo_mime
        })
        .catch(() => {
          console.log("Ocorreu um erro ao obter o documento.")
        })
    }
  }
</script>

<style>

.tituloDoc {
  color:var(--primary-color); 
  font-weight: normal;
}

.infos {
  font-weight: normal;
}

.doc-container {
  margin: 0px 5px; 
  background-color:var(--grey1-color); 
  padding: 20px;
  border-radius: 10px;
}

.container {
  z-index: 1;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 130vh;
  width: 1300px;
}

.container2 {
  border: 5px solid #555;
  margin: auto;
}
</style>

