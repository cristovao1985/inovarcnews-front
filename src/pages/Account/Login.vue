<template>
  <q-page class="q-ma-md text-center">
    <h5>Login</h5>
    <div class="q-pa-md" style="max-width: 400px; margin: 0 auto">
      <q-form ref="form" class="q-gutter-md">
        <q-input outlined label="Email" v-model="email" type="email" clear-icon="close" clearable />
        <q-input outlined label="Password" v-model="password" :type="isPwd ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-form>
      <q-btn
        label="Login"
        color="primary"
        @click="login"
        class="full-width q-mt-md"
        :loading="loading"
      />
      <q-btn label="Esqueci minha senha" flat @click="recovery = true" />
      <q-btn label="Criar conta" flat color="positive" to="signup" />
    </div>

    <q-dialog v-model="recovery">
      <q-card style="width: 400px">
        <q-banner class="bg-info text-primary-5" v-if="banner">
          Se o email {{ emailRecovery }} estiver registrado na nossa base de dados, você receberá um
          email de recuperação de senha.
          <template v-slot:action>
            <q-btn flat color="white" label="Entendi" @click="recovery = false" />
          </template>
        </q-banner>
        <q-card-section>
          <div class="text-h6">Recuperar senha</div>
        </q-card-section>
        <q-card-section>
          <q-form ref="form">
            <q-input
              outlined
              label="Email"
              v-model="emailRecovery"
              type="email"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="positive" label="Recuperar" @click="sendRecoveryEmail" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      recovery: false,
      banner: false,
      emailRecovery: '',
      isPwd: true,
      loading: false,
    }
  },
  mixins: [notify],
  methods: {
    async login() {
      try {
        this.loading = true
        const account = await firebaseApi.login(this.email, this.password)

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
      } finally {
        this.loading = false
      }
    },
    async sendRecoveryEmail() {
      // Lógica para enviar email de recuperação
      try {
        this.$refs.form.validate().then(async (isValid) => {
          if (isValid) {
            await firebaseApi.recoveryPassword(this.emailRecovery)
            this.banner = true
          }
        })
      } catch (error) {
        console.error('Error sending recovery email:', error)
        this.notifyError('Falha ao enviar email de recuperação. Por favor, tente novamente.')
      }
    },
  },
}
</script>
