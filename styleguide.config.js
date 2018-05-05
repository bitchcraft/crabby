const path = require('path');
const webpackConfig = require('./webpack.config');

const { resolveLoader } = webpackConfig;
const { rules } = webpackConfig.module;

module.exports = {
	// assetsDir: 'static/',
	components: 'src/**/*.{js,jsx}',
	getComponentPathLine(componentPath) {
		const name = path.basename(componentPath, '.jsx');
		const dir = path.dirname(componentPath).replace('src/', '');
		return `import ${name} from '${dir}/${name}';`;
	},
	getExampleFilename(componentPath) {
		return componentPath.replace(/\.jsx?$/, '.examples.md');
	},
	showUsage: false,
	styleguideComponents: {
		Wrapper: path.join(__dirname, 'styleguidist/Wrapper'),
	},
	skipComponentsWithoutExample: true,
	webpackConfig: {
		module: {
			rules,
		},
		resolveLoader,
	},
};
