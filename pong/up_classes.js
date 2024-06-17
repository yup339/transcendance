// class UpGame 
// {
// 	constructor()
// 	{
// 		// const vars
// 		const timeLimit = 30; // timelimit for the round

// 		//html stuff
// 		let canvas;

// 		//time vars
// 		let stop;
// 		let lastTime;
// 		let startTime;
// 		let frameCount;

// 		//scene
// 		let scene;
// 		let renderer;

// 		// score/players
// 		let playerLeft;
// 		let playerRight;

// 		// stats
// 		let jumpCount1 = 0;
// 		let jumpCount2 = 0;
// 		let distanceTravelled1 = 0;
// 		let distanceTravelled2 = 0;

// 		// player and player variables
// 		let players = [];
// 		let playerSpeed = 10;
// 		let jumpSpeed = 30;
// 		let isJumping = false;
// 		let isFalling = false;
// 		let previousPos = [];
// 		let previousPos2 = [];
// 		let jumpPos = 0;

// 		// objects
// 		let light;
// 		let light2;
// 		let lightSphere
// 		let objects = [];
// 		let objectsp2 = [];
// 		let platformsGeo = [
// 			new THREE.BoxGeometry(5, 1, 5), // first 50 y
// 			new THREE.BoxGeometry(4, 1, 5), // next 50 y, etc.. to augment difficulty
// 			new THREE.BoxGeometry(3, 1, 5),
// 			new THREE.BoxGeometry(2, 1, 5),
// 			new THREE.BoxGeometry(1, 1, 5),
// 			new THREE.BoxGeometry(0.5, 1, 5),];
// 		let hitboxes = [];
// 		let keys = {};
// 		let cycle = false;

// 		const views = [
// 			{
// 				left: 0,
// 				bottom: 0,
// 				width: 0.5,
// 				height: 1.0,
// 				position: [0, 0, 28],
// 				background: new THREE.Color(0xC1F7B0), // soft green
// 			},
// 			{
// 				left: 0.5,
// 				bottom: 0,
// 				width: 0.5,
// 				height: 1.0,
// 				position: [30, 0, 28],
// 				background: new THREE.Color(0xF8B7EE), // soft purple
// 			},
// 		];
// 	}
// }