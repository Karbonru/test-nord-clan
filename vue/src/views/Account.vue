<template>
  <v-layout row wrap class="pa-5">
    <v-flex xs12 class="mb-3">
      <v-card>
        <v-card-title class="pa-3">
          <v-btn 
            class="ma-0 ml-1"
            outlined 
            color="primary" 
            @click="newPayWindow = !newPayWindow">{{ !newPayWindow ? 'Новый платеж' : 'Отмена' }}</v-btn>
        </v-card-title>
        <v-slide-y-transition>
          <v-card-text v-if="newPayWindow">
            <v-form ref="formPay" v-model="valid" lazy-validation class="pa-3">
              <v-layout row wrap>
                <v-flex xs12 md4>
                  <v-text-field
                    v-model="form.title"
                    :rules="titleRules"
                    label="Название"
                    outlined
                    autofocus
                    validate-on-blur
                    required
                  ></v-text-field>
                  <v-menu
                    ref="menu"
                    v-model="datePicker"
                    :close-on-content-click="false"
                    :return-value.sync="form.date"
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="form.date"
                        label="Дата"
                        readonly
                        v-on="on"
                        outlined
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.date"
                      no-title
                      scrollable
                    >
                      <div class="flex-grow-1"></div>
                      <v-btn text color="primary" @click="menu = false">Отмена</v-btn>
                      <v-btn text color="primary" @click="$refs.menu.save(form.date)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                  <v-select
                    v-model="form.status"
                    :items="statuses"
                    label="Статус"
                    outlined
                    validate-on-blur
                    required
                    :rules="statusRules"
                  ></v-select>
                  <v-text-field
                    v-model="form.summ"
                    :rules="summRules"
                    label="Сумма"
                    v-mask="summMask"
                    outlined
                    validate-on-blur
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md4 pl-3>
                  <v-textarea
                    v-model="form.comment"
                    label="Комментарий"
                    outlined
                    rows="16"
                  ></v-textarea>

                </v-flex>
                <v-flex xs12 md4 pl-3>
                  <v-textarea
                    v-model="form.beneficiary"
                    label="Реквизиты получателя"
                    :rules="beneficiaryRules"
                    required
                    outlined
                    rows="16"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-btn 
                    :disabled="load"
                    :loading="load"
                    color="primary" 
                    @click="pay()">Отправить</v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <h1 class="headline THIN">Платежи</h1>
          <div class="flex-grow-1"></div>
          <v-text-field
            v-model="search"
            append-icon="fas fa-search"
            label="поиск"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="dataPay"
          :search="search"
          :loading="PAYMENTS ? false : true"
        >
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td><router-link :to="`/payment/${item.id}`">{{ item.title }}</router-link></td>
              <td>{{ item.comment }}</td>
              <td>{{ item.date }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.summ }}</td>
              <td>{{ item.beneficiary }}</td>
            </tr>
          </tbody>
        </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mask } from 'vue-the-mask'
import { mapGetters } from 'vuex'
export default {
  name: 'Account',
  directives: { mask },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Название', align: 'left', value: 'title' },
        { text: 'Коментарий', value: 'comment' },
        { text: 'Дата платежа', value: 'date' },
        { text: 'Статус', value: 'status' },
        { text: 'Сумма', value: 'summ' },
        { text: 'Реквизиты получателя', value: 'beneficiary', sortable: false }
      ],
      load: false,
      newPayWindow: false,
      datePicker: false,
      valid: true,
      formDefault: {
        title: '',
        comment: '',
        date: new Date().toISOString().substr(0, 10),
        status: '',
        summ: '',
        beneficiary: '',
      },
      form: {
        title: '',
        comment: '',
        date: new Date().toISOString().substr(0, 10),
        status: '',
        summ: '',
        beneficiary: '',
      },
      statuses: ['Новый', 'В обработке', 'Завершен'],
      titleRules: [
        v => !!v || 'обязательное поле',
        v => (v && v.length > 1) || 'укажите название'
      ],
      statusRules: [
        v => !!v || 'укажите статус',
      ],
      summRules: [
        v => !!v || 'укажите статус',
        v => (v && +v <= this.BALANCE) || `не более ${this.BALANCE}`,
        v => (v && +v > 0) || `не менее 0`
      ],
      beneficiaryRules: [
        v => !!v || 'укажите реквизиты получателя',
      ],
      summMask: '############'
    }
  },
  computed: {
    ...mapGetters('account', ['PAYMENTS']),
    ...mapGetters('account', ['BALANCE']),
    dataPay () {
      let arr = []
      let obj = Object.assign({}, this.PAYMENTS)
      for (let id in obj) {
        obj[id].id = id
        arr.push(obj[id])
      }
      return arr
    }
  },
  methods: {
    async pay () {
      if (this.$refs.formPay.validate()) {
        this.load = true
        const payItem = await this.$store.dispatch('account/PAY', this.form)
        this.load = false
        if (payItem) {
          this.newPayWindow = false
          this.form = Object.assign({}, this.formDefault)
        } 
      }
    }
  }
}
</script>