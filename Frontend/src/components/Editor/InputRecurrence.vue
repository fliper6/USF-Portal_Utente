<template>
  <div class="container">
    <v-text-field
      v-model="number" 
      class="input"
      hide-details
      reverse
      type="number"
      :disabled="$props.disabled"
      @change="handleChange"
      color="#800000"
    />  
    <v-select
      v-model="timeframe"
      :items="timeframes"
      class="select"
      :disabled="$props.disabled"
      @change="handleChange"
      color="#800000"
    />
  </div>
</template>

<script>
export default {
  name: 'InputRecurrence',
  props: ['timeArray','disabled'],
    model: {
        prop: 'timeArray',
        event: 'change'
    },
  data () {
    return {
      number: 0,
      timeframe: '',
      timeframes: ["Anos", "Meses", "Dias", "Horas", "Minutos", "Segundos"]
    }
  },
  created () {
    for (let i = 0; i < 6; i++) {
      if(this.$props.timeArray[i] != 0){
        this.timeframe = this.timeframes[i]
        this.number =  this.$props.timeArray[i]
      }
    }
  },
  watch: {
    timeArray () {
      for (let i = 0; i < 6; i++) {
        if(this.$props.timeArray[i] != 0){
          this.timeframe = this.timeframes[i]
          this.number =  this.$props.timeArray[i]
        }
      }
    }
  },
  methods: {
    handleChange() {
      let array = [0, 0, 0, 0, 0, 0]
      array[this.timeframes.indexOf(this.timeframe)] = this.number;
      this.$emit('change', array)
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
  }
  .input {
    width: 30px !important;
    margin-right: 10px;
  }
  .select {
    width: 100px !important;
    margin-left: 10px;
  }
</style>