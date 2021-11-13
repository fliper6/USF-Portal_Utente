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

                <v-col class="d-flex pa-2"  sm="1">
                    <v-btn @click="search()">
                        <v-icon> mdi-magnify </v-icon>
                    </v-btn>
                </v-col>
                
                <v-col class="d-flex pa-2" offset="6" sm="1">
                    <v-btn @click="save()">
                        Guardar
                    </v-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col v-if="this.lista.length==0" align="center">
                    <p style="font-size:20px"><b>Sem resultados!</b></p>
                </v-col>
            </v-row>

            <v-list v-for="item in lista" :key="item.email">
              <v-card class="pa-6" outlined >
                <v-row >
                  <v-col cols="10" sm="10">
                    <span style="color:#800000;font-size:20px"> 
                      <b> {{item.nome}} </b> ({{ item.priv }})
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
                        @change="modificou(item.email, item.newPriv)"
                        :items="levels"
                        :placeholder="item.priv"
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
export default {
  name: 'EditPrivUsers',
  data() {
    return {
      lista : [
        {'nome':"josé moreira filipe",'email':"jose.moreira@gmail.com",'priv':"utente"},
        {'nome':"candido araujo",'email':"candido.araujo@gmail.com",'priv':"medico"},
        {'nome':"antonio manuel da costa",'email':"antonio.costa@gmail.com",'priv':"utente"},
        {'nome':"lizandro pedro alves",'email':"lizandro.alves@gmail.com",'priv':"utente"},
        {'nome':"josé moreira ",'email':"jose@gmail.com",'priv':"utente"},
        {'nome':"candido",'email':"candido@gmail.com",'priv':"medico"},
        {'nome':"antonio manuel",'email':"antonio@gmail.com",'priv':"utente"},
        {'nome':"lizandro pedro",'email':"lizandro@gmail.com",'priv':"utente"},
        {'nome':"moreira filipe",'email':"moreira@gmail.com",'priv':"utente"},
        {'nome':"araujo",'email':"araujo@gmail.com",'priv':"medico"},
        {'nome':"manuel da costa",'email':"costa@gmail.com",'priv':"utente"},
        {'nome':"pedro alves",'email':"alves@gmail.com",'priv':"utente"}
      ],
      levels : ['utente','estagiario','medico','admin'],
      name:"",
      email:""
    }
  },
  methods: {
    modificou(email, priv) {
      console.log("email: " + email)
      console.log("new priv: " + priv)
      console.log("*************************")

    }
  }
}
</script>


<style>

</style>
