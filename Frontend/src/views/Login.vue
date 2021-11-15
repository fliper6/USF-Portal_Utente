   
<template>
    <div id="login">
        <v-dialog max-width="400px" v-model="dialog">
            <template v-slot:activator="{ on }">
                <v-btn
                color="grey"
                text
                x-large
                plain
                elevation="0"
                v-on="on"
                >Login</v-btn>
            </template>
            
            <v-tabs v-model="tab" show-arrows color="#800000" background-color="white" icons-and-text light grow>
                <v-tabs-slider class="col"></v-tabs-slider>
                <v-tab v-for="i in tabs" :key="i.name" >
                    <v-icon large class="tab">{{ i.icon }}</v-icon>
                    <div class="caption py-1" >{{ i.name }}</div>
                </v-tab>
                <v-tab-item>
                    <v-card>
                        <v-card-text>
                            <v-container pa-0>
                                <p v-if="alertLogin" class="alert">{{this.message}}</p>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="email" 
                                    :rules="[rules.required]"
                                    label="Email">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    :append-icon="valueLogin ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueLogin ? 'password' : 'text'" 
                                    v-model="password" 
                                    label="Password"
                                    :rules="[rules.required]"
                                    @click:append="() => (valueLogin = !valueLogin)">
                                    </v-text-field>
                                </v-col>
                            </v-container>
                        </v-card-text>

                        <v-card-actions class="justify-center">
                            <v-btn 
                            :loading="loading" 
                            v-ripple="{ class: 'primary--text' }" 
                            width="300" 
                            style="height:40px;" 
                            class="white--text" 
                            elevation="1" 
                            v-on:click="login()" 
                            color="#800000"
                            >Login</v-btn>
                        </v-card-actions>

            
                    </v-card>
                </v-tab-item>
                
                <v-tab-item>
                    <v-card>
                        <v-card-text>
                            <v-container pa-0>
                                <p v-if="alertRegist" class="alert">{{this.message_reg}}</p>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="email" 
                                    :rules="[rules.required,rules.containv,rules.containpv,rules.containa,rules.containpe,rules.containdp]"
                                    label="Email" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="username" 
                                    :rules="[rules.required,rules.containv,rules.containpv,rules.containa,rules.containpe,rules.containp,rules.containdp]"
                                    label="Nome Completo" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="n_utente" 
                                    :rules="[rules.required,rules.containv,rules.containpv,rules.containa,rules.containpe,rules.containp,rules.containdp]"
                                    label="Número de Utente" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    type="text" 
                                    v-model="n_telemovel" 
                                    :rules="[rules.containv,rules.containpv,rules.containa,rules.containpe,rules.containp,rules.containdp]"
                                    >
                                    <template v-slot:label>
                                      <div>
                                      Número de Telemóvel <small>(opcional)</small>
                                      </div>
                                    </template>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    :append-icon="valueRegistarPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarPass ? 'password' : 'text'"
                                    :rules="[rules.required]"  
                                    v-model="passRegist" label="Password"
                                    @click:append="() => (valueRegistarPass = !valueRegistarPass)">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    :append-icon="valueRegistarConfirPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarConfirPass ? 'password' : 'text'"
                                    :rules="[rules.required, passwordMatch]" 
                                    block 
                                    v-model="passverify"
                                    label="Confirmar Password"
                                    @click:append="() => (valueRegistarConfirPass = !valueRegistarConfirPass)">
                                    </v-text-field>
                                </v-col>
                            </v-container>
                        </v-card-text>

                        <v-card-actions class="justify-center">
                            <v-btn 
                            :loading="loading" 
                            v-ripple="{ class: 'primary--text' }" 
                            width="300" style="height:40px;" 
                            class="white--text" 
                            elevation="1" 
                            v-on:click="register()" 
                            color="#800000"
                            >Registar</v-btn>
                        </v-card-actions>
          
                    </v-card>
                </v-tab-item>

            </v-tabs>   
        </v-dialog>
    </div>
</template>




<script>
import axios from 'axios'
    export default {
        name: 'Login',
        data() {
            return {
                tab: 0,
                tabs: [
                    {name:"Login", icon:"mdi-account"},
                    {name:"Registar", icon:"mdi-account-outline"}
                ],
                rules: {
                    required: value => !!value || "Este campo é obrigatório.",
                    containv: v => !v.includes(',') || "Não pode conter ','",
                    containpv: v => !v.includes(';') || "Não pode conter ';'",
                    containa: v => !v.includes('"') || `Não pode conter ' " '`,
                    containpe: v => !v.includes("'") || "Não pode conter ' ' '",
                    containdp: v => !v.includes(':') || "Não pode conter ':'",
                    containp: v => !v.includes('.') || "Não pode conter '."
                },
                email: "",
                password: "",
                passRegist:"",
                passverify: "",
                username: "",
                n_utente: "",
                n_telemovel: "",
                type: "password",
                valueLogin: String,
                valueRegistarPass: String,
                valueRegistarConfirPass: String,
                message:'',
                message_reg : '',
                alertLogin: false,
                alertRegist: false,
                loading: false,
                dialog: false,
            }
        },
        computed: {
            passwordMatch() {
                return () => this.passRegist === this.passverify || "Password must match";
            }
        },  
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },   
        methods: {
            postLogin(json) {
                axios.post("http://localhost:3333/users/login", json)
                    .then(data => {
                        localStorage.setItem('jwt',data.data.token)
                        this.$router.go()
                        this.dialog = false
                        this.loading = false
                    })
                    .catch(() => {
                        this.alertLogin = true
                        this.loading = false
                        this.message = "Email ou password inválidos!"
                    })
            },
            login() {
                this.loading = true
                var json = {}
                json['email'] = this.email
                json['password'] = this.password
                this.postLogin(json)
            },
            
            register() {
                this.loading=true
                var json = {}
                json['email'] = this.email
                json['password'] = this.passRegist
                json['nome'] = this.username
                json['nr_utente'] = this.n_utente
                json['nr_telemovel'] = this.n_telemovel
                axios.post("http://localhost:3333/users/registar", json)
                    .then( () => {
                        this.postLogin(json)
                    })
                    .catch(() => {
                        this.alertRegist = true
                        this.loading = false
                        this.message_reg = "Não foi possível efetuar o registo!"
                    })  
            },
                       
        }
    }
  
</script>



<style scoped>
    #login {
        margin: auto;
    }
    
    .alert {
        text-align: center;
        color: red;
    }
    
    .tab {
        color: #CCCCCC;
    }
    
    .col{
        color: #800000;
    }


</style>
