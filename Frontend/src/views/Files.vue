<template>
  <div class="files">
    <v-row style="margin: 0px 5px">

      <AddFile @atualizardocs="atualizarDocs"> </AddFile>

      <v-col style="max-width:400px">
        <treeselect 
          v-on:input="filtrar"
          v-model="valueFiltro"
          :max-height="200"
          :multiple="true" :options="options" 
          :flatten-search-results="true"
          :normalizer="normalizer"
          placeholder="Filtar por..."/> <br/>
      </v-col>

    </v-row>

    <v-data-table
      :headers="headers"
      :items="docsfiltrados"
      :items-per-page="5"
      class="elevation-1"/>
  </div>
</template>

<script>
  import AddFile from '../components/AddFile.vue'
  import Treeselect from '@riophae/vue-treeselect' //npm install --save @riophae/vue-treeselect
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import axios from 'axios'

  export default {
    name: "Files",
    components: {
      Treeselect,
      AddFile
    },

    data() {
      return {

        /* FILTRO */
        valueFiltro: null,
        options: null,

        /* TABELA */
        docs: [],
        docsfiltrados: [],
        headers: [
          {
            text: 'Título',
            align: 'start',
            sortable: false,
            value: 'titulo',
          },
          { text: 'Data', value: 'data_publicacao' },
          { text: 'Tamanho', value: 'ficheiro.tamanho' },
          { text: 'Formato', value: 'ficheiro.nome_ficheiro' },
          { text: 'Criador', value: 'nome_autor' },
        ]
      }
    },

    methods: {
        atualizarDocs() { 
          
        // Atualizar documentos
        axios.get("http://localhost:3333/documentos")
          .then(data => {
            this.docs = data.data
            this.docs.forEach(item => {
              item.data_publicacao = item.data_publicacao.slice(0,10)
              item.ficheiro.nome_ficheiro = item.ficheiro.nome_ficheiro.split(".")[1]
            })
            this.docsfiltrados = this.docs
          })
          .catch(() => {
            console.log("Ocorreu um erro ao obter a listagem de documentos.")
          })
          window.location.reload();
        },
        filtrar: function () {
          if(this.valueFiltro.length > 0) { 
            this.docsfiltrados = []
            for(var i = 0; i < this.docs.length; i++) {
              if(this.docs[i].id_categoria == this.valueFiltro) 
                this.docsfiltrados.push(this.docs[i])
            }
          }
          else // se tiver vazio, não filtra
            this.docsfiltrados = this.docs
        },
        normalizer(node) { 
          return { children: node.children && node.children.length ? node.children : 0 } 
        },
        download: function () {
        },
    },
    created() {
      // Obter lista de documentos
      axios.get("http://localhost:3333/documentos")
        .then(data => {
          this.docs = data.data
          this.docs.forEach(item => {
            item.data_publicacao = item.data_publicacao.slice(0,10)
            item.ficheiro.nome_ficheiro = item.ficheiro.nome_ficheiro.split(".")[1]
          })
          this.docsfiltrados = this.docs
        })
        .catch(() => {
          console.log("Ocorreu um erro ao obter a listagem de documentos.")
        })
      
      // Obter árvore de categorias
      axios.get("http://localhost:3333/documentos/categorias")
        .then(data => {
          this.options = data.data.categorias
        })
        .catch(() => {
            console.log("Ocorreu um erro ao obter a árvore de categorias.")
        })

      
    }
  }
</script>

