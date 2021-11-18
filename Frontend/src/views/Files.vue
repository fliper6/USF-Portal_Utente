<template>
  <div class="files">
    <v-row style="margin: 0px 5px">
      <v-col>
        <v-dialog v-model="dialog" width="750" style="overflow-x: hidden;">
          <template v-slot:activator="{ on, attrs }">
            <v-btn  class="button-principal" v-bind="attrs" v-on="on">
              + Novo Documento
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> Carregar novo documento </v-card-title> <br/>

            <v-col style="margin: auto; padding: 0px 50px;">
              <v-text-field v-model="titulo" :counter="50" label="Título" required></v-text-field>

              <p style="margin-bottom: 5px; color:#666666">Especialidade associada:</p>
              <v-row style="height: 55px;">
                <v-col cols="11">
                  <treeselect
                    v-model="value2"
                    :max-height="100"
                    :multiple="false" :options="options" 
                    :flatten-search-results="true"
                    placeholder="Tags"/> <br/>
                </v-col>  
                <v-col cols="1">
                  <v-dialog v-model="dialog2" width="400">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn style="min-width:25px !important; height:34px !important; background-color:#e0e0e0;" v-bind="attrs" v-on="on">
                        +
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title class="text-h5 grey lighten-2"> Adicionar nova especialidade</v-card-title> <br/>
                      <v-col style="margin: auto; padding: 0px 50px;">
                        <p style="margin-bottom: 5px; color:#666666">Ramo da especialidade</p>
                        <treeselect
                          v-model="value2"
                          :max-height="100"
                          :multiple="false" :options="options" 
                          :flatten-search-results="true"
                          placeholder="Tags"/> <br/>

                        <v-text-field v-model="titulo" :counter="50" label="Nome da especialidade" required></v-text-field> <br/>
                      </v-col>
                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="button-cancelar" text @click="dialog2 = false"> Cancelar </v-btn>
                        <v-btn class="button-confirmar"  text @click="addCategoria()"> Confirmar </v-btn>
                      </v-card-actions> 
                    </v-card>
                  </v-dialog> 
                </v-col> 
              </v-row> <br/>
              <v-file-input truncate-length="15"></v-file-input>
            </v-col>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="button-cancelar" text @click="dialog = false"> Cancelar </v-btn>
              <v-btn class="button-confirmar" text @click="addDocumento()"> Confirmar </v-btn>
            </v-card-actions> 
          </v-card>
        </v-dialog> 
      </v-col>
      <v-col style="max-width:400px">
        <treeselect 
          v-on:input="filtrar"
          v-model="valueFiltro"
          :max-height="200"
          :multiple="true" :options="options" 
          :flatten-search-results="true"
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
  import axios from 'axios'
  //npm install --save @riophae/vue-treeselect
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    valueArray: [],
    name: "Files",
    components: { Treeselect },
    data() {
      return {
        dialog: false,
        dialog2: false,
        value: null,
        value2: null,
        valueFiltro: null,
        docsfiltrados: null,
        options2: null,
        options: [ {
          id: 'medicina_interna',
          label: 'Medicina Interna',
          children: [ {
            id: 'pneumologia',
            label: 'Pneumologia',
          }, {
            id: 'oncologia',
            label: 'Oncologia',
          } ],
        }, {
          id: 'cirurgia',
          label: 'Cirurgia',
        }, {
          id: 'outros',
          label: 'Outros',
        } ],
        headers: [
          {
            text: 'Título',
            align: 'start',
            sortable: false,
            value: 'titulo',
          },
          { text: 'Data', value: 'data' },
          { text: 'Tamanho', value: 'tamanho' },
          { text: 'Formato', value: 'formato' },
          { text: 'Criador', value: 'criador' },
        ],
        docs2: null,
        docs: [
          {
            titulo: 'Mitos sobre cancro e oncologia',
            data: '11/12/2020',
            tamanho: '625 KB',
            formato: '.pdf',
            criador: 'Ana Ramos',
            especialidade: ["medicina_interna","oncologia"]
          },
          {
            titulo: 'Cirurgia Plástica e os seus benefícios',
            data: '09/01/2021',
            tamanho: '540 KB',
            formato: '.pdf',
            criador: 'Patrícia Alves',
            especialidade: ["cirurgia"]
          }
        ]
      }
    },
    methods: {
        filtrar: function () {
          if(this.valueFiltro.length > 0) { 
            this.docsfiltrados = []
            for(var i = 0; i < this.docs.length; i++) {
              var intersecao = (this.docs[i].especialidade).filter(value => (this.valueFiltro).includes(value));
              if(intersecao.length > 0) 
                this.docsfiltrados.push(this.docs[i])
            }
          }
          else // se tiver vazio, não filtra
            this.docsfiltrados = this.docs
        },
        addCategoria: function () {
          this.dialog2 = false;
        },
        addDocumento: function () {
          this.dialog = false;
        },
        mudarVisibilidade: function () {
        },
        download: function () {
        },

    },
    created() {
      // Obter lista de documentos
      axios.get("http://localhost:3333/documentos")
        .then(data => {
          this.docs2 = data.data
        })
        .catch(() => {
          console.log("Ocorreu um erro ao obter a listagem de documentos.")
        })
      
      // Obter árvore de categorias
      axios.get("http://localhost:3333/tipos")
        .then(data => {
          this.options2 = data.data
        })
        .catch(() => {
            console.log("Ocorreu um erro ao obter a árvore de categorias.")
        })

      this.docsfiltrados = this.docs
    }
  }
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>