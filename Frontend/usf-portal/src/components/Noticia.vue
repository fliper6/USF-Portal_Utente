<template>
  <div class="container">
    <div class="meta"> a {{noticia.data}} por {{noticia.autor}} </div>
    <div class="title">{{noticia.title}}</div>
    <div class="text" v-for="(line,n) in noticia.text.split('\n')" :key="n">{{line}}</div>
    <div class="attachments">
      <img class="image" v-for="(attachment,n) in noticia.attachments" :key="n" :src='attachment'/>
    </div>
  </div>
</template>  

<script>
export default {
  name: 'Noticia',
  props: ["noticia"],
  mounted () {
    console.log(this.noticia.text.split('\n'))
  }
}
</script>

<style scoped>
.container {
  width: 80vw;
  border-bottom: 1px solid var(--primary-color);
  padding-bottom: 30px;
}

.meta {
  font-size: 0.7em !important;
  color: var(--gray);
  margin-left:3px;
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

.image {
  max-height: 400px;
  max-width: 800px;
}
</style>