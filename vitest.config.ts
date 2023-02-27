import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: 'dotenv/config', // load variables from .env file
  },
})
