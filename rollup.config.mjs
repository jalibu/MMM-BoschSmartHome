import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json'))

const banner = `/*! *****************************************************************************
  ${pkg.name}
  Version ${pkg.version}

  ${pkg.description}
  Please submit bugs at ${pkg.bugs.url}

  © ${pkg.author ? pkg.author : pkg.contributors}
  License: ${pkg.license}

  This file is auto-generated. Do not edit.
***************************************************************************** */

`
export default [
  {
    input: './src/frontend/Frontend.ts',
    external: ['logger'],
    plugins: [typescript({ module: 'ESNext' }), nodeResolve(), commonjs(), terser()],
    output: {
      banner,
      file: './' + pkg.main,
      format: 'iife',
      globals: {
        logger: 'Log'
      }
    }
  },
  {
    input: './src/backend/Backend.ts',
    external: ['node_helper', 'logger', 'bosch-smart-home-bridge', 'fs'],
    plugins: [typescript({ module: 'ESNext' }), nodeResolve(), terser()],
    output: {
      banner,
      interop: 'auto',
      file: './node_helper.js',
      format: 'cjs'
    }
  }
]
