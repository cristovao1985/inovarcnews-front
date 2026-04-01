<template>
  <q-page class="q-ma-md text-center">
    <h5>Login</h5>
    <div class="q-pa-md" style="max-width: 400px; margin: 0 auto">
      <q-form ref="form" class="q-gutter-md">
        <q-input outlined label="Email" v-model="email" type="email" />
        <q-input outlined label="Password" v-model="password" type="password" />
      </q-form>
      <q-btn label="Login" color="primary" @click="login" class="full-width q-mt-md" />
    </div>
  </q-page>
</template>

<script>
import firebaseApi from '../../api/firebase/firebase.api'
import usersApi from 'src/api/users/users.api'
import notify from 'src/mixins/notify'
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  mixins: [notify],
  methods: {
    async login() {
      try {
        const account = await firebaseApi.login(this.email, this.password)
        console.log(account)
        if (!account.uid) {
          this.notifyWarning(
            'Usuário não encontrado. Por favor, verifique suas credenciais e tente novamente.',
          )
          return
        }
        const user = await usersApi.login(account.uid)

        if (user.data.list.length === 0) {
          this.notifyWarning(
            'Usuário não encontrado. Por favor, verifique suas credenciais e tente novamente.',
          )
          return
        }
        localStorage.setItem('user', JSON.stringify(user.data.list[0]))
        this.notifySuccess('Login realizado com sucesso!')
        this.$router.push('/')
      } catch (error) {
        console.error('Login error:', error)
        this.notifyError('Falha no login. Por favor, verifique suas credenciais e tente novamente.')
      }
    },
  },
}
</script>
