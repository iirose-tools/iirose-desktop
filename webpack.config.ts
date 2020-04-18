import * as path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'production',
  target: 'electron-renderer',
  entry: './build/renderer/index.js',
  output: {
    path: path.resolve(__dirname, 'build/renderer'),
    filename: 'index.js'
  }
};

export default config;
