<template>
  <div class="files">
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="closeSucesso()"
    >
      Documento adicionado com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="closeErro()"
    >
      Não foi possível adicionar documento
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal2"
      @close="closeSucesso2()"
    >
      Categoria adicionada com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError2"
      @close="closeErro2()"
    >
      Não foi possível adicionar categoria
    </modal-message>
    <v-row style="margin: 0px 5px">
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
                            <v-btn class="button-cancelar" text @click="close2()"> Cancelar </v-btn>
                            <v-btn class="button-confirmar" text @click="addCategoria()"> Confirmar </v-btn>
                          </v-card-actions> 
                        </v-card>
                      </v-dialog> 
                    </v-col> 
                  </v-row> <br/>

                  <v-file-input 
                    accept=".pdf, .png, .jpeg, .jpg, .mp4"
                    color=var(--secondary-dark-color) 
                    @input="$v.file.$touch()" 
                    @blur="$v.file.$touch()" 
                    truncate-length="15" 
                    :error-messages="ficheiroErrors" 
                    v-model="file"> </v-file-input> <br/>

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
      <v-col style="max-width:400px">
        <treeselect 
          v-on:input="filtrar"
          v-model="valueFiltro"
          :max-height="200"
          :multiple="true" :options="options" 
          :flatten-search-results="true"
          :normalizer="normalizer"
          placeholder="Filtar por..."/> <br/>
      </v-col>
    </v-row>

    <v-data-table
      style="font-size:16px !important"
      :headers="headers"
      :items="docsfiltrados"
      :items-per-page="5"
      :footer-props="{ 'items-per-page-text':'Documentos por página'}"
      class="elevation-1">
      
      <template #item.titulo="{ value }">
        <router-link style="text-decoration:none; color:var(--secondary-dark-color)" :to="`/documentos/${st(value)}`"> 
          {{value.split("##")[0]}}
        </router-link>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon @click="download(item)"> mdi-download </v-icon>
      </template>
    </v-data-table>
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
    name: "Files",
    components: {
      Treeselect,
      ModalMessage
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
      
        /* FILTRO */
        valueFiltro: null,
        options: null,
        options2: null,

        /* + DOCUMENTO */
        modal: false,
        modalError: false,
        dialog: false,
        titulo: null,
        arvore: null,
        warning_arvore: false,
        file: null,

        /* + CATEGORIA */
        modal2: false,
        modalError2: false,
        dialog2: false,
        arvore_pai: null,
        warning_arvore2: false,
        categoria: null,

        /* TABELA */
        docs: [],
        docsfiltrados: [],
        headers: [
          { text: 'Id', value: '_id', align: ' d-none' }, // ' d-none' hides the column but keeps the search ability
          { text: 'Título', value: 'titulo', align: 'start', sortable: false, },
          { text: 'Data', value: 'data_publicacao' },
          { text: 'Tamanho', value: 'ficheiro.tamanho' },
          { text: 'Formato', value: 'ficheiro.nome_ficheiro' },
          { text: 'Criador', value: 'nome_autor' },
          { text: ' ', value: 'actions', sortable: false }
        ]
      }
    },
    
    computed: {
      tituloErrors () {
        const errors = []
        if (!this.$v.titulo.$dirty) return errors
        !this.$v.titulo.required && errors.push('Título é um campo obrigatório.')
        return errors
      },
      ficheiroErrors () {
        const errors = []
        if (!this.$v.file.$dirty) return errors
        !this.$v.file.required && errors.push('Ficheiro é um campo obrigatório.')
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
        download: function (item) {
          window.open("http://localhost:3333/documentos/download/" + item.titulo.split("##")[1])
        },
        st: function (value) {
          return value.split("##")[1]
        },
        testNivel: function () {
          if(this.token) {
            this.nivel = jwt.decode(this.token).nivel
            if(this.nivel=='Administrador'||this.nivel=='Secretário')
              return true
          }
          return false
        },
        filtrar: function () {
          if(this.valueFiltro.length > 0) { 
            this.docsfiltrados = []
            for(var i = 0; i < this.docs.length; i++) {
              if(this.docs[i].caminho_categorias.includes(this.valueFiltro[0])) {
                this.docsfiltrados.push(this.docs[i])
              }
            }
          }
          else // se tiver vazio, não filtra
            this.docsfiltrados = this.docs
        },
        normalizer(node) { 
          return { children: node.children && node.children.length ? node.children : 0 } 
        },
        addDocumento: function () {
          this.$v.$touch()
          if (!this.$v.arvore.required)
            this.warning_arvore = true
          if (this.$v.titulo.required && this.$v.arvore.required && this.$v.file.required) {

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
              }).then(() => {
                console.log("Ficheiro uploaded com sucesso!")
                this.modal = true;

                // Atualizar documentos
                axios.get("http://localhost:3333/documentos?visibilidade=0")
                  .then(data => {
                    this.docs = data.data
                    this.docs.forEach(item => {              
                      item.titulo = item.titulo + "##" + item._id
                      item.data_publicacao = item.data_publicacao.slice(0,10)
                      item.ficheiro.nome_ficheiro = item.ficheiro.nome_ficheiro.split(".")[1]
                    })
                    this.docsfiltrados = this.docs
                  })
                  .catch(e => {
                    console.log(e)
                  })
                    
              }).catch(e => {
                this.modalError = true;
                console.log(e)
              })
          }
        },
        closeSucesso () { this.modal = false; this.close() },
        closeErro () { this.modalError = false; this.close() },
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
              }).then(() => {
                console.log("Categoria adicionada com sucesso!")
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
              }).catch(e => {
                this.modalError2 = true;
                console.log(e)
              })  
          }
        },
        closeSucesso2 () { this.modal2 = false; this.close2() },
        closeErro2 () { this.modalError2 = false; this.close2() },
        close2() {
          this.$v.categoria.$reset()
          this.$v.arvore_pai.$reset()
          this.arvore_pai = null
          this.categoria = null
          this.warning_arvore2 = false
          this.dialog2 = false
        }
    },
    created() {
      // Obter lista de documentos
      axios.get("http://localhost:3333/documentos?visibilidade=0")
        .then(data => {
          this.docs = data.data
          this.docs.forEach(item => {
            item.titulo = item.titulo + "##" + item._id
            item.data_publicacao = item.data_publicacao.slice(0,10)
            item.ficheiro.nome_ficheiro = item.ficheiro.nome_ficheiro.split(".")[1]
          })
          this.docsfiltrados = this.docs
        })
        .catch(e => {
          console.log(e)
        })
      
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
  font-size:16px !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size:18px !important;
}
</style>