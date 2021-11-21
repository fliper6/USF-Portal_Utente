<template>
<div class="box">
  <h1 class="h1">Pedido Submetido com Sucesso!</h1>
  <v-btn class="button"><a href="/" style="text-decoration:none" class="a">Confirmar</a></v-btn>
</div>
  
</template>

<script>
export default {

}
</script>

<style>
.box{
  display: flex;
  align-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}
.h1 {
  color: var(--primary-color);
  font-size: 3em;
}
.button{
  padding:  3px;
  background-color: var(--secondary-color) !important;
  margin-top: 20px;
}
.a{
  color:black !important;
}
</style>