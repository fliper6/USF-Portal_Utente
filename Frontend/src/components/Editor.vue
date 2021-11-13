<template>
  <div>
    <bubble-menu
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
      v-if="editor"
    >
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        Italic
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        Strike
      </button>
    </bubble-menu>
    <editor-content class="editor" :editor="editor" />
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
  border: var(--primary-color) solid 1px;
  border-radius: 5px;
  margin-bottom: 10px;
  padding-bottom: 0px;
}
</style>