<!-- Vue SFC -->
<template>
  <div class="files">
    <h1>Página dos ficheiros</h1>
    <treeselect 
      v-model="value"
      :multiple="true" :options="options" 
      :flatten-search-results="true"
      placeholder="Filtar por..."/>
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
      }
    },
  }
</script>
