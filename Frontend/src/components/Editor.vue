<template>
  <div>
    <div class="editor-buttons">
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <v-icon large>mdi-format-bold</v-icon>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <v-icon large>mdi-format-italic</v-icon>
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <v-icon large>mdi-format-strikethrough</v-icon>
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
  BubbleMenu
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

  mounted() {
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
  padding: 13px;
  height:70vh;

  outline: none;
}

.editor-buttons {
  border: var(--black) solid 1px;
  border-left: var(--black) solid 10px;
  border-radius: 3.5px 3.5px 0px 0px;
  padding: 13px;
}

.editor-buttons button{
  margin: 0 5px
}

.bubble-menu {
  background-color: #333333;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.7;
}

</style>