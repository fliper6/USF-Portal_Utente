<template>
  <div class="about">
    <h1 style="margin-bottom:20px">Encontre-nos</h1>
    <div class="contactos">
      <div class="contactos-labels">
        <div v-for="label in info" :key="label" class="contactos-label"> {{label}}: </div>
      </div>
      <div class="sep"></div>
      <div class="informacoes">
        <div class="informacao"> {{dados.morada}} </div>
        <div class="informacao"> {{dados.telefone}} </div>
        <div class="informacao"> {{dados.email}} </div>
        <div class="informacao"> {{dados.horario_atendimento}} </div>
      </div>
    </div>
    <h1 style="margin-bottom:20px">Equipas</h1>
    <div class="contactos" v-for="item in equipas" :key="item">
      <div class="contactos-labels">
        <div class="contactos-label" 
        v-for="person in item" 
        :key="person"
        > 
        {{person.profissao}} {{person.nome}}: 
        </div>
      </div>
      <div class="sep"></div>
      <div class="informacoes">
        <div class="informacao" v-for="person in item" :key="person"> {{person.email}} </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'


export default {
  name: 'Home',
  data () {
    return { 
      info: [
        "Morada",
        "USF Linha de Apoio",
        "Email",
        "Horário de Atendimento"
      ],
      dados: '',
      equipas:[],
    }
  },
  mounted () {
  },
  created(){
    axios.get("http://localhost:3333/contactos" , {headers:{'authorization':'Bearer '+ this.token}})
      .then(data => {
        this.dados = data.data.shift()
        var teams = data.data
        var team = []
        var equipa = 0
        teams.forEach(element => {
          if(element.equipa === equipa){
            team.push(element)
          }
          else {
            this.equipas.push(team)
            team = []
            team.push(element)
            equipa = element.equipa
          }
        });
        this.equipas.push(team)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
.contactos {
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
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