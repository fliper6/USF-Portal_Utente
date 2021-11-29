<template>
  <div>
    <div class="editor-buttons">
      <button @click="editor.commands.undo()">
        <v-icon>mdi-undo</v-icon>
      </button>
      <button @click="editor.commands.redo()">
        <v-icon>mdi-redo</v-icon>
      </button>
      <button class="separator"/>
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'button-active': editor.isActive('bold') }">
        <v-icon>mdi-format-bold</v-icon>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'button-active': editor.isActive('italic') }">
        <v-icon>mdi-format-italic</v-icon>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'button-active': editor.isActive('strike') }">
        <v-icon>mdi-format-strikethrough</v-icon>
      </button>
      <button class="separator"/>
      <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
         <v-icon>mdi-format-align-left</v-icon>
      </button>
      <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
        <v-icon>mdi-format-align-center</v-icon>
      </button>
      <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
        <v-icon>mdi-format-align-right</v-icon>
      </button>
      <button @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
        <v-icon>mdi-format-align-justify</v-icon>
      </button>
      <button class="separator"/>
      <add-link @add-link="newLink"/>
      <add-image @add-image="addImage" />
      <input ref="file" type="file" @change="upFile" hidden>
      <button @click="addFile">
        <v-icon dense>mdi-paperclip</v-icon>
      </button>
    </div>
    <bubble-menu
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
      v-if="editor"
    >
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <v-icon dense color="white">mdi-format-bold</v-icon>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <v-icon dense color="white">mdi-format-italic</v-icon>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <v-icon dense color="white">mdi-format-strikethrough</v-icon>
      <button class="separator"/>
      </button>
      <set-link @set-link="setLink"/>
      <button @click="editor.chain().focus().unsetLink().run()" >
        <v-icon dense color="white" style="margin-left:3px">mdi-link-off</v-icon>
      </button> 
    </bubble-menu>
    <editor-content :editor="editor" />
    <v-btn class="button-cancelar" v-on:click="$router.push('/')" text> Cancelar </v-btn>
    <v-btn class="button-confirmar" v-on:click="submit" text> Enviar </v-btn>
  </div>
</template>

<script>
import {
  Editor,
  EditorContent,
  BubbleMenu,
} from '@tiptap/vue-2'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import AddLink from "./Editor/AddLink.vue"
import SetLink from "./Editor/SetLink.vue"
import AddImage from "./Editor/AddImage.vue"

export default {
  components: {
    EditorContent,
    BubbleMenu,
    AddLink,
    SetLink,
    AddImage
  },
  props: ['conteudo'],
  data() {
    return {
      editor: null,
    }
  },
  methods: {
    submit () {
      this.$emit("submit", this.editor.getHTML())
    },
    newLink (event) {
      console.log(event)
      this.editor.commands.insertContent('<a href="//' + event.link + '">' + event.text + '</a>')
    },
    setLink (event) {
      console.log(event)
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: "//" + event })
        .run()
    },
    addImage (event) {
      if (event) {
        this.editor.chain().focus().setImage({ src: event }).run()
      }
    },
    addFile() {
      let fileInputElement = this.$refs.file;
      fileInputElement.click();
    },
    upFile(event) {
      this.$emit('new-file', event.target.files[0])
    }
  },

  created() {
    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: 'editor',
        }
      },
      content: this.$props.conteudo ? this.$props.conteudo : '<p>Nova notícia 📰</p>',
      extensions: [
        StarterKit,
        Link,
        Image,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        })
      ],
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
<style>
.v-application--wrap {
  min-height: 0 !important;
}

.v-main {
  padding-top: 40px !important;
}

.editor {
  border-right: var(--black) solid 1px;
  border-bottom: var(--black) solid 1px;
  border-left: var(--black) solid 10px;
  border-radius: 0px 0px 3.5px 3.5px;
  margin-bottom: 10px;
  padding: 15px 25px;
  height:55vh;
  max-height:55vh;
  outline: none;
}

.editor img {
  display: block;
  margin: 10px auto;
  max-width: 50vw;
  max-height: 60vh;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.ProseMirror {
  max-height: 55vh;
  overflow-y: scroll;
}

.editor-buttons {
  width:100%;
  display: inline-block;
  border: var(--black) solid 1px;
  border-left: var(--black) solid 10px;
  border-radius: 3.5px 3.5px 0px 0px;
  padding: 13px;
}

.editor-buttons button{
  border-radius: 3px;
  margin: 0 5px;
  padding: 2px
}

.editor-buttons button:hover{
  background-color: #f3f3f3;
}

.button-active {
  background: lightgray;
}

.separator {
  border-right: 2px solid lightgray;
  width:0;
  border-radius: 0;
  margin: 0px 10px;
  height: 10px;
}

.bubble-menu {
  background-color: #333333;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.85;
}

fieldset {
  color:black !important
}

</style>