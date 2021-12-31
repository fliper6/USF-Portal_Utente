<template>
    <div id="confirmarEmail">

        <!-- MODAL DE SUCESSO CONFIRMAR-->
        <modal-message
          title="Sucesso"
          :visible="modalSucessoConfirmar"
          @close="sucesso()"
        >
          O email foi alterado com sucesso!
        </modal-message>

        <!-- MODAL DE SUCESSO CANCELAR-->
        <modal-message
          title="Sucesso"
          :visible="modalSucessoCancelar"
          @close="sucesso()"
        >
          A alteração de email foi cancelada com sucesso!
        </modal-message>

        <!-- MODAL DE ERRO -->
        <modal-message
          title="Erro"
          :visible="modalErro"
          @close="erro()"
        >
          Não é possível alterar o email neste momento! Por favor tente mais tarde
        </modal-message>
        
    </div>
</template>




<script>
import ModalMessage from '../components/ModalMessage.vue'
import axios from 'axios'


    export default {
        name: 'confirmarEmail',
        components: {
            ModalMessage
        },
        data() {
            return {
                //MODAIS
                modalErro: false,
                modalSucessoConfirmar: false,
                modalSucessoCancelar: false,
            }
        }, 
        created() {
            this.correuBem()
        },
        methods: {  
            sucesso() {
                this.modalSucessoConfirmar = false
                this.modalSucessoCancelar = false
                this.$router.push('/')
            },
            erro() {
                this.modalErro = false
                this.$router.push('/')
            },
            correuBem() {
                if (this.$route.params.state=="confirmar" && this.$route.query.codigo) {
                    var data = {}
                    data['codigo'] = this.$route.query.codigo
                    axios.post("http://localhost:3333/verificar/email/confirmar", data)
                        .then(data => { 
                          localStorage.setItem('jwt',data.data.token)
                          this.modalSucessoConfirmar = true
                        })
                        .catch(() => {
                          this.modalErro = true
                        })      
                }
                else if (this.$route.params.state=="cancelar" && this.$route.query.codigo) {
                    var data2 = {}
                    data2['codigo'] = this.$route.query.codigo
                    axios.post("http://localhost:3333/verificar/email/cancelar", data2)
                        .then(() => {
                          localStorage.setItem('jwt',data.data.token)
                          this.modalSucessoCancelar = true
                        })
                        .catch(() => {
                          this.modalErro = true
                        })
                }
                else {
                    this.$route.push('/')
                }
            }
        }
    }
  
</script>



<style scoped>

</style>
