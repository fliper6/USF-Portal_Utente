<template>
    <div id="recuperaPass">

        <!-- MODAL DE SUCESSO -->
        <modal-message
          title="Sucesso"
          :visible="modalSucesso"
          @close="sucesso()"
        >
          A password foi alterada com sucesso!
        </modal-message>

        <!-- MODAL DE ERRO -->
        <modal-message
          title="Erro"
          :visible="modalErro"
          @close="erro()"
        >
          Não é possível alterar a password neste momento! Por favor tente mais tarde
        </modal-message>

        <!-- APENAS PODE RECUPERAR PASSWORD QUEM ESTÁ SEM SESSÃO INICIADA!!! -->
        <v-col cols="4" offset="4" v-if="!this.token && this.$route.query.codigo">
            <v-card outlined>
                
                <v-card-title class="justify-center"> 
                    <h2> <b> Nova password </b></h2>  
                </v-card-title>
                
                <v-card-text class="justify-center">
                   
                    <!-- PASSWORD -->
                    <v-col cols="12">
                        <v-text-field  
                        :error-messages="passErrors"
                        color=var(--secondary-dark-color)
                        :append-icon="valueRegistarPass ? 'mdi-eye' : 'mdi-eye-off'" 
                        :type="valueRegistarPass ? 'password' : 'text'"
                        v-model="pass" label="Nova Password"
                        hint="(De 8 a 20 caracteres. Deverá contêr, pelo menos, uma letra minúscula, uma maiúscula e um número. Não pode conter espaços.)"
                        persistent-hint
                        @click:append="() => (valueRegistarPass = !valueRegistarPass)">
                        </v-text-field>
                    </v-col>
                            
                    <!-- CONFIRMAÇÃO DE PASSWORD -->
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

                </v-card-text>

                
                <!-- BOTÃO GUARDAR -->
                <v-card-actions class="justify-center">
                    <v-btn 
                    :loading="loading" 
                    v-ripple="{ class: 'primary--text' }" 
                    width="300" 
                    style="height:40px;margin-bottom:20px" 
                    class="button-principal justify-center"  
                    elevation="1" 
                    v-on:click="save()" 
                    >Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>

        <Error v-else/>

    </div>
</template>




<script>
import Error from '../views/Error.vue'
import { validationMixin } from 'vuelidate'
import { required, sameAs } from 'vuelidate/lib/validators'
import ModalMessage from '../components/ModalMessage.vue'
import axios from 'axios'
const host = require('../../../config.json').backend

    export default {
        name: 'recuperaPass',
        mixins: [validationMixin],
        validations: {
          pass: { required },
          passVerificacao: { required, sameAsPassword: sameAs('pass')}
        },
        computed: {
            passErrors () {
              const errors = []
              if (!this.$v.pass.$dirty) return errors
              if (!this.$v.pass.required) errors.push('Password é um campo obrigatório.')
              else if (!this.validaPassword(this.pass)) errors.push('De 8 a 20 caracteres. Deverá contêr, pelo menos, uma letra minúscula, uma maiúscula e um número. Não pode conter espaços.')
              return errors
            },
            passwordMatchErrors () {
              const errors = []
              if (!this.$v.passVerificacao.$dirty) return errors
              if (!this.$v.passVerificacao.required) errors.push('Password é um campo obrigatório.')
              else if (!this.$v.passVerificacao.sameAsPassword) errors.push('Passwords têm de corresponder!')
              return errors
            }
        },
        components: {
            Error,
            ModalMessage
        },
        data() {
            return {

                //GERAL
                token:localStorage.getItem('jwt'),

                //NOVA PASSWORD
                pass:"",
                passVerificacao: "",
                valueRegistarPass: String,
                valueRegistarConfirPass: String,
                type: "password",
                loading:false,

                //MODAIS
                modalErro: false,
                modalSucesso: false,
            }
        }, 
        methods: {  
            save() {
                this.$v.$touch() 
                if (this.verificaCampos()) {
                    this.loading = true
                    var json = {}
                    json['password'] = this.pass
                    json['codigo'] = this.$route.query.codigo
                    axios.post(host + "/verificar/recuperar/confirmar", json)
                        .then(() => {
                            this.loading = false
                            this.modalSucesso = true   
                        })
                        .catch(() => {
                            this.loading = false
                            this.modalErro = true
                          }) 
                }   
            },
            verificaCampos(){
                return (this.$v.pass.required && this.$v.passVerificacao.required && 
                        this.$v.passVerificacao.sameAsPassword && this.validaPassword(this.pass)) 
            },
            validaPassword(pass) {
                //TUDO MENOS ESPAÇOS. DEVE CONTÊR PELO MENOS 1 MINÚSCULA, 1 MAIÚSCULA E 1 NÚMERO
                var re = /^(?!.* )(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\d]).{8,20}$/
                return re.test(pass)
            },
            sucesso() {
                this.modalSucesso = false
                this.$router.push('/')
            },
            erro() {
                this.modalErro = false
                this.$router.push('/')
            }
        }
    }
  
</script>



<style scoped>

</style>
