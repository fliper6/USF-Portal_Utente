<template>
  <div class="file">
    <v-row class="doc-container">
      <v-col>
        <v-row style="margin-bottom: 10px"> <h1 class="tituloDoc">{{this.documento.titulo}}</h1> </v-row>
        <v-row> <h3>Criador: <span class="infos">{{this.documento.nome_autor}}</span></h3> </v-row>
        <v-row> <h3>Data de data publicação: <span class="infos">{{this.documento.data_publicacao.slice(0,10)}}</span></h3> </v-row>
        <v-row> <h3>Nome do ficheiro: <span class="infos">{{this.documento.ficheiro.nome_ficheiro}}</span></h3> </v-row>
        <v-row> <h3>Tamanho do ficheiro: <span class="infos">{{this.documento.ficheiro.tamanho}}</span></h3> </v-row>
        <v-row> <v-btn class="button-principal mt-3" @click="download">Transferir documento <v-icon>mdi-download</v-icon> </v-btn> </v-row>
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
    props: ["documento"],  
    components: {
      VuePdfApp
    },
    data() {
      return {
        token: localStorage.getItem('jwt'),

      }
    },

    methods: {
        download(){
            axios.get('http://localhost:3333/documentos/download/' + this.documento._id,
            {
              responseType: 'blob'
            })
              .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.documento.ficheiro.nome_ficheiro); //or any other extension
                document.body.appendChild(link);
                link.click();
              })
            .catch(err => console.log(err))
        } 
    },

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

