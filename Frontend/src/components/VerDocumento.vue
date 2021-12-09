<template>
  <div class="file">
    <v-row class="doc-container">
      <v-col>
        <v-row style="margin-bottom: 10px"> <h1 class="tituloDoc">{{this.titulo}}</h1> </v-row>
        <v-row> <h3>Criador: <span class="infos">{{this.nome_autor}}</span></h3> </v-row>
        <v-row> <h3>Data de data publicação: <span class="infos">{{this.data_publicacao}}</span></h3> </v-row>
        <v-row> <h3>Nome do ficheiro: <span class="infos">{{this.nome_ficheiro}}</span></h3> </v-row>
        <v-row> <h3>Tamanho do ficheiro: <span class="infos">{{this.tamanho}}</span></h3> </v-row>
      </v-col>
    </v-row>
    <div v-if="formato == 'pdf'" class="container">
        <br/>
        <template>
          <vue-pdf-app 
            page-scale="100" 
            theme="light"
            :pdf="diretoria">
          </vue-pdf-app>
        </template>
      </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import VuePdfApp from "vue-pdf-app";
  import "vue-pdf-app/dist/icons/main.css";
  //import jwt from 'jsonwebtoken'

  export default {
    props: ["id"],  
    components: {
      VuePdfApp
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
        tipo_mime: null
      }
    },

    methods: {
        getDocumento: function () {
        }
    },
    created() {
      // Obter dados do documento
      axios.get("http://localhost:3333/documentos/" + this.id)
        .then(data => {
          this.data_publicacao = data.data.data_publicacao.slice(0,10)
          this.id_categoria = data.data.id_categoria
          this.nome_autor = data.data.nome_autor
          this.id_autor = data.data.id_autor
          this.titulo = data.data.titulo
          this.visibilidade = data.data.visibilidade
          this.diretoria = "http://localhost:3333" +data.data.ficheiro.diretoria.substring(6)
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
  height: auto;
  margin: auto;
  width: auto;
}
</style>

