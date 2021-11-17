<template>
    <div id="editprivusers">
        <v-container> 
            <v-row no-gutters>

                <v-col class="d-flex pa-2" sm="2">
                    <v-text-field
                      v-model="name"
                      label="Nome"
                      dense
                      outlined
                      hide-details
                    ></v-text-field>
                </v-col>

                <v-col class="d-flex pa-2"  sm="2">
                    <v-text-field
                      v-model="email"
                      label="Email"
                      dense
                      outlined
                      hide-details
                    ></v-text-field>
                </v-col>

                <v-col offset="6" sm="2">
                    <v-select
                      v-model="nivelFiltro"
                      @change="filtro()"
                      :items="levels"
                      placeholder="Nível"
                      outlined
                    ></v-select>
                </v-col>

            </v-row>

            <v-row>
                <v-col v-if="this.listaFiltrada.length==0" align="center">
                    <p style="font-size:20px"><b>Sem resultados!</b></p>
                </v-col>
            </v-row>

            <v-list v-for="item in listaFiltrada" :key="item.email" style="margin-top:20px">
              <v-card class="pa-6" outlined >
                <v-row >
                  <v-col cols="10" sm="10">
                    <span style="color:#800000;font-size:20px"> 
                      <b> {{item.nome}} </b> ({{ item.nivel }})
                    </span> 
                    <br/>
                    <br/>
                    <span  style="font-size:20px">
                      <b>Email: </b> {{item.email}} 
                    </span>
                  </v-col>
                  <v-col align="right" sm="2">
                      <v-select
                        v-model="item.newPriv"
                        @change="modificou(item)"
                        :items="levels"
                        :placeholder="item.nivel"
                        single-line
                        outlined
                      ></v-select>
                  </v-col>
                </v-row>
               </v-card> 
             </v-list>      
        </v-container>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EditPrivUsers',
  data() {
    return {
      token: localStorage.getItem('jwt'),
      listaInicial : [],
      listaFiltrada : [],
      levels : ['utente','medico','admin'],
      name:"",
      email:"",
      nivelFiltro:""
    }
  },
  methods: {
    modificou(item) {
      console.log(item.nome)
      console.log(item.newPriv)
      var confirmacao = "Tem a certeza que quer alterar o nível do utilizador '" + item.nome + "' para o nível '" + item.newPriv + "' ?"
      if (confirm(confirmacao)) {
        var json = {"nivel": item.newPriv}
        axios.put("http://localhost:3333/users/nivel/"+item._id, json, {headers: {'Authorization': `Bearer ${this.token}`}})
          .then( () => {
            alert("Alterado com sucesso!")
            this.$router.go()
          })
          .catch(err => {
            alert("Não foi possível alterar o nível do utilizador!")
            console.log("Erro a alterar permissões de users:",err)
          })
      }
      else {
        this.listaFiltrada.forEach(i => {
          if (i.email==item.email) i.newPriv=""
        })
      }
    },
    sorted(lista) {
      return lista.sort((a,b) => (a.nome < b.nome) ? 1 : ((b.nome < a.nome) ? -1 : 0))
    },
    filtro() {
      console.log(this.listaFiltrada)
      this.listaFiltrada = this.listaInicial
      this.listaInicial.forEach(item => {
        if (this.name!="") {
          if (!item.nome.toLowerCase().includes(this.name.toLowerCase())) this.listaFiltrada = this.arrayRemove(this.listaFiltrada,item)
        }
        if (this.email!="") {
          if (!item.email.toLowerCase().includes(this.email.toLowerCase())) this.listaFiltrada = this.arrayRemove(this.listaFiltrada,item)
        }
        if (this.nivelFiltro!="") {
          if (item.nivel != this.nivelFiltro) this.listaFiltrada = this.arrayRemove(this.listaFiltrada,item)
        }
      })

    },
    arrayRemove(arr, value) {   
      return arr.filter(function(ele){ 
          return ele != value; 
      });
    } 
  },
  created() {
    if (this.token) {
      axios.get("http://localhost:3333/users/listarUsers", {headers: {'Authorization': `Bearer ${this.token}`}})
        .then( res => {
          this.listaInicial = res.data
          this.listaFiltrada = res.data
        })
        .catch(err => {
          console.log("Erro a obter a lista de users:",err)
        })
    }
  },
  watch: {
    'name': function() {
      this.filtro()
    },
    'email': function() {
      this.filtro()
    }
  }
}
</script>


<style>

</style>
