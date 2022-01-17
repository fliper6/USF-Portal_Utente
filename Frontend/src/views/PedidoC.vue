</<template>
    <div class="pedidoC">
        <v-card flat color="var(--grey1-color)" style="font-size:120%;">
          <v-container>
                <h1 style="color:var(--primary-color)">Pedidos de Contacto</h1>
                <v-row justify="center">
                  <v-col>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Descendente" v-if="up" icon @click="orderData(0)" ><v-icon>mdi-arrow-down</v-icon></v-btn>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Ascendente" v-else icon @click="orderData(1)"><v-icon>mdi-arrow-up</v-icon></v-btn>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn depressed @click="color1=1; color2=0; lista=contacto" v-bind:color="color1 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Pedidos Pendetes</v-btn>
                    <v-btn depressed @click="color1=0; color2=1; lista=contacto_r" v-bind:color="color2 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Pedidos Respondidos</v-btn>
                  </v-col>
                </v-row>
          </v-container>
          <v-container>
                <v-divider/>
            </v-container>
          <div v-if="this.lista.length > 0">
        <v-container v-for="(item,index) in lista" v-bind:key="item.id">
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
          <v-col class="text-right" v-if="item.estado===0">
            <v-btn depressed style="background-color:var(--secondary-color); margin:0 10px 0 0;" @click="alteraEstado(item._id,item.user,1)">Aceitar Pedido</v-btn>
            <v-btn depressed style="background-color:var(--grey2-color)" @click="alteraEstado(item._id,item.user,2)">Recusar Pedido</v-btn>
          </v-col>
          <v-col class="text-right" v-else>
            <div v-if="item.estado === 1" style="color:var(--secondary-dark-color)">Contacto Aceite</div>
            <div v-if="item.estado === 2" style="color:var(--primary-color)">Contacto Recusado</div>
          </v-col>
        </v-row>
        <v-row v-if="lista.length > 1 && index < lista.length - 1">
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
        contacto:[],
        contacto_r : [],
        lista: '',
        color1: 1,
        color2: 0,
        cons:false,
        up:false
        
      }
    },
    created(){
    if (this.token) {
      axios.get("http://localhost:3333/consultas/" , {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
                data.data.forEach(element => {
                if(element.estado === 1 || element.estado === 2){
                  this.contacto_r.push(element)
                }
                else{
                  this.contacto.push(element)
                }
              });
              this.contacto.sort((b, a) => {
                return new Date(a.data_criacao) - new Date(b.data_criacao);
              })
              this.contacto_r.sort((b, a) => {
                return new Date(a.data_criacao) - new Date(b.data_criacao);
              })
            })
            .catch(err => {
              console.log(err)
            })

            this.lista = this.contacto

      
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
          this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
      },
      orderData(bol){
        if(bol) {
          this.lista.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.contacto.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.contacto_r.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        else {
          this.lista.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.contacto.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.contacto_r.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        this.up=!this.up
      }
   }
  
  }
</script>