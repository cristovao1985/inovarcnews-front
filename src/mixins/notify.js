//

import { Notify } from 'quasar'

export default {
  methods: {
    notifySuccess(message = 'Operação realizada com sucesso!') {
      Notify.create({
        type: 'positive',
        message,
        position: 'top',
        timeout: 3000,
      })
    },
    notifyWarning(message = 'Atenção!') {
      Notify.create({
        type: 'warning',
        message,
        position: 'top',
        timeout: 3000,
      })
    },
    notifyError(message = 'Atenção!') {
      Notify.create({
        type: 'negative',
        message,
        position: 'top',
        timeout: 4000,
      })
    },
    notifyInfo(message = 'Atenção!') {
      Notify.create({
        type: 'info',
        message,
        position: 'top',
        timeout: 4000,
      })
    },
  },
}
