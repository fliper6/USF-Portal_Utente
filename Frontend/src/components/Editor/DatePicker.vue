<template>
  <v-menu
    ref="datePicker"
    v-model="datePicker"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
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
      no-title
      color="#800000"
    ></v-date-picker>
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
        proxyDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 19),
        dateFormatted: this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10)),
        datePicker: false,
      }
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.proxyDate)
      },
    },

    watch: {
      proxyDate () {
        this.datePicker = false
        this.dateFormatted = this.formatDate(this.proxyDate)
        let date = new Date(this.proxyDate)
        date.setTime(date.getTime() + (12*60*60*1000))
        this.$emit("input", date.toISOString().substring(0, 19))
      },
    },

    methods: {
      formatDate (date) {
        if (!date) return null
        console.log(date)
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      choseDate () {
        this.datePicker = false
      }
    },
  }
</script>