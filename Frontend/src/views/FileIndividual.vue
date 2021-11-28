<template>
  <div class="file">
    <v-row style="margin: 0px 5px">
    </v-row>
  </div>
</template>

<script>
  //import axios from 'axios'
  //import jwt from 'jsonwebtoken'

  export default {
    name: "FileIndividual",

    data() {
      return {
        token: localStorage.getItem('jwt'),
        nivel: 'utente',

        /* DOCUMENTO */
        dialog: false,
        titulo: null,
        arvore: null,
        warning_arvore: false,
        file: null,
      }
    },

    methods: {
        getDocumento: function () {
        }
    },
    created() {

    }
  }
</script>

