<template>
    <div class="file" :title="$props.file.name">
      <div class='file-name'>
        {{truncName($props.file.name ? $props.file.name : $props.file.nome_ficheiro)}}
      </div>
    <div 
      class="delete-file"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @click="clickAction"
    >
      <v-icon :color="hover ? 'black' : 'gray'" dense>{{$props.icon}}</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'File',
  props: ['file','icon'],
  data () {
    return {
      hover: false
    }
  },
  methods: {
    clickAction() {
      this.$emit('click-action', this.$props.file)
    },
    truncName(filename) {
      if(filename.length > 11) {
        let file = filename.split('.')
        let name = ''
        let type = file[file.length - 1]
        for(let i = 0; i < file.length - 1; i++) {
          name += file[i]
        }

      
        name = name.substring(0,4)
        name += '...'
        name += " ." + type

        return name
      }
      return filename
    }
  }
}
</script>

<style scoped>

.file {
  display: flex;

  border-radius: 4px;
  background-color: #f5ebeb;
  width: 150px;
  height: 48px;
}

.file-name {
  display: flex;
  align-items: center;

  height: 100%;
  width: calc(70% - 16px);
  margin-left: 16px;

}

.delete-file {
  display: grid;
  place-items: center;

  height: 100%;
  width: 30%;
}

.delete-file:hover {
  cursor:pointer
}


</style>