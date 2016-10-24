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
 *      GameObject.js, ShapeComponent.js, Input.js
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
    //Add the body of the player
    this.shapeComp = this.createComponent("ShapeComponent");

    //Set the shape as triangle
    this.shapeComp.points = getPrimitivePoints(ShapeType.TRIANGLE, this.size);

    //Set the color of the body
    this.shapeComp.fillColor = new Color("#F00");
    this.shapeComp.borderColor = new Color();

    //Add a physics component to the player
    var phys = this.createComponent("PhysicsComponent");

    //Set the player to be kinematic
    phys.isKinematic = true;

    //Assign a circle collider to the physics component
    phys.collider = new CircleCollider();

    //Set the radius of the circle collider
    phys.collider.radius = this.size / 2;

    //Create a child object 
    var childObj = new GameObject("Player Child");

    //Set child as child of player
    childObj.transform.parent = this.transform;

    //Position the child half way up the player on the point
    childObj.transform.localPosition = new Vec2(0, this.size / 2);

    //Add a shape to the child
    var childShape = childObj.createComponent("ShapeComponent");

    //Make the child shape a circle
    childShape.points = getPrimitivePoints(ShapeType.CIRCLE, this.size / 2);

    //Assign a random fill to the child
    childShape.fillColor = new Color().randomize();

    //Remove the border outline
    childShape.borderColor = null;
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
    sceneManager.camera.distance = Input.getAxis("zoom") * 14 + 1;

    //Rotate the child object
    this.findObjectWithTag("Player Child").transform.localRotation += 90 * pDelta;
};