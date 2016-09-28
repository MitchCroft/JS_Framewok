/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ShapeComponent
 *      Author: Mitchell Croft
 *      Date: 27/09/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      ComponentBase.js, Color.js, ExtendProperties.js
 *
 *      Purpose:
 *      Provide a method for storing 2D dimensional shape
 *      coordinate values for rendering using a transform.
 *      Coordinate values should be defined in a clockwise
 *      order. Is applied to a GameObject
 **/

/*
    ShapeComponent : Constructor - Initialise with default values
    27/09/2016

    Example:
    
    //Add a shape component to the custom object
    var shape = customObject.createComponent("ShapeComponent");

    OR

    //Create a new shape component
    var shape = new ShapeComponent();

    //Add shape component to the custom object
    customObject.addComponent(shape);
*/
function ShapeComponent() {
    //Call the Component Base Constructor for initial setup.
    ComponentBase.call(this, -1);

    //Flags if the bounds of the component needs to be updated
    this.__Internal__Dont__Modify__.boundsOutdated = true;

    //Store an array of the local space positions making up the shape (Clockwise)
    this.__Internal__Dont__Modify__.points = [];

    //Store the size of the border line
    this.__Internal__Dont__Modify__.outlineWidth = 1;

    //Store the fill color of the shape
    this.__Internal__Dont__Modify__.fillColor = new Color("#FFF");

    //Store the border color of the shape
    this.__Internal__Dont__Modify__.borderColor = new Color();
};

//Apply the ComponentBase prototype
ShapeComponent.prototype = Object.create(ComponentBase.prototype);
ShapeComponent.prototype.constructor = ShapeComponent;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Extend the ShapeComponent to preserve the ComponentBase prototype functionality
ExtendProperties(ShapeComponent, {
    /*
        ShapeComponent : points - Get the array of points that define this shape
        27/09/2016

        @return Vec2 Array - Returns an array of Vec2 objects

        Example:

        //Get the shapes points
        var points = shapeComponent.points;
    */
    get points() {
        return this.__Internal__Dont__Modify__.points;
    },

    /*
        ShapeComponent : points - Set the local space points of the shape
        27/09/2016

        @param[in] pPoints - An array of Vec2 objects storing the positions of points

        Example:

        //Set the shape coordinates as a square
        shapeComponent.points = [
            new Vec2(-0.5, -0.5),
            new Vec2( 0.5, -0.5),
            new Vec2( 0.5,  0.5),
            new Vec2(-0.5,  0.5)
        ];
    */
    set points(pPoints) {
        //Check the points are an array
        if (!pPoints instanceof Array)
            throw new Error("Can not set the points of the Shape Component as supplied value is not an array. " + pPoints + " (Type '" + typeof pPoints + "') must be an array of Vec2 objects");

        //Check they are Vec2 objects in the array
        for (var i = pPoints.length - 1; i >= 0; i--) {
            if (!pPoints[i] instanceof Vec2)
                throw new Error("Can not set the points of the Shape component as supplied array is not full of Vec2 objects. Index " + i + " is " + pPoints[i] + " (Type '" + typeof pPoints[i] + "'). Please ensure the array contains only Vec2 objects");
        }

        //Assign the points
        this.__Internal__Dont__Modify__.points = pPoints;

        //Flag the bounds as outdated
        this.__Internal__Dont__Modify__.boundsOutdated = true;
    },

    /*
        ShapeComponent : outlineWidth - Get the size of the line outlining the shape
        27/09/2016

        @return number - Returns the size of the shapes outline

        Example:

        //Get the size of the outline
        var size = shapeComponent.outlineWidth;
    */
    get outlineWidth() {
        return this.__Internal__Dont__Modify__.outlineWidth;
    },

    /*
        ShapeComponent: outlineWidth - Set the size of the line outlining the shape
        27/09/2016

        @param[in] pSize - A number defining the new size of the outline

        Example:

        //Set the size of the shape componenent
        shapeComponent.outlineWidth = 5;
    */
    set outlineWidth(pSize) {
        //Check the supplied size is a number
        if (typeof pSize !== "number")
            throw new Error("Can not set the outline width of Shape Component to value as it is not a number. Value is " + pSize + " (Type '" + typeof pSize + "'). Please use a number");

        //Set the outline width
        this.__Internal__Dont__Modify__.outlineWidth = pSize;

        //Flag the bounds as outdated
        this.__Internal__Dont__Modify__.boundsOutdated = true;
    },

    /*
        ShapeComponent : fillColor - Get the fill color of the current Shape Component
        27/09/2016

        @return Color - Returns a Color object with the current fill color

        Example:

        //Get the shapes fill color
        var color = shapeComponent.fillColor;
    */
    get fillColor() {
        return this.__Internal__Dont__Modify__.fillColor;
    },

    /*
        ShapeComponent : fillColor - Set the fill color of the current Shape Component
        27/09/2016

        @param[in] pCol - A Color object to be used as the new fill color or null
                          to remove the color

        Example:

        //Randomize the color of the shape component
        shapeComponent.fillColor = new Color().randomize();
    */
    set fillColor(pCol) {
        //Check if the color is null
        if (pCol === null) {
            this.__Internal__Dont__Modify__.fillColor = null;
            return;
        }

        //Test the value is a Color
        if (!pCol instanceof Color)
            throw new Error("Can not set the fill color of Shape Component as the Color supplied is not a Color object. " + pCol + " (Type '" + typeof pFill + "') must be a Color object");

        //Set the fill color
        this.__Internal__Dont__Modify__.fillColor = pCol;
    },

    /*
        ShapeComponent : borderColor - Get the border color of the current Shape Component
        27/09/2016

        @return Color - Returns a Color object with the current border color

        Example:

        //Get the shapes border color
        var color = shapeComponent.borderColor;
    */
    get borderColor() {
        return this.__Internal__Dont__Modify__.borderColor;
    },

    /*
        ShapeComponent : borderColor - Set the border color of the current Shape Component
        27/09/2016

        @param[in] pCol - A Color object to be used as the new border color or null
                          to remove the color

        Example:

        //Randomize the color the shape's border
        shapeComponent.borderColor = new Color().randomize();
    */
    set borderColor(pCol) {
        //Check if the color is null
        if (pCol === null) {
            this.__Internal__Dont__Modify__.borderColor = null;
            return;
        }

        //Test the value is a Color
        if (!pCol instanceof Color)
            throw new Error("Can not set the border color of Shape Component as the Color supplied is not a Color object. " + pCol + " (Type '" + typeof pFill + "') must be a Color object");

        //Set the border color
        this.__Internal__Dont__Modify__.borderColor = pCol;
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Definitions                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    ShapeComponent : updateBounds - Update the bounds of the Shape Component to fit 
                                    the points of the object
    27/09/2016

    @return bool - Returns true if the bounds of the component where updated
*/
ShapeComponent.prototype.updateBounds = function() {
    //Check if the bounds need updating
    if (!this.__Internal__Dont__Modify__.boundsOutdated) return false;

    //Store the average center position
    var center = new Vec2();

    //Get the values of all points
    for (var i = this.__Internal__Dont__Modify__.points.length - 1; i >= 0; i--)
        center.addSet(this.__Internal__Dont__Modify__.points[i]);

    //Divide for the average
    center.divSet(this.__Internal__Dont__Modify__.points.length);

    //Store an array of points with the line width factored in
    var adjustedPoints = [];

    //Store the absolute value of the border size
    var absSize = Math.abs(this.__Internal__Dont__Modify__.outlineWidth);

    //Loop through all points
    for (var i = 0; i < this.__Internal__Dont__Modify__.points.length; i++) {
        //Get the direction to the point
        var dir = this.__Internal__Dont__Modify__.points[i].subtract(center).normalize();

        //Set the adjusted point
        adjustedPoints[i] = this.__Internal__Dont__Modify__.points[i].add(dir.multi(absSize));
    }

    //Set the bounds points
    this.lclBounds.points = adjustedPoints;

    //Reset force update flag
    this.__Internal__Dont__Modify__.boundsOutdated = false;

    //Return the bounds updated
    return true;
};

/*
    ShapeComponent : draw - Draw the shape component to the passed in 2D context 
    27/09/2016

    @param[in] context - The 2D context object to be used for rendering
    @param[in] projection world view - The projection world view Mat3 object for 
                                       the viewing camera and the parent game object
*/
ShapeComponent.prototype.draw = function(pCtx, pProjWorldView) {
    //Check there is information to render
    if (this.__Internal__Dont__Modify__.points.length &&
        (this.__Internal__Dont__Modify__.fillColor !== null ||
            this.__Internal__Dont__Modify__.borderColor !== null)) {

        //Start rendering the path
        pCtx.beginPath();

        //Get the intial point
        var point = pProjWorldView.multiVec(this.__Internal__Dont__Modify__.points[0]);

        //Define the starting point
        pCtx.moveTo(point.x, point.y);

        //Loop through the points to define the path
        for (var i = 1, j = 0; j < this.__Internal__Dont__Modify__.points.length; i = (i + 1) % this.__Internal__Dont__Modify__.points.length, j++) {
            //Get the next point
            point = pProjWorldView.multiVec(this.__Internal__Dont__Modify__.points[i]);

            //Draw a line to the point
            pCtx.lineTo(point.x, point.y);
        }

        //Close the shape
        pCtx.closePath();

        //Check if the fill color has been set
        if (this.__Internal__Dont__Modify__.fillColor !== null) {
            //Change the fill style in use
            pCtx.fillStyle = this.__Internal__Dont__Modify__.fillColor.rgba;

            //Fill in the shape
            pCtx.fill();
        }

        //Check if the border color was set
        if (this.__Internal__Dont__Modify__.borderColor !== null) {
            //Change the stroke style
            pCtx.strokeStyle = this.__Internal__Dont__Modify__.borderColor.rgba;

            //Change the line width
            pCtx.lineWidth = this.__Internal__Dont__Modify__.outlineWidth;

            //Outline the shape
            pCtx.stroke();
        }
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                           Shape Type Defines                                               ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ShapeType
 *      Author: Mitchell Croft
 *      Date: 09/08/2016
 *
 *      Purpose:
 *      Name the numerical values given to primitive shapes 
 *      that can be generated by the factory function getPrimitivePoints
 **/

var ShapeType = { SQUARE: 0, CIRCLE: 1, TRIANGLE: 2 };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                   Factory Function                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
    Semi-constant variable, not modified through regular operation
    but can be modified at runtime in order to adjust the quality
    of the circles generated.
*/
var PRIMGEN_CIRCLE_SIDES = 25;

/*
    getPrimitivePoints - Get an array of points setup as a passed primitive type
    27/09/2016

    @param[in] pType - The type of shape to create from the points (List defined 
                       in the ShapeType object, e.g. ShapeType.SQUARE)
    @param[in] pSize - The size of the shape within its local space (Default 1)

    @return Vec2 Array - Returns an array of Vec2 objects setup in the defined
                         shape

    Example:

    //Make a shape component is the shape of a square
    shapeComponent.points = getPrimitivePoints(ShapeType.SQUARE, 5);
*/
function getPrimitivePoints(pType, pSize) {
    //Clean the size value
    if (typeof pSize !== "number") pSize = 1;

    //Create an empty array to hold the points in
    var temp = [];

    //Store the half size
    var halfSize = pSize / 2;

    //Switch on the type of shape to create
    switch (pType) {
        case ShapeType.SQUARE:
            //Define the square points
            temp[0] = new Vec2(-1, -1).multiSet(halfSize);
            temp[1] = new Vec2(1, -1).multiSet(halfSize);
            temp[2] = new Vec2(1, 1).multiSet(halfSize);
            temp[3] = new Vec2(-1, 1).multiSet(halfSize);
            break;
        case ShapeType.CIRCLE:
            //Get the angle increase per iteration
            var angleIncrease = (Math.PI * 2) / PRIMGEN_CIRCLE_SIDES;

            //Get the starting direction
            var dir = new Vec2(0, -1);

            //Iterate through sides and create points
            for (var i = 0; i < PRIMGEN_CIRCLE_SIDES; i++) {
                //Create the point
                temp[i] = dir.multi(halfSize);

                //Rotate the direction
                dir.rotate(angleIncrease);
            }
            break;
        case ShapeType.TRIANGLE:
            //Define the triangle points
            temp[0] = new Vec2(-1, -1).multiSet(halfSize);
            temp[1] = new Vec2(1, -1).multiSet(halfSize);
            temp[2] = new Vec2(0, 1).multiSet(halfSize);
            break;
        default:
            throw new Error("Unable to create the primitive points for the undefined type of " + pType + "(Type '" + typeof pType + "'). Try using one of the values defined in the ShapeType object");
    }

    //Return the points
    return temp;
};