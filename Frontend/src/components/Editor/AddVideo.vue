<template>
  <v-dialog
      v-model="dialog"
      width="500px"
      style="overflow-x: hidden"
    >
      <template v-slot:activator="{ on, attrs }">
        <button v-bind="attrs" v-on="on">
            <v-icon>mdi-video-plus</v-icon>
          </button>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Novo Video
        </v-card-title>
        <div class="container">
          <div class="input-container">
            <v-file-input color="#800000" label="Upload de Video" style="max-width:60% !important" v-on:change="onChangeFileUpload"/>
            <v-btn @click="uploadVideo">
              <v-icon>mdi-video-plus</v-icon> <small>Add</small>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
</template>  

<script>
import axios from 'axios'

export default {
  name: 'AddVideo',
  data() {
    return {
      url: "",
      file: null,
      dialog: false,
    }
  },
  methods: {
    addVideo() {
      this.dialog = false
      this.$emit("add-video", {url: this.url, file: this.file})
      this.url = ""
      this.file = null
    },
    uploadVideo() {
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
        this.addVideo()

      })
      .catch(err => { console.log(err) });

    },
    onChangeFileUpload(file){
      this.file = file
    }
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