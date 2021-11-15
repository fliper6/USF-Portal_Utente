  <!-- Vue SFC -->
<template>
  <div class="perfil">
    <v-container>
      <v-row>
        <v-col offset =2 cols=2>
          <v-avatar size=120>
            <v-icon dark size=120 color=grey>
              mdi-account-circle-outline
            </v-icon>
          </v-avatar>
        </v-col>
        <v-col>
          <v-row>
            <h1>António Manuel da Costa Guerra</h1>
          </v-row>
          <v-row>
            <h3>Número SNS:<span class="infos">12345</span></h3>
          </v-row>
          <v-row>
            <h3>Email:<span class="infos">joaobarreiro@gmail.com</span></h3>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-divider/>
      </v-row>
      
    </v-container>
    <v-container>
      <v-card flat color="#EFEFEF">
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="med ? '#CCCCCC' : '#AFE2DD'"
                @click="pedidoM"
              >
                Pedidos de Medicação
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="cons ? '#CCCCCC' : '#AFE2DD'"
                @click="pedidoC"
              >
                Pedidos de Consulta
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="sug ? '#CCCCCC' : '#AFE2DD'"
                @click="sugestoes"
              >
                Sugestões
              </v-btn>
            </v-col>
          </v-row>
        
      </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  //npm install --save @riophae/vue-treeselect
  export default {
    name: "Perfil",
    data() {
      return {
        value: null,
        med:false,
        cons:true,
        sug:true
        
      }
    },
    methods: {
    pedidoM() {
      this.med = false
      this.cons = true
      this.sug = true
    },
    pedidoC() {
      this.med = true
      this.cons = false
      this.sug = true
    },
    sugestoes() {
      this.med = true
      this.cons = true
      this.sug = false
    }
  }
  
  }
</script>

<style>
.infos {
  font-weight: normal;
}

.divider {
  margin-top: 100px;
}
</style>
