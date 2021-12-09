<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <span v-on="on" style="cursor:pointer" @click="openNotifications()">
            <notification-bell :size='25' fontSize="10px" iconColor='var(--grey3-color)' :ding='pling' :count="contador" :upperLimit='10' />
          </span>
        </template>

        <v-card max-width=400px> 
          <v-list max-height=800px dense class="pa-0">

            <v-subheader class="pa-8">
              <v-row>
                <v-col cols="10">
                    <b style="font-size:22px; color:var(--white)">Notificações</b>
                </v-col>
                <v-col cols="2" class="icon">

                    <template>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <div class="d-flex align-center" v-bind="attrs" v-on="on">
                                <v-icon size="30px" color="var(--white)">mdi-dots-horizontal</v-icon>
                              </div>
                            </template>

                            <v-list style="padding:0;cursor:pointer">
                                <v-list-item class="opcao pa-1" @click="readAll()">
                                  <v-row >
                                    <v-col cols="1" style="margin:auto">
                                      <v-icon>mdi-check</v-icon>
                                    </v-col>
                                    <v-col cols="10" offset="1" style="margin:auto">
                                      <b>Marcar todas como lidas</b>
                                    </v-col>
                                  </v-row>
                                </v-list-item>

                                <v-list-item class="opcao pa-1" @click="removeAll()">
                                  <v-row >
                                    <v-col cols="1" style="margin:auto">
                                      <v-icon>mdi-delete</v-icon>
                                    </v-col>
                                    <v-col cols="10" offset="1" style="margin:auto">
                                      <b>Remover todas notificações</b>
                                    </v-col>
                                  </v-row>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>

                </v-col> 
              </v-row>
            </v-subheader>

            <v-divider></v-divider>

            <div v-if="this.notifications.length">
              <v-list-item 
                @click="goToNotification(notification._id, notification.idReferente, notification.tipo)" 
                class="pa-4 backColor" 
                v-for="notification in notifications" 
                :key="`notification-key-${notification._id}`"
              >
                <v-row>
                    <v-col cols="2" style="margin:auto">
                        <v-icon v-if="notification.estado==2">mdi-brightness-1</v-icon>
                        <v-icon v-else color="var(--blue-color)">mdi-brightness-1</v-icon>
                    </v-col>
                  
                    <v-col cols="8">
                      <v-list-item-content style="font-size:18px;height:48px">
                          <b>{{notification.descricao}}</b>                    
                      </v-list-item-content> 
                      <div style="margin-top:6px;font-size:14px"> {{ notification.data_criacao | moment("from") }}</div>
                    </v-col>      
  
                    <v-col cols="2" style="margin:auto" class="iconNoti">
                      <template>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <div class="d-flex align-center" v-bind="attrs" v-on="on">
                                <v-icon size="30px" color="var(--grey3-color)">mdi-dots-horizontal</v-icon>
                              </div>
                            </template>

                            <v-list style="padding:0;cursor:pointer">
                                <v-list-item class="opcao pa-1" @click="readOne(notification._id)">
                                  <v-row >
                                    <v-col cols="1" style="margin:auto">
                                      <v-icon>mdi-check</v-icon>
                                    </v-col>
                                    <v-col cols="10" offset="1" style="margin:auto">
                                      <b>Marcar como lida</b>
                                    </v-col>
                                  </v-row>
                                </v-list-item>

                                <v-list-item class="opcao pa-1" @click="removeOne(notification._id)">
                                  <v-row >
                                    <v-col cols="1" style="margin:auto">
                                      <v-icon>mdi-delete</v-icon>
                                    </v-col>
                                    <v-col cols="10" offset="1" style="margin:auto">
                                      <b>Remover a notificação</b>
                                    </v-col>
                                  </v-row>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                      </template>
                    </v-col>
                </v-row>
              </v-list-item>
            </div>
            
            <div v-else>
              <v-list-item class="pa-6 backColor">
                  <v-row>
                    <v-list-item-content>
                      <v-list-item-title style="font-size:18px">Não existem notificações!</v-list-item-title>
                    </v-list-item-content>           
                  </v-row>
              </v-list-item>
            </div>

          </v-list>
        </v-card>
    </v-menu>
</template>


<script>
import NotificationBell from 'vue-notification-bell'
import { io } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import axios from 'axios'

    export default {
        name: "notificacao",
        data: () => ({
            token: localStorage.getItem('jwt'),
            contador: 0,
            socket: null,
            notifications: [],
            pling:false
        }),  
        components: {
          NotificationBell 
        },
        created() {
          //ao iniciar vai buscar as notificações iniciais
          this.getNotificacoes()
          
          this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT,{
            query: {
              uid: jwt.decode(this.token)._id
            }
          });
          this.socket.on('connect', () => {
            console.log(this.socket.id); 
          });

          this.socket.on('update notificacoes', () => {
            this.pling=true
            this.getNotificacoes()
          });
        },
        beforeUnmount() {
          if (this.socket) {
            this.socket.disconnect();
          }
        },    
        methods: {
          getNotificacoes (){
            axios.get("http://localhost:3333/notificacao/PorUser/"+jwt.decode(this.token)._id, {headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              this.notifications = data.data
              this.contador = this.getCount(this.notifications)
            })
            .catch(err => {
              console.log(err)
            })
          },
          getCount(lista) {
            var c = 0
            lista.forEach(elem => { if (elem.estado==0) c++ });
            return c
          },
          readAll(){
            axios.put("http://localhost:3333/notificacao/lidas/"+jwt.decode(this.token)._id, {}, {headers:{'authorization':'Bearer '+ this.token}})
              .then(() => {
                this.getNotificacoes()
              })
              .catch(err => {
                console.log(err)
              })
          },
          readOne(id){
            var json = {}
            json['_id'] = id
            json['estado'] = 2

            axios.put("http://localhost:3333/notificacao/", json, {headers:{'authorization':'Bearer '+ this.token}})
              .then(() => {
                this.getNotificacoes()
              })
              .catch(err => {
                console.log(err)
              })
          },
          removeOne(id){
            axios.delete("http://localhost:3333/notificacao/"+id, {headers:{'authorization':'Bearer '+ this.token}})
              .then(() => {
                this.getNotificacoes()
              })
              .catch(err => {
                console.log(err)
              })
          },
          removeAll(){
            axios.delete("http://localhost:3333/notificacao/all/"+jwt.decode(this.token)._id, {headers:{'authorization':'Bearer '+ this.token}})
              .then(() => {
                this.notifications = []
                this.contador = 0
              })
              .catch(err => {
                console.log(err)
              })
          },
          openNotifications(){
            axios.put("http://localhost:3333/notificacao/recebidas/"+jwt.decode(this.token)._id, {}, {headers:{'authorization':'Bearer '+ this.token}})
              .then(() => {
                this.contador=0
              })
              .catch(err => {
                console.log(err)
              })
          },
          goToNotification(idNot,idRef, tipo){
            //meter a notificacao no estado 2
            var json = {}
            json['_id'] = idNot
            json['estado'] = 2

            axios.put("http://localhost:3333/notificacao/", json, {headers:{'authorization':'Bearer '+ this.token}})
              .then(() => {
                //redirecionar o utilizador para o sitio referente à notificação
                this.$router.push('/perfil?tipo='+tipo + '&&id='+ idRef)
              })
              .catch(err => {
                console.log(err)
              })
          }
        }    
      }
</script>

<style>

.v-subheader {
  background-color: var(--grey3-color) !important;
}

.backColor {
  background-color: var(--grey2-color) !important;
}



.icon .v-icon:hover {
  background-color:	var(--shadow-color)
}

.icon .v-icon {
  border-radius: 50%;
  background-color:var(--grey3-color)
}

.iconNoti .v-icon:hover {
  background-color:	var(--shadow-color)
}

.iconNoti .v-icon {
  border-radius: 50%;
}

</style>