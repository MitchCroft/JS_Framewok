/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                   Object Globals                                           ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Store the min max size of the shapes
var TEST_OBJ_SIZE_MIN = 10;
var TEST_OBJ_SIZE_MAX = 75;

//Store the rate at which the fill color should change
var TEST_OBJ_COL_SWAP_RATE = 10;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: TestObj
 *      Author: Mitchell Croft
 *      Date: 28/09/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      GameObject.js, ShapeComponent.js
 *
 *      Purpose:
 *      Provide a basic shape to be visible in the scene
 *      for the player to move around
 **/

/*
    TestObj : Constructor - Initialise the GameObject base
    28/09/2016
*/
function TestObj() {
    //Call the GameObject Base
    GameObject.call(this, "Test Object");

    //Store the current animation time
    this.aniTimer = 0;
};

//Apply the Game Object prototype
TestObj.prototype = Object.create(GameObject.prototype);
TestObj.prototype.constructor = TestObj;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Main Function                                                ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    TestObj : start - Create a random shape for the object
    28/09/2016
*/
TestObj.prototype.start = function() {
    //Add a shape component to the current object
    var shapeComp = this.createComponent("ShapeComponent");

    //Generate a random size for the shape
    var size = Math.random() * (TEST_OBJ_SIZE_MAX - TEST_OBJ_SIZE_MIN) + TEST_OBJ_SIZE_MIN;

    //Create a random shape of random size
    shapeComp.points = getPrimitivePoints(
        Math.floor(Math.random() * 3),
        size
    );

    //Generate a random color for the fill
    shapeComp.fillColor = new Color().randomize();

    //Add a physics component to the shape
    var phys = this.createComponent("PhysicsComponent");

    //Kill drag
    phys.drag = 0;
    phys.angularDrag = 0.1;

    phys.addTorque(Math.random() * 180 + 180 * (Math.random() > 0.5 ? 1 : -1), ForceMode.IMPULSE);

    //Add a circle collider to phys
    phys.collider = new CircleCollider();

    //Set the radius of the circle collider
    phys.collider.radius = size / 2;

    //Generate a random rotation for the object
    this.transform.rotation = Math.random() * 360;

    //Create a random starting animation time
    this.aniTimer = Math.random() * TEST_OBJ_COL_SWAP_RATE;
};

/*
    TestObj : update - Update the fill color for the object every period of time
    29/09/2016

    @param[in] pDelta - The delta time for the current cycle
*/
TestObj.prototype.update = function(pDelta) {
    //Decrease the ani timer
    this.aniTimer -= pDelta;

    //Check if the timer is < 0
    if (this.aniTimer < 0) {
        //Reset the animation timer
        this.aniTimer = TEST_OBJ_COL_SWAP_RATE;

        //Get the shape component
        var comp = this.getComponentWithID(-1);

        //Ensure the component was found
        if (comp === null) throw new Error("Test Object was unable to get the component with ID -1");

        //Set the fill color
        comp.fillColor = new Color().randomize();
    }
};