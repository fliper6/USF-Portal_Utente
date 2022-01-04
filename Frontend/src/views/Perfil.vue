<template>
  <div class="perfil">
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
            label="Título" 
            v-model="titulo">
          </v-text-field>

          <!-- DESCRIÇÃO -->
          <v-textarea 
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

    <!-- MODAL DE SUCESSO -->
    <modal-message
      title="Sucesso"
      :visible="modalSucesso"
      @close="ok()"
    >
      Dados alterados com sucesso!
    </modal-message>

    <!-- MODAL DE SUCESSO EMAIL-->
    <modal-message
      title="Sucesso"
      :visible="modalSucessoEmail"
      @close="ok()"
    >
      Continue o processo de troca através do email enviado para o seu novo email!
    </modal-message>

    <!-- MODAL DE ERRO -->
    <modal-message
      title="Erro"
      :visible="modalErro"
      @close="ok()"
    >
      Não foi possível alterar os dados! Por favor tente mais tarde
    </modal-message>


    <!-- MODAL DE CANCELAMENTO DE PEDIDO DE MEDICAÇÃO-->
    <modal-message
      title="Sucesso"
      :visible="modalCancelarPedido"
      @close="$router.push({path:'/perfil'});$router.go()"
    >
      Pedido removido com sucesso.
    </modal-message>

    <!-- MODAL DE EDITAR OS CAMPOS DO PERFIL -->
    <v-dialog v-model="modalEditarDados" width="400">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Editar o perfil</v-card-title> <br/>
        
        <v-col style="margin: auto; padding: 0px 50px;">
          
          <!-- NOME -->
          <v-text-field
            :error-messages="nomeErrors"
            color=var(--secondary-dark-color)
            v-model="newNome"
            label="Nome"
            type="text"
            class="texto_perfil">
          </v-text-field>

          <!-- NUMERO UTENTE -->
          <v-text-field
            :error-messages="nUtenteErrors"
            v-model="newNUtente"
            type="text"
            color=var(--secondary-dark-color)
            label="Número SNS"
            class="texto_perfil">
          </v-text-field>

          <!-- NUMERO TELEMOVEL -->
          <v-text-field
          :error-messages="nTelemovelErrors"
            v-model="newNTelemovel"
            color=var(--secondary-dark-color)
            label="Número Telemovel"
            type="text"
            class="texto_perfil">
          </v-text-field>

        </v-col>
        
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button-cancelar" text @click="cancelarEditarPerfil()"> Cancelar </v-btn>
          <v-btn class="button-confirmar" :loading="loading" text @click="confirmarEditarPerfil()"> Confirmar </v-btn>
        </v-card-actions> 

      </v-card>
    </v-dialog> 



    <!-- MODAL DE ALTERAR A PASSWORD -->
    <v-dialog v-model="modalAlterarPassword" width="400">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Alterar a password</v-card-title> <br/>
        
        <v-col style="margin: auto; padding: 0px 50px;">
          
          <!-- MENSAGENS DE ERRO -->
          <p v-if="alertPassword" class="alert ">{{this.erroPassword}}</p>

          <!-- ANTIGA PASSWORD -->
          <v-text-field  
          color=var(--secondary-dark-color)
          :error-messages="passAntigaErrors"
          :append-icon="valuePassAntiga ? 'mdi-eye' : 'mdi-eye-off'" 
          :type="valuePassAntiga ? 'password' : 'text'" 
          v-model="passAntiga" 
          label="Antiga Password"
          @click:append="() => (valuePassAntiga = !valuePassAntiga)">
          </v-text-field>

          <!-- NOVA PASSWORD -->
          <v-text-field  
          :error-messages="passNovaErrors"
          color=var(--secondary-dark-color)
          :append-icon="valuePassNova ? 'mdi-eye' : 'mdi-eye-off'" 
          :type="valuePassNova ? 'password' : 'text'"
          v-model="passNova" 
          label="Nova Password"
          hint="(De 8 a 20 caracteres. Deverá contêr, pelo menos, uma letra minúscula, uma maiúscula e um número. Não pode conter espaços.)"
          persistent-hint
          @click:append="() => (valuePassNova = !valuePassNova)">
          </v-text-field>

          <!-- CONFIRMAÇÃO DE PASSWORD -->
          <v-text-field 
          :error-messages="passwordMatchErrors"
          color=var(--secondary-dark-color)
          :append-icon="valuePassConfirmar ? 'mdi-eye' : 'mdi-eye-off'" 
          :type="valuePassConfirmar ? 'password' : 'text'"
          block 
          v-model="passVerificacao"
          label="Confirmar Password"
          @click:append="() => (valuePassConfirmar = !valuePassConfirmar)">
          </v-text-field>


        </v-col>
        
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button-cancelar" text @click="cancelarAlterarPassword()"> Cancelar </v-btn>
          <v-btn class="button-confirmar" :loading="loading" text @click="confirmarAlterarPassword()"> Confirmar </v-btn>
        </v-card-actions> 

      </v-card>
    </v-dialog> 


    <!-- MODAL DE ALTERAR O EMAIL -->
    <v-dialog v-model="modalAlterarEmail" width="400">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Alterar o email</v-card-title> <br/>
        
        <v-col style="margin: auto; padding: 0px 50px;">
          
          <!-- MENSAGENS DE ERRO -->
          <p v-if="alertEmail" class="alert ">{{this.erroEmail}}</p>

          <!-- NOVO EMAIL -->
          <v-text-field  
          :error-messages="emailNovoErrors"
          color=var(--secondary-dark-color)
          type="text"
          v-model="emailNovo" 
          label="Novo email">
          </v-text-field>

        </v-col>
        
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button-cancelar" text @click="cancelarAlterarEmail()"> Cancelar </v-btn>
          <v-btn class="button-confirmar" :loading="loading" text @click="confirmarAlterarEmail()"> Confirmar </v-btn>
        </v-card-actions> 

      </v-card>
    </v-dialog> 



    <!-- MODAL DE INSERIR A PASSWORD -->
    <v-dialog v-model="modalInserirPassword" width="400">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">Para alterar o email é necessário inserir a password</v-card-title> <br/>
        
        <v-col style="margin: auto; padding: 0px 50px;">
          
          <!-- MENSAGENS DE ERRO -->
          <p v-if="alertInserirPassword" class="alert ">{{this.erroInserirPassword}}</p>

          <!-- CONFIRMAÇÃO DE PASSWORD -->
          <v-text-field 
          color=var(--secondary-dark-color)
          :append-icon="valuePassInserir ? 'mdi-eye' : 'mdi-eye-off'" 
          :type="valuePassInserir ? 'password' : 'text'"
          block 
          v-model="passInserir"
          label="Password"
          @click:append="() => (valuePassInserir = !valuePassInserir)">
          </v-text-field>


        </v-col>
        
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="button-cancelar" text @click="cancelarInserirPassword()"> Cancelar </v-btn>
          <v-btn class="button-confirmar" :loading="loading" text @click="confirmarInserirPassword()"> Confirmar </v-btn>
        </v-card-actions> 

      </v-card>
    </v-dialog> 



    <!-- CAMPOS GERAIS DO PERFIL-->
    <v-container>
      <v-card flat color="var(--grey1-color)">
          <v-row>

            <v-col cols="10">
              <v-card-title>
                <h1> {{this.nome}} </h1>
              </v-card-title>
            </v-col>

            <v-col offset="1" >

              <!-- DROPDOWN DO PERFIL -->
              <template>
                  <v-menu offset-y offset-x left>

                    <!-- BOTÃO DROPDOWN DO PERFIL -->
                    <template v-slot:activator="{ on, attrs }">
                      <div class="d-flex" v-bind="attrs" v-on="on">
                        <v-icon size="30px" >mdi-dots-vertical</v-icon>
                      </div>
                    </template>
                            
                    <!-- LISTA DROPDOWN DO PERFIL -->
                    <v-list style="padding:0;cursor:pointer">

                      <!-- EDITAR O PERFIL -->
                      <v-list-item class="opcao" @click="openModalEditarDados()">
                        <v-row >
                          <v-col style="margin:auto">
                            <b>Editar o perfil</b>
                          </v-col>
                        </v-row>
                      </v-list-item>

                       <!-- ALTERAR O EMAIL -->
                      <v-list-item class="opcao" @click="openModalInserirPassword()">
                        <v-row >
                          <v-col style="margin:auto">
                            <b>Alterar o email</b>
                          </v-col>
                        </v-row>
                      </v-list-item>

                      <!-- ALTERAR A PASSWORD -->
                      <v-list-item class="opcao" @click="openModalAlterarPassword()">
                        <v-row >
                          <v-col style="margin:auto">
                            <b>Alterar a password</b>
                          </v-col>
                        </v-row>
                      </v-list-item>
                    </v-list>
                  </v-menu>
              </template>
            </v-col>  
          </v-row>

          <v-card-text class="texto_perfil">
            <h3>Número SNS : <span class="infos"> {{this.nUtente}} </span></h3>
            <h3 style="margin:10px 0 0 0">Número Telemóvel : <span class="infos"> {{this.nTelemovel=="" ? "Sem preencher" : this.nTelemovel}} </span></h3>
            <h3 style="margin:10px 0 0 0">Email : <span class="infos"> {{this.email}} </span></h3>
          </v-card-text>

      </v-card>
    </v-container>


    <!-- TABS DE HISTORICO -->
    <v-container>
      <v-card flat style="font-size:120%;">
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="med ? 'var(--secondary-color)' : 'var(--grey2-color)'"
                @click="changeTab(pedidoM)"
              >
                Pedidos de Medicação
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="cons ? 'var(--secondary-color)' : 'var(--grey2-color)'"
                @click="changeTab(pedidoC)"
              >
                Pedidos de Contacto
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                depressed
                v-bind:color="sug ? 'var(--secondary-color)' : 'var(--grey2-color)'"
                @click="changeTab(sugest)"
              >
                Sugestões
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

      
      <!-- LISTA DO HISTORICO -->
      <PerfilMedicacao v-if="this.med" :ide="this.ide" :id="this.id" :medicacoes="this.medicacoes" :not="this.not"></PerfilMedicacao>
      <PerfilContacto v-if="this.cons" :ide="this.ide" :id="this.id" :contacto="this.contacto" :not="this.not"></PerfilContacto>
      <PerfilSugestao v-if="this.sug" :ide="this.ide" :id="this.id" :sugestoes="this.sugestoes" :not="this.not"></PerfilSugestao>
    </v-container>

  </div>
</template>

<script>
import jwt from 'jsonwebtoken'
import axios from 'axios'
import ModalMessage from '../components/ModalMessage.vue'
import PerfilMedicacao from '../components/Perfil/Medicacao.vue'
import PerfilContacto from '../components/Perfil/Contacto.vue'
import PerfilSugestao from '../components/Perfil/Sugestao.vue'
import { validationMixin } from 'vuelidate'
import { required, sameAs, between, email } from 'vuelidate/lib/validators'


  export default {
    name: "Perfil",
    mixins: [validationMixin],
    validations: {
      passAntiga: { required },
      passNova: { required },
      passVerificacao: { required, sameAsPassword: sameAs('passNova')},
      newNome: { required },
      newNUtente: { required, between: between(100000000,999999999)},
      newNTelemovel: { between: between(900000000,999999999)},
      emailNovo: { required, email}
    },
    computed: {
        nomeErrors() {
          const errors = []
          if (!this.$v.newNome.$dirty) return errors
          !this.$v.newNome.required && errors.push('Nome é um campo obrigatório.')
          return errors
        },
        passNovaErrors () {
          const errors = []
          if (!this.$v.passNova.$dirty) return errors
          if (!this.$v.passNova.required) errors.push('Password é um campo obrigatório.')
          else if (!this.validaPassword(this.passNova)) errors.push('De 8 a 20 caracteres. Deverá contêr, pelo menos, uma letra minúscula, uma maiúscula e um número. Não pode conter espaços.')
          return errors
        },
        passAntigaErrors () {
          const errors = []
          if (!this.$v.passAntiga.$dirty) return errors
          !this.$v.passAntiga.required && errors.push('Password é um campo obrigatório.')
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
          if (!this.$v.newNUtente.$dirty) return errors
          if (!this.$v.newNUtente.required) errors.push('Número de utente é um campo obrigatório.')
          else if (!this.$v.newNUtente.between) errors.push('Número de utente inválido.')
          return errors
        },
        nTelemovelErrors() {
          const errors = []
          if (!this.$v.newNTelemovel.$dirty) return errors
          if (!this.$v.newNTelemovel.between && this.newNTelemovel!="") errors.push('Número de telemóvel inválido.')
          return errors
        },
        emailNovoErrors () {
          const errors = []
          if (!this.$v.emailNovo.$dirty) return errors
          if (!this.$v.emailNovo.required) errors.push('Email é um campo obrigatório.')
          else if (!this.$v.emailNovo.email) errors.push('Email inválido.');
          return errors
        },
    },
    data() {
      return {
        //GERAL
        token: localStorage.getItem('jwt'),
        dialog:false,
        loading: false,
        modalErro: false,
        modalSucesso: false,
        id:'',

        //MODAIS
        modalEditarSug:false,
        modalCancelarPedido:false,

        //NOTIFICAÇÕES
        tipo:this.$route.query.tipo,
        ide:this.$route.query.id,
        not:false,

        //DADOS DO PERFIL
        nome:'',
        nUtente:'',
        nTelemovel:'',
        email:'',

        //EDITAR DADOS
        modalEditarDados: false,
        newNome:'',
        newNUtente:'',
        newNTelemovel:'',

        //ALTERAR PASSWORD
        modalAlterarPassword: false,
        passAntiga: '',
        passNova: '',
        passVerificacao: '',
        valuePassAntiga: String,
        valuePassNova: String,
        valuePassConfirmar: String,
        type: "password",
        alertPassword: false, 
        erroPassword: '',

        //INSERIR PASSWORD
        modalInserirPassword: false,
        passInserir: '',
        valuePassInserir: String,
        alertInserirPassword: false, 
        erroInserirPassword: '',

        //ALTERAR EMAIL
        modalAlterarEmail: false,
        emailNovo: '',
        alertEmail: false, 
        erroEmail: '',
        modalSucessoEmail: false,

        //TABS DO HISTORICO
        med:false,
        cons:false,
        sug:false,

        //LISTA HISTORICO
        medicacoes:[],
        contacto:[],
        sugestoes:[],
        
        //EDITAR SUGESTAO
        titulo:'',
        descricao:'', 
        id_desc:'',      
      }
    },
    components: {
      ModalMessage,
      PerfilMedicacao,
      PerfilContacto,
      PerfilSugestao
    },
    watch: {
      'token' : function() {
        this.getDados()
      },
      $route() {
        if (window.location.search!="") {
          this.tipo = this.$route.query.tipo
          this.ide = this.$route.query.id
          this.linkNotificacao()
        }
      }
    },
    created() {
      if (this.token) {
        //BUSCAR OS DADOS AO TOKEN
        this.getDados()

        if (this.$route.query.tipo) {
          this.not = true
          if (this.tipo == 'pedidoContacto') this.cons = true
          else if (this.tipo == 'sugestao') this.sug = true
          else if (this.tipo == 'pedidoMedicacao') this.med = true
          else {
            this.med = true
            this.not = false        
          }
        }
        else this.med = true
        
        //BUSCAR O HISTORICO DE PEDIDOS DE MEDICACAO
        axios.get("http://localhost:3333/medicacao/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
          .then( data => {
            this.medicacoes = data.data
          })
          .catch(err => {
            console.log(err)
          })
        this.medicacoes.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        //BUSCAR O HISTORICO DE PEDIDOS DE CONTACTO
        axios.get("http://localhost:3333/consultas/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
          .then( data => {
            this.contacto = data.data
          })
          .catch(err => {
            console.log(err)
          })
        this.contacto.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })
        //BUSCAR O HISTORICO DE SUGESTOES
        axios.get("http://localhost:3333/sugestao/historico/" + this.id, {headers:{'authorization':'Bearer '+ this.token}})
          .then( data => {
            this.sugestoes = data.data
          })
          .catch(err => {
            console.log(err)
          })
        this.sugestoes.sort((a, b) => {
            return new Date(a.data_criacao) - new Date(b.data_criacao);
          })

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
      
      //MODAL SUCESSO/ERRO
      ok(){
        this.modalSucesso = false
        this.modalErro = false
        this.modalSucessoEmail = false
      },


      //MODAL DO EDITAR PERFIL
      openModalEditarDados(){
        this.$v.$reset()
        this.newNome = this.nome
        this.newNTelemovel = this.nTelemovel
        this.newNUtente = this.nUtente
        this.modalEditarDados=true
      },
      cancelarEditarPerfil(){
        this.modalEditarDados=false
      },
      confirmarEditarPerfil(){
        this.$v.$touch()
        if (this.$v.newNome.required && this.$v.newNUtente.required && this.$v.newNUtente.between && (this.newNTelemovel=="" || this.$v.newNTelemovel.between)) {
          this.loading = true
          var data = {}
          data['nome'] = this.newNome
          data['nr_utente'] = this.newNUtente
          data['nr_telemovel'] = this.newNTelemovel
          axios.put("http://localhost:3333/users/alterar/" + this.id, data,{headers:{'authorization':'Bearer '+ this.token}})
            .then(data => {
              this.token= data.data.token
              localStorage.setItem('jwt',data.data.token)
              this.loading = false
              this.modalEditarDados = false
              this.modalSucesso = true
            })
            .catch(() => {
              this.loading = false
              this.modalEditarDados = false
              this.modalErro = true
            })
        }
      },


      //MODAL DO ALTERAR A PASSWORD
      openModalAlterarPassword(){
        this.$v.$reset()
        this.passAntiga = ''
        this.passNova = ''
        this.passVerificacao = ''
        this.alertPassword = false
        this.modalAlterarPassword=true
      },
      cancelarAlterarPassword(){
        this.modalAlterarPassword=false
      },
      confirmarAlterarPassword(){
        this.$v.$touch()
        if (this.$v.passAntiga.required && this.$v.passVerificacao.required && this.$v.passNova.required && this.$v.passVerificacao.sameAsPassword && this.validaPassword(this.passNova)) {
          this.loading = true
          var data = {}
          data['password_antiga'] = this.passAntiga
          data['password_nova'] = this.passNova
          axios.put("http://localhost:3333/users/alterar/password/" + this.id, data,{headers:{'authorization':'Bearer '+ this.token}})
            .then(() => {
              this.loading = false
              this.modalAlterarPassword = false
              this.modalSucesso = true
            })
            .catch(erro => {
              this.loading = false
              if (erro.response) {
                this.erroPassword = erro.response.data.error
                this.alertPassword = true
              }
              else { 
                this.modalAlterarPassword = false
                this.modalErro = true
              }
            })
        }
      },
      validaPassword(pass) {
        //TUDO MENOS ESPAÇOS. DEVE CONTÊR PELO MENOS 1 MINÚSCULA, 1 MAIÚSCULA E 1 NÚMERO
        var re = /^(?!.* )(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[\d]).{8,20}$/
        return re.test(pass)
      },


      //MODAL DO INSERIR A PASSWORD
      openModalInserirPassword(){
        this.passInserir = ''
        this.alertInserirPassword = false
        this.modalInserirPassword = true
      },
      cancelarInserirPassword(){
        this.modalInserirPassword=false
      },
      confirmarInserirPassword(){
          this.loading = true
          var data = {}
          data['password'] = this.passInserir
          data['email'] = this.email
          axios.post("http://localhost:3333/users/login", data)
              .then(() => {
                  this.loading = false
                  this.modalInserirPassword = false
                  this.openModalAlterarEmail()
              })
              .catch(error => {
                  this.alertInserirPassword = true
                  this.loading = false
                  if (error.response) this.erroInserirPassword = "Password errada!"
                  else this.erroInserirPassword = 'De momento não é possível alterar o email!' + '\n' + 'Por favor tente mais tarde'
              })
      },



      //MODAL DO ALTERAR O EMAIL
      openModalAlterarEmail(){
        this.$v.$reset()
        this.emailNovo = ''
        this.alertEmail = false
        this.modalAlterarEmail=true
      },
      cancelarAlterarEmail(){
        this.modalAlterarEmail=false
      },
      confirmarAlterarEmail(){
        this.$v.$touch()
        if (this.$v.emailNovo.required && this.$v.emailNovo.email) {
          this.loading = true
          var data = {}
          data['email'] = this.emailNovo
          axios.post("http://localhost:3333/verificar/email/" + this.id, data,{headers:{'authorization':'Bearer '+ this.token}})
            .then(() => {
              this.loading = false
              this.modalAlterarEmail = false
              this.modalSucessoEmail = true
            })
            .catch(erro => {
              this.loading = false
              if (erro.response) {
                this.erroEmail = erro.response.data.error
                this.alertEmail = true
              }
              else { 
                this.modalAlterarEmail = false
                this.modalErro = true
              }
            })
        }
      },

      //TABS DO HISTORICO
      changeTab(func) {
        this.tipo = ''
        this.ide = ''
        func()
      },

      //GERAL
      getDados() {
        this.id = jwt.decode(this.token)._id
        this.nome = jwt.decode(this.token).nome
        this.email = jwt.decode(this.token).email
        this.nUtente = jwt.decode(this.token).nr_utente
        this.nTelemovel = jwt.decode(this.token).nr_telemovel
      },
      pedidoM() {
        this.med = true
        this.cons = false
        this.sug = false
      },
      pedidoC() {
        this.med = false
        this.cons = true
        this.sug = false
      },
      sugest() {
        this.med = false
        this.cons = false
        this.sug = true
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
