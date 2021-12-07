<template>
    <v-menu offset-y>
        <template v-slot:activator="{ }">
         <!-- <div @click="up()" v-bind="attrs" v-on="on">-->
          <span v-on:click="contador++">
            <notification-bell :size='25' fontSize="10px" iconColor='var(--grey3-color)' :ding='true' :count="contador" :upperLimit='10' />
          </span>
        </template>
        <v-list style="padding:0">
          <router-link class="opcao" :to="'/'">
            <v-list-item class="opcao">
              <b>Notificação</b>
            </v-list-item>
          </router-link>
        </v-list>
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
            contador: 2,
            socket: null
        }),  
        components: {
          NotificationBell 
        },
        created() {
          //SocketioService.setupSocketConnection();

          this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT,{
            query: {
              uid: jwt.decode(this.token)._id
            }
          });
          //this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
          this.socket.on('connect', () => {
            console.log(this.socket.id); // an alphanumeric id...
          });

          this.socket.on('update notificacoes', (data) => {
            console.log(data);
            this.getNotificacoes()
          });
        },
        beforeUnmount() {
          //SocketioService.disconnect();~
          if (this.socket) {
            this.socket.disconnect();
          }
        },    
        methods: {
          getNotificacoes (){
            let user = jwt.decode(this.token)._id
            axios.get("http://localhost:3333/notificacao/PorUser/"+user,{headers:{'authorization':'Bearer '+ this.token}})
            .then( data => {
              console.log(data.data)
            })
            .catch(err => {
              console.log(err)
            })
          }
        }    
      }
</script>

<style>


</style>