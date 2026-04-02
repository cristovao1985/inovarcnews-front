const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/post/:id?', name: 'post', component: () => import('pages/Posts/Post.vue') },
      { path: '/publish', name: 'publish', component: () => import('pages/Posts/Publish.vue') },
      { path: '/login', name: 'login', component: () => import('pages/Account/Login.vue') },
      { path: '/signup', name: 'signup', component: () => import('pages/Account/Signup.vue') },
      { path: '/profile', name: 'profile', component: () => import('pages/Account/Profile.vue') },
      { path: '/about', name: 'about', component: () => import('pages/About/Index.vue') },
      { path: '/terms', name: 'terms', component: () => import('pages/Account/Terms.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
