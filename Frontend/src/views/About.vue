<template>
  <div class="about">
    <v-btn depressed v-if="this.nivel === 'Administrador' && this.edit_enc" @click="edit_enc = false" class="button-principal">
      Editar
    </v-btn>
    <v-btn v-else depressed class="button-principal" @click="save_enc">Guardar</v-btn>
    <h1 style="margin-bottom:20px">Encontre-nos</h1>
    <div class="contactos" v-if="this.edit_enc">
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
    <div v-else>
        <v-text-field label="Morada" v-model="dados.morada"></v-text-field>
        <v-text-field label="Telefone" v-model="dados.telefone"></v-text-field>
        <v-text-field label="Email" v-model="dados.email"></v-text-field>
        <v-text-field label="Horario de Atendimento" v-model="dados.horario_atendimento"></v-text-field>
    </div>
    <h1 style="margin-bottom:20px">Equipas</h1>
    <v-container v-for="(item,index) in equipas" :key="index">
      <div v-for="(person, indice) in item" 
          :key="indice">
        <v-row v-if="edit != person._id"  style="margin:0 0 -25px 0">
          <v-col cols=3 class="text-right">
            <div 
            class="contactos-label" 
            
            > 
            {{person.profissao}} {{person.nome}}: 
            </div>
          </v-col>
          <v-col cols=1>
            <v-divider vertical style="background-color:var(--primary-color);"></v-divider>
          </v-col>
          <v-col cols=4 >
            <div :style="'margin:0 0 0 '+ windowWidth*-0.03+ 'px' " class="text-left"> {{person.email}} </div>
          </v-col>
          <v-col cols=1>
            <v-btn icon v-if="nivel === 'Administrador' && edit != person._id" @click="edit = person._id">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-col>
          
        </v-row>
        <v-row v-else style="margin:25px 0 0 0">
          <v-col cols=1>
            <v-btn style="margin:15px 0 0 0" icon color="var(--primary-color)" @click="edit = ''">
              <v-icon>mdi-trash-can</v-icon>
          </v-btn>
          </v-col>
          <v-col cols=2>
            <v-select :items="items" label="Título" v-model="person.profissao"></v-select>
          </v-col>
          <v-col cols=3>
            <v-text-field label="Nome" v-model="person.nome"></v-text-field>
          </v-col>
          <v-col cols=3>
            <v-text-field label="Nome" v-model="person.email"></v-text-field>
          </v-col>
          <v-col cols=1>
            <v-btn icon style="margin:15px 0 0 0" @click="save_person(person)">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

        
      <v-row style="padding:25px 0 0 0">
        <v-col cols=9>
          <v-divider 
        ></v-divider>
        </v-col>
        

      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken';



export default {
  name: 'Home',
  data () {
    return { 
      windowWidth: window.innerWidth,
      info: [
        "Morada",
        "USF Linha de Apoio",
        "Email",
        "Horário de Atendimento"
      ],
      dados: '',
      equipas:[],
      token:localStorage.getItem('jwt'),
      nivel:'',
      edit_enc : true,
      items: ['Dr.', 'Dr.ª', 'Enf.', 'Enf.ª', 'Secretário Clínico', 'Secretária Clínica'],
      pessoas:[],
      edit:''
    }
  },
  mounted () {
  },
  created(){
    this.nivel = jwt.decode(this.token).nivel
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
  },
  methods: {
    save_enc(){
      axios.put("http://localhost:3333/contactos" , this.dados, {headers:{'authorization':'Bearer '+ this.token}})
      .then(() => {
        this.$router.go()
      })
      .catch(err => {
        console.log(err)
      })
    },
    save_person(person){
      console.log(person)
      axios.put("http://localhost:3333/contactos" , person, {headers:{'authorization':'Bearer '+ this.token}})
      .then(() => {
      })
      .catch(err => {
        console.log(err)
      })
      this.edit = ''
    },
    editTeam(item,index){
      this.pessoas = item
      this.edit_team[index] = true
    }
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