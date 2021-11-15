<template>
  <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <button v-bind="attrs" v-on="on">
            <v-icon dense color="white">mdi-link-plus</v-icon>
          </button>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Colocar Link
        </v-card-title>

        <v-text-field color="#800000" v-model="link" class="info-input" label="Link" required></v-text-field>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            text
            @click="setLink()"
          >
            Adicionar Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>  

<script>
export default {
  name: 'SetLink',
  data() {
    return {
      link: "",
      dialog: false,
    }
  },
  methods: {
    setLink() {
      this.dialog = false
      console.log(this.link)
      this.$emit("set-link", this.link)
      this.link = ""
    }
  }
}
</script>

<style scoped>
  
  .info-input {
    margin: 10px 50px;
    outline-color: var(--primary-color)
  }

</style>