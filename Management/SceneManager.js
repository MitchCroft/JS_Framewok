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
 *      Camera.js
 *
 *      Purpose:
 *      Manage a number of scenes that allow for the
 *      playthrough of a game. Allows for the selection
 *      and execution of different game flows
 **/

/*
    SceneManager : Constructor - Initialise with default values
    14/09/2016

    Example:

    //Create the Scene Manager
    var sceneManager = new SceneManager();
*/
function SceneManager() {
    /*  WARNING:
        Don't modify this internal object from the outside of the Scene Manager.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        //Store a map of scene types
        sceneMap: [],

        //Store the indicies of the named scenes types
        nameToIndicie: [],

        //Store the names of of the indicies
        indicieToName: [],

        //Store an instance of the active scene
        activeScene: null,

        //Store a callback to be called on scene change
        sceneChangeCB: null,

        //Store a reference to the context object being used to render
        renderer: null,

        //Store a reference to the Camera object being used to view the scenes
        camera: null
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SceneManager.prototype = {
    /*
        SceneManager : activeScene - Returns an instance of the current Scene type
        14/09/2016

        @return SceneBase - Returns a Scene Base object or null if none

        Example:

        //Get the current scene
        var curr = SceneManager.activeScene;
    */
    get activeScene() {
        return this.__Internal__Dont__Modify__.activeScene;
    },

    /*
        SceneManager : activeScene - Set the new active scene
        14/09/2016

        @param[in] pIdent - The identifier used to select the next Scene (Either 
                            index or string)

        Example:

        //Start the game, load the initial screen
        SceneManager.activeScene = 0;

        OR

        SceneManager.activeScene = "Start";
    */
    set activeScene(pIdent) {
        //Check there are scenes to laod
        if (!this.__Internal__Dont__Modify__.sceneMap.length)
            throw new Error("No Scene's have been added to the Manager. Can not load Scene " + pIdent + ". Add Scene types using SceneManager.addScene before setting an active scene");

        /*----------Clean the Identifier----------*/
        //Store the identifier result
        var identifier = -1;

        //Switch on the type of the identifier
        switch (typeof pIdent) {
            case "string":
                //Check for valid index in map
                if (!pIdent in this.__Internal__Dont__Modify__.nameToIndicie)
                    throw new Error("Could not find the Scene '" + pIdent + "' in the Scene Manager");

                //Get the index from the map
                identifier = this.__Internal__Dont__Modify__.nameToIndicie[pIdent];
                break;
            case "number":
                //Round off the index value
                pIdent = Math.round(pIdent);

                //Ensure the index is within range
                if (pIdent < 0 || pIdent >= this.__Internal__Dont__Modify__.sceneMap.length)
                    throw new Error("The index value of " + pIdent + " is outside of the useable range.");

                //Set the index value
                identifier = pIdent;
                break;
        }

        //Check the index value
        if (identifier < 0) return;

        //If there is already a scene loaded, dispose of it
        if (this.__Internal__Dont__Modify__.activeScene !== null)
            this.__Internal__Dont__Modify__.activeScene.dispose();

        //Create the new active scene
        this.__Internal__Dont__Modify__.activeScene = new this.__Internal__Dont__Modify__.sceneMap[identifier]()

        //Call the startup 
        if (this.__Internal__Dont__Modify__.activeScene.startUp !== null)
            this.__Internal__Dont__Modify__.activeScene.startUp();

        //Call the scene change callback
        if (this.__Internal__Dont__Modify__.sceneChangeCB !== null)
            this.__Internal__Dont__Modify__.sceneChangeCB(this.__Internal__Dont__Modify__.activeScene,
                identifier,
                this.__Internal__Dont__Modify__.indicieToName[identifier]);
    },

    /*
        SceneManager : renderer - Set the 2D rendering context that will be used to render
                                the scenes
        14/09/2016

        @param[in] pRend - The CanvasRenderingContext2D object to use

        Example:

        //Set the render context
        SceneManager.renderer = canvas.getContext("2d");
    */
    set renderer(pRend) {
        //Check the passed in object is a CanvasRenderingContext2D object
        if (!pRend instanceof CanvasRenderingContext2D)
            throw new Error(pRend + "(Type '" + typeof pRend + "') is not a CanvasRenderingContext2D object. Cannot be assigned as the renderer");

        //Assign the renderer
        else this.__Internal__Dont__Modify__.renderer = pRend;
    },

    /*
        SceneManager : camera - Get the Camera object that is currently being used to 
                                view the Scenes
        14/092/2016

        @return Camera - Returns a reference to the current Camera object

        Example:

        //Update the cameras position
        SceneManager.camera.position = playerObj.transform.position;
    */
    get camera() {
        return this.__Internal__Dont__Modify__.camera;
    },

    /*
        SceneManager : camera - Set the Camera object that will be used to view the 
                                Scenes
        14/09/2016

        @param[in] pCam - The Camera object to set as the used camera

        Example:

        //Set the Scene Managers camera
        SceneManager.camera = new Camera(gameCanvas, 1280, 720);
    */
    set camera(pCam) {
        //Check the passed in object is a Camera object
        if (!pCam instanceof Camera)
            throw new Error(pCam + " (Type '" + typeof pCam + "') is not a Camera object. Cannot be assigned as the Scene Manager camera");

        //Assign the camera
        else this.__Internal__Dont__Modify__.camera = pCam;
    },

    /*
        SceneManager : onSceneChange - Assign a function to be called whenever a Scene changes
        14/09/2016

        @param[in] pFunc - A function which takes in the newly loaded Scene instance, the index of
                           that scene and the string identifier assigned to it

        Example:

        //Assign the scene change callback
        SceneManager.onSceneChange = function(pScene, pIndex, pIndentifier) {
            //Move player/camera according to the scene in use
        };
    */
    set onSceneChange(pFunc) {
        //Check the passed in parameter is function
        if (typeof pFunc !== "function")
            throw new Error(pFunc + " (Type '" + typeof pFunc + "') is not a function. Cannot be assigned as the Scene change callback");

        //Assign the callback
        else this.__Internal__Dont__Modify__.sceneChangeCB = pFunc;
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Main Functions                                               ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    SceneManager : addScene - Add a new Scene type to the Scene Manager for
                              loading and use
    14/09/2016

    @param[in] pType - The SceneBase type to add to the Scene Manager
    @param[in] pIdent - An optional string identifier to be given to the 
                        Scene type (Default index number)

    Example:

    //Add the a custom scene to the Manager
    SceneManager.addScene(customScene, "Start");
*/
SceneManager.prototype.addScene = function(pType, pIdent) {
    //Clean the identifier
    pIdent = (typeof pIdent === "string" ? pIdent : "" + this.__Internal__Dont__Modify__.sceneMap.length);

    //Check if the identifier is already in use
    if (pIdent in this.__Internal__Dont__Modify__.nameToIndicie)
        throw new Error("Could not add Scene type to the Scene Manager with the identifier '" + pIdent + "' as this is already in use. Try a different identifier");

    /*----------Check the Type is Valid----------*/
    //Ensure the type is a function
    if (typeof pType === "function")
        throw new Error("The passed in Scene type " + pType + " (Type '" + typeof pType + "') is not an object base type. Please use an object type that inherits from SceneBase");

    //Create a new object to test the inheritance chain
    var testObj = new pType();

    //Test the prototype
    if (!SceneBase.isPrototypeOf(testObj))
        throw new Error("Could not add the Scene type " + pType + " (Type '" + typeof pType + "') as is does not inherit from BaseScene. Please inherit from BaseScene as the base for custom Scene objects");

    //Add the type to the array
    this.__Internal__Dont__Modify__.sceneMap.push(pType);

    //Add the identifier to index to name array
    this.__Internal__Dont__Modify__.indicieToName.push(pIdent);

    //Assign the index value to the identifier
    this.__Internal__Dont__Modify__.nameToIndicie[pIdent] = this.__Internal__Dont__Modify__.sceneMap.length - 1;
};

/*
    SceneManager : update - Update the Scene Manager and the internal active Scene
    14/09/2016

    @param[in] pDelta - The delta time for the current cycle

    Example:

    //Update the Scene Manager
    SceneManager.update(deltaTime);
*/
SceneManager.prototype.update = function(pDelta) {
    //Ensure the objects have been created and set
    if (this.__Internal__Dont__Modify__.activeScene === null ||
        this.__Internal__Dont__Modify__.renderer === null ||
        this.__Internal__Dont__Modify__.camera === null) {

        if (this.__Internal__Dont__Modify__.activeScene === null)
            throw new Error("Can not update active scene as none has been set. Use SceneManager.activeScene to assign an active scene");

        if (this.__Internal__Dont__Modify__.renderer === null)
            throw new Error("Can not render active scene as no context object has been set. Use SceneManager.renderer to assign a CanvasRenderingContext2D object");

        if (this.__Internal__Dont__Modify__.camera === null)
            throw new Error("Can not render active scene as no Camera object has been set. Use SceneManager.camera to assign a Camera");
    }

    //Update the active scene
    else this.__Internal__Dont__Modify__.activeScene.update(pDelta,
        this.__Internal__Dont__Modify__.renderer,
        this.__Internal__Dont__Modify__.camera);
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
 *      function CustomScene() {      
 *          //Call the Scene Base constructor for intitial setup
 *          SceneBase.call(this);
 *
 *          Note: Can add varying 'global' variables here that can
 *                be shared by game objects in the scene
 *      };
 *
 *      //Apply the SceneBase prototype
 *      CustomScene.prototype = Object.create(SceneBase);
 *      CustomScene.prototype.constructor = CustomScene;
 *
 *      //Set the Start Up function
 *      CustomScene.prototype.startUp = function() {
 *          //Add a cusotm object
 *          this.objects.push(new CustomObject());
 *      };
 *
 *      //Add the scene to the Scene Manager
 *      SceneManager.addScene(CustomScene, "Custom");
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
/////                                             Game Object Functions                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    SceneBase : AddGameObject - Add a Game Object to root of the Scene object
    14/09/2016

    @param[in] pObj - The Game Object to be added to the Scene root

    @return GameObject - Returns a reference to the Game Object that was added
                         to the Scene

    Example:

    //Add a new custom object to the scene
    var obj = SceneManager.activeScene.AddGameObject(new CustomObject());
*/
SceneBase.prototype.AddGameObject = function(pObj) {
    //Check if the object has a parent
    if (pObj.transform.parent !== null)
        pObj.transform.parent = null;

    //Otherwise check if its already in the root
    else {
        for (var i = this.objects.length - 1; i >= 0; i--) {
            //Check if these objects match
            if (this.objects[i] === pObj) return pObj;
        }
    }

    //Add the object to the root list
    this.objects.push(pObj);

    //Return the object
    return pObj;
};

/*
    SceneBase : FindObjectWithTag - Goes through the Game Object hierarchy chain to find
                                    the first Game Object with the specified tag
    14/09/2016

    @param[in] pTag - The tag of the Game Object to find
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through 
                                 (Default false)

    @return GameObject - Returns the found Game Object or null if not found

    Example:

    //Get the player scene in the scene
    var playerObj = SceneManager.activeScene.FindObjectWithTag("Player");

    OR

    var playerObj = SceneManager.activeScene.FindObjectWithTag("Player", true);
*/
SceneBase.prototype.FindObjectWithTag = function(pTag, pSearchDisabled) {
    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Look through scene objects
    var found = null;
    for (var i = this.objects.length - 1; i >= 0; i--) {
        //Check if the object is disabled
        if (!pSearchDisabled && !this.objects[i].enabled) continue;

        //Check the objects tag
        if (this.objects[i].tag === pTag) return this.objects[i];

        //Recurse into the object
        if ((found = this.objects[i].findObjectWithTagInChildren(pTag, pSearchDisabled)) !== null)
            return found;
    }

    //Default return null
    return null;
};

/*
    SceneManager : FindObjectsWithTag - Goes through the Game Object hierarchy chain to find 
                                        all Game Objects in the Scene with the specified tag
    14/09/2016

    @param[in] pTag - The tag of the Game Objects to find
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through 
                                 (Default false)

    @return GameObject Array - Returns an Array of Game Objects with the specified tag or
                               null if not found

    Example:

    //Find all bullets in the Scene
    var bullets = SceneManager.activeScene.FindObjectsWithTag("Bullet");

    OR

    var bullets = SceneManager.activeScene.FindObjectsWithTag("Bullet", true);
*/
SceneBase.prototype.FindObjectsWithTag = function(pTag, pSearchDisabled) {
    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Create an array to store the objects
    var objs = null;

    //Look through the children
    var found = null;
    for (var i = this.objects.length - 1; i >= 0; i--) {
        //Check the object is disabled
        if (!pSearchDisabled && !this.objects[i].enabled) continue;

        //Check the objects tag
        if (this.objects[i].tag === pTag) {
            //Create the array as needed
            if (objs === null) objs = [];

            //Add the object to the array
            objs.push(this.objects[i]);
        }

        //Recurse into the children
        if ((found = this.objects[i].findObjectsWithTagInChildren(pTag, pSearchDisabled)) !== null) {
            //Create the array as needed
            if (objs === null) objs = [];

            //Add the objects to the array
            objs = objs.concat(found);
        }
    }

    //Return the array
    return objs;
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
    @param[in] pGraphics - The Graphics object being used to render the scene
    @param[in] pCamera - The Camera object being used to render the scene
*/
SceneBase.prototype.update = function(pDelta, pGraphics, pCamera) {
    //Loop through the internal root level nodes to preform updates
    for (var i = this.objects.length - 1; i >= 0; i--)
        this.objects[i].internalUpdate(pDelta);

    //Loop through the internal root level nodes to preform late updates
    for (var i = this.objects.length - 1; i >= 0; i--)
        this.objects[i].internalLateUpdate(pDelta);

    //Loop through the internal root level nodes to preform component updates
    for (var i = this.objects.length - 1; i >= 0; i--)
        this.objects[i].updateComponents(pDelta);

    //Loop through the internal root level nodes to preform positional updates
    for (var i = this.objects.length - 1; i >= 0; i--)
        this.objects[i].updateTransforms();

    //TODO: Preform physics calculations

    //TODO: Update spacial partition

    //TODO: Find visible objects and render only those

    //TEMP
    //Get the projection view from the camera
    var projView = pCamera.projectionView;

    //Loop through internal root level nodes to draw components
    for (var i = this.objects.length - 1; i >= 0; i--)
        this.objects[i].drawComponents(pGraphics.draw, projView);
    //TEMP
};

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