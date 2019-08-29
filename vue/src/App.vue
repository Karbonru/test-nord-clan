<template>
  <v-app>
    <AppBar />

    <v-content>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar'
export default {
  name: 'App',
  components: { AppBar },
  mounted () {
    this.$store.dispatch('user/USER_CHECK')
  },
  methods: {
    logout () {
      this.$store.dispatch('user/LOGOUT')
      this.$router.push('/')
    }
  }
};
</script>
