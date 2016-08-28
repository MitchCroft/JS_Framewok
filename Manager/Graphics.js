/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: Graphics
 *      Author: Mitchell Croft
 *      Date: 31/07/2016
 *
 *      Version: 2.0
 *      Added properties to improve usability
 *
 *      Requires:
 *      Mat3.js, Color.js
 *
 *      Purpose:
 *      Control and manage the rendering of 2D graphics to a contained
 *      HTML5 canvas object. Provides basic hierarchal rendering
 *      capabilities.
 **/

/*
    Graphics : Constructor - Initialise with graphics manager
    31/07/2016

    @param[in] pWidth - The desired width of the canvas (Default to tag settings)
    @param[in] pHeight - The desired height of the canvas (Default to tag settings)
    @param[in] pID - The id of the canvas object to retrieve (Default first on page)

    Example:

    //Create the graphics object
    var graphics = new Graphics(1280, 720, "gameCanvas");
    OR
    var graphics = new Graphics(1280, 720);
    OR
    var graphics = new Graphics();  
*/
function Graphics(pWidth, pHeight, pID) {
    //Get the first canvas object
    this.canvas = (typeof pID === "string" ? document.getElementById(pID) :
        document.getElementsByTagName("canvas")[0]);

    //Get the 2D context from the canvas
    this.draw = this.canvas.getContext("2d");

    //Create a render stack 
    var renderStack = [];

    //Store a map loaded images
    var imageMap = [];

    //Set the window dimensions
    if (typeof pWidth === "number") this.canvas.width = Math.round(pWidth);
    if (typeof pHeight === "number") this.canvas.height = Math.round(pHeight);

    //Save a list of resize event callbacks
    var resizeEvents = [];

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                            Rendering Functions                                             ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
        Graphics : beginRender - Start the rendering with the passed in properties
        31/07/2016

        @param[in] pTranslateX - The X value to translate the drawing point to (Default 0)
        @param[in] pTranslateY - The Y value to translate the drawing point to (Default 0)
        @param[in] pRot - The amount of rotation (Radians) to apply to the rendering process (Default 0)
        @param[in] pScaleX - The amount that the X dimension should be scaled by (Default 1)
        @param[in] pScaleY - The amount that the Y dimension should be scaled by (Default 1)

        Example:

        //Render the player to the canvas
        Graphics.beginRender(position.x, position.y, rotation, scale.x, scale.y);

        //Draw player image
        Graphics.draw.drawImage(...);
    */
    this.beginRender = function(pTranslateX, pTranslateY, pRot, pScaleX, pScaleY) {
        //Create the new transform
        var transform = createTranslationMat(typeof pTranslateX === "number" ? pTranslateX : 0,
            typeof pTranslateY === "number" ? pTranslateY : 0);

        //Apply the rotation matrix
        if (typeof pRot === "number")
            transform.multiSet(createRotationMat(pRot));

        //Apply the scale matrix
        if (typeof pScaleX === "number" || typeof pScaleY === "number")
            transform.multiSet(createScaleMat(typeof pScaleX === "number" ? pScaleX : 1,
                typeof pScaleY === "number" ? pScaleY : 1));

        //Check if there are other transforms in the stack
        if (renderStack.length)
            transform.set(renderStack[renderStack.length - 1].multi(transform));

        //Apply the transform
        this.transform = transform;

        //Push the transform onto the render stack
        renderStack.push(transform);
    };

    /*
        Graphics : endRender - End the rendering process restoring the pre-render properties
        31/07/2016

        Example:

        //Draw player image
        Graphics.draw.drawImage(...);

        //End the rendering
        Graphics.endRender();
    */
    this.endRender = function() {
        //Pop the current transform from the stack
        renderStack.pop();

        //Reset the previous transform if it exists
        if (renderStack.length) this.transform = renderStack[renderStack.length - 1];

        //Set the identity matrix
        else this.transform = null;
    };

    /*
        Graphics : loadImage - Creates and loads an image from the specified file path
                               if it does not already exist. Returns the previous instance
                               if it does exist.
        31/07/2016

        @param[in] pFilepath - The filepath of the image to load (Relative to the HTML calling this)

        @return Image Element - Returns a reference to an HTML Image element that has been
                                added to the document and assigned the passed in image

        Example:

        //Load the player image
        var playerImage = Graphics.loadImage("Sprites/player.png");
    */
    this.loadImage = function(pFilepath) {
        //Check if the image has already been loaded
        if (!(pFilepath in imageMap)) {
            //Create a new image
            imageMap[pFilepath] = document.createElement("img");
            imageMap[pFilepath].src = pFilepath;
        }

        //Return the image object
        return imageMap[pFilepath];
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                               Resize Functions                                             ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
        Graphics : addResizeEvent - Add a new function to be called as a canvas resize event callback
        28/08/2016

        @param[in] pCB - A function that takes in a Vec2 object with the new canvas dimensions

        @return bool - Returns true if the callback was added to the event list

        Example:

        //Add a callback to canvas resizing
        if (Graphics.addResizeEvent(resizeFunction)) {
            //TODO: Output success message
        }
    */
    this.addResizeEvent = function(pCB) {
        //Ensure the parameter is a function
        if (typeof pCB !== "function") return false;

        //Check if it has already been added
        for (var i = resizeEvents.length - 1; i >= 0; i--) {
            if (resizeEvents[i] === pCB) return false;
        }

        //Add the callback to the list
        resizeEvents.push(pCB);

        //Return success
        return true;
    };

    /*
        Graphics : triggerResizeEvents - Go through and call all canvas resize event callbacks
                                         (Called through size, width and height properties)
        28/08/2016

        Example:

        //Force resize callbacks 
        Graphics.triggerResizeEvents();
    */
    this.triggerResizeEvents = function() {
        //Loop through all resize events
        for (var i = resizeEvents.length - 1; i >= 0; i--)
            resizeEvents[i](new Vec2(this.canvas.width, this.canvas.height));
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Graphics.prototype = {
    /*
        Graphics : transform - Change the current transform being being used to render
        31/07/2016

        @param[in] pTrans - The transform to assign (Null clears current transform)

        Example:

        //Set player transform
        Graphics.transform = playerTransform;

        OR

        //Clear the current transform
        Graphics.transform = null;
    */
    set transform(pTrans) {
        //Test the type of pTrans
        if (pTrans instanceof Mat3)
            this.draw.setTransform(pTrans.data[0][0], pTrans.data[0][1], pTrans.data[1][0], pTrans.data[1][1], pTrans.data[2][0], pTrans.data[2][1]);

        //Remove the current transform
        else
            this.draw.setTransform(1, 0, 0, 1, 0, 0);
    },

    /*
        Graphics : size - Get the size of the contained canvas object
        28/08/2016

        @return Vec2 - Returns a Vec2 object holding the size of the canvas

        Example:

        //Get the dimensions of the canvas
        var canvasBounds = Graphics.size;
    */
    get size() {
        return new Vec2(this.canvas.width, this.canvas.height);
    },

    /*
        Graphics : size - Set the size of the contained canvas object
        28/08/2016

        @param[in] pDim - A Vec2 object containing the new dimensions of the canvas

        Example:

        //Resize the canvas object
        Graphics.size = new Vec2(1280, 720);
    */
    set size(pDim) {
        //Set the canvas dimensions
        this.canvas.width = pDim.x;
        this.canvas.height = pDim.y;

        //Trigger resize callbacks
        this.triggerResizeEvents();
    },

    /*
        Graphics : width - Returns the current width of the canvas being used
        31/07/2016

        @return number - Returns the width as a number

        Example:

        //Position the player halfway across the screen
        playerPositionX = Graphics.width / 2;
    */
    get width() {
        return this.canvas.width;
    },

    /*
        Graphics : width - Sets the width of the current canvas object
        31/07/2016

        @param[in] pWidth - A number representing the new width of the canvas

        Example:

        //Resize the canvas to user selection
        Graphics.width = userWidth;
    */
    set width(pWidth) {
        //Change the size of the canvas
        this.canvas.width = pWidth;

        //Trigger resize callbacks
        this.triggerResizeEvents();
    },

    /*
        Graphics : height - Returns the current height of the canvas being used
        31/07/2016

        @return number - Returns the height as a number

        Example:

        //Position the player halfway down the screen
        playerPositionY = Graphics.height;      
    */
    get height() {
        return this.canvas.height;
    },

    /*
        Graphics : height - Sets the height of the current canvas object
        31/07/2016

        @param[in] pHeight - A number representing the new height of the canvas

        Example:

        //Resize the canvas to user selection
        Graphics.height = userHeight;
    */
    set height(pHeight) {
        //Change the size of the canvas
        this.canvas.height = pHeight;

        //Trigger resize callbacks
        this.triggerResizeEvents();
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Main Functions                                               ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    Graphics : outlineText - Render text to a specified position with an outline
    17/06/2016

    @param[in] pText - The text to render to the display
    @param[in] pXPos - The X position to render the text at
    @param[in] pYPos - The Y position to render the text at
    @param[in] pMainCol - The color to render the main body of text in (Default White)
    @param[in] pBorderCol - The color to render the outline of text in (Default Black)
    @param[in] pScale - The scale of the border from the main body of text (Default 1)

    Example:

    //DISPLAY WINNER
    Graphics.outlineText('You Win!', width / 2, height / 2, 'green', 'black', 2);
*/
Graphics.prototype.outlineText = function(pText, pXPos, pYPos, pMainCol, pBorderCol, pScale) {
    //Define the text offset values
    var offsets = [{ x: -1, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }];

    //Set the offset color
    this.draw.fillStyle = (pBorderCol instanceof Color ? pBorderCol.rgba :
        typeof pBorderCol === "string" ? pBorderCol : "#000");

    //Get the scale value
    if (typeof pScale !== "number")
        pScale = 1;

    //Loop through and render background text
    for (var i = 0; i < offsets.length; i++)
        this.draw.fillText(pText, pXPos + offsets[i].x * pScale, pYPos + offsets[i].y * pScale);

    //Set the main color
    this.draw.fillStyle = (pMainCol instanceof Color ? pMainCol.rgba :
        typeof pMainCol === "string" ? pMainCol : "#FFF");

    //Render main text
    this.draw.fillText(pText, pXPos, pYPos);
};