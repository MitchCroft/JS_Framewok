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
var ZOOM_AXIS = new InputAxis("zoom", Keys.SPACE);

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

/*
    updateLoop - Update the input and scene manager to allow for rendering of the scene
    28/09/2016

    @param[in]  pDelta - The delta time for the current cycle
*/
function updateLoop(pDelta) {
    //Update the Input Manager
    Input.update(pDelta);

    //Clear the background
    graphics.draw.fillStyle = 'black';
    graphics.draw.fillRect(0, 0, graphics.width, graphics.height);

    //Update the Scene Manager
    sceneManager.update(pDelta);

    //Display the FPS
    graphics.draw.font = "36px Arial";
    graphics.outlineText("FPS: " + (1 / pDelta).toFixed(0), 5, 40, 'red');
};

//Assign the function to the State Manager
StateManager.setGameFunction(updateLoop);