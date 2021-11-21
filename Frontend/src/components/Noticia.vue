<template>
  <div class="container">
    <div class="meta">{{tempo}} por {{noticia.nome_autor}} </div>
    <div class="title">{{noticia.titulo}}</div>
    <div v-html="noticia.corpo" />
  </div>
</template>  

<script>
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

.title {
  font-size: 2em !important;
  color: var(--primary-color);
  margin-bottom: 15px;
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