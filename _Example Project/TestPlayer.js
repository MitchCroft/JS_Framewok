/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: TestPlayer
 *      Author: Mitchell Croft
 *      Date: 28/09/2016
 *
 *      Version: 1.0
 *  
 *      Requires:
 *      TestChildObj.js, ShapeComponent.js, PhysicsComponent, ParticleComponent.js, Input.js
 *
 *      Purpose:
 *      Provide a simple method for a player to interact
 *      with the testing scene
 **/

/*
    TestPlayer : Constructor - Initialise the GameObject base
    28/09/2016

    Example:

    //Create a player object
    var playerObj = new TestPlayer();
*/
function TestPlayer() {
    //Call the GameObject Base
    GameObject.call(this, "Player");

    //Store the size of the player
    this.size = 50;

    //Store the move speed of the player (World Units / Second)
    this.moveSpeed = 250;

    //Store the turn speed of the player (Degrees / Second)
    this.turnSpeed = 360;

    //Store a reference to the player shape
    this.shapeComp = null;
};

//Apply the Game Object prototype
TestPlayer.prototype = Object.create(GameObject.prototype);
TestPlayer.prototype.constructor = TestPlayer;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Main Functions                                               ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    TestPlayer : start - Setup the player for viewing
    28/09/2016
*/
TestPlayer.prototype.start = function() {
    //Add a physics component to the player
    var phys = this.createComponent("PhysicsComponent");

    //Set the player to be kinematic
    phys.isKinematic = true;

    //Assign a circle collider to the physics component
    phys.collider = new CircleCollider();

    //Set the radius of the circle collider
    phys.collider.radius = this.size / 2;

    //Set the collider to be a trigger
    phys.collider.isTrigger = true;

    //Add a particle emitter component to the player
    var emitter = this.createComponent("ParticleComponent");

    //Set the maximum number of particles
    emitter.maximum = 100;

    //Set the emit rate
    emitter.emitRate = 25;

    //Set the lifetime
    emitter.minLife = 1;
    emitter.maxLife = 4;

    //Set the velocity
    emitter.minVelocity = 50;
    emitter.maxVelocity = 500;

    //Set the starting size
    emitter.startSize = this.size / 4;

    //Start the emitter
    emitter.start();

    //Add the body of the player
    this.shapeComp = this.createComponent("ShapeComponent");

    //Set the shape as triangle
    this.shapeComp.points = getPrimitivePoints(ShapeType.TRIANGLE, this.size);

    //Set the color of the body
    this.shapeComp.fillColor = new Color("#F00");
    this.shapeComp.borderColor = new Color();

    //Create child objects 
    for (var i = 0; i < 2; i++) {
        //Create a child object 
        var childObj = new TestChildObj("Player Child");

        //Set child as child of player
        childObj.transform.parent = this.transform;

        //Position the child half way up the player on the point
        childObj.transform.localPosition = new Vec2(this.size / 2 * (i === 0 ? 1 : -1), -this.size / 2);

        //Set the childs size
        childObj.size = this.size / 4;
    }
};

/*
    TestPlayer : update - Update the players position in the world based on input
    28/09/2016

    @param[in] pDelta - The delta time for the current cycle
*/
TestPlayer.prototype.update = function(pDelta) {
    //Update the players turning
    this.transform.localRotation += Input.getAxis("turn") * this.turnSpeed * pDelta;

    //Move the player
    this.transform.position = this.transform.position.addSet(this.transform.forward.multi(Input.getAxis("vertical") * this.moveSpeed * pDelta));

    //Adjust the camera's zoom
    sceneManager.camera.distance = Input.getAxis("zoom") * 19 + 1;

    if (Input.keyPressed(Keys.SPACE)) {
        this.getComponentWithID(ComponentID.PARTICLES).type = EmitterType.DIRECTION;
    }
};

/*
    TestPlayer : onTrigger - If the player interacts with a test object apply a velocity
    25/10/2016

    @param[in] pObj - The Game Object that triggered the event
*/
TestPlayer.prototype.onTrigger = function(pObj) {
    //Check the tag of the object
    if (pObj.tag !== "Test Object");

    //Get the physics component
    var phys = pObj.getComponentWithID(ComponentID.PHYSICS);

    //Check the component was found
    if (!phys) return;

    //Calculate the seperation vector
    var seperation = pObj.transform.position.subtract(this.transform.position);

    //Apply the force to the Physics Component
    phys.addForce(seperation.multiSet(5));
};