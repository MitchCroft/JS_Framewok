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
 *      Transform.js, Bounds.js, ComponentBase.js
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
 *      PlayerObj.prototype = Object.create(GameObject.prototype);
 *      PlayerObj.prototype.constructor = PlayerObj;
 **/

/*
    GameObject : Virtual Constructor - Initialise with default values
    31/08/2016

    @param[in] pTag - The optional tag to be given to the Game Object 
                      (Default "Game Object") 
*/
function GameObject(pTag) {
    /*  WARNING:
        Don't modify this internal object from the outside of the Game Object.
        Instead use properties and functions to modify these values as this 
        allows for the internal information to update itself and keep it correct.
    */
    this.__Internal__Dont__Modify__ = {
        tag: (typeof pTag === "string" ? pTag : "Game Object"),
        transform: new Transform(this),

        enabled: true,
        initialised: false,
        components: [],

        forceBoundsUpdate: true,
        lclBounds: new Bounds(),
        glbBounds: null,

        destroy: false,
        disposed: false
    };

    //Force Transform to update in the first pass
    this.__Internal__Dont__Modify__.transform.invalidTransforms = true;
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
        //Check if the object has been disposed of
        if (this.__Internal__Dont__Modify__.disposed)
            throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'get tag'");

        //Return the enabled flag
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
        //Check if the object has been disposed of
        if (this.__Internal__Dont__Modify__.disposed)
            throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'set tag'");

        //Set the current state
        this.__Internal__Dont__Modify__.enabled = pState;

        //Recurse into the children objects and set enabled states
        for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
            this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.enabled = pState;
    },

    /*
        GameObject : tag - Get the tag of the current Game Object
        23/09/2016

        @return string - Returns a string that is the tag for the Game Object

        Example:

        //Loop through a group of objects to find the player
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].tag === "Player") {
                //TODO: Use the player
            }
        }
    */
    get tag() {
        //Check if the object has been disposed of
        if (this.__Internal__Dont__Modify__.disposed)
            throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'get tag'");

        //Return the tag
        return this.__Internal__Dont__Modify__.tag;
    },

    /*
        GameObject : tag - Set the tag of the current Game Object
        23/09/2016

        @param[in] pTag - A string value representing the new tag for the Game Object

        Example:

        //Assign the 'Player' tag to the player object
        playerObj.tag = "Player";
    */
    set tag(pTag) {
        //Check if the object has been disposed of
        if (this.__Internal__Dont__Modify__.disposed)
            throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'set tag'");

        //Assign if the passed in value is a string
        if (typeof pTag === "string")
            this.__Internal__Dont__Modify__.tag = pTag;
    },

    /*
        GameObject : transform - Return the Transform object that belongs to the current
                                 Game Object
        23/09/2016

        @return Transform - Returns a Transform object

        Example:

        //Get the players current position
        var playerPos = playerObj.transform.position;
    */
    get transform() {
        //Check if the object has been disposed of
        if (this.__Internal__Dont__Modify__.disposed)
            throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'get transform'");

        //Return the Transform object
        return this.__Internal__Dont__Modify__.transform;
    },

    /*
        GameObject : bounds - Returns the global Bounds object for the Game Object
        29/09/2016

        @return Bounds - Returns a Bounds object with the bounds values for the object

        Example:

        //Get the Game Objects global bounds
        var glbBounds = playerObj.bounds;
    */
    get bounds() {
        //Check if the object has been disposed of
        if (this.__Internal__Dont__Modify__.disposed)
            throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'get bounds'");

        //Return the Bounds object
        return this.__Internal__Dont__Modify__.glbBounds;
    },

    /*
        GameObject : disposed - Returns the disposal state of this Game Object
        23/09/2016

        @return bool - Returns true if the Game Object has been disposed of and
                       is unusable

        Example:

        //Check if the Custom Object is useable before attempting
        if (!customObj.disposed) {
            //TODO: Do stuff
        }
    */
    get disposed() {
        return this.__Internal__Dont__Modify__.disposed;
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
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'addComponent'");

    //Ensure the parameter is a component derivative
    if (!pComp instanceof ComponentBase) return false;

    //Ensure that the owner is not the current object
    if (pComp.owner === this) return false;

    //Otherwise if the component has a previous owner
    else if (pComp.owner !== null) {
        //Attempt removal of component
        if (!pComp.owner.removeComponent(pComp))
            return false;
    }

    //Set the owner of the component
    pComp.transferOwnership(this);

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
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'createComponent'");

    //Evauluate the type of object to create
    var evaluatedType = eval(pType);

    //Create the new object
    var obj = new evaluatedType();

    //Test to ensure it is a component type
    if (!obj instanceof ComponentBase)
        throw new Error("Could not create a component of type " + pType + " as it is not a ComponentBase type. Ensure that the type you are trying to create derives from ComponentBase");

    //Set the owner of the new object
    obj.transferOwnership(this);

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
GameObject.prototype.getComponentWithID = function(pID) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'getComponentWithID'");

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
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'getComponentsWithID'");

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
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through (Default false)

    @return Component - Returns the first component found with the specified ID or null if not found

    Example:

    //Get any component in the matrix chain with an ID of 0
    var comp = GameObject.getComponentWithIDInChildren(0);
*/
GameObject.prototype.getComponentWithIDInChildren = function(pID, pSearchDisabled) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'getComponentWithIDInChildren'");

    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Check the search flag against state
    if (!pSearchDisabled && !this.__Internal__Dont__Modify__.enabled) return null;

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
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the search found a component
        if ((found = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.getComponentWithIDInChildren(pID, pSearchDisabled)) !== null)
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
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through (Default false)

    @return Component Array - Returns an array of all the components with the specified ID throughout
                              this Game Object and its children or null if not found

    Example:

    //Get all components with an ID of 0
    var comps = GameObject.getComponentsWithIDInChildren(0);

    for (var i = comps.length - 1; i >= 0; i--) {
        //TODO: Use components in some way
    }
*/
GameObject.prototype.getComponentsWithIDInChildren = function(pID, pSearchDisabled) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'getComponentsWithIDInChildren'");

    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Check the search flag against state
    if (!pSearchDisabled && !this.__Internal__Dont__Modify__.enabled) return null;

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
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the search found a component
        if ((found = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.getComponentsWithIDInChildren(pID, pSearchDisabled)) !== null) {
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
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'removeComponent'");

    //Ensure there are components to check for removal
    if (!this.__Internal__Dont__Modify__.components.length) return false;

    //Ensure the parameter is a component derivative
    if (!pComp instanceof ComponentBase) return false;

    //Ensure the owner is the current object
    if (pComp.owner !== this) return false;

    //Look through the components list for removal
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--) {
        //Check for the right component
        if (this.__Internal__Dont__Modify__.components[i] === pComp) {
            //Remove the owner value
            pComp.transferOwnership(null);

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
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed.  Called function 'removeComponentWithID'");

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
            comp.transferOwnership(null);

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
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'removeComponentsWithID'");

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

            //Remove the owner from the components
            for (var j = comps.length - 1; j >= 0; j--)
                comps[j].transferOwnership(null);

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

    @return GameObject - Returns the found Game Object or null if not found

    Example:

    //Find the gun object on the player
    var gun = playerObject.findObjectWithTag("gun");
*/
GameObject.prototype.findObjectWithTag = function(pTag, pSearchDisabled) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'findObjectWithTag'");

    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Look through children
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if Game Object is disabled
        if (!pSearchDisabled && !this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.enabled) continue;

        //Check the objects tag
        if (this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.tag === pTag)
            return this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner;
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

    //Find all the gun objects on the player
    var guns = playerObject.findObjectsWithTag("gun");

    //Do something with all gun objects
    for (var i = guns.length - 1; i >= 0; i--) {
        //...
    }
*/
GameObject.prototype.findObjectsWithTag = function(pTag, pSearchDisabled) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'findObjectsWithTag'");

    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Create an array to store the objects
    var objs = null;

    //Look through the children
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the object is disabled
        if (!pSearchDisabled && !this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.enabled) continue;

        //Check the objects tag
        if (this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.tag === pTag) {
            //Create the array as needed
            if (objs === null) objs = [];

            //Add the object to the array
            objs.push(this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner);
        }
    }

    //Return the array
    return objs;
};

/*
    GameObject : findObjectWithTagInChildren - Gets a reference to the first Game Object with the specified tag
                                               recursivly through the children
    03/09/2016

    @param[in] pTag - The tag of the Game Object to find
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through (Default false)

    @return GameObject - Returns the found Game Object or null if not found

    Example:

    //Find the gun object in the players hierarchy
    var gun = playerObject.findObjectWithTagInChildren("gun");
*/
GameObject.prototype.findObjectWithTagInChildren = function(pTag, pSearchDisabled) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'findObjectWithTagInChildren'");

    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Look through children
    var found = null;
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if Game Object is disabled
        if (!pSearchDisabled && !this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.enabled) continue;

        //Check the objects tag
        if (this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.tag === pTag)
            return this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner;

        //Recurse into the child
        if ((found = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.findObjectWithTagInChildren(pTag, pSearchDisabled)) !== null)
            return found;
    }

    //Default return null
    return null;
};

/*
    GameObject : findObjectsWithTagInChildren - Gets an array of Game Objects with the specified tag recirsivly
                                                through the children
    03/09/2016

    @param[in] pTag - The tag of the Game Objects to find
    @param[in] pSearchDisabled - Flags if disabled Game Objects should be searched through (Default false)

    @return GameObject Array - Returns an Array of Game Objects with the specified tag or
                               null if not found

    Example:

    //Find all the gun objects in the players hierarchy
    var guns = playerObject.findObjectsWithTagInChildren("gun");

    //Do something with all gun objects
    for (var i = guns.length - 1; i >= 0; i--) {
        //...
    }
*/
GameObject.prototype.findObjectsWithTagInChildren = function(pTag, pSearchDisabled) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'findObjectsWithTagInChildren'");

    //Clean search flag
    if (typeof pSearchDisabled !== "boolean") pSearchDisabled = false;

    //Create an array to store the objects
    var objs = null;

    //Look through the children
    var found = null;
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the object is disabled
        if (!pSearchDisabled && !this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.enabled) continue;

        //Check the objects tag
        if (this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.tag === pTag) {
            //Create the array as needed
            if (objs === null) objs = [];

            //Add the object to the array
            objs.push(this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner);
        }

        //Recurse into the children
        if ((found = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.findObjectsWithTagInChildren(pTag, pSearchDisabled)) !== null) {
            //Create the array as needed
            if (objs === null) objs = [];

            //Add the objects to the array
            objs = objs.concat(found);
        }
    }

    //Return the array
    return objs;
};

/*
    GameObject : destroy - Flag this Game Object, its components and its children for removeal
    23/09/2016

    Example:

    //Destroy the player object when they die
    if (!playerObj.alive)
        playerObj.destroy();
*/
GameObject.prototype.destroy = function() {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed.  Called function 'destroy'");

    this.__Internal__Dont__Modify__.destroy = true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                              Pipeline Functions                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    GameObject : internalUpdate - Goes down the hierarchy chain updating the Game Objects. This is
                                  called by the scene management and shouldn't be explicitly called
                                  elsewhere.
    13/09/2016

    @param[in] pDelta - The delta time for the current cycle
*/
GameObject.prototype.internalUpdate = function(pDelta) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'internalUpdate'");

    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Check if this object has been initialised
    if (!this.__Internal__Dont__Modify__.initialised) {
        //Check if a start function has been set
        if (this.start !== null)
            this.start();

        //Flag as initialised
        this.__Internal__Dont__Modify__.initialised = true;
    }

    //Call this objects update function
    if (this.update !== null) this.update(pDelta);

    //Update all children
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Check if the child should be destroyed
        if (this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.destroy) {
            //Dispose of the Game Object
            this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.dispose();

            //Remove the child from the list
            this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.splice(i, 1);

            //Force the bounds of the object to update
            this.__Internal__Dont__Modify__.forceBoundsUpdate = true;
        }

        //Otherwise recurse down into the child
        else this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.internalUpdate(pDelta);
    }
};

/*
    GameObject : internalLateUpdate - Goes down the hierarchy chain updating the Game Objects. This is
                                      called by the scene management and shouldn't be explicitly called
                                      elsewhere.
    13/09/2016

    @param[in] pDelta - The delta time for the current cycle
*/
GameObject.prototype.internalLateUpdate = function(pDelta) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'internalLateUpdate'");

    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Check if this object has been initialised
    if (!this.__Internal__Dont__Modify__.initialised) {
        //Check if a start function has been set
        if (this.start !== null)
            this.start();

        //Flag as initialised
        this.__Internal__Dont__Modify__.initialised = true;
    }

    //Call this objects update function
    if (this.lateUpdate !== null) this.lateUpdate(pDelta);

    //Recurse into children
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.internalLateUpdate(pDelta);
};

/*
    GameObject : updateComponents - Goes down the hierarchy chain updating Game Objects components.
                                    This is called by the scene management and shouldn't be explicitly
                                    called elsewhere.
    31/08/2016

    @param[in] pDelta - The delta time for the current cycle
*/
GameObject.prototype.updateComponents = function(pDelta) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'updateComponents'");

    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Update the current components within the Game Object
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--) {
        //Check if the component should be destroyed
        if (this.__Internal__Dont__Modify__.components[i].__Internal__Dont__Modify__.destroy) {
            //Dispose of the component
            this.__Internal__Dont__Modify__.components[i].internalDispose();

            //Remove the component from the list
            this.__Internal__Dont__Modify__.components.splice(i, 1);

            //Force the bounds of the object to update
            this.__Internal__Dont__Modify__.forceBoundsUpdate = true;
        }

        //Check the object is enabled
        else if (this.__Internal__Dont__Modify__.components[i].__Internal__Dont__Modify__.enabled) {
            //Ensure that update function has been set
            if (this.__Internal__Dont__Modify__.components[i].update !== null)
                this.__Internal__Dont__Modify__.components[i].update(pDelta);
        }
    }

    //Recurse into the children objects
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.updateComponents(pDelta);
};

/*
    GameObject : lateUpdateComponents - Goes down the hierarchy chain updating Game Objects components.
                                        This is called by the scene management and shouldn't explicitly
                                        called elsewhere.
    03/10/2016

    @param[in] pDelta - The delta time for the current cycle
*/
GameObject.prototype.lateUpdateComponents = function(pDelta) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'lateUpdateComponents'");

    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Update the current components within the Game Object
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--) {
        //Check if the component should be destroyed
        if (this.__Internal__Dont__Modify__.components[i].__Internal__Dont__Modify__.destroy) {
            //Dispose of the component
            this.__Internal__Dont__Modify__.components[i].internalDispose();

            //Remove the component from the list
            this.__Internal__Dont__Modify__.components.splice(i, 1);

            //Force the bounds of the object to update
            this.__Internal__Dont__Modify__.forceBoundsUpdate = true;
        }

        //Check the object is enabled
        else if (this.__Internal__Dont__Modify__.components[i].__Internal__Dont__Modify__.enabled) {
            //Ensure that update function has been set
            if (this.__Internal__Dont__Modify__.components[i].lateUpdate !== null)
                this.__Internal__Dont__Modify__.components[i].lateUpdate(pDelta);

            //Ensure that update bounds function has been set
            if (this.__Internal__Dont__Modify__.components[i].updateBounds !== null) {
                //Check if the bounds where updated
                if (this.__Internal__Dont__Modify__.components[i].updateBounds())
                    this.__Internal__Dont__Modify__.forceBoundsUpdate = true;
            }
        }
    }

    //Recurse into the children objects
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.lateUpdateComponents(pDelta);
};

/*
    GameObject : updateTransforms - Goes down the hierarchy chain updating the Game Objects transforms.
                                    This is called by the scene management and shouldn't be explicitly
                                    called elsewhere.
    01/09/2016

    @param[in] pParentForce - Flags if the parent object has updated its transform and the child objects
                              need to update their global transform matricies

    @return bool - Returns true if the GameObject's transform or components where updated
*/
GameObject.prototype.updateTransforms = function(pParentForce) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'updateTransforms'");

    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Flag if the transform was updated
    var transformUpdated = false;

    //Update the current transform
    if (this.__Internal__Dont__Modify__.transform.updateTransforms(pParentForce, false))
        transformUpdated = true;

    //Recurse into the children objects
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
        //Test if the child objects have update position or component bounds
        if (this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.updateTransforms(transformUpdated))
            this.__Internal__Dont__Modify__.forceBoundsUpdate = true;
    }

    //Check if bounds needs to be updated
    if (transformUpdated || this.__Internal__Dont__Modify__.forceBoundsUpdate) {
        //Check if the local bounds need updating
        if (this.__Internal__Dont__Modify__.forceBoundsUpdate) {
            //Reset the local bounds
            this.__Internal__Dont__Modify__.lclBounds = new Bounds();

            //Encapsulate the Game Objects components 
            for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--)
                this.__Internal__Dont__Modify__.lclBounds.encapsulate(this.__Internal__Dont__Modify__.components[i].lclBounds);

            //Loop through and encapsulate the childrens bounds
            for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
                this.__Internal__Dont__Modify__.lclBounds.encapsulate(this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.__Internal__Dont__Modify__.lclBounds.getGlobalBounds(
                    this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].localMatrix));

            //Reset the force update flag
            this.__Internal__Dont__Modify__.forceBoundsUpdate = false;
        }

        //Set the global bounds of the game object
        this.__Internal__Dont__Modify__.glbBounds = this.__Internal__Dont__Modify__.lclBounds.getGlobalBounds(this.__Internal__Dont__Modify__.transform.globalMatrix);

        //Return bounds updated
        return true;
    }

    //Default return false
    return false;
};

/*
    GameObject : drawComponents - Goes down the hierarchy chain drawing Game Objects components.
                                  This is called by the scene management and shouldn't be explicitly
                                  called elsewhere.
    01/09/2016

    @param[in] pCtx - The 2D context object to be used for rendering
    @param[in] pProjView - The projection view matrix from the rendering Camera
    @param[in] pVisBounds - A Bounds object defining the area that is being rendered, to enable 
                            scene culling
*/
GameObject.prototype.drawComponents = function(pCtx, pProjView, pVisBounds) {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'drawComponents'");

    //Check if this Game Object is still active
    if (!this.__Internal__Dont__Modify__.enabled) return;

    //Check if the Game Object is visible
    if (!this.__Internal__Dont__Modify__.glbBounds.isIntersecting(pVisBounds)) return;

    //Recurse into the children objects
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.drawComponents(pCtx, pProjView, pVisBounds);

    //Store the projection world view matrix
    var projectionWorldView = null;
    if (this.__Internal__Dont__Modify__.components.length)
        projectionWorldView = pProjView.multi(this.__Internal__Dont__Modify__.transform.globalMatrix);

    //Update the current components within the Game Object
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--) {
        //Check the object is enabled
        if (this.__Internal__Dont__Modify__.components[i].__Internal__Dont__Modify__.enabled) {
            //Ensure that update function has been set
            if (this.__Internal__Dont__Modify__.components[i].draw !== null)
                this.__Internal__Dont__Modify__.components[i].draw(pCtx, projectionWorldView);
        }
    }
};

/*
    GameObject : dispose - Recurse down and dispose of child Game Objects and components to clear
                           requried data
    13/09/2016
*/
GameObject.prototype.dispose = function() {
    //Check if the object has been disposed of
    if (this.__Internal__Dont__Modify__.disposed)
        throw new Error("Trying to use the Game Object " + this + " (Tag: " + this.__Internal__Dont__Modify__.tag + ") after it has been disposed. Called function 'dispose'");

    //Recurse down into child Game Objects
    for (var i = this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
        this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children[i].owner.dispose();

    //Clear the the child list
    this.__Internal__Dont__Modify__.transform.__Internal__Dont__Modify__.children = [];

    //Call components dispose functions
    for (var i = this.__Internal__Dont__Modify__.components.length - 1; i >= 0; i--)
        this.__Internal__Dont__Modify__.components[i].internalDispose();

    //Clear the components list
    this.__Internal__Dont__Modify__.components = [];

    //Call this objects on destroy function
    if (this.onDestroy !== null)
        this.onDestroy();

    //Set the disposed flag
    this.__Internal__Dont__Modify__.disposed = true;
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

/*
    GameObject : update - An empty function which can be filled to allow the Game Object
                          to update itself every cycle
    03/09/2016

    @param[in] number - If function is defined a number will be passed into the function that 
                        contains the delta time for the current cycle

    Example:

    //Set the update of the custom object
    CustomObject.prototype.update = function(pDelta) {
        //Move the object in the world
    };
*/
GameObject.prototype.update = null;

/*
    GameObject : lateUpdate - An empty function which can be filled to allow the Game Object
                              to preform additional update logic after the main update
    03/09/2016

    @param[in] number - If function is defined a number will be passed into the function that 
                        contains the delta time for the current cycle

    Example:

    //Set the late update of the custom object
    CustomObject.prototype.lateUpdate = function(pDelta) {
        //React to the players actions
    };
*/
GameObject.prototype.lateUpdate = null;

/*
    GameObject : onTrigger - An empty function which can be filled to allow the Game Object
                             to preform actions when the current Game Object is set to be a 
                             physics trigger and a physics object enters its bounds
    03/09/2016

    @param[in] GameObject - Passes in the object that is contained in the trigger area

    Example:

    //Set the on trigger of the custom object
    CustomObject.prototype.onTrigger = function(pObject) {
        //Check if player object and react accordingly
    };
*/
GameObject.prototype.onTrigger = null;

/*
    GameObject : onDestroy - An empty function which can be filled to allow the Game Object
                             to preform any actions required at the end of the Game Objects
                             life
    13/09/2016

    Example:

    //Set the on destroy of the custom object
    CustomObject.prototype.onDestroy = function() {
        //Increase player score, Spawn additional enemies etc.
    };
*/
GameObject.prototype.onDestroy = null;