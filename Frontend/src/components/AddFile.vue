<template>
    <v-col>
        <v-dialog v-model="dialog" width="750" style="overflow-x: hidden;">
            <template v-slot:activator="{ on, attrs }">
            <v-btn v-if="testNivel()==true" class="button-principal" @click = "close()" v-bind="attrs" v-on="on">
                + Novo Documento
            </v-btn>
            </template>
            <form>
                <v-card>
                <v-card-title class="text-h5 grey lighten-2"> Carregar novo documento </v-card-title> <br/>
                <v-col style="margin: auto; padding: 0px 50px;">

                    <v-text-field color=var(--secondary-dark-color) @input="$v.titulo.$touch()" @blur="$v.titulo.$touch()" :error-messages="tituloErrors" v-model="titulo" label="Título"></v-text-field> <br/>
                    
                    <p style="margin-bottom: 5px; color:#666666">Categoria associada:</p>
                    <v-row style="height: 55px;">
                    <v-col cols="11">
                        <treeselect
                        @input="$v.arvore.$touch()" 
                        @open="warning_arvore = false"
                        :error-messages="arvoreErrors"
                        :max-height="100"
                        :multiple="false" :options="options" 
                        :flatten-search-results="true"
                        :normalizer="normalizer"
                        v-model="arvore"
                        placeholder="Tags"/> 
                        <span style="color: #ff5252; font-size: 12px;" v-if="this.warning_arvore">Categoria é um campo obrigatório.</span>
                    </v-col>  
                    <br/>
                    <v-col cols="1">
                        <v-dialog v-model="dialog2" width="400">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn style="min-width:25px !important; height:34px !important; background-color:#e0e0e0;" v-bind="attrs" v-on="on">
                            +
                            </v-btn>
                        </template>

                        <v-card>
                            <v-card-title class="text-h5 grey lighten-2"> Adicionar nova categoria</v-card-title> <br/>
                            <v-col style="margin: auto; padding: 0px 50px;">
                            <p style="margin-bottom: 5px; color:#666666">Ramo da categoria</p>
                            <treeselect
                                @input="$v.arvore_pai.$touch()" 
                                @open="warning_arvore2 = false"
                                :error-messages="arvorepaiErrors"
                                :max-height="100"
                                :multiple="false" :options="options" 
                                :flatten-search-results="true"
                                :normalizer="normalizer"
                                v-model="arvore_pai"
                                placeholder="Tags"/> 
                            <span style="color: #ff5252; font-size: 12px;" v-if="this.warning_arvore2">Ramo da categoria é um campo obrigatório.</span>
                            <br/>
                            <v-text-field color=var(--secondary-dark-color) @input="$v.categoria.$touch()" @blur="$v.categoria.$touch()" :error-messages="categoriaErrors" v-model="categoria" :counter="50" label="Nome da categoria"></v-text-field> <br/>
                            </v-col>
                            <v-divider></v-divider>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="button-cancelar" text @click="close2()"> Cancelar </v-btn>
                            <v-btn class="button-confirmar" text @click="addCategoria()"> Confirmar </v-btn>
                            </v-card-actions> 
                        </v-card>
                        </v-dialog> 
                    </v-col> 
                    </v-row> <br/>

                    <v-file-input color=var(--secondary-dark-color) @input="$v.file.$touch()" @blur="$v.file.$touch()" truncate-length="15" :error-messages="ficheiroErrors" v-model="file"></v-file-input> <br/>

                </v-col>
                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="button-cancelar" text @click="close()"> Cancelar </v-btn>
                    <v-btn class="button-confirmar" text @click="addDocumento()"> Confirmar </v-btn>
                </v-card-actions> 
                </v-card>
            </form>
        </v-dialog> 
    </v-col>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect' //npm install --save @riophae/vue-treeselect
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import axios from 'axios'
  import jwt from 'jsonwebtoken'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    name: "AddFile",
    components: {
      Treeselect
    },

    validations: {
      titulo: { required },
      arvore: { required },
      file: { required },
      categoria: { required },
      arvore_pai: { required },
    },

    data() {
      return {
        token: localStorage.getItem('jwt'),
        nivel: 'utente',

        options: null,

        /* + DOCUMENTO */
        dialog: false,
        titulo: null,
        arvore: null,
        warning_arvore: false,
        file: null,

        /* + CATEGORIA */
        dialog2: false,
        arvore_pai: null,
        warning_arvore2: false,
        categoria: null,
      }
    },
    
    computed: {
      tituloErrors () {
        const errors = []
        if (!this.$v.titulo.$dirty) return errors
        !this.$v.titulo.required && errors.push('Título é um campo obrigatório.')
        return errors
      },
      arvoreErrors () {
        const errors = []
        if (!this.$v.arvore.$dirty) return errors
        !this.$v.arvore.required && errors.push('Categoria é um campo obrigatório.')
        return errors
      },
      ficheiroErrors () {
        const errors = []
        if (!this.$v.file.$dirty) return errors
        !this.$v.file.required && errors.push('Ficheiro é um campo obrigatório.')
        return errors
      },
      arvorepaiErrors () {
        const errors = []
        if (!this.$v.arvore_pai.$dirty) return errors
        !this.$v.arvore_pai.required && errors.push('Ramo da categoria é um campo obrigatório.')
        return errors
      },
      categoriaErrors () {
        const errors = []
        if (!this.$v.categoria.$dirty) return errors
        !this.$v.categoria.required && errors.push('Categoria é um campo obrigatório.')
        return errors
      },
    },

    methods: {
        testNivel: function () {
          if(this.token) {
            this.nivel = jwt.decode(this.token).nivel
            if(this.nivel=='admin'||this.nivel=='medico')
              return true
          }
          return false
        },
        normalizer(node) { 
          return { children: node.children && node.children.length ? node.children : 0 } 
        },
        addDocumento: function () {
         this.$emit('atualizardocs')
          this.$v.$touch()
          if (!this.$v.arvore.required)
            this.warning_arvore = true
          if (this.$v.titulo.required && this.$v.arvore.required && this.$v.file.required) {
            
            this.dialog = false;
            

            console.log(jwt.decode(this.token))
            
            let formData = new FormData();
            formData.append('documento', this.file)
            formData.append('titulo', this.titulo)
            formData.append('id_categoria', this.arvore)

            axios.post("http://localhost:3333/documentos/", 
              formData, 
              {
                  headers: {
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                  }
              }
              ).then(() => {
                console.log("Ficheiro uploaded com sucesso!")
                    
              }).catch(() => {
                console.log("Ocorreu um erro ao obter ao dar upload ao documento.")
              })  
          }
        },
        close() {
          this.$v.$reset()
          this.titulo = null
          this.arvore = null
          this.file = null
          this.warning_arvore = false
          this.dialog = false
        },
        addCategoria: function () {
          this.$v.arvore_pai.$touch()
          this.$v.categoria.$touch()
          if (!this.$v.arvore_pai.required)
            this.warning_arvore2 = true
          if (this.$v.categoria.required && this.$v.arvore_pai.required) {
            this.dialog2 = false;
            
            var obj = {
              'nova_categoria': this.categoria,
              'id_pai': this.arvore_pai
            }

            axios.post("http://localhost:3333/documentos/criar_categoria", obj, {
              headers: {'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
              }).then(() => {
                console.log("Categoria adicionada com sucesso!")

                  /* Atualizar árvore de categorias
                  axios.get("http://localhost:3333/documentos/categorias")
                    .then(data => {
                      this.options = data.data.categorias
                    })
                    .catch(() => {
                        console.log("Ocorreu um erro ao obter a árvore de categorias.")
                    })*/
              }).catch(() => {
                console.log("Ocorreu um erro ao adicionar a categoria.")
              })  
          }
        },
        close2() {
          this.$v.categoria.$reset()
          this.$v.arvore_pai.$reset()
          this.arvore_pai = null
          this.categoria = null
          this.warning_arvore2 = false
          this.dialog2 = false
        },
        mudarVisibilidade: function () {
        },
        download: function () {
        },
    },
    created() {
    // Obter árvore de categorias
      axios.get("http://localhost:3333/documentos/categorias")
        .then(data => {
          this.options = data.data.categorias
        })
        .catch(() => {
            console.log("Ocorreu um erro ao obter a árvore de categorias.")
        })

    }
  }
</script>

