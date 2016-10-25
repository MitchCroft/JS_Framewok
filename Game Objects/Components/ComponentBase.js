/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                   Component IDs                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ComponentID
 *      Author: Mitchell Croft
 *      Date: 25/10/2016
 *
 *      Purpose:
 *      Provide labels to the number ID's for
 *      the pre-made components
 **/

var ComponentID = { SHAPE: -1, PHYSICS: -2, PARTICLES: -3 };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ComponentBase
 *      Author: Mitchell Croft
 *      Date: 31/08/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      GameObject.js
 *
 *      Purpose:
 *      Provide a base point for newly defined components to inherit 
 *      from for addition and use with Game Objects
 *
 *      Example:
 *
 *      //Define a simple square component
 *      function SquareComponent() {
 *          //Call the Component Base Constructor for initial setup. First custom component has 0 as its ID value
 *          ComponentBase.call(this, 0);    
 *
 *          //Define the points of the square
 *          this.min = {x:0, y:0};
 *          this.max = {x:0, y:0};
 *      };
 *
 *      //Apply the ComponentBase prototype
 * SquareComponent.prototype = Object.create(ComponentBase.prototype);
 *      SquareComponent.prototype.constructor = SquareComponent;
 **/

/*
    ComponentBase : Abstract Constructor - Initialise with default values
    31/08/2016

    @param[in] pID - A unique ID number given to different types of components
                     to enable searches through Game object lists. User defined
                     components should be greater than or equal to 0. Use unique 
                     identifiers otherwise the wrong objects may be found in searches
*/
function ComponentBase(pID) {
    //Enfore abstract nature of the ComponentBase
    if (this.constructor === ComponentBase) throw new Error("Can not instantiate the abstract ComponentBase. Create a seperate object which inherits from ComponentBase");

    //Enforce a component ID value being set
    if (typeof pID !== "number") throw new Error("Can not instantiate the new Component as a unique identifier has not be set. Ensure the identifier is greater than or equal to zero and unique for each type of custom component to prevent errors in Game Object search functions");

    //Store the local space bounds for the component
    this.lclBounds = new Bounds();

    /*  WARNING:
        Don't modify this internal object from the outside of the Component Base.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        ID: pID,
        owner: null, //This value is set when the component is added/removed from a GameObject

        enabled: true,

        destroy: false,
        disposed: false,
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ComponentBase.prototype = {
    /*
        ComponentBase : ID - Get the ID value of the Component object
        31/08/2016

        @return number - Returns the ID number of the Component object

        Example:

        //Get the ID value of component
        var compID = CustomComponent.ID;
    */
    get ID() {
        return this.__Internal__Dont__Modify__.ID;
    },

    /*
        ComponentBase : owner - Returns the Game Object that owns the component
        31/08/2016

        @return GameObject - Returns a reference to the Game Object that owns this component or null if none

        Example:

        //Define the drawing function for the custom component
        CustomComponent.prototype.draw = function(pCtx) {
            //Get the global transform of the parent object
            var glblMat = this.owner.transform.globalMatrix;
        };
    */
    get owner() {
        return this.__Internal__Dont__Modify__.owner;
    },

    /*
        ComponentBase : enabled - Returns the enabled flag for the current component
        23/09/2016

        @return bool - Returns true if the component is currently active

        Example:

        //Check if the custom component is enabled
        if (customComponent.enabled) {
            //TODO: Do stuff
        }
    */
    get enabled() {
        return this.__Internal__Dont__Modify__.enabled;
    },

    /*
        ComponentBase : enabled - Set the enabled flag for the current component
        23/09/2016

        @param[in] pState - A bool value representing the enabled state of the component

        Example:

        //Disable the custom component
        customComponent.enabled = false;
    */
    set enabled(pState) {
        this.__Internal__Dont__Modify__.enabled = pState;
    },

    /*
        ComponentBase : disposed - Returns the disposal state of this Component
        23/09/2016

       @return bool - Returns true if the Component has been disposed of and
                      is unusable

        Example:

        //Check if custom component can be used
        if (!customComponent.disposed) {
            //TODO: Use component
        }
    */
    get disposed() {
        return this.__Internal__Dont__Modify__.disposed;
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Pipeline Functions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    ComponentBase : transferOwnership - Transfer the ownership of this component to a specified 
                                        Game Object. This function can be overriden by custom
                                        components if values need to be modified on owner change
    25/10/2016

    @param[in] pObj - The new Game Object that will be assigned as the owner
*/
ComponentBase.prototype.transferOwnership = function(pObj) {
    //Check the object value
    if (pObj !== null && !pObj instanceof GameObject)
        throw new Error("Can not assign " + pObj + " (Type: '" + typeof pObj + "') as the owner of " + this + ". Please only assign null or a Game Object instance");

    //Assign the owner game object
    this.__Internal__Dont__Modify__.owner = pObj;
};

/*
    ComponentBase : internalDispose - Clear up internal values and call the user defined dispose
                                      function if defined. This is called by the scene management 
                                      and shouldn't be explicitly called elsewhere.
    23/09/2016
*/
ComponentBase.prototype.internalDispose = function() {
    //Call the dispose function
    if (this.dispose !== null)
        this.dispose();

    //Clear the owner
    this.transferOwnership(null);

    //Set the diposed flag
    this.__Internal__Dont__Modify__.disposed = true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  General Function                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    ComponentBase : destroy - Flag this component to be destroyed and removed
    23/09/2016

    Example:

    //Remove the custom component from an object
    customComponent.destroy();
*/
ComponentBase.prototype.destroy = function() {
    this.__Internal__Dont__Modify__.destroy = true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Definitions                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    ComponentBase : update - An empty update function which can be filled to allow for component
                             values to be updated after the Game Object owning it. 
    31/08/2016

    @param[in] number - If function is defined a number will be passed into the function that 
                        contains the delta time for the current cycle

    Example:

    //Fluctuate the size of the square over time
    SquareComponent.prototype.update = function(pDelta) {
        this.min.x = this.min.y =  Math.sin(Date.now() * 0.001);
        this.max.x = this.max.y = -Math.sin(Date.now() * 0.001);
    };
*/
ComponentBase.prototype.update = null;

/*
    ComponentBase : lateUpdate - An empty late update function which can be filled to allow for
                                 component values to be updated after the Physics calculations
                                 for the cycle are evaluated.
    03/10/2016

    @param[in] number - If function is defined a number will be passed into the function that 
                        contains the delta time for the current cycle

    Example:

    //Update the direction to a target
    DirectionsComponent.prototype.lateUpdate = function(pDelta) {
        //Get new direction after physics update
        this.direction = this.target.transform.position.subtract(this.owner.transform.position).normalize();
    };
*/
ComponentBase.prototype.lateUpdate = null;

/*
    ComponentBase : updateBounds - An empty update bounds function which can be filled to allow
                                   for components to update their bounds
    10/09/2016

    @return bool - Defined functions should return a bool value indicating if the bounds have
                   been updated

    Example:

    //Update the bounds of the component
    SquareComponent.prototype.updateBounds = function() {
        //Update the bounds values
        this.lclBounds.min.set(this.min);
        this.lclBounds.max.set(this.max);

        //Clean the bounds (Math.sin bounces between -1 and 1. Bounds min must always be the smallest)
        this.lclBounds.clean();

        //Return values updated
        return true;
    };
*/
ComponentBase.prototype.updateBounds = null;

/*
    ComponentBase : draw - An empty draw function which can be filled to allow for components
                           to render themselves to a passed in 2D context.
    31/08/2016

    @param[in] context - The 2D context object to be used for rendering
    @param[in] projection world view - The projection world view Mat3 object for the viewing camera
                                       and the parent game object

    Example:

    //Render the square to the context
    SquareComponent.prototype.draw = function(pCtx, pProjWorldView) {
        //Set the fill color
        pCtx.fillStyle = "white";
        pCtx.fillRect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.max.y);
    };
*/
ComponentBase.prototype.draw = null;

/*
    ComponentBase : dispose - An empty dispose function which can be filled to allow for components
                              to dispose of data and memory as required by the component
    13/09/2016

    Example:

    //Clear memory 
    SquareComponent.prototype.dispose = function() {
        //Clear additional point values
    };
*/
ComponentBase.prototype.dispose = null;