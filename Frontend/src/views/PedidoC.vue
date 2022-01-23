</<template>
    <div class="pedidoC">
      <!-- MODAL DE CONFIRMAÇÃO DE EDIÇÃO DE PEDIDO-->
        <modal-message
          title="Sucesso"
          :visible="modal"
          @close="$router.go()"
        >
          Pedido atualizado com sucesso.
        </modal-message>
        <!-- MODAL DE CONFIRMAÇÃO -->
        <modal-message
          title="Alerta"
          :visible="modalConf"
          @confirm="alteraEstado(id,user,estado)"
          @close="modalConf=false"
          options
        >
          Tem a certeza que pertende mudar o estado do pedido?
        </modal-message>
        <v-card flat color="var(--grey1-color)" style="font-size:120%;">
          <v-container>
                <h1 style="color:var(--primary-color)">Pedidos de Contacto</h1>
                <v-row justify="center">
                  <v-col>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Descendente" v-if="up" icon @click="orderData()" ><v-icon>mdi-arrow-down</v-icon></v-btn>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Ascendente" v-else icon @click="orderData()"><v-icon>mdi-arrow-up</v-icon></v-btn>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn depressed @click="changeTab('pendentes')" v-bind:color="color1 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Pedidos Pendentes</v-btn>
                    <v-btn depressed @click="changeTab('respondidas')" v-bind:color="color2 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Pedidos Respondidos</v-btn>
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
        <div class="text-subtitle-2">Motivo : {{item.tipo}}</div>
        <v-row>
          <v-col v-if="!cons">
            {{item.medico}}
          </v-col>
          <v-col class="text-right" v-if="item.estado===0">
            <v-btn depressed style="background-color:var(--secondary-color); margin:0 10px 0 0;" @click="confirmMessage(item._id,item.user,1)">Aceitar Pedido</v-btn>
            <v-btn depressed style="background-color:var(--grey2-color)" @click="confirmMessage(item._id,item.user,2)">Recusar Pedido</v-btn>
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
const host = require('../../../config.json').backend
import ModalMessage from '../components/ModalMessage.vue'

  //npm install --save @riophae/vue-treeselect
  export default {
    name: "PedidoC",
    data() {
      return {
        token: localStorage.getItem('jwt'),
        contacto:[],
        contacto_r : [],
        lista: [],
        color1: 1,
        color2: 0,
        cons:false,
        up:false,
        modal:false,
        modalConf:false,
        id:'',
        user:'',
        estado:'',
        lastPage:false,
        loading:true
      }
    },
    mounted () {
      window.onscroll = () => {
        let bottomOfWindow = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
        if (bottomOfWindow && !this.loading && !this.lastPage) {
          this.loading = true;
          this.getNextPage();
        }
      }
    },
    created(){
    if (this.token) {
      axios.get(host + "/consultas?estado=0&ordem=-1&skip=0" , {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
              this.lista = data.data
              this.loading = false;
            })
            .catch(err => {
              console.log(err)
            })
    }
    },
    components: {
      ModalMessage
    },
    methods: {
      alteraEstado (id,user,estado){
        var data = {}
        data['_id'] = id
        data['user'] = user
        data['estado'] = estado
        axios.put(host + "/consultas/altE", data,{headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.modalConf=false
          this.modal=true
        })
        .catch(err => {
          console.log(err)
        })
      },
      confirmMessage(id,user,estado){
        this.modalConf=true;
        this.id=id;
        this.user=user;
        this.estado=estado
      },
      orderData(){
        this.loading = true
        let estado = this.color1 == 1 ? 0 : 1
        let ordem = this.up ? -1 : 1

        axios.get(host + `/consultas?estado=${estado}&ordem=${ordem}&skip=0`, {headers:{'authorization':'Bearer '+ this.token}})
          .then(data => {
            this.lista = data.data
            this.loading = false;
            this.lastPage = false
          })
          .catch(err => {
            console.log(err)
          })
        
        this.up=!this.up
      },
      changeTab(to) {
        let ordem = this.up ? 1 : -1

        if (!this.color1 && to == "pendentes") {
          this.color1 = 1; this.color2 = 0
          this.loading = true

          axios.get(host + `/consultas?estado=0&ordem=${ordem}&skip=0`, {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              this.lista = data.data
              this.loading = false;
              this.lastPage = false
            })
            .catch(err => {
              console.log(err)
            })
        }
        
        if (!this.color2 && to == "respondidas") {
          this.color1 = 0; this.color2 = 1
          this.loading = true

          axios.get(host + `/consultas?estado=1&ordem=${ordem}&skip=0`, {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              this.lista = data.data
              this.loading = false;
              this.lastPage = false
            })
            .catch(err => {
              console.log(err)
            })
        }
      },
      getNextPage() {
        axios.get(host + `/consultas?estado=${!this.color2 ? 0 : 1}&ordem=${this.up ? 1 : -1}&skip=` + this.lista.length, {headers:{'authorization':'Bearer '+ this.token}})
          .then(data => {
            if(!data.data || data.data.length < 10) this.lastPage = true
            this.lista = this.lista.concat(data.data)
            this.loading = false;
          })
          .catch(err => console.log(err))
      }
   }
  
  }
</script>