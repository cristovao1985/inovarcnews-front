<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-white">INOVARC NEWS</q-toolbar-title>
        vBETA
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered side="right" v-if="leftDrawerOpen">
      <q-list>
        <q-item-label header> INOVARC NEWS </q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
      <q-btn
        label="Login"
        color="positive"
        flat
        class="full-width"
        to="/login"
        v-if="!user?.name"
      />
      <q-btn
        label="Sair"
        color="negative"
        flat
        class="full-width"
        @click="logout"
        v-if="user?.name"
      />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import notify from 'src/mixins/notify'

const linksList = [
  {
    title: 'Postagens',
    caption: 'Notícias e Vagas de Emprego',
    icon: 'fa-solid fa-newspaper',
    link: '/#/',
  },
  {
    title: 'Publicar',
    caption: 'Publicar novo conteúdo',
    icon: 'fa-solid fa-add',
    link: '/#/publish',
  },
  {
    title: 'Inovarc',
    caption: 'Sobre nós',
    icon: 'fa-solid fa-circle-info',
    link: '/#/about',
  },
  {
    title: 'Perfil',
    caption: 'Dados da minha conta',
    icon: 'fa-solid fa-user',
    link: '/#/profile',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      linksList[3].title = user.name
    }
    return {
      linksList,
      leftDrawerOpen,
      user,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout() {
        // Lógica de logout aqui, como limpar tokens, redirecionar para a página de login, etc.
        notify.methods.notifySuccess(
          'Logout realizado com sucesso!. Você está navegando de forma anônima.',
        )
        localStorage.removeItem('user')
        window.location.reload()
      },
    }
  },
})
</script>
