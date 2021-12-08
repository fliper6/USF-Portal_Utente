<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <span v-on="on" style="cursor:pointer" @click="openNotifications()">
            <notification-bell :size='25' fontSize="10px" iconColor='var(--grey3-color)' :ding='pling' :count="contador" :upperLimit='10' />
          </span>
        </template>

        <v-card max-width=400px> 
          <v-list max-height=800px dense class="pa-0">

            <v-subheader  class="pa-8" style="font-size:20px">
              <b style="color: var(--white)">Notificações</b>
            </v-subheader>

            <v-divider></v-divider>

            <div v-if="this.notifications.length">
              <v-list-item 
                @click="goToNotification(notification.idReferente)" 
                class="pa-6 backColor" 
                v-for="notification in notifications" 
                :key="`notification-key-${notification._id}`"
              >
                  <v-list-item-icon>
                    <v-icon v-if="notification.estado==2">mdi-brightness-1</v-icon>
                    <v-icon v-else color="var(--blue-color)">mdi-brightness-1</v-icon>
                  </v-list-item-icon>
                  <v-row>
                    <v-list-item-content>
                      <v-list-item-title v-text="notification.descricao" style="font-size:18px"></v-list-item-title>
                      <div style="margin-top:10px; font-size:14px"> {{ notification.data_criacao | moment("from") }}</div>
                    </v-list-item-content>           
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
//import SocketioService from '../services/socketio.service.js';
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
              console.log(data.data)
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
          openNotifications(){
            //this.contador=0
            //meter as notificações no estado 1
          },
          goToNotification(id){
            console.log(id)
            //meter a notificacao no estado 2
            //redirecionar o utilizador para o sitio referente à notificação
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

</style>