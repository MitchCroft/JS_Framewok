/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                             Initialisation Values                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*--------------------Constants--------------------*/
//Define the set world dimensions for the environment
let Constants = {
	WORLD_VIEW_WIDTH: 1920,
	WORLD_VIEW_HEIGHT: 1080
};

/*--------------------Graphics--------------------*/
//Create the graphics manager
let graphics = new Graphics(window.innerWidth, window.innerHeight);

//Set the window resize callback
graphics.setWindowResizeCallback(function(pWidth, pHeight) {
	//Force the graphics canvas to match the window size
	graphics.size = new Vec2(pWidth, pHeight);
});

/*--------------------Input--------------------*/
//Create the Input Manager
let input = new Input(graphics.canvas);

/*--------------------Rendering--------------------*/
//Create the camera to view the environment
let camera = new Camera(graphics.canvas, Constants.WORLD_VIEW_WIDTH, Constants.WORLD_VIEW_HEIGHT);

//Add a canvas resize event
graphics.addCanvasResizeEvent(function(pWidth, pHeight) {
	//Assign the new canvas size to the camera
	camera.canvasDimensions = new Vec2(pWidth, pHeight);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                           Update Loop Functionality                                        ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Store the particle manager
let particleManager = new ParticleManager();

//Store paintbrush settings
let emittersPerSecond = 5;
let lastEmitter = Date.now() * 0.001;

let emit = particleManager.createEmitter({
	maximum: 200,
	emitRate: 50,
	emitterSpace: EmitterSpace.LOCAL
});

/*
	updateLoop - Update the input and display the world environment
	19/05/2017

	param[in] pDelta - The delta time for the current cycle
*/
function updateLoop(pDelta) {
	//Update the input manager
	input.update(pDelta);

	emit.position = new Vec2(-Constants.WORLD_VIEW_WIDTH / 2 + Constants.WORLD_VIEW_WIDTH * Math.sinT(), 0);

	//Check for mouse click
	if (input.inputDown(Buttons.LEFT_CLICK) && (Date.now() * 0.001) >= (lastEmitter + (1 / emittersPerSecond))) {
		//Save the current time
		lastEmitter = Date.now() * 0.001;

		//Get the position
		let pos = camera.screenPosToWorld(input.mousePos);

		//Create an emitter
		particleManager.createEmitter({
			position: pos,
			maximum: 200,

			type: Math.randomRange(EmitterType.POINT, EmitterType.LINE),
			emitRate: Math.randomRange(10, 200),
			direction: new Vec2(Math.randomRange(-1, 1), Math.randomRange(-1, 1)),
			lineLength: Math.randomRange(10, 200),
			runTime: Math.randomRange(1, 20),
			minLife: Math.randomRange(0, 5),
			maxLife: Math.randomRange(5, 20),
			minVelocity: Math.randomRange(0, 10),
			maxVelocity: Math.randomRange(10, 50),
			negRotation: Math.randomRange(0, Math.PI * 4),
			posRotation: Math.randomRange(0, Math.PI * 4),
			startSize: Math.randomRange(0, 100),
			endSize: Math.randomRange(0, 100),
			startColor: new Color().randomize()
		});
	}

	//Update the particle manager
	particleManager.update(pDelta);

	//Pan the camera out as emitters are added
	camera.distance = Math.lerp(camera.distance, Math.log(particleManager.count + 2), pDelta);

	//Clear the background
	graphics.transform = null;
	graphics.draw.fillStyle = "black";
	graphics.draw.fillRect(0, 0, graphics.width, graphics.height);

	//Set the camera transform
	if (graphics.pushTransform(camera.projectionView)) {
		//Draw the particles
		particleManager.draw(graphics);

		//Stop rendering
		graphics.endRender();
	}

	//Set the UI transform
	graphics.transform = camera.projectionUI;

	//Display the Emitter count
	graphics.draw.font = "36px Arial";
	graphics.outlineText("Emitters: " + particleManager.count, Constants.WORLD_VIEW_WIDTH, 40, "white", "black", TextAlign.RIGHT);
	graphics.outlineText("FPS: " + (1 / pDelta).toFixed(0), 10, 40, "red");
}

//Assign the game loop to the state manager
StateManager.setGameFunction(updateLoop);