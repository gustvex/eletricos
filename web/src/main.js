import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'
import { useCatalogStore } from './stores/catalog.js'
import { applyStructuredData } from './utils/seo.js'

import './assets/styles/tokens.css'
import './assets/styles/base.css'
import './assets/styles/utilities.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Dados estruturados para busca local (Google Meu Negócio / rich results).
applyStructuredData()

// Tenta sincronizar com a API; se falhar, o conteúdo do bundle já basta.
useCatalogStore().load()

app.mount('#app')
