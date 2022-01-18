<template>
  <div class="gestaocats">
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="closeSucesso()"
    >
      Categoria adicionada com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="closeErro()"
    >
      Não foi possível adicionar categoria
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal2"
      @close="closeSucesso2()"
    >
      Categoria eliminada com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError2"
      @close="closeErro2()"
    >
      Não foi possível eliminar categoria
    </modal-message>
    <v-card flat color="var(--grey1-color)" style="font-size:120%; min-height:700px">
        <div style="margin-left: 40px">
          <v-container>
              <h1 style="color:var(--primary-color)">Categorias</h1>
              <v-row justify="center"> </v-row>
          </v-container>
          <v-container>
              <v-divider/>
          </v-container>
          <v-container>
              <v-dialog v-model="dialog" width="400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="button-secundário" style="margin-right: 10px" @click = "close()" v-bind="attrs" v-on="on">
                    Adicionar
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title class="text-h5 grey lighten-2">Adicionar nova categoria</v-card-title> <br/>
                  <v-col style="margin: auto; padding: 0px 50px;">
                    <p style="margin-bottom: 5px; color:#666666">Ramo da categoria</p>
                    <treeselect
                        @input="$v.arvore_pai.$touch()" 
                        @open="warning_arvore = false"
                        :max-height="150"
                        :multiple="false" :options="options2" 
                        :flatten-search-results="true"
                        :normalizer="normalizer"
                        v-model="arvore_pai"
                        placeholder="Tags"/> 
                    <span style="color: #ff5252; font-size: 12px;" v-if="this.warning_arvore">Ramo da categoria é um campo obrigatório.</span>
                    <br/>
                    <v-text-field color=var(--secondary-dark-color) @input="$v.categoria.$touch()" @blur="$v.categoria.$touch()" :error-messages="categoriaErrors" v-model="categoria" :counter="50" label="Nome da categoria"></v-text-field> <br/>
                  </v-col>
                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="button-cancelar" text @click="close()"> Cancelar </v-btn>
                    <v-btn class="button-confirmar" text @click="addCategoria()"> Confirmar </v-btn>
                  </v-card-actions> 
                </v-card>
              </v-dialog> 

              <v-dialog v-model="dialog2" width="400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="button-secundário" @click = "close2()" v-bind="attrs" v-on="on">
                    Apagar
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title class="text-h5 grey lighten-2"> Eliminar categoria</v-card-title> <br/> 
                  <v-col style="margin: auto; padding: 0px 50px;">
                  <br/>
                  <treeselect
                      @input="$v.arvore.$touch()" 
                      @open="warning_arvore2 = false"
                      :max-height="100"
                      :multiple="false" :options="options" 
                      :flatten-search-results="true"
                      :normalizer="normalizer"
                      v-model="arvore"
                      placeholder="Tags"/> 
                  <span style="color: #ff5252; font-size: 12px;" v-if="this.warning_arvore2">Categoria é um campo obrigatório.</span>
                  </v-col>
                  <br/><br/>
                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="button-cancelar" text @click="close2()"> Cancelar </v-btn>
                    <v-btn class="button-confirmar" text @click="deleteCategoria()"> Confirmar </v-btn>
                  </v-card-actions> 
                </v-card>
              </v-dialog> 
          </v-container>
        </div>
        <br/>

        <v-col style="margin: auto; padding: 0px 50px;">
          <treeselect
              @input="$v.arvore.$touch()" 
              :max-height="400"
              :multiple="false" :options="options"
              :always-open="true"
              :searchable="false"
              :clearable="false"
              :normalizer="normalizer"
              placeholder="Categorias"/> 
        </v-col>
    </v-card>
  </div>
</template>
 
<script>
  import Treeselect from '@riophae/vue-treeselect' //npm install --save @riophae/vue-treeselect
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import ModalMessage from '../components/ModalMessage.vue'; 
  import axios from 'axios'
  import jwt from 'jsonwebtoken'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    name: "GestaoCategorias",
    components: {
      Treeselect,
      ModalMessage
    },

    validations: {
      categoria: { required },
      arvore_pai: { required },
      arvore: { required },
    },

    data() {
      return {
        token: localStorage.getItem('jwt'),
        nivel: 'utente',

        /* FILTRO */
        valueFiltro: null,
        options: null,
        options2: null,

        /* + CATEGORIA */
        modal: false,
        modalError: false,
        dialog: false,
        arvore_pai: null,
        warning_arvore: false,
        categoria: null,

        /* - CATEGORIA */
        modal2: false,
        modalError2: false,
        dialog2: false,
        arvore: null,
        warning_arvore2: false,
      }
    },
    
    computed: {
      categoriaErrors () {
        const errors = []
        if (!this.$v.categoria.$dirty) return errors
        !this.$v.categoria.required && errors.push('Categoria é um campo obrigatório.')
        return errors
      }
    },

    methods: {
        normalizer (node) { 
          return { children: node.children && node.children.length ? node.children : 0 } 
        },
        testNivel: function () {
          if(this.token) {
            this.nivel = jwt.decode(this.token).nivel
            if(this.nivel=='Administrador'||this.nivel=='Secretário')
              return true
          }
          return false
        },
        addCategoria: function () {
          this.$v.arvore_pai.$touch()
          this.$v.categoria.$touch()
          if (!this.$v.arvore_pai.required)
            this.warning_arvore = true
          if (this.$v.categoria.required && this.$v.arvore_pai.required) {

            var obj = {
              'nova_categoria': this.categoria,
              'id_pai': this.arvore_pai
            }

            axios.post("http://localhost:3333/documentos/criar_categoria", 
              obj, 
              {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
              }).then(data => {
                if ("erro" in data.data) alert(data.data.erro)
                else {
                  this.modal = true;
                  // Atualizar árvore de categorias
                  this.options = data.data.categorias[0].children
                  this.options2 = data.data.categorias
                }
              }).catch(e => {
                this.modalError = true;
                console.log(e)
              })  
          }
        },
        closeSucesso () { this.modal = false; this.close() },
        closeErro () { this.modalError = false; this.close() },
        close() {
          this.$v.categoria.$reset()
          this.$v.arvore_pai.$reset()
          this.arvore_pai = null
          this.categoria = null
          this.warning_arvore = false
          this.dialog = false
        },
        deleteCategoria: function () {
          this.$v.arvore.$touch()
          if (!this.$v.arvore.required)
            this.warning_arvore2 = true
          if (this.$v.arvore.required) {

            axios.put("http://localhost:3333/documentos/categoria/" + this.arvore, 
              {
                headers: 
                  {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                  }
              }).then(data => {
                if ("erro" in data.data) alert(data.data.erro)
                else {
                  this.modal2 = true;

                  // Atualizar árvore de categorias
                  axios.get("http://localhost:3333/documentos/categorias")
                    .then(data => {
                      this.options = data.data.categorias[0].children
                      this.options2 = data.data.categorias
                    })
                    .catch(e => {
                      console.log(e)
                    })
                }
              }).catch(e => {
                this.modalError2 = true;
                console.log(e)
              })  
          }
        },  
        closeSucesso2 () { this.modal2 = false; this.close2() },
        closeErro2 () { this.modalError2 = false; this.close2() },
        close2() {
          this.$v.arvore.$reset()
          this.arvore = null
          this.warning_arvore2 = false
          this.dialog2 = false
        },
    },
    created() {
      // Obter árvore de categorias
      axios.get("http://localhost:3333/documentos/categorias")
        .then(data => {
          this.options = data.data.categorias[0].children
          this.options2 = data.data.categorias
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
</script>

<style>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th  {
  font-size:14px !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size:16px !important;
}

.vue-treeselect{
  z-index:1;
  /*position: absolute;*/
}
</style>
