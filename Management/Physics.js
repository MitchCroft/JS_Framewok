/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: Physics
 *      Author: Mitchell Croft
 *      Date: 30/09/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      Mat3.js
 *
 *      Purpose:
 *      Manage Physics for a number of objects that can be added
 *      and removed from the active monitoring and updating
 **/

/*
    Physics : Constructor - Intialise on file load for initial setup
    30/09/2016
*/
var Physics = new function() {
    /*  WARNING:
        Don't modify this internal object from the outside of the Physics Manager.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        //Store the direction and magnitude of gravity to be applied to Physics Objects
        gravity: new Vec2(),

        //Store ID progress for the current physics scene
        nextID: -1,

        //Store an array of the Rigid Body Physics Objects in the active physics scene
        physObjs: [],

        //How often physics calculations are run (Higher numbers will be less precise Physics but use less resources)
        timeStep: 1 / 30,

        //Calculates how much time has accumulated since the last Physics calculations
        timeAccumulation: 0,

        /*
            Physics : extender - Add additional functions and properties to the single Physics object
            30/09/2016

            @param[in] pCollection - An object containing the functions and properties to add to the 
                                     Physics object
        */
        extender: function(pCollection) {
            //Store the descriptor of the property extracted from the collection
            var description;

            //Loop through all properties inside the collection
            for (var prop in pCollection) {
                //Get the property descriptor for the prop value
                description = Object.getOwnPropertyDescriptor(pCollection, prop);

                //Apply the property if not undefined
                if (typeof description !== "undefined")
                    Object.defineProperty(Physics.__proto__, prop, description);
            }
        }
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Physics.__Internal__Dont__Modify__.extender({
    /*
        Physics : gravity - Get the value of gravity effecting all Rigid Body Physics Objects
        30/09/2016

        @return Vec2 - Returns a Vec2 object with the axis values

        Example:

        //Get the value of gravity effecting the scene
        var grav = Physics.gravity;
    */
    get gravity() {
        return this.__Internal__Dont__Modify__.gravity;
    },

    /*
        Physics : gravity - Set the direction and magnitude of gravity effecting all Rigid Body Physics Objects
        30/09/2016

        @param[in] pGrav - A Vec2 object holding the gravity axis values

        Example:

        //Set gravity to be acting down the screen
        Physics.gravity = new Vec2(0, 20);
    */
    set gravity(pGrav) {
        //Check that the value passed in is a Vec2
        if (!pGrav instanceof Vec2)
            throw new Error("Can not set Physics' gravity value to " + pGrav + " (Type '" + typeof pGrav + "'). Please use a Vec2 object");

        //Set the value
        this.__Internal__Dont__Modify__.gravity = pGrav;
    },

    /*
        Physics : timeStep - Get the current time step value that determines how often Physics calculations are run
        30/09/2016

        @return number - Returns the time step value as a number in seconds

        Example:

        //Get the current Physics time step
        var timeStep = Physics.timeStep;
    */
    get timeStep() {
        return this.__Internal__Dont__Modify__.timeStep;
    },

    /*
        Phsyics : timeStep - Set the current time step value to determine how often Physics calculations are run
        30/09/2016

        @param[in] pVal - A number representing the time step in seconds

        Example:

        //Make the physics calculations run every 1/4 of a second
        Physics.timeStep = 0.25;
    */
    set timeStep(pVal) {
        //Check the value is a number
        if (typeof pVal !== "number")
            throw new Error("Can not set the Physics time step to " + pVal + " (Type '" + typeof pVal + "') Please use a number in seconds");

        //Set the time step value
        this.__Internal__Dont__Modify__.timeStep = pVal;
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                                  Main Functions                                            ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //TODO
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ForceMode
 *      Author: Mitchell Croft
 *      Date: 23/10/2016
 *
 *      Purpose:
 *      Name the numerical values given to the different 
 *      modes of applying force
 **/
var ForceMode = { FORCE: 0, IMPULSE: 1 };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: PhysicsObject
 *      Author: Mitchell Croft
 *      Date: 30/09/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      Bounds.js
 *
 *      Purpose:
 *      Provide an object for the Physics manager object to 
 *      use and update in physics calculations
 **/

/*
    PhysicsObject : Constructor - Initialise with default values
    30/09/2016
*/
function PhysicsObject() {
    /*  WARNING:
        Don't modify this internal object from the outside of the Physics Object.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        //Flags if the Physics Object is active
        enabled: true,

        //Store the ID of the Physics Object in the Physics Scene
        ID: -1,

        //Store the flag for if this object is kinematic
        kino: false,

        //Store the position of the object
        pos: new Vec2(),

        //Store the position altering values
        vel: new Vec2(),
        acc: new Vec2(),

        //Store the rotation of the object
        rot: 0,

        //Store the rotation altering values
        angVel: 0,
        angAcc: 0,

        //Store the mass values
        mass: 1,
        invMass: 1,

        //Store the drag values
        drag: 0.1,
        angDrag: 0.05,

        //Store a reference to the collider used on this object
        collider: null,

        //Store the global bounding box of the collider attached
        glbBounds: null,
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

PhysicsObject.prototype = {
    /*
        PhysicsObject : enabled - Get's the enabled flag of the Physics Object
        03/10/2016

        @return bool - Returns true if the Physics Object is enabled

        Example:

        //Test if the Physics Object is active
        if (playerPhysObj.enabled) {
            //TODO: Do action
        }
    */
    get enabled() {
        return this.__Internal__Dont__Modify__.enabled;
    },

    /*
        PhysicsObject : enabled - Set the enabled state of the Physics Object
        03/10/2016

        @param[in] pState - A bool value representing the new enabled state

        Example:

        //Disable the player physics object
        playerPhysObj.enabled = false;
    */
    set enabled(pState) {
        //Check state is a bool
        if (typeof pState !== "boolean")
            throw new Error("Can not set Physics Object enabled to " + pState + " (Type '" + typeof pState + "') Please use a boolean value (True/False)");

        //Set the enabled state
        this.__Internal__Dont__Modify__.enabled = pState;
    },

    /*
        PhysicsObject : isKinematic - Returns a bool representing if the Physics 
                                      Object is effected by external physics
        30/09/2016

        @return bool - Returns true if the object is effected by external physics

        Example:

        //Check if physics object is kinematic
        if (physicsObject.isKinematic) {
            //TODO: Do stuff
        }
    */
    get isKinematic() {
        return this.__Internal__Dont__Modify__.kino;
    },

    /*
        PhysicsObject : iskinematic - Sets the kinematic flag for the current Physics
                                      object
        30/09/2016

        @param[in] pState - A bool value representing if the Physics Object should be 
                            effected by external physics

        Example:

        //Set the player's physics object to kinematic
        playerPhysObj.isKinematic = true;
    */
    set isKinematic(pState) {
        //Check the state is a bool flag
        if (typeof pState !== "boolean")
            throw new Error("Can not set Physics Object (" + this.__Internal__Dont__Modify__.ID + ") kinematic to " + pState + " (Type '" + typeof pState + "') Please use a bool value");

        //Set the state
        this.__Internal__Dont__Modify__.kino = pState;
    },

    /*
        PhysicsObject : position - Get's the position of the Physics Object in world space
        30/09/2016

        @return Vec2 - Returns the position as a Vec2 object

        Example:

        //Get the position of the players physics object
        var playPos = playerPhysObj.position;
    */
    get position() {
        return this.__Internal__Dont__Modify__.pos;
    },

    /*
        PhysicsObject : position - Set the position of the Physics Object in world space
        30/09/2016

        @param[in] pPos - A Vec2 object containing the new position values

        Example:

        //Reset the position of the players physics object
        playerPhysObj.position = new Vec2();
    */
    set position(pPos) {
        //Check the position is a Vec2 object
        if (!pPos instanceof Vec2)
            throw new Error("Can not set position to " + pPos + " (Type '" + typeof pPos + "') Please use a Vec2 object");

        //Set the position value
        this.__Internal__Dont__Modify__.pos = pPos;
    },

    /*
        PhysicsObject : velocity - Get's the velocity of the Physics Object
        30/09/2016

        @return Vec2 - Returns the velocity as a Vec2 object

        Example:

        //Get how fast the player is currently moving
        console.log(playerPhysObj.velocity.mag);
    */
    get velocity() {
        return this.__Internal__Dont__Modify__.vel;
    },

    /*
        PhysicsObject : velocity - Set the velocity of the Physics Object 
        30/09/2016

        @param[in] pVel - A Vec2 object containing the new velocity values

        Example:

        //Reset the velocity of the players physics object
        playerPhysObj.velocity = new Vec2();
    */
    set velocity(pVel) {
        //Check the velocity is a Vec2 object
        if (!pVel instanceof Vec2)
            throw new Error("Can not set velocity to " + pVel + " (Type '" + typeof pVel + "') Please use a Vec2 object");

        //Set the velocity value
        this.__Internal__Dont__Modify__.vel = pVel;
    },

    /*
        PhysicsObject : rotation - Get's the global rotation value of the Physics Object 
        30/09/2016

        @return number - Returns the global rotation as number in degrees

        Example:

        //Get the players physics object global rotation
        var playerRot = playerPhysObj.rotation;
    */
    get rotation() {
        return this.__Internal__Dont__Modify__.rot;
    },

    /*
        PhysicsObject : rotation - Set the global rotation value of the Physics Object
        30/09/2016

        @param[in] pRot - A number with the new rotation value in degrees

        Example:

        //Reset the players physics object global rotation
        playerPhysObj.rotation = 0;
    */
    set rotation(pRot) {
        //Check the rotation is a number
        if (typeof pRot !== "number")
            throw new Error("Can not set rotation to " + pRot + " (Type '" + typeof pRot + "') Please use a number in degrees");

        //Set the rotation value
        this.__Internal__Dont__Modify__.rot = cleanRotation(pRot);
    },

    /*
        PhysicsObject : angularVelocity - Get's the angular velocity of the Physics Object
        30/09/2016

        @return number - Returns the angular velocity as number in degrees per second

        Example:

        //Get the players physics object angular velocity
        var playerAngVel = playerPhysObj.angularVelocity;
    */
    get angularVelocity() {
        return this.__Internal__Dont__Modify__.angVel;
    },

    /*
        PhysicsObject : angularVelocity - Set the angular velocity of the Physics Object
        30/09/2016

        @param[in] pVel - A number with the angular velocity value in degrees per second

        Example:

        //Set the player to rotate a full revoloution per second
        playerPhysObj.angularVelocity = 360;
    */
    set angularVelocity(pVel) {
        //Check the velocity is a number
        if (typeof pVel !== "number")
            throw new Error("Can not set angular velocity to " + pVel + " (Type '" + typeof pVel + "') Please use a number in degrees per second");

        //Set the angular velocity value
        this.__Internal__Dont__Modify__.angVel = pVel;
    },

    /*
        PhysicsObject : mass - Get the mass of the Physics Object
        30/09/2016

        @return number - Returns a number representing the mass of the Physics Object

        Example:

        //Log the players mass
        console.log(playerPhysObj.mass);
    */
    get mass() {
        return this.__Internal__Dont__Modify__.mass;
    },

    /*
        PhysicsObject : mass - Set the mass of the Physics Object
        30/09/2016

        @param[in] pVal - A number representing the new mass of the Physics Object
                          This must be >= 0

        Example:

        //Set the mass of the players physics object
        playerPhysObj.mass = 5;
    */
    set mass(pVal) {
        //Check the value is a number
        if (typeof pVal !== "number")
            throw new Error("Can not set mass to " + pVal + " (Type '" + typeof pVal + "') Please use a number");

        //Set the mass value
        this.__Internal__Dont__Modify__.mass = Math.max(0, pVal);

        //Set the inverse mass value
        this.__Internal__Dont__Modify__.invMass = 1 / this.__Internal__Dont__Modify__.mass;
    },

    /*
        PhysicsObject : drag - Get's the drag of the Physics Object
        30/09/2016

        @return number - Returns a number representing the artificial drag scale 
                         acting on the Physics Object velocity

        Example:

        //Get the drag acting on the players physics object
        var drag = playerPhysObj.drag;
    */
    get drag() {
        return this.__Internal__Dont__Modify__.drag;
    },

    /*
        PhysicsObject : drag - Set the drag acting on the Physics Object
        30/09/2016

        @param[in] pVal - A number representing the drag scale acting on the Physics
                          Objects velocity (0 - 1)

        Example:

        //Remove all of the drag acting on the player
        playerPhysObj.drag = 0;
    */
    set drag(pVal) {
        //Check the value is a number
        if (typeof pVal !== "number")
            throw new Error("Can not set drag to " + pVal + " (Type '" + typeof pVal + "') Please use a number between 0 and 1");

        //Force the value to the 0 - 1 scale
        if (pVal < 0) pVal = 0;
        else if (pVal > 1) pVal = 1;

        //Set the drag value
        this.__Internal__Dont__Modify__.drag = pVal;
    },

    /*
        PhysicsObject : angularDrag - Get's the angular drag of the Physics Object
        30/09/2016

        @return number - Returns a number representing the artificial angular drag
                         scale acting on the Physics Object rotational velocity

        Example:

        //Get the angular drag acting on the players physics object
        var angularDrag = playerPhysObj.angularDrag;
    */
    get angularDrag() {
        return this.__Internal__Dont__Modify__.angDrag;
    },

    /*
        PhysicsObject : angularDrag - Set the angular drag acting on the Physics Object
        30/09/2016

        @parma[in] pVal - A number representing the angular drag scale acting on the 
                          Physics Objects rotational velocity

        Example:

        //Remove all of the angular drag acting on the player
        playerPhysObj.angularDrag = 0;
    */
    set angularDrag(pVal) {
        //Check the value is a number
        if (typeof pVal !== "number")
            throw new Error("Can not set angular drag to " + pVal + " (Type '" + typeof pVal + "') Please use a number between 0 and 1");

        //Force the value to the 0 - 1 scale
        if (pVal < 0) pVal = 0;
        else if (pVal > 1) pVal = 1;

        //Set the drag value
        this.__Internal__Dont__Modify__.angDrag = pVal;
    },

    /*
        PhysicsObject : collider - Get's the Collider object in use by the Physics Object
        30/09/2016

        @return ColliderBase - Returns the Collider object in use by this Physics Object that
                               inherits ColliderBase

        Example:

        //Get the collider from the players physics object
        var collider = playerPhysObj.collider;
    */
    get collider() {
        return this.__Internal__Dont__Modify__.collider;
    },

    /*
        PhysicsObject : collider - Set the collider object in use by the Physics Object
        30/09/2016

        @param[in] pCol - A Collider object that inherits ColliderBase or null to remove

        Example:

        //Set the players physics object to use a square collider
        playerPhysObj.collider = new BoxCollider();
    */
    set collider(pCol) {
        //Check if the value is null
        if (pCol === null) {
            //Nullify the collider object
            this.__Internal__Dont__Modify__.collider = null;

            //Clear the global bounds object
            this.__Internal__Dont__Modify__.glbBounds = null;

            return;
        }

        //Check the passed in object inherits collider base
        if (!pCol instanceof ColliderBase)
            throw new Error("Can not set collider to " + pCol + " (Type '" + typeof pCol + "') Please use a object that inherits from ColliderBase");

        //Set the collider value
        this.__Internal__Dont__Modify__.collider = pCol;
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    PhysicsObject : addForce - Add a force to the PhysicsObject, either as a force
                               or as an impulse
    23/10/2016

    @param[in] pForce - A Vec2 object containing the force to apply
    @param[in] pMode - A value defined in the ForceMode object that dictates
                       how the force value will be treated (Default ForceMode.FORCE)

    Example:

    //Add an explosive force to the player 
    playerPhysObj.addForce(explosionPos.subtract(playerPhysObj.position).normalize().multi(EXPLOSIVE_FORCE), ForceMode.IMPULSE);
*/
PhysicsObject.prototype.addForce = function(pForce, pMode) {
    //Clean the mode flag
    if (typeof pMode === "undefined")
        pMode = ForceMode.FORCE;

    //Switch on the type of force application
    switch (pMode) {
        case ForceMode.FORCE:
            //Add the force to the acceleration
            this.__Internal__Dont__Modify__.acc.addSet(pForce);
            break;
        case ForceMode.IMPULSE:
            //Add the force to the velocity
            this.__Internal__Dont__Modify__.vel.addSet(pForce);
            break;
        default:
            throw new Error("Can not apply force to Physics Object " + this + " with the mode " + pMode + " (Type '" + typeof pMode + "') Please use a value described in the ForceMode object");
    }
};

/*
    PhysicsObject : addTorque - Add a rotational force to the PhysicsObject, either as
                                a force or as an impulse
    23/10/2016

    @param[in] pTorque - A number defining the rotational force to apply 
    @param[in] pMode - A value defined in the ForceMode object that dictates
                       how the force value will be treated (Default ForceMode.FORCE)

    Example:

    //Add sudden rotational force to the player
    playerPhysObj.addTorque(FORCE_VALUE, ForceMode.IMPULSE);
*/
PhysicsObject.prototype.addTorque = function(pTorque, pMode) {
    //Clean the mode flag
    if (typeof pMode === "undefined")
        pMode = ForceMode.FORCE;

    //Switch on the type of force application
    switch (pMode) {
        case ForceMode.FORCE:
            //Add the force to the acceleration
            this.__Internal__Dont__Modify__.angAcc += pTorque;
            break;
        case ForceMode.IMPULSE:
            //Add the force to the velocity
            this.__Internal__Dont__Modify__.angVel += pTorque;
            break;
        default:
            throw new Error("Can not apply torque to Physics Object " + this + " with the mode " + pMode + " (Type '" + typeof pMode + "') Please use a value described in the ForceMode object");
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                Pipeline Functions                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    PhysicsObject : update - Update the PhysicsObject, applying queued forces.
                             This is called by the Physics Manager.
    23/10/2016

    @param[in] pDelta - The delta time for the current cycle
*/
PhysicsObject.prototype.update = function(pDelta) {
    //Apply the drag values
    this.__Internal__Dont__Modify__.acc.addSet(this.__Internal__Dont__Modify__.vel.negative.multiSet(this.__Internal__Dont__Modify__.drag));
    this.__Internal__Dont__Modify__.angAcc += -this.__Internal__Dont__Modify__.angVel * this.__Internal__Dont__Modify__.angDrag;

    //Add the force values
    this.__Internal__Dont__Modify__.vel.addSet(this.__Internal__Dont__Modify__.acc.multi(pDelta));
    this.__Internal__Dont__Modify__.angVel += this.__Internal__Dont__Modify__.angAcc * pDelta;

    //Modify the position and rotation values by velocity
    this.__Internal__Dont__Modify__.pos.addSet(this.__Internal__Dont__Modify__.vel.muti(pDelta));
    this.__Internal__Dont__Modify__.rot += this.__Internal__Dont__Modify__.angVel * pDelta;

    //Update the bounds object
    this.__Internal__Dont__Modify__.glbBounds = (this.__Internal__Dont__Modify__.collider instanceof ColliderBase ?
        this.__Internal__Dont__Modify__.collider.__Internal__Dont__Modify__.bounds.getGlobalBounds(createTranslationMat(this.__Internal__Dont__Modify__.pos.x, this.__Internal__Dont__Modify__.pos.y)) :
        null);

    //Reset the acceleration values
    this.__Internal__Dont__Modify__.acc.reset();
    this.__Internal__Dont__Modify__.angAcc = 0;
};

/*
    PhysicsObject : collidesWith - Checks if this PhysicsObject intersects
                                   with another. This is called by the Physics
                                   Manager.
    21/10/2016

    @param[in] pOther - The other Physics Obejct that collision is being checked against

    @return CollisionData - Returns a CollisionData object containing collision 
                            information or null if no collision
*/
PhysicsObject.prototype.collidesWith = function(pOther) {
    //Check the objects colliders are valid
    if (this.__Internal__Dont__Modify__.collider === null || pOther.__Internal__Dont__Modify__.collider === null)
        return null;

    //Preform preliminary check for collision
    if (!this.__Internal__Dont__Modify__.glbBounds.isIntersecting(pOther.__Internal__Dont__Modify__.glbBounds))
        return null;

    //Find the collision test to preform
    switch (this.__Internal__Dont__Modify__.collider.type | pOther.__Internal__Dont__Modify__.collider.type) {
        case ColliderType.BOX:

            break;
        case ColliderType.CIRCLE:

            break;
        case ColliderType.SHAPE:

            break;
        case (ColliderType.BOX | ColliderType.CIRCLE):

            break;
        case (ColliderType.BOX | ColliderType.SHAPE):

            break;
        case (ColliderType.CIRCLE | ColliderType.SHAPE):

            break;
        default:
            throw new Error("Can not test collision between the types " + this.collider.type + " and " + pOther.collider.type + ". Please check colliders are correct");
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Collider Type Defines                                        ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ColliderType
 *      Author: Mitchell Croft
 *      Date: 12/10/2016
 *
 *      Purpose:
 *      Provide a numerical value to the different type of 
 *      Collider objects that can be created
 */
var ColliderType = { NULL: -1, BOX: 1, CIRCLE: 2, SHAPE: 4 };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ColliderBase
 *      Author: Mitchell Croft
 *      Date: 03/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      Vec2.js, Bounds.js
 *
 *      Purpose:
 *      Provide a base point for other collider types to inherit
 *      from and allow for type testing.
 **/

/*
    ColliderBase - Abstract Constructor - Initialise with default values
    03/10/2016
*/
function ColliderBase() {
    //Enfore abstract nature of the ColliderBase
    if (this.constructor === ColliderBase) throw new Error("Can not instantiate the abstract ColliderBase. Use a BoxCollider, CircleCollider or ShapeCollider");

    /*  WARNING:
        Don't modify this internal object from the outside of the Collider object.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        //Store the enabled flag of the collider
        enabled: true,

        //Store the offset from the center position in global space
        offset: new Vec2(),

        //Flags if this collider is a trigger or solid
        trigger: false,

        //Store the center of mass offset for the collider (Will remain at 0,0 unless collider is a shape collider)
        COMOffset: new Vec2(),

        //Store the axis aligned bounds of the collider for quick elimination
        bounds: new Bounds(),
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ColliderBase.prototype = {
    /*
        ColliderBase : type - Returns the type of collider the obejct is
        12/10/2016

        @return ColliderType - Returns a number defined in the ColliderType object

        Example:

        //Check if the collider is a square collider
        if (playerCollider.type !== ColliderType.NULL) {
            //TODO: Do something
        }
    */
    get type() {
        return ColliderType.NULL;
    },

    /*
        ColliderBase : enabled - Get's the enabled flag of the Collider object
        03/10/2016

        @return bool - Return's true if the Collider is enabled

        Example:

        //Check if the players collider is enabled
        if (playerCollider.enabled) {
            //Do something...
        }
    */
    get enabled() {
        return this.__Internal__Dont__Modify__.enabled;
    },

    /*
        ColliderBase : enabled - Set the enabled flag of the Collider object
        03/10/2016

        @param[in] pState - A bool value representing the new enabled state

        Example:

        //Disable the players collider
        playerCollider.enabled = false;
    */
    set enabled(pState) {
        //Check state is a bool
        if (typeof pState !== "boolean")
            throw new Error("Can not set Collider enabled to " + pState + " (Type '" + typeof pState + "') Please use a boolean value (True/False)");

        //Set the enabled state
        this.__Internal__Dont__Modify__.enabled = pState;
    },

    /*
        ColliderBase : offset - Get's the offset of the collider
        03/10/2016

        @return Vec2 - Returns a Vec2 object containing the offset values

        Example:

        //Get the player colliders offset
        var playColOffset = playerCollider.offset;
    */
    get offset() {
        return this.__Internal__Dont__Modify__.offset;
    },

    /*
        ColliderBase : offset - Set the offset of the collider from the Physics Objects center position
        03/10/2016

        @param[in] pOff - A Vec2 object containing the offset values

        Example:

        //Set the offset of the players collider
        playerCollider.offset = new Vec2(0, 0.5);
    */
    set offset(pOff) {
        //Test the offset value is a Vec2 object
        if (!pOff instanceof Vec2)
            throw new Error("Can not set collider offset to " + pOff + " (Type '" + typeof pOff + "') Please use a Vec2 object");

        //Set the offset values
        this.__Internal__Dont__Modify__.offset.set(pOff);
    },

    /*
        ColliderBase : isTrigger - Get's the trigger state for the collider
        03/10/2016

        @return bool - Returns true if the Collider object is a trigger

        Example:

        //Check if the player is a trigger
        if (playerCollider.isTrigger) {
            //Do something
        }
    */
    get isTrigger() {
        return this.__Internal__Dont__Modify__.trigger;
    },

    /*
        ColliderBase : isTrigger - Set's the trigger flag for the collider
        03/10/2016

        @param[in] pState - A bool value representing the trigger state of the collider

        Example:

        //Set the pickup collider as a trigger
        pickupCollider.isTrigger = true;
    */
    set isTrigger(pState) {
        //Check state is bool
        if (typeof pState !== "boolean")
            throw new Error("Can not set collider isTrigger to " + pState + " (Type '" + typeof pState + "') Please use a boolean value (True/False");

        //Set the trigger state
        this.__Internal__Dont__Modify__.trigger = pState;
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: BoxCollider
 *      Author: Mitchell Croft
 *      Date: 21/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      ExtendProperties.js
 *
 *      Purpose:
 *      Define a square area that acts as the collision
 *      area of the collider
 **/

/*
    BoxCollider : Constructor - Initialise with default values
    21/10/2016

    Example:

    //Create a collider for the player
    playerPhysObj.collider = new BoxCollider();
*/
function BoxCollider() {
    //Call the Collider Base base for initial setup
    ColliderBase.call(this);

    //Store the extents of the collider
    this.__Internal__Dont__Modify__.extents = new Vec2(1);
};

//Apply the ColliderBase prototype
BoxCollider.prototype = Object.create(ColliderBase.prototype);
BoxCollider.prototype.constructor = BoxCollider;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ExtendProperties(BoxCollider, {
    /*
        BoxCollider : type - Returns the type of collider the obejct is
        21/10/2016

        @return ColliderType - Returns a number defined in the ColliderType object

        Example:

        //Check if the collider is a square collider
        if (playerCollider.type === ColliderType.BOX) {
            //TODO: Do something
        }
    */
    get type() {
        return ColliderType.BOX;
    },

    /*
        BoxCollider : extents - Get the extents of the area covered by this collider
        21/10/2016

        @return Vec2 - Return the extents stored in a Vec2 object

        Example:

        //Get the extents of the players box collider
        var playerExtents = playerBoxCollider.extents;
    */
    get extents() {
        return this.__Internal__Dont__Modify__.extents;
    },

    /*
        BoxCollider : extents - Set the collider extents of the Box Collider
        21/10/2016

        @param[in] pExt - A Vec2 object storing the new extents of the collider (>= 0)

        Example:

        //Set the starting extents of the player's box collider
        playerBoxCollider = new Vec2(3, 4);
    */
    set extents(pExt) {
        //Check the value is a Vec2 object
        if (!pExt instanceof Vec2)
            throw new Error("Can not set the extents to " + pExt + " (Type '" + typeof pExt + "') Please use a Vec2 object");

        //Set the extents
        this.__Internal__Dont__Modify__.extents.set(pExt);

        //Ensure extents are >= 0
        this.__Internal__Dont__Modify__.extents.x = Math.max(this.__Internal__Dont__Modify__.extents.x, 0);
        this.__Internal__Dont__Modify__.extents.y = Math.max(this.__Internal__Dont__Modify__.extents.y, 0);

        //Update the bounds of the collider
        this.updateBounds();
    },

    /*
        BoxCollider : extentX - Get the X axis extent of the collider
        21/10/2016

        @return number - Returns the extent of the X axis as a number

        Example:

        //Get the X extent of the player
        var XExtent = playerBoxCollider.extentX;
    */
    get extentX() {
        return this.__Internal__Dont__Modify__.extents.x;
    },

    /*
        BoxCollider : extentX - Set the X axis extent of the collider
        21/10/2016

        @param[in] pVal - A number defining the new X extent length

        Example:

        //Set the players X extent length
        playerBoxCollider.extentX = 4;
    */
    set extentX(pVal) {
        //Check the value is a number
        if (typeof pVal !== "number")
            throw new Error("Can not set the X extent of the Box Collider to " + pVal + " (Type '" + typeof pVal + "') Please use a number");

        //Set the new extent value
        this.__Internal__Dont__Modify__.extents.x = Math.max(pVal, 0);

        //Update the bounds of the collider
        this.updateBounds();
    },

    /*
        BoxCollider : extentY - Get the Y axis extent of the collider
        21/10/2016

        @return number - Returns the extent of the Y axis as a number

        Example:

        //Get the Y extent of the player
        var YExtent = playerBoxCollider.extentY;
    */
    get extentY() {
        return this.__Internal__Dont__Modify__.extents.y;
    },

    /*
        BoxCollider : extentY - Set the Y axis extent of the collider
        21/10/2016

        @param[in] pVal 0 A number defining the new Y extent length

        Example:

        //Set the players Y extent length
        playerBoxCollider.extentY = 2;
    */
    set extentY(pVal) {
        //Check the value is a number
        if (typeof pVal !== "number")
            throw new Error("Can not set the Y extent of the Box Collider to " + pVal + " (Type '" + typeof pVal + "') Please use a number");

        //Set the new extent value
        this.__Internal__Dont__Modify__.extents.y = Math.max(pVal, 0);

        //Update the bounds of the collider
        this.updateBounds();
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    BoxCollider : updateBounds - Update the colliders bounds object
    21/10/2016
    
    Example:

    //Force the bounds of the collider to update
    playerBoxCollider.updateBounds();
*/
BoxCollider.prototype.updateBounds = function() {
    //Update the min/ max of the bounds based on the extents
    this.__Internal__Dont__Modify__.bounds.min = new Vec2(-this.__Internal__Dont__Modify__.extents.x / 2, -this.__Internal__Dont__Modify__.extents.y / 2);
    this.__Internal__Dont__Modify__.bounds.max = new Vec2(this.__Internal__Dont__Modify__.extents.x / 2, this.__Internal__Dont__Modify__.extents.y / 2);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: CircleCollider
 *      Author: Mitchell Croft
 *      Date: 21/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      ExtendProperties.js
 *
 *      Purpose:
 *      Define a circle area that acts as the collision
 *      area of the collider
 **/

/*
    CircleCollider : Constructor - Initialise with default values
    21/10/2016

    Example:

    //Create a collider for the player
    playerPhysObj.collider = new CircleCollider();
*/
function CircleCollider() {
    //Call the Collider Base base for initial setup
    ColliderBase.call(this);

    //Store the radius of the collider
    this.__Internal__Dont__Modify__.radius = 1;
};

//Apply the ColliderBase prototype
CircleCollider.prototype = Object.create(ColliderBase.prototype);
CircleCollider.prototype.constructor = CircleCollider;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ExtendProperties(CircleCollider, {
    /*
        CircleCollider : type - Returns the type of collider the obejct is
        21/10/2016

        @return ColliderType - Returns a number defined in the ColliderType object

        Example:

        //Check if the collider is a square collider
        if (playerCollider.type === ColliderType.CIRCLE) {
            //TODO: Do something
        }
    */
    get type() {
        return ColliderType.CIRCLE;
    },

    /*
        CircleCollider : radius - Get the radius of the Circle Collider
        21/10/2016

        @return number - Returns the radius as a number

        Example:

        //Get the radius of the players circle collider
        var radius = playerCircleCollider.radius;
    */
    get radius() {
        return this.__Internal__Dont__Modify__.radius;
    },

    /*
        CircleCollider : radius - Set the radius of the Circle Collider
        21/10/2016

        @param[in] pVal - Set the radius of the Circle Collider (>= 0)

        Example:

        //Set the players starting radius
        playerCircleCollider.radius = 10;
    */
    set radius(pVal) {
        //Check the value is a number
        if (typeof pVal === "number")
            throw new Error("Can not set the radius of the Circle Collider to " + pVal + " (Type '" + typeof pVal + "') Please use a number");

        //Set the radius 
        this.__Internal__Dont__Modify__.radius = Math.max(pVal, 0);

        //Update the bounds of the collider
        this.updateBounds();
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    CircleCollider : updateBounds - Update the colliders bounds object
    21/10/2016

    Example:

    //Force the bounds of the collider to update
    playerCircleCollider.updateBounds();
*/
CircleCollider.prototype.updateBounds = function() {
    //Update the min/ max of the bounds based on the radius
    this.__Internal__Dont__Modify__.bounds.min = new Vec2(-this.__Internal__Dont__Modify__.radius);
    this.__Internal__Dont__Modify__.bounds.max = new Vec2(this.__Internal__Dont__Modify__.radius);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ShapeCollider
 *      Author: Mitchell Croft
 *      Date: 21/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      ExtendProperties.js
 *
 *      Purpose:
 *      Define a custom area that acts as the collision 
 *      area of the collider
 **/

/*
    ShapeCollider : Constructor - Initialise with default values
    21/10/2016

    Example:

    //Create a collider for the player
    playerPhysObj.collider = new ShapeCollider();
*/
function ShapeCollider() {
    //Call the Collider Base base for initial setup
    ColliderBase.call(this);

    //Store the points of the shape
    this.__Internal__Dont__Modify__.points = [new Vec2(), new Vec2(), new Vec2()];
};

//Apply the ColliderBase prototype
ShapeCollider.prototype = Object.create(ColliderBase.prototype);
ShapeCollider.prototype.constructor = ShapeCollider;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ExtendProperties(ShapeCollider, {
    /*
        ShapeCollider : type - Returns the type of collider the obejct is
        21/10/2016

        @return ColliderType - Returns a number defined in the ColliderType object

        Example:

        //Check if the collider is a square collider
        if (playerCollider.type === ColliderType.SHAPE) {
            //TODO: Do something
        }
    */
    get type() {
        return ColliderType.SHAPE;
    },

    /*
        ShapeCollider : points - Get the points that make up the custom shape
        21/10/2016

        @return Vec2 array - Returns an array of Vec2 objects

        Example:

        //Get the points that make up the custom collider
        var colliderPoints = playerShapeCollider.points;
    */
    get points() {
        return this.__Internal__Dont__Modify__.points;
    },

    /*
        ShapeCollider : points - Set the points used to define the custom collision area
        21/10/2016

        @param pPoints - An array of Vec2 objects containing the position data for
                         the different points (Minimum of 3 points)

        Example:

        //Set the collision points for the player collider
        playerShapeCollider.points = [new Vec2(0, -0.5), new Vec2(0.5, 0.5), new Vec2(-0.5, 0.5)];
    */
    set points(pPoints) {
        //Check to ensure that the points are an array
        if (!pPoints instanceof Array)
            throw new Error("Can not set Shape Collider points to " + pPoints + " (Type '" + typeof pPoints + "') Please use an array of Vec2 objects with at least 3 points");

        //Check there are at least of 3 points
        if (pPoints.length < 3)
            throw new Error("Can not set Shape Collider points with " + pPoints.length + " as there must be at least 3 points to make a shape. Please supply an array of at least three points");

        //Store a temporary array to store values
        var temp = [];

        //Check all objects in the array are Vec2 
        for (var i = 0; i < pPoints.length; i++) {
            //Check the value is a Vec2 
            if (pPoints[i] instanceof Vec2)
                temp[i] = pPoints[i];

            //Otherwise throw an error
            else throw new Error("Can not set points data with a value of " + pPoints[i] + " (Type '" + typeof pPoints[i] + "') Please only use Vec2 objects");
        }

        //Set the colliders points to the temp array
        this.__Internal__Dont__Modify__.points = temp;

        //Update the bounds of the collider
        this.updateBounds();
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    ShapeCollider : updateBounds - Update the colliders bounds object
    21/10/2016

    Example:

    //Force the bounds of the collider to update
    playerShapeCollider.updateBounds();
*/
ShapeCollider.prototype.updateBounds = function() {
    //Assign the bounds object the collision points
    this.__Internal__Dont__Modify__.bounds.points = this.__Internal__Dont__Modify__.points;

    //Reset the center of mass
    this.__Internal__Dont__Modify__.COMOffset.reset();

    //Add all cordinate values together
    for (var i = 0; i < this.__Internal__Dont__Modify__.points.length; i++)
        this.__Internal__Dont__Modify__.COMOffset.addSet(this.__Internal__Dont__Modify__.points[i]);

    //Take the avergae to find the center of mass
    this.__Internal__Dont__Modify__.COMOffset.divSet(this.__Internal__Dont__Modify__.points.length);
};