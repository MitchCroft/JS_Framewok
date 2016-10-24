/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: TestScene
 *      Author: Mitchell Croft
 *      Date: 28/09/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      SceneManager.js, TestPlayer.js, TestObj.js
 *
 *      Purpose:
 *      Provide a basic scene to test implemented features
 *      and provide an example on how to use the systems
 **/

/*
    TestScene : Constructor - Intialise the SceneBase
    28/09/2016
*/
function TestScene() {
    //Call the Scene Base constructor for intitial setup
    SceneBase.call(this);

    //Define the number of test objects to create
    this.testObjectCount = 250;

    //Store the test objects inside an array
    this.testObjects = [];

    //Define the speed with which the camera moves
    this.cameraSpeed = 2;

    //Define the size of the world to spawn objects in
    this.worldRadius = 10000;

    //Store a reference to the player object
    this.playerObj = null;
};

//Apply the SceneBase prototype
TestScene.prototype = Object.create(SceneBase.prototype);
TestScene.prototype.constructor = TestScene;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Main Function                                                ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    TestScene : startUp - Spawn the test objects and the player
    28/09/2016
*/
TestScene.prototype.startUp = function() {
    //Create the player
    this.playerObj = new TestPlayer();

    //Add the player to the scene
    this.objects.push(this.playerObj);

    //Create the test object folder (Store test objects)
    var holder = new GameObject("Test Object Folder");

    //Add the folder to the scene
    this.objects.push(holder);

    //Create the test objects
    for (var i = 0; i < this.testObjectCount; i++) {
        //Create the test object
        var obj = new TestObj();

        //Get a random direction
        var randDir = new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();

        //Randomly position the obj in the 'world'
        obj.transform.position = randDir.multiSet(Math.random() * this.worldRadius);

        //Add the object to the folder
        obj.transform.parent = holder.transform;

        //Add the obejct to the test objects array
        this.testObjects[this.testObjects.length] = obj;
    }

    //Set gravity to pull objects down
    Physics.gravity = new Vec2(0, 10);

    //Uncap the timestep
    Physics.timeStep = 0;
};

/*
    TestScene : update - Restrict the player to the world area 
                         and make the camera track them
    28/09/2016

    @param[in] pDelta - The delta time for the current cycle
*/
TestScene.prototype.update = function(pDelta) {
    //Get the player's position
    var playerPos = this.playerObj.transform.position;

    //Check if the player is outside of the world radius
    if (playerPos.sqrMag > this.worldRadius * this.worldRadius) {
        //Get the direction of the player from the origin
        playerPos.normalize();

        //Place the player on the bounds of the world
        playerPos.multiSet(this.worldRadius);

        //Re-assign the player's position
        this.playerObj.transform.position = playerPos;
    }

    //Lerp the camera position towards the player
    sceneManager.camera.position = sceneManager.camera.position.lerp(playerPos, this.cameraSpeed * pDelta);

    //Check if the additional objects have fallen outside of the world radius
    for (var i = this.testObjects.length - 1; i >= 0; i--) {
        if (this.testObjects[i].transform.position.sqrMag > this.worldRadius * this.worldRadius) {
            //Destroy the game object
            this.testObjects[i].destroy();

            //Remove reference from the list
            this.testObjects.splice(i, 1);
        }
    }
};

/*
    TestScene : preDraw - Clear the backbuffer of the graphics object
    30/09/2016

    @param[in] pCtx - The 2D context being used to render the scene
    @param[in] pVisBounds - The Bounds object describing the area that has been found to be visible
                            by the camera
    @param[in] pProjView - A Mat3 object containing the projection view matrix for
                           the Camera object being used to draw
*/
TestScene.prototype.preDraw = function(pCtx, pVisBounds, pProjView) {
    //Set the draw color
    pCtx.fillStyle = "black";

    //Convert the world space visible bounds to screen space
    var screenSpaceBounds = pVisBounds.getGlobalBounds(pProjView);

    //Fill in the rectangle in the background
    pCtx.fillRect(screenSpaceBounds.min.x, screenSpaceBounds.min.y,
        screenSpaceBounds.max.x - screenSpaceBounds.min.x, screenSpaceBounds.max.y - screenSpaceBounds.min.y);
};