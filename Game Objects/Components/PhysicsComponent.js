/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: PhysicsComponent
 *      Author: Mitchell Croft
 *      Date: 24/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      ComponentBase.js, Physics.js, ExtendProperties.js
 *
 *      Purpose:
 *      Provide a method of simulating physics for 
 *      Game Objects within a Scene. It is applied
 *      to a GameObject. These will not persist per
 *      Scene and as such should be recreated whenever
 *      a new scene is loaded.
 **/

/*
    PhysicsComponent : Constructor - Initialise with default values
    23/10/2016

    Example:

    var phys = customObject.createComponent("PhysicsComponent");

    OR

    //Create a new physics component
    var phys = new PhysicsComponent();

    //Add physics component to the custom object
    customObject.addComponent(phys);
*/
function PhysicsComponent() {
    //Call the Component Base Constructor for initial setup.
    ComponentBase.call(this, ComponentID.PHYSICS);

    //Store a reference to the Physics Body this component wraps
    this.__Internal__Dont__Modify__.body = null;
};

//Apply the ComponentBase prototype
PhysicsComponent.prototype = Object.create(ComponentBase.prototype);
PhysicsComponent.prototype.constructor = PhysicsComponent;

ExtendProperties(PhysicsComponent, {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                               Property Definitions                                         ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
        PhysicsComponent : enabled - Get's the enabled flag of the component
        24/10/2016

        @return bool - Returns true if the component is currently active

        Example:

        //Check if the players physics component is enabled
        if (playerPhysComp.enabled) {
            //TODO: Do stuff
        }
    */
    get enabled() {
        return this.__Internal__Dont__Modify__.enabled;
    },

    /*
        PhysicsComponent : enabled - Set the enabled flag for the component
        24/10/2016

        @param[in] pState - A bool value representing the enabled state of the component

        Example:

        //Disable the players physics component
        playerPhysComp.enabled = false;
    */
    set enabled(pState) {
        //Set the components flag
        this.__Internal__Dont__Modify__.enabled = pState;

        //Set the internal Physics Object's flag
        this.__Internal__Dont__Modify__.body.enabled = pState;
    },

    /*
        PhysicsComponent : isKinematic - Returns a bool representing if the Physics 
                                         Component is effected by external physics
        24/10/2016

        @return bool - Returns true if the component is effected by external physics

        Example:

        //Check if the physics component is kinematic
        if (playerPhysComp.isKinematic) {
            //TODO: Do stuff
        }
    */
    get isKinematic() {
        return this.__Internal__Dont__Modify__.body.isKinematic;
    },

    /*
        PhysicsComponent : isKinematic - Sets the kinematic flag for the current Physics 
                                         Component
        24/10/2016

        @param[in] pState - A bool value representing if the Physics Component should be 
                            effected by external physics

        Example:

        //Set the player's phsyics component to kinematic
        playerPhysComp.isKinematic = true;
    */
    set isKinematic(pState) {
        this.__Internal__Dont__Modify__.body.isKinematic = pState;
    },

    /*
        PhysicsComponent : velocity - Get's the velocity of the Physics Component
        24/10/2016

        @return Vec2 - Returns the velocity as a Vec2 object

        Example:

        //Get how fast the player is currently moving
        console.log(playerPhysComp.velocity.mag);
    */
    get velocity() {
        return this.__Internal__Dont__Modify__.body.velocity;
    },

    /*
        PhysicsComponent : velocity - Set the velocity of the Physics Component
        24/10/2016

        @param[in] pVel - A Vec2 object containing the new velocity values

        Example:

        //Reset the velocity of the player physics component
        playerPhysComp.velocity = new Vec2();
    */
    set velocity(pVel) {
        this.__Internal__Dont__Modify__.body.velocity = pVel;
    },

    /*
        PhysicsComponent : angularVelocity - Get's the angular velocity of the Physics Object
        24/10/2016

        @return number - Returns the angular velocity as a number in degrees per second

        Example:

        //Get the players physics component angular velocity
        var playerAngVel = playerPhysComp.angularVelocity;
    */
    get angularVelocity() {
        return this.__Internal__Dont__Modify__.body.angularVelocity;
    },

    /*
        PhysicsComponent : angularVelocity - Set the angular velocity of the Physics Component
        24/10/2016

        @param[in] pVel - A number with the angular velocity value in degrees per second

        Example:

        //Set the player to rotate a full revolution per second
        playerPhysComp.angularVelocity = 360;
    */
    set angularVelocity(pVel) {
        this.__Internal__Dont__Modify__.body.angularVelocity = pVel;
    },

    /*
        PhysicsComponent : mass - Get the mass of the Physics Component
        24/10/2016

        @return number - Returns a number representing the mass of the Physics Component

        Example:

        //Log the players mass
        console.log(playerPhysComp.mass);
    */
    get mass() {
        return this.__Internal__Dont__Modify__.body.mass;
    },

    /*
        PhysicsComponent : mass - Set the mass of the Physics Component
        24/10/2016

        @param[in] pVal - A number representing the new mass of the Physics Component
                          This must be >= 0

        Example:

        //Set the mass of the players physics component
        playerPhysComp.mass = 5;
    */
    set mass(pVal) {
        this.__Internal__Dont__Modify__.body.mass = pVal;
    },

    /*
        PhysicsComponent : drag - Get's the drag of the Physics Component
        24/10/2016

        @return number - Returns a numebr representing the artificial drag scale 
                         acting on the Phsyics Component's velocity

        Example:

        //Get the drag acting on the players physics component object
        var drag = playerPhysComp.drag;
    */
    get drag() {
        return this.__Internal__Dont__Modify__.body.drag;
    },

    /*
        PhysicsComponent : drag - Set the drag acting on the Physics Component
        24/10/2016

        @param[in] pVal - A number representing the drag scale acting on the Physics
                          Components velocity (0 - 1)

        Example:

        //Remove all of the drag acting on the player
        playerPhysComp.drag = 0;
    */
    set drag(pVal) {
        this.__Internal__Dont__Modify__.body.drag = pVal;
    },

    /*
        PhysicsComponent : angularDrag - Get's the angular drag of the Physics Component
        24/10/2016

        @return number - returns a number representing the artifical angular drag scale
                         acting on the Phsyics Components rotational velocity

        Example:

        //Get the angular drag acting on the players physics component
        var angularDrag = playerPhysComp.angularDrag;
    */
    get angularDrag() {
        return this.__Internal__Dont__Modify__.body.angularDrag;
    },

    /*
        PhysicsComponent : angularDrag - Set the angular drag acting on the Physics Component
        24/10/2016

        @param[in] pVal - A number representing the angular drag scale acting on the
                          Physics Components rotational velocity

        Example:

        /?Remove all of the angular drag acting on the player
        playerPhysComp.angularDrag = 0;
    */
    set angularDrag(pVal) {
        this.__Internal__Dont__Modify__.body.angularDrag = pVal;
    },

    /*
        PhysicsComponent : collider - Gets the collider object in use by the Physics Component
        24/10/2016

        @return ColliderBase - Returns the Collider object in use by this Phsyics Component
                               that inherits from ColliderBase

        Example:

        //Get the collider from the players physics component
        var collider = playerPhysComp.collider;
    */
    get collider() {
        return this.__Internal__Dont__Modify__.body.collider;
    },

    /*
        PhysicsComponent : collider - set the collider object in use by the Physics Component
        24/10/2016

        @param[in] pCol - A Collider object that inherits from ColliderBase or null to remove it

        Example:

        //Set the players physics component to use a box collider
        playerPhysComp.collider = new BoxCollider();
    */
    set collider(pCol) {
        this.__Internal__Dont__Modify__.body.collider = pCol;
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Force Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
        PhysicsComponent : addForce - Add a force to hte Physics Component, either as a force
                                      or as an impulse
        24/10/2016

        @param[in] pForce - A Vec2 object containing the force to apply
        @param[in] pMode - A value defined in the ForceMode object that dictates
                           how the force value will be treated (Default ForceMode.FORCE)

        Example:

        //Add a sudden force to the player
        playerPhysComp.addForce(HEADING_VEC2.multi(SPEED_FORCE), ForceMode.IMPULSE);
    */
PhysicsComponent.prototype.addForce = function(pForce, pMode) {
    this.__Internal__Dont__Modify__.body.addForce(pForce, pMode);
};

/*
    PhysicsComponent : addTorque - Add a rotational force to the Physics Component, either as
                                   a force or as an impulse
    24/10/2016

    @param[in] pTorque - A number defining the rotational force to apply 
    @param[in] pMode - A value defined in the ForceMode object that dictates
                       how the force value will be treated (Default ForceMode.FORCE)

    Example:

    //Add sudden rotational force to the player
    playerPhysComp.addTorque(FORCE_VALUE, ForceMode.IMPULSE);
*/
PhysicsComponent.prototype.addTorque = function(pTorque, pMode) {
    this.__Internal__Dont__Modify__.body.addTorque(pTorque, pMode);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                             Callback Functions                                             ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    PhysicsComponent : triggerCallbackEvent - If the Physics Object associated with this 
                                              component encounters a trigger event run the
                                              trigger event on the owner Game Object
    25/10/2016

    @param[in] pObj - The Physics Object that raised the trigger event
*/
PhysicsComponent.prototype.triggerCallbackEvent = function(pObj) {
    //Check the storage of the physics Object for a Game Object
    if (pObj.storage instanceof GameObject) {
        //Check the owner of this Game Object has set the ontrigger function
        if (this.__Internal__Dont__Modify__.owner.onTrigger !== null)
            this.__Internal__Dont__Modify__.owner.onTrigger(pObj.storage);
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Definitions                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    PhysicsComponent : update - Update the positional values of the internal Physics Object
    24/10/2016
*/
PhysicsComponent.prototype.update = function() {
    this.__Internal__Dont__Modify__.body.position = this.__Internal__Dont__Modify__.owner.transform.position;
    this.__Internal__Dont__Modify__.body.rotation = this.__Internal__Dont__Modify__.owner.transform.rotation;
};

/*
    PhysicsComponent : lateUpdate - Update the positional values of the owner's transform
                                    based on the values of the internal Physics Object
    24/10/2016
*/
PhysicsComponent.prototype.lateUpdate = function() {
    this.__Internal__Dont__Modify__.owner.transform.position = this.__Internal__Dont__Modify__.body.position;
    this.__Internal__Dont__Modify__.owner.transform.rotation = this.__Internal__Dont__Modify__.body.rotation;
};

/*
    PhysicsComponent : transferOwnership - Transfer the ownership of this component to another
                                           Game Object
    25/10/2016

    @param[in] pObj - The Game Object to transfer ownership to
*/
PhysicsComponent.prototype.transferOwnership = function(pObj) {
    //Check the object value
    if (pObj !== null && !pObj instanceof GameObject)
        throw new Error("Can not assign " + pObj + " (Type: '" + typeof pObj + "') as the owner of " + this + ". Please only assign null or a Game Object instance");

    //Set the owner variable
    this.__Internal__Dont__Modify__.owner = pObj;

    //Create the new Physics Object if the owner is valid
    if (this.__Internal__Dont__Modify__.owner) {
        //If there is already a physics body, delete it
        if (this.__Internal__Dont__Modify__.body)
            Physics.removeObject(this.__Internal__Dont__Modify__.body);

        //Create a new Physics Object
        this.__Internal__Dont__Modify__.body = new PhysicsObject();

        //Assign the owner game object to the Physics body
        this.__Internal__Dont__Modify__.body.storage = this.__Internal__Dont__Modify__.owner;

        //Assign the callback function to the Physics Body for a trigger interaction
        this.__Internal__Dont__Modify__.body.addTriggerEvent(this.triggerCallbackEvent.bind(this));

        //Add to the Physics Object to the physics scene
        Physics.addObject(this.__Internal__Dont__Modify__.body);
    }

    //Otherwise clear the any Physics Object
    else if (this.__Internal__Dont__Modify__.body) {
        //Remove the Physics Body from the Phsyics scene
        Physics.removeObject(this.__Internal__Dont__Modify__.body);

        //Nullify the Physics Object
        this.__Internal__Dont__Modify__.body = null;
    }
};

/*
    PhysicsComponent : dispose - Remove the internal Physics Object from the current Physics Scene
    24/10/2016
*/
PhysicsComponent.prototype.dispose = function() {
    //Check if there is a Physics Object
    if (this.__Internal__Dont__Modify__.body) {
        //Remove the Physics Object from the scene
        Physics.removeObject(this.__Internal__Dont__Modify__.body);

        //Nullify the variable
        this.__Internal__Dont__Modify__.body = null;
    }
};