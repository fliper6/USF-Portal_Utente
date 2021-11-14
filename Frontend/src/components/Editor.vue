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
        <v-icon>mdi-link-plus</v-icon>
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
      </button>
    </bubble-menu>
    <editor-content :editor="editor" />
    <button class="see" v-on:click="printHTML">See HTML</button>
  </div>
</template>

<script>
import {
  Editor,
  EditorContent,
  BubbleMenu,
} from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'

export default {
  components: {
    EditorContent,
    BubbleMenu
  },

  data() {
    return {
      editor: null,
    }
  },

  methods: {
    printHTML () {
      console.log(this.editor.getHTML())
    }
  },

  created() {
    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: 'editor',
        }
      },
      content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit,
      ],
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
<style>
.see {
  background: var(--primary-color);
  border-radius: 5px;
  padding: 5px;
  color:white
}

.editor {
  border-right: var(--black) solid 1px;
  border-bottom: var(--black) solid 1px;
  border-left: var(--black) solid 10px;
  border-radius: 0px 0px 3.5px 3.5px;
  margin-bottom: 10px;
  padding: 15px 25px;
  height:65vh;
  max-height:65vh;

  outline: none;
}

.ProseMirror {
  max-height: 65vh;
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

.editor-buttons i{
  margin: 0 5px;
  padding: 2px
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
  opacity: 0.7;
}



</style>