/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: GameObject
 *      Author: Mitchell Croft
 *      Date: 31/08/2016
 *
 *      Version: 1.0
 *
 *      Requires: 
 *      Transform.js, ComponentBase.js
 *      
 *      Purpose:
 *      Provide a base point for game objects to inherit from 
 *      for inclusion and use within a game scene. The Transform
 *      included allows for object hierarchies to be created, however
 *      only Transforms created from Game Objects should be included
 *
 *      Example:
 *      
 *      //Define the player object
 *      function PlayerObj() {
 *          //Call the GameObject Base
 *          GameObject.call(this, "Player");
 *
 *          //Define values 
 *          this.lives = 10;
 *          this.health = 50;
 *      };
 *
 *      //Apply the Game Object prototype
 *      PlayerObj.prototype = Object.create(GameObject);
 *      PlayerObj.prototype.constructor = PlayerObj;
 **/

/*
    GameObject : Abstract Constructor - Initialise with default values
    31/08/2016

    @param[in] pTag - The optional tag to be given to the Game Object 
                      (Default "Game Object") 
*/
function GameObject(pTag) {
    //Enfore abstract nature of the GameObject
    if (this.constructor === GameObject) throw new Error("Can not instantiate the abstract Game Object. Create a seperate object which inherits from Game Object");

    //Store a tag for the Game Object
    this.tag = (typeof pTag === "string" ? pTag : "Game Object");

    //Create a transform for the object
    this.transform = new Transform(this);

    /*  WARNING:
        Don't modify this internal object from the outside of the Game Object.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        enabled: true,
        initialised: false,
        components: [],
    };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

GameObject.prototype = {
    /*
        GameObject : enabled - Get the current enabled state of the Game Object
        31/08/2016

        @return bool - Returns true if the Game Object is currently active

        Example:

        //Check if there is a wall in the way
        if (!wallObj.enabled) {
            //TODO: Walk through the area
        }
    */
    get enabled() {
        return this.__Internal__Dont__Modify__.enabled;
    },

    /*
        GameObject : enabled - Recursivly set the enabled state for this Game Object 
                               its children.
        31/08/2016

        @param[in] pState - A bool value dictating the enabled state to set the Game 
                            Objects to

        Example:

        //Destroy the wall obstacle
        wallObj.enabled = false;
    */
    set enabled(pState) {
        //Set the current state
        this.__Internal__Dont__Modify__.enabled = pState;

        //Recurse into the children objects and set enabled states
        for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
            this.transform.__Internal__Dont__Modify__.children[i].owner.enabled = pState;
    },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                             Component Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    GameObject : addComponent - Add a specific component to the current Game Object
    31/08/2016

    @param[in] pComp - The component to add to the Game Object

    @return bool - Returns true if the component was added successfully

    Example:

    //Add a custom component to the game object
    GameObject.addComponent(new CustomComponent());
*/
GameObject.prototype.addComponent = function(pComp) {
    //Ensure the parameter is a component derivative
    if (!ComponentBase.isPrototypeOf(pComp)) return false;

    //Ensure that the owner is not the current object
    if (pComp.owner === this) return false;

    //Set the owner of the component
    pComp.__Internal__Dont__Modify__.owner = this;

    //Add the component to the list
    this.__Internal__Dont__Modify__.components.push(pComp);

    //Sort the list of components
    this.__Internal__Dont__Modify__.components.sort(function(pA, pB) {
        return pA.ID - pB.ID;
    });

    //Return successful
    return true;
};

/*
    GameObject : createComponent - Create a new component of the specified type and it
                                   to the current Game Object
    31/08/2016

    @param[in] pType - A string vlaue that can be evaluated to the type of component to create

    @return Component - Returns a new component of the specified type

    Example:

    var comp = GameObject.createComponent("CustomComponent");
*/
GameObject.prototype.createComponent = function(pType) {
    //Evauluate the type of object to create
    var evaluatedType = eval(pType);

    //Create the new object
    var obj = new evaluatedType();

    //Test to ensure it is a component type
    if (!ComponentBase.isPrototypeOf(obj))
        throw new Error("Could not create a component of type " + pType + " as it is not a ComponentBase type. Ensure that the type you are trying to create derives from ComponentBase");

    //Set the owner of the new object
    obj.__Internal__Dont__Modify__.owner = this;

    //Add the component to the list
    this.__Internal__Dont__Modify__.components.push(obj);

    //Sort the list of components
    this.__Internal__Dont__Modify__.components.sort(function(pA, pB) {
        return pA.ID - pB.ID;
    });

    //Return the new component object
    return obj;
};

/*
    GameObject : getComponentWithID - Gets a reference to the first component with the specified ID
    31/08/2016

    @param[in] pID - The ID of the component type to find

    @return Component - Returns the first component found with the specified ID or null if not found

    Example:

    //Get the component with an ID of 0
    var comp = GameObject.getComponentWithID(0);
*/
Gameobject.prototype.getComponentWithID = function(pID) {
    //Ensure there are components to check for removal
    if (!this.__Internal__Dont__Modify__.components.length) return null;

    //Ensure the ID is within the bounds of the contained components
    if (pID < this.__Internal__Dont__Modify__.components[0].ID || pID > this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID) return null;

    //Get the direction to move through the array
    var dir = (pID - this.__Internal__Dont__Modify__.components[0].ID < this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID - pID ? 1 : -1);

    //Look thorugh the components 
    for (var i = (dir === 1 ? 0 : this.__Internal__Dont__Modify__.components.length - 1); i >= 0 && i < this.__Internal__Dont__Modify__.components.length; i += dir) {
        //Check the ID of the current component
        if (this.__Internal__Dont__Modify__.components[i].ID === pID)
            return this.__Internal__Dont__Modify__.components[i];
    }

    //Default return null
    return null;
};

/*
    GameObject : getComponentsWithID - Gets an array of components with the specified ID
    01/09/2016

    @param[in] pID - The ID of the components type to find

    @return Component Array - Returns an array of all components with the specified ID or null
                              if not found

    Example:

    //Get all components with an ID of 0
    var comps = GameObject.getComponentsWithID(0);

    for (var i = comps.length - 1; i >= 0; i--) {
        //TODO: Use components in some way
    }
*/
GameObject.prototype.getComponentsWithID = function(pID) {
    //Ensure there are components to check for removal
    if (!this.__Internal__Dont__Modify__.components.length) return null;

    //Ensure the ID is within the bounds of the contained components
    if (pID < this.__Internal__Dont__Modify__.components[0].ID || pID > this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID) return null;

    //Get the direction to move through the array
    var dir = (pID - this.__Internal__Dont__Modify__.components[0].ID < this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID - pID ? 1 : -1);

    //Look through the components for removal
    for (var i = (dir === 1 ? 0 : this.__Internal__Dont__Modify__.components.length - 1); i >= 0 && i < this.__Internal__Dont__Modify__.components.length; i += dir) {
        //Check the ID of the current component
        if (this.__Internal__Dont__Modify__.components[i].ID === pID) {
            //Create an array to hold the components
            var comps = [this.__Internal__Dont__Modify__.components[i]];

            //Loop through to find all other components with the ID
            for (var j = i + dir; j >= 0 && j < this.__Internal__Dont__Modify__.components.length; j += dir) {
                //Check the ID for match
                if (this.__Internal__Dont__Modify__.components[j].ID === pID)
                    comps.push(this.__Internal__Dont__Modify__.components[j]);

                //Exit the search
                else break;
            }

            //Return the found elements
            return comps;
        }
    }

    //Default return null
    return null;
};

/*
    GameObject : getComponentWithIDInChildren - Gets a reference to the first component with the 
                                                specified ID recursivly through the children
    01/09/2016

    @param[in] pID - The ID of the comonent type to find

    @return Component - Returns the first component found with the specified ID or null if not found

    Example:

    //Get any component in the matrix chain with an ID of 0
    var comp = GameObject.getComponentWithIDInChildren(0);
*/
GameObject.prototype.getComponentWithIDInChildren = function(pID) {
    //Check there are components to look through
    if (this.__Internal__Dont__Modify__.components.length) {
        //Ensure the ID is within the bounds of the contained components
        if (pID >= this.__Internal__Dont__Modify__.components[0].ID && pID <= this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID) {
            //Get the direction to move through the array
            var dir = (pID - this.__Internal__Dont__Modify__.components[0].ID < this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID - pID ? 1 : -1);

            //Look thorugh the components 
            for (var i = (dir === 1 ? 0 : this.__Internal__Dont__Modify__.components.length - 1); i >= 0 && i < this.__Internal__Dont__Modify__.components.length; i += dir) {
                //Check the ID of the current component
                if (this.__Internal__Dont__Modify__.components[i].ID === pID)
                    return this.__Internal__Dont__Modify__.components[i];
            }
        }
    }

    //Look through children
    var found = null;
    for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the search found a component
        if ((found = this.transform.__Internal__Dont__Modify__.children[i].owner.getComponentWithIDInChildren(pID)) !== null)
            return found;
    }

    //Default return null
    return null;
};

/*
    GameObject : getComponentsWithIDInChildren - Gets an array of components with the specified ID
                                                 recursivly through the children
    01/09/2016

    @param[in] pID - The ID of the components type to find

    @return Component Array - Returns an array of all the components with the specified ID throughout
                              this Game Object and its children or null if not found

    Example:

    //Get all components with an ID of 0
    var comps = GameObject.getComponentsWithIDInChildren(0);

    for (var i = comps.length - 1; i >= 0; i--) {
        //TODO: Use components in some way
    }
*/
GameObject.prototype.getComponentsWithIDInChildren = function(pID) {
    //Create a container for the found components
    var comps = null;

    //Check there are components to look through
    if (this.__Internal__Dont__Modify__.components.length) {
        //Ensure the ID is within the bounds of the contained components
        if (pID >= this.__Internal__Dont__Modify__.components[0].ID && pID <= this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID) {
            //Get the direction to move through the array
            var dir = (pID - this.__Internal__Dont__Modify__.components[0].ID < this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID - pID ? 1 : -1);

            //Look through the components for removal
            for (var i = (dir === 1 ? 0 : this.__Internal__Dont__Modify__.components.length - 1); i >= 0 && i < this.__Internal__Dont__Modify__.components.length; i += dir) {
                //Check the ID of the current component
                if (this.__Internal__Dont__Modify__.components[i].ID === pID) {
                    //Create an array to hold the components
                    comps = [this.__Internal__Dont__Modify__.components[i]];

                    //Loop through to find all other components with the ID
                    for (var j = i + dir; j >= 0 && j < this.__Internal__Dont__Modify__.components.length; j += dir) {
                        //Check the ID for match
                        if (this.__Internal__Dont__Modify__.components[j].ID === pID)
                            comps.push(this.__Internal__Dont__Modify__.components[j]);

                        //Exit the search
                        else break;
                    }
                }
            }
        }
    }

    //Look through the children
    var found = null;
    for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the search found a component
        if ((found = this.transform.__Internal__Dont__Modify__.children[i].owner.getComponentsWithIDInChildren(pID)) !== null) {
            //Check if the component array needs creating
            if (comps === null) comps = [];

            //Add the found ocmponents to the array
            comps = comps.concat(found);
        }
    }

    //Return the components
    return comps;
};

/*
    GameObject : removeComponent - Remove a specific component from the current Game Object
    31/08/2016

    @param[in] pComp - The component to remove from the Game Object

    @return bool - Returns true if the component was removed successfully

    Example:

    //Remove the custom component from the game object
    if (!GameObject.removeComponent(customComp)) {
        //TODO: Display error message
    }
*/
GameObject.prototype.removeComponent = function(pComp) {
    //Ensure there are components to check for removal
    if (!this.__Internal__Dont__Modify__.components.length) return false;

    //Ensure the parameter is a component derivative
    if (!ComponentBase.isPrototypeOf(pComp)) return false;

    //Ensure the owner is the current object
    if (pComp.owner !== this) return false;

    //Look through the components list for removal
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--) {
        //Check for the right component
        if (this.__Internal__Dont__Modify__.components[i] === pComp) {
            //Remove the owner value
            pComp.__Internal__Dont__Modify__.owner = null;

            //Remove the component from the list
            this.__Internal__Dont__Modify__.components.splice(i, 1);

            //Return success
            return true;
        }
    }

    //Default return failure
    return false;
};

/*
    GameObject : removeComponentWithID - Remove the first component found with the specified ID
    31/08/2016

    @param[in] pID - The ID of the component type to remove

    @return Component - Returns the component that was removed or null if not found

    Example:

    //Remove the first component with an ID of 0
    if (GameObject.removeComponentWithID(0) !== null) {
        //TODO: Do stuff
    }
*/
GameObject.prototype.removeComponentWithID = function(pID) {
    //Ensure there are components to check for removal
    if (!this.__Internal__Dont__Modify__.components.length) return null;

    //Ensure the ID is within the bounds of the contained components
    if (pID < this.__Internal__Dont__Modify__.components[0].ID || pID > this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID) return null;

    //Get the direction to move through the array
    var dir = (pID - this.__Internal__Dont__Modify__.components[0].ID < this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID - pID ? 1 : -1);

    //Look through the components for removal
    for (var i = (dir === 1 ? 0 : this.__Internal__Dont__Modify__.components.length - 1); i >= 0 && i < this.__Internal__Dont__Modify__.components.length; i += dir) {
        //Check the ID of the current component
        if (this.__Internal__Dont__Modify__.components[i].ID === pID) {
            //Store a reference to the component
            var comp = this.__Internal__Dont__Modify__.components[i];

            //Remove the owner from the component
            comp.__Internal__Dont__Modify__.owner = null;

            //Remove the component from the list
            this.__Internal__Dont__Modify__.components.splice(i, 1);

            //Return the removed component
            return comp;
        }
    }

    //Default return null
    return null;
};

/*
    GameObject : removeComponentsWithID - Remove all components with the specified ID from the
                                          Game Object
    31/08/2016

    @param[in] pID - The ID of the components to remove

    @return Component Array - Returns an array of holding the components that were removed or
                              null if not found

    Example:

    //Remove all components with an ID of 0
    if (GameObject.removeComponentWithID(0) !== null) {
        //TODO: Do stuff
    }
*/
GameObject.prototype.removeComponentsWithID = function(pID) {
    //Ensure there are components to check for removal
    if (!this.__Internal__Dont__Modify__.components.length) return null;

    //Ensure the ID is within the bounds of the contained components
    if (pID < this.__Internal__Dont__Modify__.components[0].ID || pID > this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID) return null;

    //Get the direction to move through the array
    var dir = (pID - this.__Internal__Dont__Modify__.components[0].ID < this.__Internal__Dont__Modify__.components[this.__Internal__Dont__Modify__.components.length - 1].ID - pID ? 1 : -1);

    //Look through the components for removal
    for (var i = (dir === 1 ? 0 : this.__Internal__Dont__Modify__.components.length - 1); i >= 0 && i < this.__Internal__Dont__Modify__.components.length; i += dir) {
        //Check the ID of the current component
        if (this.__Internal__Dont__Modify__.components[i].ID === pID) {
            //Get the number of components to remove
            var count = 1;
            for (var j = i + dir; j >= 0 && j < this.__Internal__Dont__Modify__.components.length; j += dir) {
                //Check the id value on the component
                if (this.__Internal__Dont__Modify__.components[j].ID === pID) count++;
                else break;
            }

            //Get the array of components to remove
            var comps = this.__Internal__Dont__Modify__.components.splice((dir === 1 ? i : i - count - 1), count);

            //Remove the owner from the ocmponents
            for (var j = comps.length - 1; j >= 0; j--)
                comps[j].__Internal__Dont__Modify__.owner = null;

            //Return the removed components
            return comps;
        }
    }

    //Default return null
    return null;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                             Game Object Functions                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    GameObject : findObjectWithTag - Gets a reference to the first Game Object with the specified tag 
    01/09/2016

    @param[in] pTag - The tag of the Game Object to find
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through (Default false)

    @return GameObject - Returns the found GameObejct or null if not found

    Example:

    //Find the gun object on the player
    var gun = playerObject.findObjectWithTag("gun");
*/
GameObject.prototype.findObjectWithTag = function(pTag, pSearchDisabled) {
    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Look through children
    for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if Game Object is disabled
        if (!pSearchDisabled && !this.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.enabled) continue;

        //Check the objects tag
        if (this.transform.__Internal__Dont__Modify__.children[i].owner.tag === pTag)
            return this.transform.__Internal__Dont__Modify__.children[i].owner;
    }

    //Default return null
    return null;
};

/*
    GameObject : findObjectsWithTag - Gets an array of Game Objects with the specified tag 
    01/09/2016

    @param[in] pTag - The tag of the Game Objects to find
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through (Default false)

    @return GameObject Array - Returns an Array of Game Obejcts with the specified tag or
                               null if not found

    Example:

    //Find all the gun obejcts on the player
    var guns = playerObject.findObjectsWithTag("gun");

    //Do something with all gun objects
    for (var i = guns.length - 1; i >= 0; i--) {
        //...
    }
*/
GameObject.prototype.findObjectsWithTag = function(pTag, pSearchDisabled) {
    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Create an array to store the objects
    var objs = null;

    //Look through the children
    for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the object is disabled
        if (!pSearchDisabled && !this.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.enabled) continue;

        //Check the objects tag
        if (this.transform.__Internal__Dont__Modify__.children[i].owner.tag === pTag) {
            //Create the array as needed
            if (objs === null) objs = [];

            //Add the obejct to the array
            objs.push(this.transform.__Internal__Dont__Modify__.children[i].owner);
        }
    }

    //Return the array
    return objs;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                              Pipeline Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    GameObject : updateComponents - Goes down the hierarchy chain updating Game Objects components.
                                    This is called by the scene management and shouldn't be explicitly
                                    called elsewhere.
    31/08/2016

    @param[in] pDelta - The delta time for the current cycle
*/
GameObject.prototype.updateComponents = function(pDelta) {
    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Update the current components within the Game Object
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--) {
        //Check the object is enabled
        if (this.__Internal__Dont__Modify__.components[i].enabled) {
            //Ensure that update function has been set
            if (this.__Internal__Dont__Modify__.components[i].update !== null)
                this.__Internal__Dont__Modify__.components[i].update(pDelta);
        }
    }

    //Recurse into the children objects
    for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.transform.__Internal__Dont__Modify__.children[i].owner.updateComponents(pDelta);
};

/*
    GameObject : updateTransforms - Goes down the hierarchy chain updating the Game Objects transforms.
                                    This is called by the scene management and shouldn't be explicitly
                                    called elsewhere.
    01/09/2016
*/
GameObject.prototype.updateTransforms = function() {
    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Update the current transform
    if (this.transform.updateTransforms()) {
        //TODO: Update the bounding object of the current Game Object
    }

    //Recurse into the children objects
    for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.transform.__Internal__Dont__Modify__.children[i].owner.updateTransforms();
};

/*
    GameObject : drawComponents - Goes down the hierarchy chain drawing Game Objects components.
                                  This is called by the scene management and shouldn't be explicitly
                                  called elsewhere.
    01/09/2016

    @param[in] pCtx - The 2D context object to be used for rendering
*/
GameObject.prototype.drawComponents = function(pCtx) {
    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Update the current components within the Game Object
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--) {
        //Check the object is enabled
        if (this.__Internal__Dont__Modify__.components[i].enabled) {
            //Ensure that update function has been set
            if (this.__Internal__Dont__Modify__.components[i].draw !== null)
                this.__Internal__Dont__Modify__.components[i].draw(pCtx);
        }
    }

    //Recurse into the children objects
    for (var i = this.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.transform.__Internal__Dont__Modify__.children[i].owner.drawComponents(pCtx);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                        Customisable Called Functions                                       ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    GameObject : start - An empty function which can be filled to allow setup of the Game Object
                         at the start of its life in place of the traditional constructor.
    31/08/2016

    Example:

    //Set the startup of the custom object
    CustomObject.prototype.start = function() {
        //TODO: Add required components to the Game Object
    };
*/
GameObject.prototype.start = null;