import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

export default [
  {
    input: 'userScript.js',
    output: {
      file: '../dist/userScript.js',
      format: 'iife'
    },
    plugins: [
      string({
        include: '**/*.css'
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            targets: {
              chrome: '47'
            },
            bugfixes: true
          }]
        ]
      }),
      terser({
        ecma: 5,
        compress: {
          ecma: 5
        },
        format: {
          ecma: 5,
          ascii_only: true
        }
      })
    ]
  }
];
