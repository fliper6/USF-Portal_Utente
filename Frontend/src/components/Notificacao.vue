<template>
    <v-menu offset-y>
        <template v-slot:activator="{ }">
         <!-- <div @click="up()" v-bind="attrs" v-on="on">-->
          <span v-on:click="contador++">
            <notification-bell size="25" fontSize="10px" iconColor='var(--grey3-color)' ding="true" :count="contador" upperLimit="10"/>
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

    export default {
        name: "notificacao",
        data: () => ({
            token: localStorage.getItem('jwt'),
            contador: 2
        }),
        methods: {
        },    
        components: {
          NotificationBell 
        }     
    }
</script>

<style>


</style>