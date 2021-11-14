<!-- Vue SFC -->
<template>
  <div class="files">
    <v-row style="margin: 0px 5px">
      <v-col>
        <v-dialog v-model="dialog" width="800">
          <template v-slot:activator="{ on, attrs }">
            <v-btn style="background-color:#AFE2DD; margin-bottom:30px;" v-bind="attrs" v-on="on">
              + Novo Documento
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2"> Carregar novo documento </v-card-title> <br/>
            <v-text-field style="margin: 0px 50px;" v-model="titulo" :counter="50" :rules="nameRules" label="Título" required></v-text-field>

            <p style="margin: 5px 50px; color:#666666">Tags relacionadas:</p>
            <treeselect style="margin: 0px 50px;"
              v-model="value2"
              :multiple="true" :options="options" 
              :flatten-search-results="true"
              placeholder="Tags"/> <br/>
              
            <v-file-input style="margin: 0px 50px;" truncate-length="15"></v-file-input>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="dialog = false"> Cancelar </v-btn>
              <v-btn color="rgb(128, 0, 0)" text @click="dialog = false"> Confirmar </v-btn>
            </v-card-actions> 
          </v-card>
        </v-dialog> 
      </v-col>
      <v-col style="max-width:400px">
        <treeselect 
          v-model="value"
          :multiple="true" :options="options" 
          :flatten-search-results="true"
          placeholder="Filtar por..."/> <br/>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="especialidades"
      :items-per-page="5"
      class="elevation-1"/>
  </div>
</template>

<script>
  //npm install --save @riophae/vue-treeselect
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: "Files",
    components: { Treeselect },
    data() {
      return {
        dialog: false,
        value: null,
        value2: null,
        options: [ {
          id: 'a',
          label: 'Medicina Interna',
          children: [ {
            id: 'aa',
            label: 'Pneumologia',
          }, {
            id: 'ab',
            label: 'Oncologia',
          } ],
        }, {
          id: 'b',
          label: 'Cirurgia',
        }, {
          id: 'c',
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
        especialidades: [
          {
            titulo: 'Mitos sobre cancro e oncologia',
            data: '11/12/2020',
            tamanho: '625 KB',
            formato: '.pdf',
            criador: 'Ana Ramos',
          }
        ]
      }
    }
  }
</script>
