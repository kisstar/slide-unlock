import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

export default {
  input: 'src/index.ts',
  output: [
    isProduction && { file: pkg.module, format: 'es', sourcemap: true },
    {
      file: pkg.main,
      name: pkg.name
        .split('/')[1]
        .split('-')
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(''),
      format: 'umd',
      sourcemap: true,
    },
  ].filter(Boolean),
  watch: {
    include: 'src/**/*.ts',
  },
  plugins: [
    isDevelopment &&
      serve({ open: true, contentBase: ['public', 'dist', '.'] }),
    typescript(),
    json(),
    commonjs(),
    nodeResolve(),
    livereload(),
  ].filter(Boolean),
};
