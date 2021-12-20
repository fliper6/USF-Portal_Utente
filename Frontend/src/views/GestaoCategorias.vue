<template>
  <div class="gestaocats">
    <v-card flat color="var(--grey1-color)" style="font-size:120%;">
        <v-container>
            <h1 style="color:var(--primary-color)">Categorias</h1>
            <v-row justify="center">
            </v-row>
        </v-container>
        <v-container>
            <v-divider/>
        </v-container>
        <div style="margin-left:20px;">
            <v-dialog v-model="dialog" width="400">
            <template v-slot:activator="{ on, attrs }">
                <v-btn style="margin-right:10px; min-width:25px !important; height:34px !important; background-color:#e0e0e0;" v-bind="attrs" v-on="on">
                Adicionar
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
                    :multiple="false" :options="options2" 
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
                <v-btn class="button-cancelar" text @click="close()"> Cancelar </v-btn>
                <v-btn class="button-confirmar" text @click="addCategoria()"> Confirmar </v-btn>
                </v-card-actions> 
            </v-card>
            </v-dialog> 

            <v-dialog v-model="dialog2" width="400">
            <template v-slot:activator="{ on, attrs }">
                <v-btn style="min-width:25px !important; height:34px !important; background-color:#e0e0e0;" v-bind="attrs" v-on="on">
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
                    :error-messages="arvoreErrors"
                    :max-height="100"
                    :multiple="false" :options="options" 
                    :flatten-search-results="true"
                    :normalizer="normalizer"
                    v-model="arvore"
                    placeholder="Tags"/> 
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
        </div>
        <br/>
    </v-card>
  </div>
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
    name: "GestaoCategorias",
    components: {
      Treeselect
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
        dialog: false,
        arvore_pai: null,
        warning_arvore: false,
        categoria: null,

        /* - CATEGORIA */
        dialog2: false,
        arvore: null,
        warning_arvore2: false,
      }
    },
    
    computed: {
      arvorepaiErrors () {
        const errors = []
        if (!this.$v.arvore_pai.$dirty) return errors
        !this.$v.arvore_pai.required && errors.push('Ramo da categoria é um campo obrigatório.')
        return errors
      },
      arvoreErrors () {
        const errors = []
        if (!this.$v.arvore.$dirty) return errors
        !this.$v.arvore.required && errors.push('Categoria é um campo obrigatório.')
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
        normalizer(node) { 
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

                  // Atualizar árvore de categorias
                  axios.get("http://localhost:3333/documentos/categorias")
                    .then(data => {
                      this.options = data.data.categorias[0].children
                      this.options2 = data.data.categorias
                    })
                    .catch(() => {
                        console.log("Ocorreu um erro ao obter a árvore de categorias.")
                    })
              }).catch(() => {
                console.log("Ocorreu um erro ao adicionar a categoria.")
              })  
          }
        },
        close() {
          this.$v.categoria.$reset()
          this.$v.arvore_pai.$reset()
          this.arvore_pai = null
          this.categoria = null
          this.warning_arvore = false
          this.dialog = false
        },
        deleteCategoria: function () {
         
        },
        close2() {
          this.$v.categoria.$reset()
          this.categoria = null
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
        .catch(() => {
            console.log("Ocorreu um erro ao obter a árvore de categorias.")
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
</style>