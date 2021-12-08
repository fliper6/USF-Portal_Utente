</<template>
    <div class="pedidoC">
        <v-card flat color="var(--grey1-color)" style="font-size:120%;">
          <v-container>
                <h1 style="color:var(--primary-color)">Pedidos de Consulta</h1>
          </v-container>
          <v-container>
                <v-divider/>
            </v-container>
          <div v-if="this.consulta.length > 0">
        <v-container v-for="(item,index) in consulta" v-bind:key="item.id">
        <v-row>
          <v-col>
            <h3 v-if="!cons">{{item.nome}}</h3>
          </v-col>
        </v-row>
        <div class="text-subtitle-2" v-if="!item.nr_utente_pedido">Número de utente : {{item.nr_utente_titular}}</div>
        <div class="text-subtitle-2" v-else>Número de utente : {{item.nr_utente_pedido}}</div>
        <div class="text-subtitle-2">Tipo : {{item.tipo}}</div>
        <v-row>
          <v-col v-if="!cons">
            {{item.medico}}
          </v-col>
          <v-col class="text-right" v-if="item.estado==0">
            <v-btn depressed style="background-color:var(--secondary-color); margin:0 10px 0 0;" @click="alteraEstado(item._id,item.user,1)">Aceitar Pedido</v-btn>
            <v-btn depressed style="background-color:var(--grey2-color)" @click="alteraEstado(item._id,item.user,2)">Recusar Pedido</v-btn>
          </v-col>
          <v-col class="text-right" v-else>
            <div v-if="item.estado === 0" style="color:var(--grey3-color)">Pedido Pendente</div>
            <div v-if="item.estado === 1" style="color:var(--secondary-dark-color)">Consulta Aceite</div>
            <div v-if="item.estado === 2" style="color:var(--primary-color)">Consulta Recusada</div>
          </v-col>
        </v-row>
        <v-row v-if="consulta.length > 1 && index < consulta.length - 1">
          <v-col><v-divider>

          </v-divider></v-col>
          
        </v-row>
        
      </v-container>
      </div>
      <div v-else>
        <v-container>
          <v-row>
            <v-col>
              <h2 style="text-align:center;">Não existem pedidos</h2>
            </v-col>
          </v-row>
        </v-container>
      </div>

        </v-card>
    </div>
</template>

<script>
import axios from 'axios'


  //npm install --save @riophae/vue-treeselect
  export default {
    name: "PedidoC",
    data() {
      return {
        token: localStorage.getItem('jwt'),
        consulta:'',
        cons:false
        
      }
    },
    created(){
    if (this.token) {
      axios.get("http://localhost:3333/consultas/" , {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
          this.consulta = data.data
          console.log(data.data)
        })
        .catch(err => {
          console.log(err)
        })

      
    }
    },
    methods: {
      alteraEstado (id,user,estado){
        var data = {}
        data['_id'] = id
        data['user'] = user
        data['estado'] = estado
        axios.put("http://localhost:3333/consultas/altE", data,{headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          //this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
      }
   }
  
  }
</script>