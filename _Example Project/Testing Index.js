/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                             Initialisation Values                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*--------------------Graphics--------------------*/
//Create the graphics manager
var graphics = new Graphics(window.innerWidth, window.innerHeight);

//Set the window resize callback
graphics.setWindowResizeCallback(function(pWidth, pHeight) {
    //Force the graphics canvas to match the window size
    graphics.size = new Vec2(pWidth, pHeight);

    //Debug out the new canvas dimensions
    console.log(pWidth + " " + pHeight);
});

/*--------------------Input--------------------*/
//Set the canvas within the Input Manager
Input.setCanvas(graphics.canvas);

//Create the input axis
var VERTICAL_AXIS = new InputAxis("vertical", Keys.W, Keys.S, 2, 0.5, Keys.UP, Keys.DOWN);
var TURN_AXIS = new InputAxis("turn", Keys.D, Keys.A, 2, 2, Keys.RIGHT, Keys.LEFT);
var ZOOM_AXIS = new InputAxis("zoom", Keys.SPACE, 0, 1, 0.5);

//Add the input axis to the Input Manager
Input.addAxis(VERTICAL_AXIS);
Input.addAxis(TURN_AXIS);
Input.addAxis(ZOOM_AXIS);

/*--------------------Scene--------------------*/
//Create the Scene Manager
var sceneManager = new SceneManager();

//Assign the renderer
sceneManager.renderer = graphics.draw;

//Create the camera to be used
sceneManager.camera = new Camera(graphics.canvas, 1920, 1080);

//Create the canvas resize event for resizing the camera
graphics.addCanvasResizeEvent(function(pWidth, pHeight) {
    //Assign the new canvas size
    sceneManager.camera.canvasDimensions = new Vec2(pWidth, pHeight);
});

//Add the main scene to the manager
sceneManager.addScene(TestScene, "Main");

//Set the starting scene for use
sceneManager.activeScene = "Main";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                         Update Loop Functionality                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Store the avergae frame rate to show a readable number
var avgFrames = 0;

//Store a timer value to track passage of a second
var fpsTimer = 0;

//Store the sum of the evaluated frames per second
var fpsSum = 0;

//Store the number of iterations that have occured in order to take the average
var fpsIterations = 0;

/*
    updateLoop - Update the input and scene manager to allow for rendering of the scene
    28/09/2016

    @param[in]  pDelta - The delta time for the current cycle
*/
function updateLoop(pDelta) {
    //Update the Input Manager
    Input.update(pDelta);

    //Update the Scene Manager
    sceneManager.update(pDelta);

    //Update the FPS counter
    fpsTimer += pDelta;

    //Add onto the sum
    fpsSum += 1 / pDelta;

    //Increment the counter
    fpsIterations++;

    //Check if a second has passed
    if (fpsTimer >= 1) {
        //Take the average
        avgFrames = fpsSum / fpsIterations;

        //Reset the values
        fpsTimer = fpsSum = fpsIterations = 0;
    }

    //Display the FPS
    graphics.draw.font = "36px Arial";
    graphics.outlineText("FPS: " + avgFrames.toFixed(0), 5, 40, 'red');
};

//Assign the function to the State Manager
StateManager.setGameFunction(updateLoop);