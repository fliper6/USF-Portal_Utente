<template>
  <div class="perfil_medicacao">
    <!-- MODAL DE CONFIRMAÇÃO CANCELAMENTO DE PEDIDO DE MEDICAÇÃO-->
    <modal-message
      title="Alerta"
      :visible="modalConfirmarCancelarPedido"
      @close="modalConfirmarCancelarPedido=false"
      @confirm="deleteEstado(ida)"
      options
    >
      Deseja cancelar o pedido de medicação?
    </modal-message>
    <!-- MODAL DE CANCELAMENTO DE PEDIDO DE MEDICAÇÃO-->
    <modal-message
      title="Sucesso"
      :visible="modalCancelarPedido"
      @close="$router.push({path:'/perfil'});$router.go()"
    >
      Pedido removido com sucesso.
    </modal-message>
    <v-container>
      <!-- LISTA DO HISTORICO -->
      <v-card flat color="var(--grey1-color)" style="font-size:120%;margin-top:20px">  
        
        <div v-if="this.$props.medicacoes.length > 0">
          
          <!-- PARA CADA ITEM DA LISTA -->
          <v-container v-for="(item,index) in $props.medicacoes" v-bind:key="item.id" >
  
            <!-- FIRST ROW -->
            <v-row :ref="item._id" >

              <!-- NORMAL -->
              <v-col v-if="item._id != $props.ide || !not">
                <h3>{{item.data_criacao.split('T')[0]}}</h3>
              </v-col> 

              <!-- DESTACADO PELA NOTIFICAÇÃO -->
              <v-col v-else>
                <h2 class="noti">{{item.data_criacao.split('T')[0]}}</h2>
              </v-col>
            </v-row>
            
            <!-- SECOND ROW -->
            <div class="text-subtitle-2">{{item.medico}}</div>

            <!-- THIRD ROW -->
            <v-row>
              <v-col> {{item.medicacao}} </v-col>
              <!-- ESTADO -->
              <v-col class="text-right">
                <v-btn v-if="item.estado===0" depressed color="var(--grey2-color)" @click="modalConfirmarCancelarPedido = true;ida=item._id">Cancelar Pedido</v-btn>
                <div v-if="item.estado === 1" style="color:var(--secondary-dark-color)">Pedido Aceite</div>
                <div v-if="item.estado === 2" style="color:var(--primary-color)">Pedido Recusado</div>
              </v-col>
            </v-row>
  
            <!-- DIVISÃO ENTRE CADA ELEMENTO DA LISTA -->
            <v-row v-if="$props.medicacoes.length > 1 && index < $props.medicacoes.length - 1">
                <v-divider></v-divider>
            </v-row>
          
          </v-container>
        </div>
  
        <!-- CASO NAO HAJA ELEMENTOS NA LISTA -->
        <div v-else>
          <v-container>
            <v-row align="center" justify="center">
                <h2>Não existem pedidos de medicação</h2>
            </v-row>
          </v-container>
        </div>
        
      </v-card>
    </v-container>

  </div>
</template>

<script>
import axios from 'axios'
import ModalMessage from '../ModalMessage.vue'


  export default {
    name: "PerfilMedicacao",
    props: {
        ide: String,
        id:String,
        medicacoes:Array,
        not:Boolean
    },
    data() {
      return {
        //GERAL
        token: localStorage.getItem('jwt'),
        modalCancelarPedido:false,
        modalConfirmarCancelarPedido :false,
        ida:''
      }
    },
    watch: {
      $route() {
        if (window.location.search!="") {
          this.tipo = this.$route.query.tipo
          this.ide = this.$route.query.id
          this.linkNotificacao()
        }
      }
    },
    components: {
      ModalMessage
    },
    mounted() {
      if(this.$route.query.id){
        var id = this.$route.query.id
        setTimeout(() => {
            var element = this.$refs[id];
            var top = element[0].offsetTop;
            window.scrollTo(0, top);
          }, 100)
      }
    },
    methods: {
        
      //VERIFICAR SE VEM DE NOTIFICAÇÃO
      linkNotificacao() {
        if (this.tipo && this.ide) {
          if (this.tipo == 'pedidoContacto') this.pedidoC()
          else if (this.tipo == 'sugestao') this.sugest()
          else this.pedidoM()
          setTimeout(() => {
            var element = this.$refs[this.ide];
            var top = element[0].offsetTop;
            window.scrollTo(0, top);
          }, 100)
        }
      },


      //CANCELAR PEDIDOS MEDICACAO
      deleteEstado (id){
        axios.delete("http://localhost:3333/medicacao/" + id,{headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.modalConfirmarCancelarPedido = false
          this.modalCancelarPedido = true
        })
        .catch(err => {
          console.log(err)
        })

      }
  }
  
  }
</script>

<style scoped>

.alert {
    white-space: pre-line;
    text-align: center;
    font-size: 16px;
    color: red;
}

.v-icon:hover {
  background-color:	var(--shadow-color)
}

.v-icon {
  border-radius: 50%;
}

.infos {
  font-weight: normal;
}

.divider {
  margin-top: 100px;
}

.texto_perfil {
  font-size: 18px;
}

.noti {
  color: black;
  animation: example 0.5s;
  animation-iteration-count: 4;
}

@keyframes example {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.divisor {
  max-width: 100px !important;
  width: 30px !important;
    border-width: 0 4px 0 0 !important;

}

</style>
