<template>
  <v-dialog
      v-model="dialog"
      width="500px"
      style="overflow-x: hidden"
    >
      <template v-slot:activator="{ on, attrs }">
        <button v-bind="attrs" v-on="on">
            <v-icon>mdi-image-plus</v-icon>
          </button>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Nova Imagem
        </v-card-title>
        <div class="container">
          <div class="input-container">
            <v-file-input clearable color="#800000" label="Upload de Imagem" v-model="file" style="max-width:60% !important"/>
            <v-btn :disabled="this.file == null" @click="uploadImage">
              <v-icon>mdi-file-image-plus</v-icon> <small>Add</small>
            </v-btn>
          </div>

          <div class="separate">
            <v-divider/>
            <div style="margin: 0 15px;"> ou </div>
            <v-divider/>
          </div>
          
          <div class="input-container">
            <v-text-field color="#800000" v-model="url" label="URL da Imagem" class="info-input" style="max-width:60% !important" required />
            <v-btn :disabled="this.url == ''" @click="addImage()">
              <v-icon>mdi-image-plus</v-icon> <small>Add</small>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
</template>  

<script>
import axios from 'axios'
export default {
  name: 'AddLink',
  data() {
    return {
      url: "",
      file: null,
      dialog: false,
    }
  },
  methods: {
    addImage() {
      this.dialog = false
      this.$emit("add-image", this.url)
      this.url = ""
      this.file = null
      console.log(this.$refs.file)
    },
    uploadImage() {
      let formData = new FormData();
      formData.append('ficheiro', this.file);

      axios.post('http://localhost:3333/noticias/ficheiro',
          formData,
          {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(({data}) => {

        this.url = "http://localhost:3333/" + data.url
        this.addImage()

      })
      .catch(err => { console.log(err) });
    },
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0;
    /*border: green 2px solid*/
  }

  .input-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    /*border: 2px blue solid*/
  }

  .separate {
    width: 30vw;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: var(--gray);
    margin: 10px 0;
  }

</style>