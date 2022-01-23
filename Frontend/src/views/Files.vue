<template>
  <div class="files">
    <modal-message
      title="Erro"
      :visible="modalErroDetail"
      @close="closeErroDetail()"
    >
      {{erro}}
    </modal-message>
    <modal-message
      title="Sucesso"
      :visible="modal"
      @close="closeSucesso()"
    >
      Documento(s) adicionado(s) com sucesso
    </modal-message>
    <modal-message
      title="Erro"
      :visible="modalError"
      @close="closeErro()"
    >
      Não foi possível adicionar documento(s)
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
              + Documento
            </v-btn>
  
          </template>
            <form>
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    <v-row v-if="modo">
                      <v-col>
                        Carregar novo documento <br/> 
                      </v-col> 
                      <v-col>
                        <v-row style="padding: 12px; flex-direction: row; justify-content: flex-end;"> 
                          <div> <v-label style="margin-top: 10px;">ou importar em lote: &nbsp; </v-label> </div>
                          <v-btn v-if="testNivel()==true" style="background-color: var(--white) !important; margin-right: 10px" @click = "modo=false">
                            Importar
                          </v-btn>
                        </v-row>
                      </v-col> 
                    </v-row>
                    <v-row v-else>
                      <v-col>
                        Importar em lote <br/> 
                      </v-col>
                      <v-col>
                        <v-row style="padding: 12px; flex-direction: row; justify-content: flex-end;"> 
                          <div> <v-label style="margin-top: 10px;">ou criar novo documento: &nbsp; </v-label> </div>
                          <v-btn v-if="testNivel()==true" style="background-color: var(--white) !important; margin-right: 10px" @click = "modo=true">
                            Novo
                          </v-btn>
                        </v-row>
                      </v-col>
                    </v-row>
                </v-card-title> <br/>
                <v-col v-if="modo" style="margin: auto; padding: 10px 50px 60px 50px;">

                  <v-text-field color=var(--secondary-dark-color) @input="$v.titulo.$touch()" @blur="$v.titulo.$touch()" :error-messages="tituloErrors" counter="70" maxlength="70" v-model="titulo" label="Título"></v-text-field> <br/>
                  
                  <p style="margin-bottom: 5px; color:#666666">Categoria associada:</p>
                  <v-row style="height: 55px;">
                    <v-col cols="11">
                      <treeselect
                        @input="$v.arvore.$touch()" 
                        @open="warning_arvore = false"
                        :max-height="200"
                        :multiple="false" :options="options" 
                        :flatten-search-results="true"
                        :normalizer="normalizer"
                        v-model="arvore"
                        placeholder="Tags"/> 
                      <span style="color: #ff5252; font-size: 12px;" v-if="this.warning_arvore">Categoria é um campo obrigatório.</span>
                    </v-col>  
                    <br/> <br/>
                    <br/> <br/>
                    <v-col cols="1">
                      <v-dialog v-model="dialog2" width="400">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn style="min-width:25px !important; height:34px !important; background-color:#e0e0e0;" v-bind="attrs" v-on="on">
                            +
                          </v-btn>
                        </template>

                        <v-card>
                          <v-card-title class="text-h5 grey lighten-2"> Adicionar nova categoria</v-card-title> <br/>
                          <v-col style="margin: auto; padding: 20px 50px 40px 50px;">
                            <p style="margin-bottom: 5px; color:#666666">Ramo da categoria</p>
                            <treeselect
                              @input="$v.arvore_pai.$touch()" 
                              @open="warning_arvore2 = false"
                              :max-height="200"
                              :multiple="false" :options="options2" 
                              :flatten-search-results="true"
                              :normalizer="normalizer"
                              v-model="arvore_pai"
                              placeholder="Tags"/> 
                            <span style="color: #ff5252; font-size: 12px;" v-if="this.warning_arvore2">Ramo da categoria é um campo obrigatório.</span>
                            <br/>
                            <v-text-field color=var(--secondary-dark-color) @input="$v.categoria.$touch()" @blur="$v.categoria.$touch()" :error-messages="categoriaErrors" v-model="categoria" counter="35" maxlength="35" label="Nome da categoria"></v-text-field> <br/>
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
                    v-model="file"> </v-file-input> 
                </v-col>

                <v-col v-else style="margin: auto; padding: 10px 50px 20px 50px;">
                  Selecione a pasta que pretende importar. Atenção:
                  <ul style="font-size:14px">
                    <li>Pastas são consideradas categorias e os documentos dentro são colocados nessas respetivas categorias;</li>
                    <li>Todos os documentos devem estar associados a uma categoria. Como tal, ficheiros que estejam na raiz da pasta selecionada serão ignorados;</li>
                    <li>O nome de cada categoria terá, no máximo, 35 caracteres (se o nome da pasta ultrapassar este limite, será cortado);</li>
                    <li>O título de cada documento terá, no máximo, 65 caracteres (se o nome do ficheiro ultrapassar este limite, será cortado).</li>
                  </ul>
                  <v-file-input 
                      color=var(--secondary-dark-color) 
                      @input="$v.files.$touch()" 
                      @blur="$v.files.$touch()" 
                      truncate-length="100" 
                      :error-messages="multErrors" 
                      multiple
                      webkitdirectory
                      v-model="files"> </v-file-input> <br/>
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
        <v-progress-circular
          v-if="importing"
          indeterminate
          color="#800000"
          style="margin-left: 15px"
        ></v-progress-circular>
      </v-col>
      <v-col style="max-width:400px">
        <treeselect 
          v-on:input="filtrar"
          v-model="valueFiltro"
          :max-height="200"
          :multiple="true" :options="options" 
          :flatten-search-results="true"
          :normalizer="normalizer"
          placeholder="Filtrar por..."/> <br/>
      </v-col>
    </v-row>

    <v-data-table
      style="font-size:16px !important"
      :headers="headers"
      :items="docsfiltrados"
      :items-per-page="10"
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
  const host = require('../../../config.json').backend
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
      files: { required }
    },

    data() {
      return {
        token: localStorage.getItem('jwt'),
        nivel: 'utente',

        /* FILTRO */
        valueFiltro: [],
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
        
        /* IMPORTACAO EM LOTE */
        importing: false,
        modalErroDetail: false,
        modo: true, 
        files: null,
        erro: null, 

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
      multErrors () {
        const errors = []
        if (!this.$v.files.$dirty) return errors
        !this.$v.files.required && errors.push('Diretoria dos documentos é um campo obrigatório.')
        return errors
      },
    },

    methods: {
        importar: function(dir) {
          this.importing = true
          let formData = new FormData();
          let paths = []

          dir.forEach(f => {
            paths.push(f.webkitRelativePath)
            formData.append('diretoria', f)
          })
          formData.append('paths', JSON.stringify(paths))

          axios.post(host + "/importar/", formData, 
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
              }
            }).then(categorias => {
              if ("erro" in categorias.data) {this.erro = categorias.data.erro; this.modalErroDetail = true}
              else {
                this.modal = true;

                // atualizar a árvore de categorias
                this.options = categorias.data.categorias[0].children
                this.options2 = categorias.data.categorias
                
                // atualizar a listagem de documentos
                axios.get(host + "/documentos?visibilidade=0")
                  .then(data => {
                    this.docs = data.data
                    this.docs.forEach(item => {              
                      item.titulo = item.titulo + "##" + item._id
                      item.data_publicacao = item.data_publicacao.slice(0,10)
                      item.ficheiro.nome_ficheiro = item.ficheiro.nome_ficheiro.split(".").pop()
                    })
                    this.docsfiltrados = this.docs
                    this.importing = false
                  })
                  .catch(e => {
                    console.log(e)
                  })
              }
            }).catch(e => {
                this.modalError = true;
                this.importing = false
                console.log(e)
            }) 
        },
        closeErroDetail () { this.modalErroDetail = false; },
        download: function (item) {
          window.open(host + "/documentos/download/" + item.titulo.split("##")[1])
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
              if(this.valueFiltro.some(x => this.docs[i].caminho_categorias.includes(x))) {
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
          if(this.modo) {
            this.$v.$touch()
            if (!this.$v.arvore.required)
              this.warning_arvore = true
            if (this.$v.titulo.required && this.$v.arvore.required && this.$v.file.required) {

              let formData = new FormData();
              formData.append('documento', this.file)
              formData.append('titulo', this.titulo)
              formData.append('id_categoria', this.arvore)

              axios.post(host + "/documentos/", 
                formData, 
                {
                  headers: {
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                  }
                }).then(() => {
                  this.modal = true;

                  // Atualizar documentos
                  axios.get(host + "/documentos?visibilidade=0")
                    .then(data => {
                      this.docs = data.data
                      this.docs.forEach(item => {              
                        item.titulo = item.titulo + "##" + item._id
                        item.data_publicacao = item.data_publicacao.slice(0,10)
                        item.ficheiro.nome_ficheiro = item.ficheiro.nome_ficheiro.split(".").pop()
                      })
                      this.filtrar()
                    })
                    .catch(e => {
                      console.log(e)
                    })
                      
                }).catch(e => {
                  this.modalError = true;
                  console.log(e)
                })
            }
          }
          else {
            this.$v.$touch()
            if (this.$v.files.required)
              this.importar(this.files)

          }
        },
        closeSucesso () { this.modal = false; this.close() },
        closeErro () { this.modalError = false; },
        close() {
          this.$v.$reset()
          this.titulo = null
          this.arvore = null
          this.file = null
          this.warning_arvore = false
          this.dialog = false
          this.modo = true
          this.files = null
          this.importing = false
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

            axios.post(host + "/documentos/criar_categoria", 
              obj, 
              {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                }
              }).then(data => {
                if ("erro" in data.data) {this.erro = data.data.erro; this.modalErroDetail = true;}
                else {
                  this.modal2 = true;

                  // Atualizar árvore de categorias
                  this.options = data.data.categorias[0].children
                  this.options2 = data.data.categorias
                }
              }).catch(e => {
                this.modalError2 = true;
                console.log(e)
              })  
          }
        },
        closeSucesso2 () { this.modal2 = false; this.close2() },
        closeErro2 () { this.modalError2 = false; },
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
      axios.get(host + "/documentos?visibilidade=0")
        .then(data => {
          this.docs = data.data
          this.docs.forEach(item => {
            item.titulo = item.titulo + "##" + item._id
            item.data_publicacao = item.data_publicacao.slice(0,10)
            item.ficheiro.nome_ficheiro = item.ficheiro.nome_ficheiro.split(".").pop()
          })
          this.docsfiltrados = this.docs
        })
        .catch(e => {
          console.log(e)
        })
      
      // Obter árvore de categorias
      axios.get(host + "/documentos/categorias")
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
.separate {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: var(--gray);
  margin: 10px 0;
}

.v-data-table > .v-data-table__wrapper > table > thead > tr > th  {
  font-size:16px !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-size:18px !important;
}

.vue-treeselect__multi-value-item{
  color: var(--secondary-dark-color);
  background: #f9e1e1;
}

.vue-treeselect__value-remove {
  color: var(--secondary-dark-color);
}

.vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
  border-color: var(--secondary-dark-color) !important;
  box-shadow: 0 0 0 3px var(--secondary-color);
}

.vue-treeselect__checkbox--checked {
  background: var(--secondary-dark-color) !important ;
  border-color: var(--secondary-dark-color) !important;
}

.vue-treeselect__checkbox--unchecked  {
  border-color: var(--secondary-dark-color) !important;
}

.vue-treeselect__checkbox--unchecked:hover  {
  border-color: var(--secondary-dark-color) !important;
}

.vue-treeselect__checkbox--checked:hover  {
  border-color: var(--secondary-dark-color) !important;
}

.vue-treeselect--single .vue-treeselect__option--selected {
  background: var(--secondary-color);
}

.vue-treeselect--single .vue-treeselect__option--selected:hover {
  background: var(--grey1-color);
}

</style>