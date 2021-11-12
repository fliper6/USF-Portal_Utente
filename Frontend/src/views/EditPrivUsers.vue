<template>
    <div id="editprivusers">
        <v-container> 
            <v-row no-gutters>
                <v-col class="d-flex pa-2" cols="12" sm="2">
                    <v-text-field
                      v-model="name"
                      label="Nome"
                      dense
                      outlined
                      hide-details
                    ></v-text-field>
                </v-col>

                <v-col class="d-flex pa-2" cols="12" sm="1">
                    <v-btn @click="search()">
                        <v-icon> mdi-magnify </v-icon>
                    </v-btn>
                </v-col>
          
            </v-row>

            <v-row>
                <v-col v-if="this.lista.length==0" align="center">
                    <p style="font-size:20px"><b>Sem resultados!</b></p>
                </v-col>
            </v-row>

            <v-list v-for="item in lista" :key="item.email" >
              <v-card class="pa-6" outlined >
                <v-row >
                  <v-col cols="12" sm="11">
                    <span style="color:green"> 
                      <b> {{item.nome}} </b> 
                    </span> 
                    <br/>
                    <b>Email: </b> {{item.email}}
                  </v-col>
                  <v-col align="right" sm="1">
                      <v-select
                        @change="modificou(item.email,item.priv)"
                        v-model="item.priv"
                        :items="levels"
                        :placeholder="item.priv"
                        return-object
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
        {'nome':"lizandro pedro alves",'email':"lizandro.alves@gmail.com",'priv':"utente"}
      ],
      levels : ['utente','medico','admin'],
      name:"",
      select: ""
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
