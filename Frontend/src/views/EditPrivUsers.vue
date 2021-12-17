<template>
    <div  id="editprivusers">
        <v-container> 
            <v-row no-gutters>

                <!-- MODAL DE CONFIRMAÇÃO -->
                <v-dialog v-model="dialog" width="400">
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">Confirmação</v-card-title> <br/>
                    <v-col style="margin: auto; padding: 0px 50px;">
                      <p style="margin-bottom: 5px; color:var(--grey3-color)">
                        Tem a certeza que quer alterar o nível do utilizador <b>{{nomeAlt}}</b> de <b>{{privAnt}}</b> para <b>{{privAlt}}</b> ?</p>
                    </v-col>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn class="button-cancelar" text @click="cancelar(1)"> Cancelar </v-btn>
                      <v-btn class="button-confirmar" :loading="loading" text @click="altNivel()"> Confirmar </v-btn>
                    </v-card-actions> 
                  </v-card>
                </v-dialog> 


                <!-- MODAL DE ALERTA -->
                <v-dialog v-model="dialog2" width="400">
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">Alerta</v-card-title> <br/>
                    <v-col style="margin: auto; padding: 0px 50px;">
                      <p style="margin-bottom: 5px; color:var(--grey3-color)">
                        <span v-if="sucesso==true"> O nível do utilizador foi alterado com sucesso! </span>
                        <span v-else> Não foi possível alterar o nível do utilizador! </span>
                      </p>
                    </v-col>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn v-if="sucesso==true" class="button-confirmar" text @click="alteracaoSucesso()"> Ok </v-btn>
                      <v-btn v-else class="button-confirmar" text @click="cancelar(2)"> Ok </v-btn>
                    </v-card-actions> 
                  </v-card>
                </v-dialog> 


                <!-- FILTROS (NOME) -->
                <v-col class="d-flex pa-2" sm="2">
                    <v-text-field
                      v-model="name"
                      label="Nome"
                      dense
                      outlined
                      hide-details
                    ></v-text-field>
                </v-col>

                <!-- FILTROS (EMAIL) -->
                <v-col class="d-flex pa-2"  sm="2">
                    <v-text-field
                      v-model="email"
                      label="Email"
                      dense
                      outlined
                      hide-details
                    ></v-text-field>
                </v-col>

                <!-- FILTROS (NIVEL) -->
                <v-col offset="6" sm="2">
                    <v-select
                      v-model="nivelFiltro"
                      @change="filtro()"
                      :items="niveis"
                      item-text="titulo"
                      outlined
                    ></v-select>
                </v-col>
            </v-row>


            <!-- CASO NÃO HAJA ELEMENTOS NA LISTA -->
            <v-row>
                <v-col v-if="this.listaFiltrada.length==0" align="center">
                    <p style="font-size:20px"><b>Sem resultados!</b></p>
                </v-col>
            </v-row>


            <!-- CASO HAJA ELEMENTOS NA LISTA -->
            <v-list v-for="item in listaFiltrada" :key="item.email" style="margin-top:20px">
              <v-card class="pa-6" outlined >
                <v-row >
                  <v-col cols="10" sm="10">
                    <span style="color:var(--primary-color);font-size:20px"> 
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
import axios from 'axios';

export default {
  name: 'EditPrivUsers',
  data() {
    return {
      //MODAL CONFIRMAÇÃO
      dialog: false,
      loading:false,

      //MODAL ALERTA
      dialog2:false,
      sucesso:false,

      //FILTROS
      name:"",
      email:"",
      nivelFiltro:"",
      niveis : [
        {titulo:'Todos', value: ""},
        {titulo:'Utentes', value: "Utente"},
        {titulo:'Secretários', value: "Secretário"},
        {titulo:'Administradores', value: "Administrador"}
      ],

      //LISTA
      listaInicial : [],
      listaFiltrada : [],
      levels : ['Utente','Secretário','Administrador'],
      nomeAlt:"",
      privAlt:"",
      privAnt:"",
      idAlt:"",

      //OUTROS
      token: localStorage.getItem('jwt'), 
    }
  },
  methods: {
    modificou(item) {
      this.nomeAlt = item.nome
      this.privAlt = item.newPriv
      this.privAnt = item.nivel
      this.idAlt = item._id
      this.dialog = true
    },
    // se receber 1 fecha o modal confirmação, 2 fecha o modal alerta
    cancelar(int) {
      this.listaFiltrada.forEach(i => { if (i._id==this.idAlt) i.newPriv="" })
      int==1 ? this.dialog = false : this.dialog2 = false
    },
    altNivel() {
      this.dialog = false
      this.loading = true
      var json = {"nivel": this.privAlt}
        axios.put("http://localhost:3333/users/nivel/"+this.idAlt, json, {headers: {'Authorization': `Bearer ${this.token}`}})
          .then( () => {
            this.sucesso = true
            this.dialog2 = true
            this.loading = false
          })
          .catch(err => {
            this.dialog2 = true
            this.loading = false
            console.log("Erro a alterar permissões de users:",err)
          })
    },
    alteracaoSucesso() {
      this.dialog2 = false 
      this.$router.go()
    },
    filtro() {
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
      axios.get("http://localhost:3333/users/listar", {headers: {'Authorization': `Bearer ${this.token}`}})
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


<style scoped>

</style>
