<template>
  <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <button v-bind="attrs" v-on="on">
            <v-icon>mdi-link-plus</v-icon>
          </button>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Novo Link
        </v-card-title>

        <v-text-field color="#800000" v-model="text" class="info-input" label="Texto" required></v-text-field>
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
            @click="addLink()"
          >
            Adicionar Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>  

<script>
export default {
  name: 'AddLink',
  data() {
    return {
      text: "",
      link: "",
      dialog: false,
    }
  },
  methods: {
    addLink() {
      this.dialog = false
      this.$emit("add-link", { text:this.text, link:this.link })
      this.text = ""
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