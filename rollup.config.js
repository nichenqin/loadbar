import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: './loading-bar.js',
  format: 'umd',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  moduleName: 'LoadingBar',
  dest: 'bundle.js'
};