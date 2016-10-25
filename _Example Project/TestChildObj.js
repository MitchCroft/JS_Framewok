/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: TestChildObj
 *      Author: Mitchell Croft
 *      Date: 25/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      GameObject.js, PhysicsComponent.js, ShapeComponent.js
 *
 *      Purpose:
 *      Provide a method for destroying TestObj Game Objects
 *      when they come in contact with this object
 **/

/*
    TestChildObj - Constructor - Initialise with default values
    25/10/2016
*/
function TestChildObj() {
    //Call the GameObject Base
    GameObject.call(this, "Player Child");

    //Store the size of the child object
    this.size = 0;
};

//Apply the Game Object prototype
TestChildObj.prototype = Object.create(GameObject.prototype);
TestChildObj.prototype.constructor = TestChildObj;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Main Functions                                               ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    TestChildObj : start - Setup the child object with its components
    25/10/2016
*/
TestChildObj.prototype.start = function() {
    //Create the shape component for the child
    var shape = this.createComponent("ShapeComponent");

    //Make the child shape a circle
    shape.points = getPrimitivePoints(ShapeType.CIRCLE, this.size);

    //Assign a random fill to the child
    shape.fillColor = new Color().randomize();

    //Remove the border outline
    shape.borderColor = null;

    //Create the physics component for the child
    var phys = this.createComponent("PhysicsComponent");

    //Set the component to be kinematic
    phys.isKinematic = true;

    //Give the physics component a collider
    phys.collider = new CircleCollider();

    //Set the radius of the collider
    phys.collider.radius = this.size;

    //Set the collider to be a trigger
    phys.collider.isTrigger = true;
};

/*
    TestChildObj : onTrigger - Remove any TestObj that comes in contact with this object
    25/10/2016

    @param[in] pObj - The Game Object that triggered this event
*/
TestChildObj.prototype.onTrigger = function(pObj) {
    //Check the tag is that of a test object
    if (pObj.tag === "Test Object") {
        //Destroy that object
        //pObj.destroy();

        //Set as a child of this object
        //pObj.transform.parent = this.transform;

        //Set the physics component as kinematic
        //pObj.getComponentWithID(-2).isKinematic = true;
    }
};