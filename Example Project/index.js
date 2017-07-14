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

//Create a virtual axis for scaling time
let SCALE_AXIS = new InputAxis({
	name: "scale",
	positiveKey: Keys.RIGHT,
	negativeKey: Keys.LEFT,
	gravity: 0
});

//Add the axis to the input manager
input.addAxis(SCALE_AXIS);

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
let emittersPerSecond = 1 / 5;
let nextEmitterTime = 0;

let emit = particleManager.createEmitter({
	maximum: 200,
	emitRate: 50,
	emitterSpace: EmitterSpace.LOCAL
});

/*
	updateLoop - Update the input and display the world environment
	19/05/2017

	param[in] pTime - A time object containing the time information for the cycle
*/
function updateLoop(pTime) {
	//Update the input manager
	input.update(pTime.realDeltaTime);

	//Scale the time object
	pTime.timeScale = (input.getAxis("scale") + 1) / 2 * 2;

	//Move the local space emitter
	emit.position = new Vec2(Constants.WORLD_VIEW_WIDTH / 2 + Constants.WORLD_VIEW_WIDTH * Math.sin(pTime.elapsedTime), 0);

	//Check for mouse click
	if (input.inputDown(Buttons.LEFT_CLICK) && pTime.realElapsedTime >= nextEmitterTime) {
		//Save the time of next emitter
		nextEmitterTime = pTime.realElapsedTime + emittersPerSecond;

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
	particleManager.update(pTime.deltaTime);

	//Pan the camera out as emitters are added
	camera.distance = Math.lerp(camera.distance, Math.log(particleManager.count + 2), pTime.deltaTime);

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

	//Display Stat Information
	graphics.draw.font = "36px Arial";
	graphics.outlineText("Emitters: " + particleManager.count, Constants.WORLD_VIEW_WIDTH, 40, "white", "black", TextAlign.RIGHT);
	graphics.outlineText("FPS: " + (1 / pTime.realDeltaTime).toFixed(0), 10, 40, "red");

	//Display Time Scale Information
	graphics.outlineText("Time Scale: " + pTime.timeScale.toFixed(2), Constants.WORLD_VIEW_WIDTH / 2, 40, "green", "black", TextAlign.CENTER);
	graphics.draw.font = "16px Arial";
	graphics.outlineText("Use LEFT and RIGHT to Scale Time", Constants.WORLD_VIEW_WIDTH / 2, 60, "white", "black", TextAlign.CENTER);
}

//Assign the game loop to the state manager
let stateManager = new StateManager(updateLoop);