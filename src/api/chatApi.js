import { apiFetch } from './index'

export const sendMessage = (message, history) =>
  apiFetch('/chat/', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  })
