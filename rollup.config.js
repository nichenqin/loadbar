import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './loadbar.js',
  format: 'umd',
  plugins: [
    uglify(),
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  moduleName: 'Loadbar',
  dest: 'loadbar.min.js'
};
