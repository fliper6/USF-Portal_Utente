<template>
    <div class="pedidoM">
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
                <h1 style="color:var(--primary-color)">Pedidos de Medicação</h1>
                <v-row justify="center">
                  <v-col>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Descendente" v-if="up" icon @click="orderData(0)" ><v-icon>mdi-arrow-down</v-icon></v-btn>
                    <v-btn style="margin:10px 0 0 0;" title="Mudar Ordem: Data Ascendente" v-else icon @click="orderData(1)"><v-icon>mdi-arrow-up</v-icon></v-btn>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn depressed @click="color1=1; color2=0; lista=medicacao" v-bind:color="color1 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Pedidos Pendetes</v-btn>
                    <v-btn depressed @click="color1=0; color2=1; lista=medicacao_r" v-bind:color="color2 === 1 ? 'var(--secondary-color)' : 'var(--grey2-color)'" style="margin:0 10px 0 0;">Pedidos Respondidos</v-btn>
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
                  <h3>{{item.nome}}</h3>
                </v-col>
                <v-col cols=1>
                  <v-tooltip v-if="!item.nr_utente_pedido" left>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="copy(item.nr_utente_titular,item.contacto.tipo,item.contacto.valor,item.medicacao)" v-bind="attrs" v-on="on">
                      <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                    </template>
                    <span>Copiar</span>
                  </v-tooltip>
                  <v-tooltip v-else left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon @click="copy(item.nr_utente_pedido,item.contacto.tipo,item.contacto.valor,item.medicacao)" v-bind="attrs" v-on="on">
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                    <span>Copiar</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <div class="text-subtitle-2" v-if="!item.nr_utente_pedido">Número de utente : {{item.nr_utente_titular}}</div>
              <div class="text-subtitle-2" v-else>Número de utente : {{item.nr_utente_pedido}}</div>
              <div class="text-subtitle-2">{{item.medico}}</div>
              <div class="text-caption">{{item.data_criacao.split('T')[0]}}</div>
              <v-row>
                <v-col>
                  {{item.medicacao}}
                </v-col>
                <v-col class="text-right" v-if="item.estado===0">
                  <v-btn depressed style="background-color:var(--secondary-color); margin:0 10px 0 0;" @click="confirmMessage(item._id,item.user,1)">Aceitar Pedido</v-btn>
                  <v-btn depressed style="background-color:var(--grey2-color)" @click="confirmMessage(item._id,item.user,2)">Recusar Pedido</v-btn>
                </v-col>
                <v-col class="text-right" v-else>
                  <div v-if="item.estado === 1" style="color:var(--secondary-dark-color)">Pedido Aceite</div>
                  <div v-if="item.estado === 2" style="color:var(--primary-color)">Pedido Recusado</div>
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
import ModalMessage from '../components/ModalMessage.vue'


  //npm install --save @riophae/vue-treeselect
  export default {
    name: "PedidoM",
    data() {
      return {
        token: localStorage.getItem('jwt'),
        medicacao:[],
        medicacao_r : [],
        lista: '',
        color1: 1,
        color2: 0,
        up:false,
        modal:false,
        modalConf:false,
        id:'',
        user:'',
        estado:'',
        
      }
    },
    components: {
      ModalMessage
    },
    created(){
    if (this.token) {
      axios.get("http://localhost:3333/medicacao/" , {headers:{'authorization':'Bearer '+ this.token}})
        .then( data => {
              data.data.forEach(element => {
                if(element.estado === 1 || element.estado === 2){
                  this.medicacao_r.push(element)
                }
                else{
                  this.medicacao.push(element)
                }
                this.medicacao.sort((b, a) => {
                return new Date(a.data_criacao) - new Date(b.data_criacao);
                })
                this.medicacao_r.sort((b, a) => {
                  return new Date(a.data_criacao) - new Date(b.data_criacao);
                })
              });
            })
            .catch(err => {
              console.log(err)
            })

            this.lista = this.medicacao

      
    }
    },
    methods: {
      copy(sns,sms_email,value,medi){
        if(sms_email == 0){
          navigator.clipboard.writeText(sns + '\nEmail : ' + value + '\n' + medi);
        }
        else{
          navigator.clipboard.writeText(sns + '\nSMS : ' + value + '\n' + medi);
        }

      },
      alteraEstado (id,user,estado){
        var data = {}
        data['_id'] = id
        data['user'] = user
        data['estado'] = estado
        axios.put("http://localhost:3333/medicacao/altE", data,{headers:{'authorization':'Bearer '+ this.token}})
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
      orderData(bol){
        if(bol) {
          this.lista.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.medicacao.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.medicacao_r.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        else {
          this.lista.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.medicacao.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
          this.medicacao_r.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        this.up=!this.up
      }
  }
  
  }
</script>