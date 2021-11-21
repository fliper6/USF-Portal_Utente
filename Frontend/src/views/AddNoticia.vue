<template>
  <div>
    <v-text-field class="label" color="#000000" v-model="titulo" label="Titulo" required outlined dense></v-text-field>
    <Editor @submit="submit"/>
  </div>
</template>

<script>
import Editor from "../components/Editor.vue"
import axios from 'axios'
export default {
  name: 'Home',
  components: {
    Editor
  },
  data () {
    return {
      titulo: "",
      files: []
    }
  },
  methods: {
    submit (content) {
      let formData = new FormData();
      for (const i of Object.keys(this.files)) {
        formData.append('ficheiros', this.files[i])
      }
      formData.append('corpo', content)
      formData.append('titulo',this.titulo)

      axios.post('http://localhost:3333/noticias',
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(({data}) => {
        console.log(data);

      }).catch(err => { console.log(err) });
    },
  }
}
</script>

<style scoped>

</style>