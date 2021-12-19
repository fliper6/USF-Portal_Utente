<template>
  <v-menu
    ref="datePicker"
    v-model="datePicker"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        label="Data"
        persistent-hint
        prepend-icon="mdi-calendar"
        v-bind="attrs"
        readonly
        :disabled="$props.disabled"
        v-on="on"
        style="margin: 0 10px;"
        color="#800000"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="proxyDate"
      @change="choseDate"
      v-if="pickingDate"
      no-title
      color="#800000"
    ></v-date-picker>
    <v-time-picker
      v-model="time"
      landscape
      @change="choseTime"
      v-if="pickingTime"
      no-title
      format="ampm"
    ></v-time-picker>
  </v-menu>
</template>  

<script>
  export default {
    name: 'DatePicker',
    props: ['disabled', 'date'],
    model: {
        prop: 'date',
        event: 'input'
    },
    data() {
      return {
        proxyDate: '',
        time: '',
        dateFormatted: '',
        datePicker: false,

        pickingDate: true,
        pickingTime: false,
      }
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate()
      },
    },

    watch: {
      proxyDate () {
        this.dateFormatted = this.formatDate()
      },
      time () {
        this.dateFormatted = this.formatDate()
      }
    },
    created () {
      const auxData = new Date(this.$props.date)
      const year = auxData.getFullYear();
      const month = auxData.getMonth();
      const day = auxData.getDate();
      const hour = auxData.getHours();
      const minute = auxData.getMinutes();

      this.proxyDate = this.$props.date
      this.time = `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`
      this.dateFormatted = `${day}/${month}/${year} ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`
    },
    methods: {
      formatDate () {
        const [hours, minutes] = this.time.split(':')
        let date = new Date(this.proxyDate)
        date.setHours(hours)
        date.setMinutes(minutes)
        console.log(date.toISOString().substring(0, 19))
        this.$emit("input", date.toISOString().substring(0, 19))
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        return `${day}/${month}/${year} ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`
      },
      choseDate () {
        this.pickingDate = false
        this.pickingTime = true
      },
      choseTime () {
        this.datePicker = false
        this.pickingDate = true
        this.pickingTime = false
      }
    },
  }
</script>