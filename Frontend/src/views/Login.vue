   
<template>
    <div id="login">
        <v-dialog max-width="400px" v-model="open">
            <template v-if="show" v-slot:activator="{ on }">
                <v-btn
                @click = "close()"
                color="var(--grey3-color)"
                text
                x-large
                plain
                elevation="0"
                v-on="on"
                >Login</v-btn>
            </template>
            
            <v-tabs v-model="tab" show-arrows color="var(--grey3-color)" background-color="var(--white)" icons-and-text light grow>
                <v-tabs-slider style="color: var(--grey3-color)"></v-tabs-slider>
                <v-tab v-for="i in tabs" :key="i.name" >
                    <v-icon large>{{ i.icon }}</v-icon>
                    <div class="caption py-1" >{{ i.name }}</div>
                </v-tab>
                <v-tab-item>
                    <v-card>
                        <v-card-text>
                            <v-container pa-0>
                                <p v-if="alertLogin" class="alert">{{this.message}}</p>
                                <v-col cols="12">
                                    <v-text-field 
                                    @input="$v.email.$touch()" 
                                    @blur="$v.email.$touch()" 
                                    color=var(--secondary-dark-color)
                                    :error-messages="emailErrors"
                                    type="text" 
                                    v-model="email" 
                                    label="Email">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    @input="$v.password.$touch()" 
                                    @blur="$v.password.$touch()" 
                                    color=var(--secondary-dark-color)
                                    :error-messages="passwordErrors"
                                    :append-icon="valueLogin ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueLogin ? 'password' : 'text'" 
                                    v-model="password" 
                                    label="Password"
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
                            class="button-principal" 
                            elevation="1" 
                            v-on:click="login()" 
                            >Login</v-btn>
                        </v-card-actions>

            
                    </v-card>
                </v-tab-item>
                
                <v-tab-item>
                    <v-card>
                        <v-card-text>
                            <v-container pa-0>
                                <p v-if="alertRegist" class="alert ">{{this.message_reg}}</p>
                                <v-col cols="12">
                                    <v-text-field 
                                    @input="$v.email2.$touch()" 
                                    @blur="$v.email2.$touch()" 
                                    :error-messages="email2Errors"
                                    color=var(--secondary-dark-color)
                                    type="text" 
                                    v-model="email2" 
                                    label="Email" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    @input="$v.username.$touch()" 
                                    @blur="$v.username.$touch()" 
                                    :error-messages="usernameErrors"
                                    color=var(--secondary-dark-color)
                                    type="text" 
                                    v-model="username" 
                                    label="Nome Completo" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    @input="$v.n_utente.$touch()" 
                                    @blur="$v.n_utente.$touch()" 
                                    :error-messages="nUtenteErrors"
                                    color=var(--secondary-dark-color)
                                    type="text" 
                                    v-model="n_utente" 
                                    label="Número de Utente" >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field   
                                    @input="$v.n_telemovel.$touch()" 
                                    @blur="$v.n_telemovel.$touch()" 
                                    :error-messages="nTelemovelErrors"                               
                                    color=var(--secondary-dark-color)
                                    type="text" 
                                    v-model="n_telemovel" 
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
                                    @input="$v.passRegist.$touch()" 
                                    @blur="$v.passRegist.$touch()" 
                                    :error-messages="passwordRegistErrors"
                                    color=var(--secondary-dark-color)
                                    :append-icon="valueRegistarPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarPass ? 'password' : 'text'"
                                    v-model="passRegist" label="Password"
                                    @click:append="() => (valueRegistarPass = !valueRegistarPass)">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                    @input="$v.passverify.$touch()" 
                                    @blur="$v.passverify.$touch()" 
                                    :error-messages="passwordMatchErrors"
                                    color=var(--secondary-dark-color)
                                    :append-icon="valueRegistarConfirPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarConfirPass ? 'password' : 'text'"
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
                            width="300" 
                            style="height:40px;" 
                            class="button-principal"  
                            elevation="1" 
                            v-on:click="register()" 
                            >Registar</v-btn>
                        </v-card-actions>
          
                    </v-card>
                </v-tab-item>

            </v-tabs>   
        </v-dialog>
    </div>
</template>




<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'

    export default {
        name: 'Login',
        mixins: [validationMixin],
        validations: {
          email: { required },
          email2: { required },
          password: { required },
          passRegist: { required },
          username: { required },
          n_utente: { required },
          n_telemovel: {},
          passverify: { required}
        },
        computed: {
            emailErrors () {
              const errors = []
              if (!this.$v.email.$dirty) return errors
              if (!this.$v.email.required) {
                  errors.push('Email é um campo obrigatório.')
              }
              return errors
            },
            email2Errors () {
              const errors = []
              if (!this.$v.email2.$dirty) return errors
              if (!this.$v.email2.required) {
                  errors.push('Email é um campo obrigatório.')
              }
              else if (!this.validEmail(this.email2)) {
                errors.push('Email inválido.');
                }
              return errors
            },
            usernameErrors() {
              const errors = []
              if (!this.$v.username.$dirty) return errors
              !this.$v.username.required && errors.push('Nome é um campo obrigatório.')
              return errors
            },
            passwordRegistErrors () {
              const errors = []
              if (!this.$v.passRegist.$dirty) return errors
              !this.$v.passRegist.required && errors.push('Password é um campo obrigatório.')
              return errors
            },
            passwordErrors () {
              const errors = []
              if (!this.$v.password.$dirty) return errors
              !this.$v.password.required && errors.push('Password é um campo obrigatório.')
              return errors
            },
            passwordMatchErrors () {
              const errors = []
              if (!this.$v.passverify.$dirty) return errors
              if (!this.$v.passverify.required) {
                  errors.push('Password é um campo obrigatório.')
              }
              else if (!this.verificaPasswords()) {
                  errors.push('Passwords têm de corresponder!')
              }
              return errors
            },
            nUtenteErrors() {
              const errors = []
              if (!this.$v.n_utente.$dirty) return errors
              if (!this.$v.n_utente.required) {
                  errors.push('Número de utente é um campo obrigatório.')
              }
              else if (!this.validNumero(this.n_utente)) {
                  errors.push('Número de utente inválido.')
              }
              return errors
            },
            nTelemovelErrors() {
              const errors = []
              if (!this.$v.n_telemovel.$dirty) return errors
              if (!this.validNumero(this.n_telemovel) && this.n_telemovel!="") {
                  errors.push('Número de telemóvel inválido.')
              }
              return errors
            }
        },
        data() {
            return {
                tab: 0,
                tabs: [
                    {name:"Login", icon:"mdi-account"},
                    {name:"Registar", icon:"mdi-account-outline"}
                ],
                email: "",
                email2:"",
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
                open: false
            }
        },
        watch: {
            'isOpen': function() {
                this.open=this.isOpen
            }
        },
        props: {
            isOpen: Boolean,
            show: Boolean
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },   
        methods: {
            close() {
              this.$v.$reset()
              this.email=""
              this.email2=""
              this.password=""
              this.passRegist="",
              this.passverify="",
              this.username="",
              this.n_utente="",
              this.n_telemovel="",
              this.alertRegist=null,
              this.alertLogin=null
            },
            validEmail: function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            validNumero: function (numero) {
                var re = /^[0-9]{9}$/ig;
                return re.test(numero);
            },
            verificaPasswords: function () {
                return this.passRegist==this.passverify;
            },
            postLogin(json) {
                axios.post("http://localhost:3333/users/login", json)
                    .then(data => {
                        localStorage.setItem('jwt',data.data.token)
                        this.$router.go()
                        this.open = false
                        this.loading = false  
                    })
                    .catch(() => {
                        this.alertLogin = true
                        this.loading = false
                        this.message = "Email ou password inválidos!"
                    })
            },
            login() {
                this.$v.$touch() 
                if (this.$v.email.required && this.$v.password.required) {
                    this.loading = true
                    var json = {}
                    json['email'] = this.email
                    json['password'] = this.password
                    this.postLogin(json)
                }
            },
            
            register() {               
                this.loading=true
                this.$v.$touch()

                if (this.$v.email2.required && this.validEmail(this.email2) && this.$v.passRegist.required && 
                    this.$v.passverify.required && this.$v.username.required && this.$v.n_utente.required && 
                    this.validNumero(this.n_utente) && this.verificaPasswords() &&
                    (this.n_telemovel=="" || this.validNumero(this.n_telemovel))) {

                    var json = {}
                    json['email'] = this.email2
                    json['password'] = this.passRegist
                    json['nome'] = this.username
                    json['nr_utente'] = this.n_utente
                    json['nr_telemovel'] = this.n_telemovel
                    
                    axios.post("http://localhost:3333/users/registar", json)
                        .then( () => {
                            this.postLogin(json)
                        })
                        .catch(res => {
                            console.log(res)
                            this.alertRegist = true
                            this.loading = false
                            this.message_reg = 'De momento não é possível efetuar o registo!' + '\n' + 'Por favor tente mais tarde'
                        })  
                }
                else {
                    this.loading = false
                }
            },
                       
        }
    }
  
</script>



<style scoped>
    #login {
        margin: auto;
    }
    
    .alert {
        white-space: pre-line;
        text-align: center;
        color: red;
    }

</style>
