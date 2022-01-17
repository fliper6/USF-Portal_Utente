<template>
  <div class="perfil_sugestao">
      <!-- MODAL DE EDITAR AS SUGESTÕES -->
    <v-dialog v-model="dialog"  width="500">

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Editar
          <v-spacer></v-spacer>
          <v-btn
            icon
            color="var(--primary-color)"
            @click="deleteSug(this.id_desc)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-title>

        <v-container style="padding:20px;">
          <!-- TITULO -->
          <v-text-field 
            color="var(--secondary-dark-color)"
            label="Título" 
            v-model="titulo">
          </v-text-field>

          <!-- DESCRIÇÃO -->
          <v-textarea 
            color="var(--secondary-dark-color)"
            label="Sugestão" 
            v-model="descricao">
          </v-textarea>
        </v-container>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button-cancelar" text @click="dialog = false"> Cancelar </v-btn>
          <v-btn class="button-confirmar" text @click="saveSug(id_desc)"> Confirmar </v-btn>
        </v-card-actions> 
      </v-card>
    </v-dialog>

    <v-container>
      <v-btn title="Mudar Ordem: Data Descendente" v-if="up && this.$props.sugestoes.length > 1" icon @click="orderData(0)" ><v-icon>mdi-arrow-down</v-icon></v-btn>
      <v-btn title="Mudar Ordem: Data Ascendente" v-if="!up && this.$props.sugestoes.length > 1" icon @click="orderData(1)"><v-icon>mdi-arrow-up</v-icon></v-btn>
      <!-- LISTA DO HISTORICO -->
      <v-card flat color="var(--grey1-color)" style="font-size:120%;margin-top:20px">  
        
        <div v-if="this.sugestoes.length > 0">

          <!-- PARA CADA ITEM DA LISTA -->
          <v-container v-for="(item,index) in sugestoes" v-bind:key="item.id" >
  
            <!-- FIRST ROW -->
            <v-row :ref="item._id" >

              <!-- NORMAL -->
              <v-col v-if="item._id != $props.ide || !not">
                <h3>{{item.titulo}}</h3>
              </v-col> 

              <!-- DESTACADO PELA NOTIFICAÇÃO -->
              <v-col v-else>
                <h2 class="noti">{{item.titulo}}</h2>
              </v-col>
            </v-row>
            
            <!-- SECOND ROW -->
            <div class="text-caption">{{item.data_criacao.split('T')[0]}}</div>


            <!-- THIRD ROW -->
            <v-row>
              <v-col> {{item.descricao}} </v-col>
              <!-- EDITAR SUGESTÃO -->
              <v-col class="text-right" v-if="item.estado===0 || !item.resposta" cols=2 >
                <v-btn
                  depressed 
                  style="background-color:var(--secondary-color)"
                  @click="editSug(item.titulo,item.descricao,item._id)"
                >
                  Editar
                </v-btn>
                
                <!-- MODAL DE CONFIRMAÇÃO DE EDIÇÃO DE SUGESTÃO-->
                <modal-message
                  title="Sucesso"
                  :visible="modalEditarSug"
                  @close="closeEditarSug(id_desc)"
                >
                  Sugestão editada com sucesso.
                </modal-message>
              </v-col>
            </v-row>

            <!-- RESPOSTA DA SUGESTÃO -->
            <v-row v-if="item.estado === 1">
              <v-col cols=1><v-divider class="divisor" vertical></v-divider></v-col>
              <v-col>
                <v-row>
                  <v-col> {{item.resposta}} </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-subtitle-2"> {{item.data_resposta.split('T')[0]}} </v-col>
                </v-row>
              </v-col>
            </v-row>
  
            <!-- DIVISÃO ENTRE CADA ELEMENTO DA LISTA -->
            <v-row v-if="sugestoes.length > 1 && index < sugestoes.length - 1">
                <v-divider></v-divider>
            </v-row>
          
          </v-container>
        </div>
  
        <!-- CASO NAO HAJA ELEMENTOS NA LISTA -->
        <div v-else>
          <v-container>
            <v-row align="center" justify="center">
                <h2>Não existem sugestões</h2>
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
    name: "Perfil_Medicacao",
    props: {
        ide: String,
        id:String,
        sugestoes:Array,
        not:Boolean
    },
    data() {
      return {
        //GERAL
        token: localStorage.getItem('jwt'),
        up:false,

        //MODAIS
        modalEditarSug:false,
        dialog:false,

        //EDITAR SUGESTAO
        titulo:'',
        descricao:'', 
        id_desc:'',   
      }
    },
    components: {
      ModalMessage
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
        orderData(bol){
        if(bol) {
          this.$props.sugestoes.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        else {
          this.$props.sugestoes.sort((b, a) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        }
        this.up=!this.up
      },
        
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
      editSug(tit,desc,id){
        this.titulo=tit
        this.descricao=desc
        this.id_desc = id
        this.dialog=true
      },
      deleteSug(id){
        axios.delete("http://localhost:3333/sugestao/" + id , {headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.$router.go()
        })
        .catch(err => {
          console.log(err)
        })
      },
      saveSug(id){
        var data = {}
        data['_id'] = id
        data['titulo'] = this.titulo
        data['descricao'] = this.descricao
        axios.put("http://localhost:3333/sugestao",data , {headers:{'authorization':'Bearer '+ this.token}})
        .then(() => {
          this.modalEditarSug = true
        })
        .catch(err => {
          console.log(err)
        })
      },
      closeEditarSug(id){
        this.$router.push({ path: `/perfil?tipo=sugestao&id=${id}` })
        this.$router.go()
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
