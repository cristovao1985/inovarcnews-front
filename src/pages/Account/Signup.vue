<template>
  <q-page class="q-ma-md text-center">
    <h5>Criar Conta</h5>
    <div class="q-pa-md" style="max-width: 400px; margin: 0 auto">
      <q-form ref="form" class="q-gutter-md">
        <q-input
          outlined
          label="Digite seu nome de usuário"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          v-model="account.username"
          @update:model-value="onInput"
          placeholder="n0m3pub1c0"
        />
        <q-input
          outlined
          label="Digite seu email"
          type="email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          v-model="account.email"
          placeholder="ex: usuario@gmail.com"
        />
        <q-input
          outlined
          label="Digite sua senha"
          :type="isPwd ? 'password' : 'text'"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
          v-model="account.password"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <a href="/#/terms" target="_blank">Termos e condições</a>
        <br />
        <q-checkbox v-model="acceptedTerms" label="Aceito os termos e condições acima" />
        <q-card-actions align="right">
          <q-btn label="Já tenho conta" flat to="/login" />
          <q-btn
            label="Criar Cadastro"
            color="positive"
            @click="validateNickName"
            :disable="!acceptedTerms"
          />
        </q-card-actions>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import usersApi from 'src/api/users/users.api'
import firebaseApi from 'src/api/firebase/firebase.api'
import notify from 'src/mixins/notify'
export default {
  name: 'SignupPage',
  data() {
    return {
      account: {
        username: '',
        email: '',
        password: '',
      },
      acceptedTerms: false,
      isPwd: true,
    }
  },
  mixins: [notify],
  methods: {
    onInput(val) {
      this.account.username = val
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acento
        .replace(/[^a-zA-Z0-9]/g, '') // remove tudo que não for letra/número
        .toLowerCase()
    },
    async validateNickName() {
      await this.$refs.form.validate().then(async (valid) => {
        if (valid) {
          const user = await usersApi.validateNickName(this.account.username)

          if (user.data.list?.length) {
            this.notifyWarning('Este nome de usuário já está em uso. Por favor, escolha outro.')
          } else {
            // Aqui você pode adicionar a lógica para criar a conta, como enviar os dados para o backend
            await this.createAccount()
          }
        }
      })
    },
    async createAccount() {
      await firebaseApi
        .createAccount(this.account.email, this.account.password)
        .then((userCredential) => {
          console.log(userCredential)

          // Conta criada com sucesso
          const user = {
            uuid: userCredential.uid,
            name: this.account.username,
            email: this.account.email,
          }

          console.log('Conta criada:', user)
          this.createUser(user)
        })
        .catch((error) => {
          // Tratar erros de criação de conta
          console.error('Erro ao criar conta:', error)
        })
    },
    async createUser(user) {
      await usersApi
        .create(user)
        .then(() => {
          this.notifySuccess('Conta criada com sucesso!')
          this.$router.push('/login')
        })
        .catch(() => {
          this.notifyError('Erro ao criar conta.')
        })
    },
  },
}
</script>
