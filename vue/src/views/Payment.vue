<template>
  <v-layout row wrap class="pa-5">
    <v-flex xs12>
      <v-card>
        <v-card-title class="pa-3">
          <div class="card_title">
            <v-btn icon text class="mr-5" color="primary" @click="$router.go(-1)">
              <v-icon small>fas fa-arrow-left</v-icon>
            </v-btn>
            <h1 class="title">Платеж - {{pay.title}}</h1>
          </div>
          <v-list-item two-line v-for="(item,i) in pay.arr" :key="i">
            <v-list-item-content>
              <v-list-item-subtitle>{{item.name}}</v-list-item-subtitle>
              <v-list-item-title>{{item.val}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Payment',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: ''
    }
  },
  computed: {
    pay () {
      const data = this.$store.getters['account/PAY_ITEM'](this.id)
      let pay = {
        title: '',
        arr: []
      }
      for (let row in data) {
        let obj = {}
        switch (row) {
          case 'title':
            pay.title = data[row]
            break;
          case 'date':
            obj['name'] = 'Дата'
            obj['val'] = data[row]
            pay.arr.push(obj)
            break;
          case 'status':
            obj['name'] = 'Статус'
            obj['val'] = data[row]
            pay.arr.push(obj)
            break;
          case 'summ':
            obj['name'] = 'Сумма'
            obj['val'] = data[row]
            pay.arr.push(obj)
            break;
          case 'comment':
            obj['name'] = 'Комментарий'
            obj['val'] = data[row]
            pay.arr.push(obj)
            break;
          case 'beneficiary':
            obj['name'] = 'Реквизиты получателя'
            obj['val'] = data[row]
            pay.arr.push(obj)
            break;
          default:
            break;
        }
      }
      return pay
    }
  }
}
</script>

<style lang="scss" scoped>
.card_title{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
</style>