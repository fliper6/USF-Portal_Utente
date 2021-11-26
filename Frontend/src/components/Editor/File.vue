<template>
    <div class="file" :title="$props.file.name">
      <div class='file-name'>
        {{truncName($props.file.name)}}
      </div>
    <div 
      class="delete-file"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @click="deleteMe"
    >
      <v-icon :color="hover ? 'black' : 'gray'" dense>mdi-close</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Link',
  props: ['file'],
  data () {
    return {
      hover: false
    }
  },
  methods: {
    deleteMe() {
      this.$emit('delete-me', this.$props.file)
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