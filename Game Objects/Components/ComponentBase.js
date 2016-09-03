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
 *      SquareComponent.prototype = Object.create(ComponentBase);
 *      SquareComponent.prototype.constructor = SquareComponent;
 **/

/*
    ComponentBase : Abstract Constructor - Initialise with default values
    31/08/2016

    @param[in] pID - A unique ID number given to different types of components
                     to enable searches through Game object lists. User defined
                     components should be greater than or equal to 0. Use unique 
                     identifiers otherwise the wrong obejcts may be found in searches
*/
function ComponentBase(pID) {
    //Enfore abstract nature of the ComponentBase
    if (this.constructor === ComponentBase) throw new Error("Can not instantiate the abstract ComponentBase. Create a seperate object which inherits from ComponentBase");

    //Enforce a component ID value being set
    if (typeof pID !== "number") throw new Error("Can not instantiate the new Component as a unique identifier has not be set. Ensure the identifier is greater than or equal to zero and unique for each type of custom component to prevent errors in Game Object search functions");

    //Flags if the component is currently active
    this.enabled = true;

    /*  WARNING:
        Don't modify this internal object from the outside of the Component Base.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        ID: pID,
        owner: null, //This value is set when the component is added/removed from a GameObject
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
    }
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
    ComponentBase : draw - An empty draw function which can be filled to allow for components
                           to render themselves to a passed in 2D context.
    31/08/2016

    @param[in] context - The 2D context object to be used for rendering

    Example:

    //Render the square to the context
    SquareComponent.prototype.draw = function(pCtx) {
        //Set the fill color
        pCtx.fillStyle = "white";
        pCtx.fillRect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.max.y);
    };
*/
ComponentBase.prototype.draw = null;