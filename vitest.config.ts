import {defineConfig} from 'vitest/config'
import loadEnv from '@jswork/loadenv';

export default defineConfig(({mode}) => {
    return {
        test: {
            // mode defines what ".env.{mode}" file to choose if exists
            env: loadEnv({cwd: process.cwd(), files: [`./configs/.env.${mode}`]})
        },
    }
})
