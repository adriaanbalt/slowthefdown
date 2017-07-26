const initialState = {
	user: null,
	isMobile: false,
	isiPhone4orLG3: /iPhone/i.test(navigator.userAgent)  && (window.devicePixelRatio || 1) == 2 || /LG-D855|LG-D852|LG-D851|LG-D850|VS985 4G|LGLS990|LGUS990/i.test(navigator.userAgent)  && (window.devicePixelRatio || 1) == 3,
	currentLocale: window.navigator && window.navigator.language || 'en', // default to language detected by browser
	acceptedLocales: window.navigator && window.navigator.languages || [], // default to languages list detected by browser
	highscore: {
		score: 0
	},
	score: 0,
	highscores: [],
	drawerOpen: true,
	instructionsOpen: true,
	drawerPeak: false,
	animation: {
		callback: null,
		x: 0,
		y: 0,
		rotation: 0,
		speed: 1
	}
};

export default initialState;