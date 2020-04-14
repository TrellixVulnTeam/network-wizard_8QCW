// en este archivo vamos 
module.exports = {
	webpack(config) {
		config.target = 'electron-renderer';
		return config;
	},
};