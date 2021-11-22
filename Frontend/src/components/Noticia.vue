<template>
  <div class="container">
    <div class="meta">{{tempo}} por {{noticia.nome_autor}} </div>
    <div class="title-row">
      <div class="title">{{noticia.titulo}}</div>
       <v-menu
          bottom
          left
       >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="deleteNoticia">
            <v-list-item-icon style="margin-right:5px">
              <v-icon small>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Apagar</v-list-item-title>
          </v-list-item>
          <v-list-item to="/publicar">
            <v-list-item-icon style="margin-right:5px">
              <v-icon small>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-html="noticia.corpo" />
  </div>
</template>  

<script>
import axios from 'axios'

export default {
  name: 'Noticia',
  props: ["noticia" , "timeAgo"],
  data () {
    return {
      tempo: ''
    }
  },
  mounted () {
    let created = new Date(this.$props.noticia.data_criacao)
    this.tempo = this.$props.timeAgo.format(created)
  },
  methods: {
    deleteNoticia () {
      axios.put('http://localhost:3333/noticias/' + this.$props.noticia._id,{},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          }
        }
      ).then(({data}) => {
        console.log(data);
        this.$emit('deleteMe', this.$props.noticia._id)
      }).catch(err => { console.log(err) });
    }
  }
}
</script>

<style scoped>
.container {
  width: 80vw;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 30px;
  margin-bottom: 20px
}

.meta {
  font-size: 0.7em !important;
  color: var(--gray);
  margin-left:3px;
  margin-bottom:5px;
}

.title-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-size: 2em !important;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.dropdown {
  display: flex;
  flex-direction: column;
}

.text {
  margin-bottom: 20px;
}

.attachments {
  display: flex;
  justify-content: center;
}

.container >>> img {
  display: block;
  margin: 10px auto;
  max-width: 400px;
  max-height: 300px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>