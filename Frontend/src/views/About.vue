<template>
  <div class="about">
    <h1 style="margin-bottom:20px">Encontre-nos</h1>
    <div class="contactos">
      <div class="contactos-labels">
        <div v-for="label in Object.keys(info)" :key="label" class="contactos-label"> {{label}}: </div>
      </div>
      <div class="sep"></div>
      <div class="informacoes">
        <div v-for="val in Object.values(info)" :key="val" class="informacao"> {{val}} </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return { 
      info: {
        Morada: 'Largo Paulo Orósio, 2º andar Maximinos 4700-036 Braga',
        "USF Linha de Apoio": "+351 937 344 557",
        Email: "usf.apoio@gmail.com",
        "Horário de Atendimento": "2ª a 6ª feira: das 08:00 horas às 20:00 horas"
      }
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.contactos {
  display: flex;
  flex-direction: row;
}

.sep {
  border: var(--primary-color) solid 1px;
  margin: 0px 20px
}

.contactos-labels {
  text-align: right;
}

.contactos-label {
  margin-bottom: 7px;
  font-weight: bold;
}

.informacao {
  margin-bottom: 7px;
}

</style>