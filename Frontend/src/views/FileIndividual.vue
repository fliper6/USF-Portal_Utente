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
          axios.put('http://localhost:3333/documentos/remover/' + this.id_documento, {
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

