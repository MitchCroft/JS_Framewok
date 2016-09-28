/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                   Object Globals                                           ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Store the min max size of the shapes
var TEST_OBJ_SIZE_MIN = 10;
var TEST_OBJ_SIZE_MAX = 75;

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

    //Create a random shape of random size
    shapeComp.points = getPrimitivePoints(
        Math.floor(Math.random() * 3),
        Math.random() * (TEST_OBJ_SIZE_MAX - TEST_OBJ_SIZE_MIN) + TEST_OBJ_SIZE_MIN
    );

    //Generate a random color for the fill
    shapeComp.fillColor = new Color().randomize();

    //Generate a random rotation for the object
    this.transform.rotation = Math.random() * 360;
};