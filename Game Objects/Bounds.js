/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: Bounds
 *      Author: Mitchell Croft      
 *      Date: 10/09/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      Mat3.js
 *
 *      Purpose:
 *      Provide a method for monitoring the area (local space) that
 *      is taken up by GameObjects or Components. This is axis aligned
 *      and can be used to determine visibility or for pre-collision checks
 **/

/*
    Bounds : Constructor - Initialise with default values
    10/09/2016

    @param[in] pCopy - An optional optional Bounds object to be copied (Defualt null)

    Example:

    //Create a new Bounds object
    var playerBounds = new Bounds();

    OR

    //Copy the players bounds
    var playerBoundsCpy = new Bounds(playerBounds);
*/
function Bounds(pCopy) {
    //Switch based on the copy type
    switch (typeof pCopy) {
        case "object":
            if (pCopy instanceof Bounds) {
                this.min = new Vec2(pCopy.min);
                this.max = new Vec2(pCopy.max);
                break;
            }
        default:
            this.min = new Vec2();
            this.max = new Vec2();
            break;
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Bounds.prototype = {
    /*
        Bounds : clone - Create a copy of the Bounds object
        10/09/2016

        @return Bounds - Returns a new Bounds object with the same values as the current

        Example:

        //Create a copy of the players bounds
        var playerBoundsCpy = playerBounds.clone;
    */
    get clone() {
        return new Bounds(this);
    },

    /*
        Bounds : points - Set the points that the Bounds object must encapsulate
        10/09/2016

        @param[in] pPoints - An array of Vec2 objects defining the points in space to encapsulate

        Example:

        //Set the bounds for a shape
        shapeBounds.points = squareShape.points;
    */
    set points(pPoints) {
        //Set the min an max points to the first array element
        this.min.set(this.max.set(pPoints[0]));

        //Loop through remaining elements and find min/max
        for (var i = 1; i < pPoints.length; i++) {
            //Check X axis
            if (pPoints[i].x < this.min.x) this.min.x = pPoints[i].x;
            else if (pPoints[i].x > this.max.x) this.max.x = pPoints[i].x;

            //Check Y axis
            if (pPoints[i].y < this.min.y) this.min.y = pPoints[i].y;
            else if (pPoints[i].y > this.max.y) this.max.y = pPoints[i].y;
        }
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Main Functions                                               ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    Bounds : getGlobalBounds - By applying a Mat3 transform matrix get the global
                               position of the current Bounds object
    10/09/2016

    @param[in] pTrans - A Mat3 object defining the global transform to apply

    @return Bounds - Returns a new Bounds object with global min/max positions

    Example:

    //Get the players global bounds
    var globalPlayerBounds = playerBounds.getGlobalBounds(playerMat3Transform);
*/
Bounds.prototype.getGlobalBounds = function(pTrans) {
    //Create a new Bounds object
    var globalBounds = new Bounds();

    //Apply the points to the global bounds
    globalBounds.points = [pTrans.multiVec(this.min), pTrans.multiVec(this.max)];

    //Return the global bounds
    return globalBounds;
};

/*
    Bounds : encapsulate - Expand the current Bounds object to include a passed 
                           Bounds object
    10/09/2016

    @param[in] pOther - The Bounds object to be encapsulated by the current

    @return this - Returns itself once the function has ended

    Example:

    //Have the players bounds cover their gun
    playerBounds.encapsulate(playerGunBounds);
*/
Bounds.prototype.encapsulate = function(pOther) {
    //Check the X axis
    if (pOther.min.x < this.min.x) this.min.x = pOther.min.x;
    if (pOther.max.x > this.max.x) this.max.x = pOther.max.x;

    //Check the Y axis
    if (pOther.min.y < this.min.y) this.min.y = pOther.min.y;
    if (pOther.max.y > this.max.y) this.max.y = pOther.max.y;

    //Return itself
    return this;
};

/*
    Bounds : isIntersecting - Tests to see if two Bounds objects are intersecting
    10/09/2016

    @param[in] pOther - The Bounds object to test the current against

    @return bool - Returns true if the two Bounds objects are intersecting

    Example:

    //Check if the player is colliding with a bullet
    if (playerBounds.isIntersecting(bulletBounds)) {
        //TODO: Preform more in depth collision check
    }
*/
Bounds.prototype.isIntersecting = function(pOther) {
    return !(pOther.min.x > this.max.x ||
        pOther.min.y > this.max.y ||
        this.min.x > pOther.max.x ||
        this.min.y > pOther.max.y);
};

/*
    Bounds : clean - Checks the position values to ensure the min is the smallest and
                     max is largest
    10/09/2016

    @return this - Returns itself once the function has ended

    Example:

    //Create a bounds object
    var playerBounds = new Bounds();

    //TODO: Random setting of min and max

    //Clean the bounds object
    playerBounds.clean();
*/
Bounds.prototype.clean = function() {
    //Store the old min/max values
    var oldPoints = [new Vec2(this.min), new Vec2(this.max)];

    //Set the points
    this.points = oldPoints;

    //Return itself
    return this;
};