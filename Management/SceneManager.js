/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: SceneManager
 *      Author: Mitchell Croft
 *      Date: 
 *
 *      Version: 1.0
 *
 *      Requires:
 *      Graphics.js, Camera.js
 *
 *      Purpose:
 *      Manage a number of scenes that allow for the
 *      playthrough of a game. Allows for the selection
 *      and execution of different game flows
 **/

/*
    SceneManager : Constructor - Initialise with default values
    13/09/2016
*/
var SceneManager = new function() {
    //Store a map of loaded Scenes
    var sceneMap = [];

    //Store the indicies of the named scenes
    var namedIndicies = [];

    //Store a clone of the current active scene
    var activeScene = null;

    //Store a function callback to be called on scene change
    var sceneChangeCallback = null;

    //Store a reference to the Graphics object being used to render the scenes
    var graphics = null;

    //Store a reference to the Camera object being used to view the scenes
    var camera = null;

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                             Internal Functions                                             ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
        SceneManager : validifySceneIdentifier - Takes in an identification value and returns a valid scene index
        13/09/2016

        @param[in] pIdent - The identifier to validate (Number, string or unidentified)
        @param[in] pDefault - The default numerical index value to return if the identifier is invalid

        @return Integral Number - Returns a whole number index value for a scene or pDefault
    */
    var validifySceneIdentifier = function(pIdent, pDefault) {
        //Check how many scenes have been loaded
        if (sceneMap.length === 0) return -1;

        //Switch on the type of the identifier
        switch (typeof pIdent) {
            case "string":
                //Check for valid index
                if (!(pIdent in sceneMap)) {
                    throw new Error("Could not find the scene '" + pIdent + "' in the Scene Manager. Default " + pDefault + " index being used instead");
                    return pDefault;
                }

                //Return the identified index
                return namedIndicies[pIdent];
            case "number":
                //Round off the index value
                pIdent = Math.round(pIdent);

                //Ensure the index is within range
                if (pIdent < 0 || pIdent >= sceneMap.length) {
                    throw new Error("The index value of " + pIdent + " is outside of the usabel range. Default value of " + pDefault + " was assigned");
                    return pDefault;
                }

                //Return the identifier
                return pIdent;
            default:
                return pDefault;
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                               Main Function                                                ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
        SceneManager : update - Update the scene manager and the internal scenes
        13/09/2016

        @param[in] pDelta - The delta time for the current cycle

        Example:

        //Update the Scene Manager
        SceneManager.update(deltaTime);
    */
    this.update = function(pDelta) {
        //Ensure the objects have been created and set
        if (activeScene === null || graphics === null || camera === null) {
            if (activeScene === null) throw new Error("Can not render scene as an active scene has not been set");
            if (graphics === null) throw new Error("Can not render scene's, Graphics object has not been set");
            if (camera === null) throw new Error("Can not render scene's, Camera object has not been set");
        }

        //Update and render the scene
        else {
            //TODO: Rendering / updating
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                              Setter Function                                               ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
        SceneManager : getActiveScene - Returns the current active scene
        13/09/2016

        @return SceneBase - Returns the SceneBase object which is currently in use

        Example:

        //Get the active scene
        var active = SceneManager.getActiveScene();
    */
    this.getActiveScene = function() {
        return activeScene;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////                                                                                                            ////
    /////                                              Setter Functions                                              ////
    /////                                                                                                            ////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
        SceneManager : setCamera - Assign a Camera object to the Scene Manager
        13/09/2016

        @param[in] pCam - A reference to the Camera object to be used to render 

        Example:

        //Set the camera object to render with
        SceneManager.setCamera(new Camera(canvas, 1280, 720));
    */
    this.setCamera = function(pCam) {
        //Check the passed in object is a Camera object
        if (!pCal instanceof Camera) {
            throw new Error(pCam + " (Type '" + typeof pCam + "') is not a Camera object. Cannot be assigend as the Camera object");
            camera = null;
        }

        //Assign as the camera
        else camera = pCam;
    };

    /*
        SceneManager : setGraphics - Assign a Graphics object to the Scene Manager
        13/09/2016

        @param[in] pGraph - A reference to the Graphics object to be used to render

        Example:

        //Set the graphics object to render with
        SceneManager.setGraphics(new Graphics(1280, 720));
    */
    this.setGraphics = function(pGraph) {
        //Check the passed in object is a Graphics object
        if (!pGraph instanceof Graphics) {
            throw new Error(pGraph + " (Type '" + typeof pGraph + "') is not a Graphics object. Cannot be assigend as the Graphics object");
            graphics = null;
        }

        //Assign as the graphics
        else graphics = pGraph;
    };

    /*
        SceneManager : setSceneChangeCallback - Assign a function to be called when the scene changes
        13/09/2016

        @param[in] pFunc - A function which takes in the index of the new scene and the
                           name of the scene

        Example:

        //Assign callback
        SceneManager.setSceneChangeCallback(function(pIndex, pName) {
            //Move player/camera to starting position
        });
    */
    this.setSceneChangeCallback = function(pFunc) {
        //Check the passed in object is a function
        if (typeof pFunc !== "function") {
            throw new Error(pFunc + " (Type '" + typeof pFunc + "') is not a function. Cannot be assigned as the Scene Change callback");
            return;
        }

        //Assign the callback
        else sceneChangeCallback = pFunc;
    };

    /* 
        SceneManager : addScene - Add a new Scene object to the Scene Manager for loading and use
        13/09/2016

        @param[in] pScene - The Scene object to add to the SceneManager
        @param[in] pIdent - An optional string identifier to be given to the Scene (Default index number)

        Example:

        //Add a scene to the Scene Manager
        //TODO
    */
    this.addScene = function(pScene, pIdent) {
        //TODO
    };

    /*
        SceneManager : setActiveScene - Transition the current scene to the specified identifier
        13/09/2016

        @param[in] pIdent - The identifier used to select the scene (Either index or string)

        Example:

        //Start the game, load intitial screen
        SceneManager.setActiveScene(0);

        OR

        SceneManager.setActiveScene("Start");
    */
    this.setActiveScene = function(pIdent) {
        //TODO
    };
};

/*
 *      Name: SceneBase
 *      Author: Mitchell Croft
 *      Date: 13/09/2016
 *      
 *      Version: 1.0
 *
 *      Requires:
 *      GameObject.js
 *
 *      Purpose:
 *      Provide a base point for defining a single game 
 *      environment scene.
 *
 *      Example:
 *      
 *      //Define a simple scene with a single object
 **/

/*
    SceneBase : Constructor - Initialise with default values
    13/092/106
*/
function SceneBase() {
    //Ensure abstract nature of the SceneBase
    if (this.constructor === SceneBase) throw new Error("Can not instantiate the abstract SceneBase. Create a seperate object which inherits from SceneBase");

    //Store an array of root level game objects
    this.objects = [];
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                             Scene Base Functions                                           ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    SceneBase : update - Update and render the current Scene object using the passed in values
    13/09/2016

    @param[in] pDelta - The delta time for the current cycle
    @param[in] pGraphics
*/

/*
    SceneBase : Destroy - Destroy all of the contained Game Objects
    13/09/2016
*/
SceneBase.prototype.Dispose = function() {
    //Call dispose on all root level game objects
    for (var i = this.objects.length - 1; i >= 0; i--)
        this.objects[i].dispose();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                        Customisable Called Function                                        ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    SceneBase : startUp - Allow for the initial setup of a scene 
    13/09/2016

    Example:

    //Create basic scene
    CustomScene.prototype.startUp = function() {
        //Add a base game object
        this.objects.push(new CustomObject());
    };
*/
SceneBase.prototype.startUp = null;