/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const webpack = require('webpack');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')
const path = require('path');
const rootPath = path.resolve(process.cwd()) + path.sep;
const config = require(path.resolve(rootPath, './webpack.config.js'));

const argv = yargs(hideBin(process.argv)).argv;

const opt = config([], argv, process.cwd(), true);

webpack(opt).run();
