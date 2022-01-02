<template>
  <div class="about">
    <v-container>
      <v-row>
        <v-col>
          <h1 style="margin-bottom:20px">Encontre-nos <v-btn title="Editar Local" icon depressed v-if="nivel === 'Administrador' && this.edit_enc" @click="edit_enc = false">
      <v-icon>mdi-pencil</v-icon>
    </v-btn></h1>
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
        <v-btn depressed class="button-principal" @click="save_enc">Guardar</v-btn>
    </div>
        </v-col>
        <v-col>
          <GmapMap
            :center="center"
            :zoom="16"
            map-type-id="terrain"
            style="width: 500px; height: 300px"
          >
            <GmapMarker
              :position="center"
              @click="center=center"
            />
          </GmapMap>
        </v-col>
      </v-row>
    </v-container>
    
    <h1 style="margin-bottom:20px">Equipas <v-dialog
              :v-model="dialogo"
              width="700"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-if="nivel==='Administrador'"
                  v-bind="attrs"
                  v-on="on"
                  title="Adicionar Equipa"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
        
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Nova Equipa
                </v-card-title>
        
                <v-container>
                  <v-row v-for="(p,i) in equipa" :key="i">
                    <v-col>
                      <v-select :items="items" label="Título" v-model="p.profissao"></v-select>
                    </v-col>
                    <v-col >
                      <v-text-field label="Nome" v-model="p.nome"></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field label="Email" v-model="p.email"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols=1>
                      <v-btn title="Adicionar elemento à equipa" icon @click="add_ele()">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn title="Apagar último elemento" icon @click="equipa.pop()">
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
        
                <v-divider></v-divider>
        
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="button-cancelar"
                    text
                    @click="dialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    class="button-confirmar"
                    @click="add_equipa()"
                  >
                    Confirmar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog></h1>
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
            <v-btn title="Editar Contacto" icon v-if="nivel === 'Administrador' && edit != person._id" @click="edit = person._id">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-col>
          
        </v-row>
        <v-row v-else style="margin:25px 0 0 0">
          <v-col cols=1>
            <v-dialog
              :v-model="dialog"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="margin:15px 0 0 0" icon color="var(--primary-color)"
                  v-bind="attrs"
                  v-on="on"
                  title="Eliminar Contacto"
                >
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </template>
        
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Confirmar
                </v-card-title>
        
                <v-card-text>Tem a certeza que deseja eliminar o contacto?</v-card-text>
        
                <v-divider></v-divider>
        
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    class="button-cancelar"
                    text
                    @click="dialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    class="button-confirmar"
                    @click="apagar_contacto(person._id)"
                  >
                    Confirmar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-col>
          <v-col cols=2>
            <v-select :items="items" label="Título" v-model="person.profissao"></v-select>
          </v-col>
          <v-col cols=3>
            <v-text-field label="Nome" v-model="person.nome"></v-text-field>
          </v-col>
          <v-col cols=3>
            <v-text-field label="Email" v-model="person.email"></v-text-field>
          </v-col>
          <v-col cols=1>
            <v-btn title="Guardar Contacto" icon style="margin:15px 0 0 0" @click="save_person(person)">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        
      </div>

      <div v-if="add_team === index">
        <v-row>
          <v-col cols=1>
            <v-btn title="Cancelar Operação" icon style="margin:15px 0 0 0" @click="add_team = ''">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
          <v-col cols=2>
            <v-select :items="items" label="Título" v-model="pessoa.profissao"></v-select>
          </v-col>
          <v-col cols=3>
            <v-text-field label="Nome" v-model="pessoa.nome"></v-text-field>
          </v-col>
          <v-col cols=3>
            <v-text-field label="Email" v-model="pessoa.email"></v-text-field>
          </v-col>
          <v-col cols=1>
            <v-btn title="Adicionar Contacto" icon style="margin:15px 0 0 0" @click="add_person(index)">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <div v-else>
        <v-btn v-if="nivel==='Administrador'" title="Adicionar elemento à equipa" icon style="margin:15px 0 0 0" @click="add_team = index">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
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
      center: { lat: 41.54738349797038, lng: -8.428102644182273 },
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
      pessoa:{
        nome:'',
        profissao:'',
        email:'',
        equipa:''
      },
      equipa:[{
        nome:'',
        profissao:'',
        email:'',
      },
      {
        nome:'',
        profissao:'',
        email:'',
      },
      {
        nome:'',
        profissao:'',
        email:'',
      }],
      edit:'',
      add_team : '',
      dialog:'',
      dialogo:''
    }
  },
  mounted () {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)

    this.$refs.mapRef.$mapPromise.then((map) => {
      map.panTo({lat: 1.38, lng: 103.80})
    })
  },
  created(){
    
    if (this.token){
      this.nivel = jwt.decode(this.token).nivel
    }
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
          else if (element.equipa < equipa){
            this.equipas[element.equipa].push(element)
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
  components:{
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
    add_person(index){
      this.pessoa['equipa'] = index
      axios.post("http://localhost:3333/contactos" , this.pessoa, {headers:{'authorization':'Bearer '+ this.token}})
      .then(() => {
        this.$router.go()
      })
      .catch(err => {
        console.log(err)
      })
    },
    apagar_contacto(id){
      axios.delete("http://localhost:3333/contactos/" + id , {headers:{'authorization':'Bearer '+ this.token}})
      .then(() => {
        this.$router.go()
      })
      .catch(err => {
        console.log(err)
      })
    },
    save_person(person){
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
      this.add_team[index] = true
    },
    add_ele(){
      var nova = {
        nome:'',
        profissao:'',
        email:'',
      }
      this.equipa.push(nova)

    },
    add_equipa(){
      axios.post("http://localhost:3333/contactos/equipa" , this.equipa, {headers:{'authorization':'Bearer '+ this.token}})
      .then(() => {
        this.$router.go()
      })
      .catch(err => {
        console.log(err)
      })
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