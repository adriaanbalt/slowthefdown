const initialState = {
	user: null,
	title: "",
	currentIndex: 0,
	showModal: false,
	isMobile: false,
	isiPhone4orLG3: /iPhone/i.test(navigator.userAgent)  && (window.devicePixelRatio || 1) == 2 || /LG-D855|LG-D852|LG-D851|LG-D850|VS985 4G|LGLS990|LGUS990/i.test(navigator.userAgent)  && (window.devicePixelRatio || 1) == 3,
	currentLocale: window.navigator && window.navigator.language || 'en', // default to language detected by browser
	acceptedLocales: window.navigator && window.navigator.languages || [], // default to languages list detected by browser
	project: { // bridge object to create/update a project
		title: ""
	},
	create: {
		steps: [
			{
				title: "Features",
				features: [
					{
						title: "Tub",
					},
					{
						title: "Sink"
					},
					{
						title: "Toilet"
					},
					{
						title: "Vanity"
					},
					{
						title: "Sauna"
					},
					{
						title: "Steam"
					},
					{
						title: "Shower bench"
					},
					{
						title: "Shower"
					}
				]
			},
			{
				title: "Materials",
				features: [
					{
						title: "wood",
					},
					{
						title: "steel"
					},
					{
						title: "slate"
					},
					{
						title: "tile"
					}
				]
			},
			{
				title: "Square Footage",
				description: "Input square footage"
			},
			{
				title: "Budget",
				description: "budget and zip code"
			},
			{
				title: "Select Contractors",
				description: "Select your contractors you wish to contact"
			}
		]
	},
	skills: [
		{
			_id: "plumbing-01",
			type: "plumbing",
			icon: "pipe"
		},
		{
			_id: "carpenter-01",
			type: "carpenter",
			icon: "wood"
		},
		{
			_id: "mason-01",
			type: "mason",
			icon: "mason"
		},
		{
			_id: "electrician-01",
			type: "electrician",
			icon: "electric"
		},
		{
			_id: "engineer-01",
			type: "engineer",
			icon: "engineer"
		}
	],
	materials: [
		{
			_id: "stone-001",
			type: "tile",
			color: "white",
			title:"Onyx Material",
			pattern: "herringbone",
			sku: "sku12345",
			type: "onyx",
			category: "ceiling",
			thumbnail: "/images/material/onyx.jpg",
			images: [
				"/images/material/onyx-1.jpg",
				"/images/material/onyx-2.jpg",
				"/images/material/onyx-3.jpg"
			]
		},
		{
			_id: "wood-001",
			type: "wood",
			color: "brown",
			title:"Wood Material",
			pattern: "diagonal",
			sku: "sku3456",
			type: "oak",
			category: "floor",
			thumbnail: "/images/material/wood.jpg",
			images: [
				"/images/material/wood-1.jpg",
				"/images/material/wood-2.jpg",
				"/images/material/wood-3.jpg"
			]
		}
	],
	// ROOM TYPES: kitchen, bathroom, garden, bedroom, attic, cellar/basement, porch, stoop, roof",
	checklist: [
		{
			_id: "task-1",
			type: "task",
			title: "Task 001",
			description: "This is the description of task 001. lorem ipsum dolar amit set.",
			creator: "client-1",
			assignee: "contractor-1",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			dueDate: new Date(),
			priority: 10,
			project_id: "project-001",
			room_id: "kitchen-001",
			state: "current" // could be archive
		},
		{
			_id: "task-2",
			type: "task",
			title: "Task 002",
			description: "This is the description of task 002. lorem ipsum dolar amit set.",
			creator: "client-1",
			assignee: "contractor-1",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			dueDate: new Date(),
			priority: 8,
			project_id: "project-002",
			room_id: "kitchen-002",
			state: "current" // could be archive
		},
		{
			_id: "task-3",
			type: "task",
			title: "Task 003",
			description: "This is the description of task 003. lorem ipsum dolar amit set.",
			creator: "client-1",
			assignee: "contractor-1",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			dueDate: new Date(),
			priority: 3,
			project_id: "project-003",
			room_id: "kitchen-003",
			state: "current" // could be archive
		},
		{
			_id: "task-4",
			type: "task",
			title: "Task 004",
			description: "This is the description of task 004. lorem ipsum dolar amit set.",
			creator: "client-1",
			assignee: "contractor-1",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			dueDate: new Date(),
			priority: 3,
			project_id: "project-004",
			room_id: "kitchen-004",
			state: "archive" // could be archive
		}
	],
	users: [
		{
			_id:"client-1",
			type: "admin",
			label: "adriaan",
			avatar : "/images/adriaan.jpg",
			email: "adriaan@balt.us",
			phone: "9172878273",
			firstName: "Adriaan",
			lastName: "Scholvinck",
			security: 1,
			permissions: 10,

			contractors: [
				"contractor-1"
			],
			projects: [
				"project-1",
				"project-2",
				"project-3"
			],
			checklist: [
				"task-1",
				"task-2",
				"task-3",
				"task-4"
			],
			milestones: [
			]
		},
		{
			_id: "contractor-1",
			type: "normal",
			avatar: "/image/contractor.jpg",
			businessName: "BALT",
			firstName: "Balt",
			lastName: "Consulting Inc.",
			phone: "9172878273",
			fax: "2126083451",
			address: "138 Duane Street",
			suite: "PH",
			city: "New York",
			state: "New York",
			zipcode: "10013",
			email: "adriaanbalt@gmail.com",

			security: 1,
			permissions: 10,
			rating: 4.5,

			clients: [
				"client-1"
			],

			reviews: [
			],

			skills: [
			],

			projects: [
				"project-1",
				"project-2",
				"project-3"
			],

			checklist: [
				"task-1",
				"task-2",
				"task-3",
				"task-4"
			],

			milestones: [
			]
		}
	],
	projects: [],
	// projects: [
	// 	{
	// 		_id: "project-1",
	// 		createdDate: new Date(),
	// 		lastUpdatedDate: new Date(),
	// 		title: "Project Title 001",
	// 		description: "This is project 001 description text.  Lorem ipsum dolar amit set",
	// 		budget: 500000,
	// 		type: "gut",
	// 		creator: "client-1",
	// 		client: "client-1",
	// 		contractors: [
	// 			"contractor-1"
	// 		],
	// 		rooms: [
	// 			"kitchen-001",
	// 			"bathroom-002",
	// 			"garden-003"
	// 		]
	// 	},
	// 	{
	// 		_id: "project-2",
	// 		createdDate: new Date(),
	// 		lastUpdatedDate: new Date(),
	// 		title: "Project Title 002",
	// 		description: "This is project 002 description text.  Lorem ipsum dolar amit set",
	// 		budget: 30000,
	// 		creator: "client-1",
	// 		client: "client-1",
	// 		contractors: [
	// 			"contractor-1"
	// 		],
	// 		type: "remodel"
	// 	},
	// 	{
	// 		_id: "project-3",
	// 		createdDate: new Date(),
	// 		lastUpdatedDate: new Date(),
	// 		title: "Project Title 003",
	// 		description: "This is project 003 description text.  Lorem ipsum dolar amit set",
	// 		budget: 780000,
	// 		creator: "client-1",
	// 		client: "client-1",
	// 		contractors: [
	// 			"contractor-1"
	// 		],
	// 		type: "gut"
	// 	},
	// 	{
	// 		_id: "project-4",
	// 		createdDate: new Date(),
	// 		lastUpdatedDate: new Date(),
	// 		title: "Project Title 001",
	// 		description: "This is project 001 description text.  Lorem ipsum dolar amit set",
	// 		budget: 500000,
	// 		type: "gut",
	// 		creator: "client-1",
	// 		client: "client-1",
	// 		rooms: [
	// 			"kitchen-011",
	// 			"bathroom-012",
	// 			"garden-013",
	// 		]
	// 	}
	// ],
	products: [
		{
			_id: "faucet-001",
			type: "faucet",
			brand: "faucet",
			type: "faucet",
			sku: "sku12345",
			thumbnail: "/images/faucet-001.jpg",
			color: "white",
			images:[
				"/images/faucet-001-01.jpg",
				"/images/faucet-001-02.jpg",
				"/images/faucet-001-03.jpg"
			]
		}
	],
	rooms: [
		{
			_id: "kitchen-001",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			title: "Duplex Kitchen",
			type: "kitchen",
			budget: 20000,
			progress: .75,
			squarefeet: 300,
			project_id: "001",
			users: [
				"contractor-1"
			],
			materials: [ // array of materials
				"tile-001",
				"wood-001"
			],
			products: [ // array of products
				"faucet-001"
			]
		},
		{
			_id: "bathroom-002",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			title: "Master Bathroom",
			type: "bathroom",
			budget: 40000,
			progress: .35,
			squarefeet: 550,
			project_id: "001",
			users: [
				"contractor-1"
			],
			materials: [ // array of materials
				"tile-001",
				"wood-001"
			],
			products: [ // array of products
				"faucet-001"
			]
		},
		{
			_id: "garden-003",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			title: "Rental Garden",
			type: "garden",
			budget: 48040,
			progress: .97,
			squarefeet: 600,
			project_id: "001",
			users: [
				"contractor-1"
			],
			materials: [ // array of materials
				"tile-001",
				"wood-001"
			],
			products: [ // array of products
				"faucet-001"
			]
		},
		{
			_id: "kitchen-011",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			title: "Duplex Kitchen",
			type: "kitchen",
			budget: 20000,
			progress: .75,
			squarefeet: 300,
			project_id: "004",
			users: [
				"client-1"
			],
			materials: [ // array of materials
				"tile-001",
				"wood-001"
			],
			products: [ // array of products
				"faucet-001"
			]
		},
		{
			_id: "bathroom-012",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			title: "Master Bathroom",
			type: "bathroom",
			budget: 40000,
			progress: .35,
			squarefeet: 550,
			project_id: "004",
			users: [
				"client-1"
			],
			materials: [ // array of materials
				"tile-001",
				"wood-001"
			],
			products: [ // array of products
				"faucet-001"
			]
		},
		{
			_id: "garden-013",
			createdDate: new Date(),
			lastUpdatedDate: new Date(),
			title: "Rental Garden",
			type: "garden",
			budget: 48040,
			progress: .97,
			squarefeet: 600,
			project_id: "004",
			users: [
				"client-1"
			],
			materials: [ // array of materials
				"tile-001",
				"wood-001"
			],
			products: [ // array of products
				"faucet-001"
			]
		}
	],
	search: {
		results: [],
		filter: {},
		sort: "date",
		itemsPerPage: 20,
		offset: 0
	},
	nav: {
		isSearchOpen: false,
		isUserOpen: false,
		isMobileOpen: false
	}
};

export default initialState;