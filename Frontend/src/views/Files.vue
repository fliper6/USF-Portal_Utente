<!-- Vue SFC -->
<template>
  <div class="files">
    <treeselect 
      v-model="value"
      :multiple="true" :options="options" 
      :flatten-search-results="true"
      placeholder="Filtar por..."/>
    <br/>
    <v-data-table
      :headers="headers"
      :items="desserts"
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
        value: null,
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
        desserts: [
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
