<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Test</span>
        <span class="font-weight-light ml-2">NodrClan</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="USER">
        <span v-if="BALANCE !== null">Баланс {{ BALANCE }} руб.</span>
        <span v-else>
          Баланс 
          <v-progress-circular
            :size="20"
            :width="2"
            color="primary"
            indeterminate
          ></v-progress-circular>
           руб.
        </span>
        <v-btn 
          outlined
          class="ml-2"
          color='primary' 
          @click="logout()">
            <span class="mr-2">Выход</span>
          <v-icon small>fas fa-sign-out-alt</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-content>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  mounted () {
    this.$store.dispatch('user/USER_CHECK')
  },
  watch: {
    'USER' () {
      if (this.USER) {
        this.$store.dispatch('account/INIT')
      }

    }
  },
  computed: {
    ...mapGetters('account', ['BALANCE']),
    ...mapGetters('user', ['USER'])
  },
  methods: {
    logout () {
      this.$store.dispatch('user/LOGOUT')
      this.$router.push('/')
    }
  }
};
</script>
