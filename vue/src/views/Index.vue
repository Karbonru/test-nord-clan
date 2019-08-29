<template>
  <v-layout row wrap class="pa-5">
    <v-flex xs12 md4 offset-md4>
      <v-card>
        <v-tabs centered grow v-model="tab">
          <v-tab :key="0">Вход</v-tab>
          <v-tab :key="1">Регистрация</v-tab>
          <v-tab-item :key="0" class="px-3 pt-5">
            <v-form ref="formLogin" v-model="valid" lazy-validation>
              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="E-mail"
                outlined
                autofocus
                validate-on-blur
                required
              ></v-text-field>
              <v-text-field
                v-model="form.pass"
                :rules="passRules"
                label="Пароль"
                type="password"
                validate-on-blur
                outlined
                required
                autocomplete="new-password"
                @keyup.enter.native="login"
              ></v-text-field>
            </v-form>
          </v-tab-item>
          <v-tab-item :key="1" class="px-3 pt-5">
            <v-form ref="formSignUp" v-model="valid" lazy-validation>
              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                label="E-mail"
                outlined
                autofocus
                validate-on-blur
                required
              ></v-text-field>
              <v-text-field
                v-model="form.pass"
                :rules="passRules"
                label="Пароль"
                type="password"
                validate-on-blur
                outlined
                required
                autocomplete="new-password"
                @keyup.enter="signUp()"
              ></v-text-field>
            </v-form>
          </v-tab-item>
        </v-tabs>
        <v-card-actions>
          <div class="errorMess">{{errorMess}}</div>
          <v-spacer></v-spacer>
          <v-btn 
            :disabled="load"
            :loading="load"
            color='primary' 
            @click="tab == 0 ? login() : signUp()">
              <span class="mr-2">{{ tab == 0 ? 'Вход' : 'Регистрация'}}</span>
            <v-icon small>fas fa-sign-in-alt</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Index',
  data: () => ({
    load: false,
    tab: 0,
    form: {
      email: '',
      pass: ''
    },
    valid: true,
    passRules: [
      v => !!v || 'обязательное поле',
      v => (v && v.length > 5) || 'не менее 6 символов',
    ],
    emailRules: [
      v => !!v || 'обязательное поле',
      v => /.+@.+\..+/.test(v) || 'E-mail не правильный',
    ],
    errorMess: ''
  }),
  methods: {
    login () {
      this.errorMess = ''
      if (this.$refs.formLogin.validate()) {
        this.load = true
        this.$store.dispatch('user/LOGIN', this.form)
          .then(() => {
            this.load = false
            this.$router.push('/account')
          })
          .catch(err => {
            this.load = false
            console.error('--->', err);
              console.error('--->2', err);
            if (err.code) {
              switch (err.code) {
                case 'auth/user-not-found':
                  this.errorMess = 'Пользователь не найден'
                  break;
                case 'auth/wrong-password':
                  this.errorMess = 'Неправильный пароль'
                  break;
                default:
                  this.errorMess = ''
                  break;
              }
            }
          })
      }
    },
    signUp () {
      this.errorMess = ''
      if (this.$refs.formSignUp.validate()) {
        this.load = true
        this.$store.dispatch('user/SIGN_UP', this.form)
          .then(() => {
            this.load = false
            this.$router.push('/account')
          })
          .catch(err => {
            this.load = false
            console.error('--->', err);
          })
      }

    },
  }
};
</script>

<style lang="scss" scoped>
.errorMess{
  color: red;
}
</style>