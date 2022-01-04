<template>
  <div class="perfil_contacto">
    <v-container>

      <!-- LISTA DO HISTORICO -->
      <v-card flat color="var(--grey1-color)" style="font-size:120%;margin-top:20px">  
        
        <div v-if="this.contacto.length > 0">
          <!-- PARA CADA ITEM DA LISTA -->
          <v-container v-for="(item,index) in contacto" v-bind:key="item.id" >
  
            <!-- FIRST ROW -->
            <v-row :ref="item._id" >

              <!-- NORMAL -->
              <v-col v-if="item._id != $props.ide || !not">
                <h3>{{item.nome}}</h3>
              </v-col> 

              <!-- DESTACADO PELA NOTIFICAÇÃO -->
              <v-col v-else>
                <h2 class="noti">{{item.nome}}</h2>
              </v-col>
            </v-row>
            
            <!-- SECOND ROW -->
            <div class="text-subtitle-2">Tipo : {{item.tipo}}</div>


            <!-- THIRD ROW -->
            <v-row>
              <v-col> {{item.medico}} </v-col>
              <!-- ESTADO -->
              <v-col class="text-right">
                <div v-if="item.estado === 0" style="color:var(--grey3-color)">Pedido Pendente</div>
                <div v-if="item.estado === 1" style="color:var(--secondary-dark-color)">Pedido Aceite</div>
                <div v-if="item.estado === 2" style="color:var(--primary-color)">Pedido Recusado</div>
              </v-col>
            </v-row>
  
            <!-- DIVISÃO ENTRE CADA ELEMENTO DA LISTA -->
            <v-row v-if="contacto.length > 1 && index < contacto.length - 1">
                <v-divider></v-divider>
            </v-row>
          
          </v-container>
        </div>
  
        <!-- CASO NAO HAJA ELEMENTOS NA LISTA -->
        <div v-else>
          <v-container>
            <v-row align="center" justify="center">
                <h2>Não existem pedidos de contacto</h2>
            </v-row>
          </v-container>
        </div>
        
      </v-card>
    </v-container>

  </div>
</template>

<script>

  export default {
    name: "Perfil_Medicacao",
    props: {
        ide: String,
        id:String,
        contacto:Array,
        not:Boolean
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
