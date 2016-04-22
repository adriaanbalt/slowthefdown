export default {

	url_api : {
		dev: '',
		qa: '',
		prod: '',
	},

	url_locale : {
		dev: '/assets/localization/',
		prod: '/assets/localization/'
	},

	constants : {
		ROOT_PATH: "/",
		API_VERSION: "v1",
		TRANSLATE_DEFAULT_TEXT: "TRANSLATE"
	},

	getLocaleUrl () {
		return this.url_locale.dev;
	},

	getApiUrl () {
		return this.url_api.dev;
	}

};
