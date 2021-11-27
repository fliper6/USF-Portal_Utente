   
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
                                
                                <p v-if="alertLogin" class="alert">{{this.erroLogin}}</p>
                                
                                <v-col cols="12">
                                    <v-text-field 
                                    color=var(--secondary-dark-color)
                                    :error-messages="emailLoginErrors"
                                    type="text" 
                                    v-model="emailLogin" 
                                    label="Email">
                                    </v-text-field>
                                </v-col>
                                
                                <v-col cols="12">
                                    <v-text-field  
                                    color=var(--secondary-dark-color)
                                    :error-messages="passLoginErrors"
                                    :append-icon="valueLogin ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueLogin ? 'password' : 'text'" 
                                    v-model="passLogin" 
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

                                <p v-if="alertRegisto" class="alert ">{{this.erroRegisto}}</p>
                                
                                <v-col cols="12">
                                    <v-text-field 
                                    :error-messages="emailRegistoErrors"
                                    color=var(--secondary-dark-color)
                                    type="text" 
                                    v-model="emailRegisto" 
                                    label="Email" >
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field 
                                    :error-messages="usernameErrors"
                                    color=var(--secondary-dark-color)
                                    type="text" 
                                    v-model="username" 
                                    label="Nome Completo" >
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field 
                                    :error-messages="nUtenteErrors"
                                    color=var(--secondary-dark-color)
                                    type="text" 
                                    v-model="n_utente" 
                                    label="Número de Utente" >
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field   
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
                                    :error-messages="passRegistoErrors"
                                    color=var(--secondary-dark-color)
                                    :append-icon="valueRegistarPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarPass ? 'password' : 'text'"
                                    v-model="passRegisto" label="Password"
                                    @click:append="() => (valueRegistarPass = !valueRegistarPass)">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field 
                                    :error-messages="passwordMatchErrors"
                                    color=var(--secondary-dark-color)
                                    :append-icon="valueRegistarConfirPass ? 'mdi-eye' : 'mdi-eye-off'" 
                                    :type="valueRegistarConfirPass ? 'password' : 'text'"
                                    block 
                                    v-model="passVerificacao"
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
import { required, sameAs, between, email } from 'vuelidate/lib/validators'
import axios from 'axios'

    export default {
        name: 'Login',
        mixins: [validationMixin],
        validations: {
          emailLogin: { required },
          emailRegisto: { required,  email },
          passLogin: { required },
          passRegisto: { required },
          passVerificacao: { required, sameAsPassword: sameAs('passRegisto')},
          username: { required },
          n_utente: { required, between: between(100000000,999999999)},
          n_telemovel: { between: between(900000000,999999999)}
        },
        computed: {
            emailLoginErrors () {
              const errors = []
              if (!this.$v.emailLogin.$dirty) return errors
              if (!this.$v.emailLogin.required) errors.push('Email é um campo obrigatório.')
              return errors
            },
            emailRegistoErrors () {
              const errors = []
              if (!this.$v.emailRegisto.$dirty) return errors
              if (!this.$v.emailRegisto.required) errors.push('Email é um campo obrigatório.')
              else if (!this.$v.emailRegisto.email) errors.push('Email inválido.');
              return errors
            },
            usernameErrors() {
              const errors = []
              if (!this.$v.username.$dirty) return errors
              !this.$v.username.required && errors.push('Nome é um campo obrigatório.')
              return errors
            },
            passRegistoErrors () {
              const errors = []
              if (!this.$v.passRegisto.$dirty) return errors
              !this.$v.passRegisto.required && errors.push('Password é um campo obrigatório.')
              return errors
            },
            passLoginErrors () {
              const errors = []
              if (!this.$v.passLogin.$dirty) return errors
              !this.$v.passLogin.required && errors.push('Password é um campo obrigatório.')
              return errors
            },
            passwordMatchErrors () {
              const errors = []
              if (!this.$v.passVerificacao.$dirty) return errors
              if (!this.$v.passVerificacao.required) errors.push('Password é um campo obrigatório.')
              else if (!this.$v.passVerificacao.sameAsPassword) errors.push('Passwords têm de corresponder!')
              return errors
            },
            nUtenteErrors() {
              const errors = []
              if (!this.$v.n_utente.$dirty) return errors
              if (!this.$v.n_utente.required) errors.push('Número de utente é um campo obrigatório.')
              else if (!this.$v.n_utente.between) errors.push('Número de utente inválido.')
              return errors
            },
            nTelemovelErrors() {
              const errors = []
              if (!this.$v.n_telemovel.$dirty) return errors
              if (!this.$v.n_telemovel.between && this.n_telemovel!="") errors.push('Número de telemóvel inválido.')
              return errors
            }
        },
        data() {
            return {
                //TABS
                tab: 0,
                tabs: [
                    {name:"Login", icon:"mdi-account"},
                    {name:"Registar", icon:"mdi-account-outline"}
                ],
                
                //LOGIN
                emailLogin: "",
                passLogin: "",
                erroLogin:'',
                alertLogin: false,
                valueLogin: String,

                //REGISTO
                emailRegisto:"",
                passRegisto:"",
                passVerificacao: "",
                username: "",
                n_utente: "",
                n_telemovel: "",
                erroRegisto : '',
                alertRegisto: false,
                valueRegistarPass: String,
                valueRegistarConfirPass: String,

                //GERAL
                type: "password",
                loading: false,
                open: this.isOpen
            }
        },
        props: {
            isOpen: Boolean,
            show: Boolean
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },  
        watch: {
            'tab': function() {
                this.$v.$reset()
                this.alertRegisto=null
                this.alertLogin=null
            }
        },
        methods: {
            close() {
              this.$v.$reset()
              this.emailLogin=""
              this.emailRegisto=""
              this.passLogin=""
              this.passRegisto=""
              this.passVerificacao=""
              this.username=""
              this.n_utente=""
              this.n_telemovel=""
              this.alertRegisto=null
              this.alertLogin=null
              this.tab=0
            },
            postLogin(json) {
                axios.post("http://localhost:3333/users/login", json)
                    .then(data => {
                        localStorage.setItem('jwt',data.data.token)
                        this.$router.go()
                        this.open = false
                        this.loading = false  
                    })
                    .catch(error => {
                        this.alertLogin = true
                        this.loading = false
                        if (error.response) this.erroLogin = "Email ou password inválidos!"
                        else this.erroLogin = 'De momento não é possível efetuar o login!' + '\n' + 'Por favor tente mais tarde'
                    })
            },
            login() {
                this.$v.$touch() 
                if (this.$v.emailLogin.required && this.$v.passLogin.required) {
                    this.loading = true
                    var json = {}
                    json['email'] = this.emailLogin
                    json['password'] = this.passLogin
                    this.postLogin(json)
                }
            },
            
            register() {               
                this.loading=true
                this.$v.$touch()

                if (this.$v.emailRegisto.required && this.$v.emailRegisto.email && this.$v.passRegisto.required && 
                    this.$v.passVerificacao.required && this.$v.username.required && this.$v.n_utente.required && 
                    this.$v.n_utente.between && this.$v.passVerificacao.sameAsPassword &&
                    (this.n_telemovel=="" || this.$v.n_telemovel.between)) {

                    var json = {}
                    json['email'] = this.emailRegisto
                    json['password'] = this.passRegisto
                    json['nome'] = this.username
                    json['nr_utente'] = this.n_utente
                    json['nr_telemovel'] = this.n_telemovel
                    
                    axios.post("http://localhost:3333/users/registar", json)
                        .then( () => {
                            this.postLogin(json)
                        })
                        .catch(error => {
                            this.alertRegisto = true
                            this.loading = false
                            if (error.response) this.erroRegisto = "Email já existente!"
                            else this.erroRegisto = 'De momento não é possível efetuar o registo!' + '\n' + 'Por favor tente mais tarde'
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
