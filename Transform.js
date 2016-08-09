/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////																											 ////
/////												  Object Definition										 	 ////
/////																											 ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *		Name: Transform
 *		Author: Mitchell Croft
 *		Date: 08/08/2016
 *
 *		Requires:
 *		Mat3.js
 *
 *		Version: 1.0
 *
 *		Purpose:
 *		Provide a method for creating a hierarchal standing between
 *		different game objects
 **/

/*
	Transform : Constructor - Initialise with default values
	08/08/2016

	Example:

	//Create a new transform
	var playerTransform = new Transform();
*/
function Transform() {
	/*	WARNING:
		Don't modify this internal object from the outside of the transform.
		Instead use Transform properties and functions to modify these values
		as this allows for the internal information to update itself and keep it
		correct.
	*/
	this.__Internal__Dont__Modify__ = {
		pos: new Vec2(),
		rot: 0,
		scale: new Vec2(1),
		lclMat: new Mat3(),
		glbMat: new Mat3(),
		parent: null,
		children: []
	};

	//Flag if the transform matricies are invalid and need updating
	this.invalidTransforms = false;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////																											 ////
/////												Property Definitions										 ////
/////																											 ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Transform.prototype = {
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////																											 ////
	/////												Local Space Properties										 ////
	/////																											 ////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*
		Transform : localPosition - Get the local position of the current Transform object
		08/08/2016

		@return Vec2 - Returns the values stored in a Vec2 object

		Example:

		//Get the local position of the player
		var localPlayerPos = playerTransform.localPosition;
	*/
	get localPosition() {
		return new Vec2(this.__Internal__Dont__Modify__.pos);
	},

	/*
		Transform : localPosition - Set the local position of the current Transform object
		08/08/2016

		@param[in] pPos - The new local position stored in a Vec2 object

		Example:

		//Move the local position of the player transform over time
		playerTransform.localPosition = new Vec2(Math.sin(Date.now() * 0.001) * 50, Math.cos(Date.now() * 0.001) * 50);
	*/
	set localPosition(pPos) {
		//Copy the position values
		this.__Internal__Dont__Modify__.pos.set(pPos);

		//Flag transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : localX - Get the local X position of the current Transform object
		08/08/2016

		@return number - Returns the value of the local X position as a number

		Example:

		//Get the players X position
		var playerLocalXPos = playerTransform.localX;
	*/
	get localX() {
		return this.__Internal__Dont__Modify__.pos.x;
	},

	/*
		Transform : localX - Set the local X position of the current Transform object
		08/08/2016

		@param[in] pVal - The new local X position stored as a number

		Example:

		//Move the local X position of the player transform over time
		playerTransform.localX = Math.sin(Date.now() * 0.001) * 50;
	*/
	set localX(pVal) {
		//Copy the the position value
		this.__Internal__Dont__Modify__.pos.x = pVal;

		//Flag transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : localY - Get the local Y position of the current Transform object
		08/08/2016

		@return number - Returns the value of the local Y position as a number

		Example:

		//Get the players Y position
		var playerLocalYPos = playerTransform.localY;
	*/
	get localY() {
		return this.__Internal__Dont__Modify__.pos.y;
	},

	/*
		Transform : localY _ Set the local Y position of the current Transform object
		08/08/2016

		@param[in] pVal - The new local Y position stored as a number

		Example:

		//Move the local Y position of the player transform over time
		playerTransform.localY = Math.cos(Date.now() * 0.001) * 50;
	*/
	set localY(pVal) {
		//Copy the the position value
		this.__Internal__Dont__Modify__.pos.y = pVal;

		//Flag transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : localRotation - Get the local rotation of the current Transform object
		08/08/2016

		@return number - Returns the value of the rotation as a number (In degrees)

		Example:

		//Get the players rotation
		var playerRot = playerTransform.localRotation;
	*/
	get localRotation() {
		return this.__Internal__Dont__Modify__.rot;
	},

	/*
		Transform : localRotation - Set the local rotation of the current Transform object
		08/08/2016

		@param[in] pRot - The new local rotation value stored as a number (In degrees)

		Example:

		//Rotate the player on the spot over time
		playerTransform.localRotation = 360 * Math.sin(Date.now() * 0.001);
	*/
	set localRotation(pRot) {
		//Copy the rotation value
		this.__Internal__Dont__Modify__.rot = pRot;

		//Flag transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : localScale - Get the local scale of the current Transform object
		08/08/2016

		@return Vec2 - Returns the values stored inside a Vec2 object

		Example:

		//Get the players scale 
		var playerLocalScale = playerTransform.localScale;
	*/
	get localScale() {
		return new Vec2(this.__Internal__Dont__Modify__.scale);
	},

	/*
		Transform : localScale - Set the local scale of the current Transform object
		08/08/2016

		@param[in] pScl - The new local scale stored in a Vec2 object

		Example:

		//Modify the players scale over time
		playerTransform.localScale = new Vec2((Math.sin(Date.now() * 0.001) + 1) / 2 * 5);
	*/
	set localScale(pScl) {
		//Copy the scale values
		this.__Internal__Dont__Modify__.scale.set(pScl);

		//Flag transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : localXScale - Get the local X scale of the current Transform object
		08/08/2016

		@return number - Returns the value of the local X scale as a number

		Example:

		//Get the players local X scale
		var playerLocalXScale = playerTransform.localXScale;
	*/
	get localXScale() {
		return this.__Internal__Dont__Modify__.scale.x;
	},

	/*
		Transform : localXScale - Set the local X scale of the current Transform object
		08/08/2016

		@param[in] pVal - The new local X scale stored as a number

		Example:

		//Scale the player over time on the X dimension
		playerTransform.localXScale = (Math.sin(Date.now() * 0.001) + 1) / 2 * 5;
	*/
	set localXScale(pVal) {
		//Copy the scale value
		this.__Internal__Dont__Modify__.scale.x = pVal;

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : localYScale - Get the local Y scale of the current Transform object
		08/08/2016

		@return number - Returns the value of the local Y scale as a number

		Example:

		//Get the players local Y scale
		var playerLocalYScale = playerTransform.localYScale;
	*/
	get localYScale() {
		return this.__Internal__Dont__Modify__.scale.y;
	},

	/*
		Transform : localYScale - Set the local Y scale of the current Transform object
		08/08/2016

		@param[in] pVal - The new local Y scale stored as a number

		Example:

		//Scale the player over time on the Y dimension
		playerTransform.localYScale = (Math.sin(Date.now() * 0.001) + 1) / 2 * 5;
	*/
	set localYScale(pVal) {
		//Copy the scale value
		this.__Internal__Dont__Modify__.scale.y = pVal;

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : localMatrix - Get the local matrix for the current Transform
								  (Accurate as of last updateTransforms call)
		08/08/2016

		@return Mat3 - Returns a Mat3 object with the local matrix

		Example:

		//Get the local matrix of the player
		var playerLocalMat = playerTransform.localMatrix;
	*/
	get localMatrix() {
		return this.__Internal__Dont__Modify__.lclMat;
	},

	/*
		Transform : localMatrix - Set the local matrix for the current Transform
		08/08/2016

		@param[in] pMat - The new local matrix values stored in a Mat3 object

		Example:

		//Reset the players transform values
		playerTransform.localMatrix = new Mat3();
	*/
	set localMatrix(pMat) {
		//Get the translation values
		this.__Internal__Dont__Modify__.pos = new Vec2(pMat.data[2][0], pMat.data[2][1]);

		//Get the rotation values
		this.__Internal__Dont__Modify__.rot = Math.atan2(pMat.data[0][1], pMat.data[1][1]) * 180 / Math.PI;

		//Get the scale values
		this.__Internal__Dont__Modify__.scale = new Vec2(
			Math.sqrt((pMat.data[0][0] * pMat.data[0][0]) + (pMat.data[1][0] * pMat.data[1][0])),
			Math.sqrt((pMat.data[0][1] * pMat.data[0][1]) + (pMat.data[1][1] * pMat.data[1][1])));

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////																											 ////
	/////												Global Space Properties										 ////
	/////																											 ////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*
		Transform : position - Get the global position of the current Transform object 
							   (Accurate as of last updateTransforms call)
		08/08/2016

		@return Vec2 - Returns the values stored in a Vec2 object

		Example:

		//Get the global position of the player
		var playerGlobalPos = playerTransform.position;
	*/
	get position() {
		return new Vec2(this.__Internal__Dont__Modify__.glbMat.data[2][0],
			this.__Internal__Dont__Modify__.glbMat.data[2][1]);
	},

	/*
		Transform : position - Set the global position of the current Transform object
		08/08/2016

		@param[in] pPos - The new global position stored in a Vec2 object

		Example:

		//Move the player to the origin
		playerTransform.position = new Vec2();
	*/
	set position(pPos) {
		//Check if the transform has a parent set
		if (this.__Internal__Dont__Modify__.parent instanceof Transform)
			this.__Internal__Dont__Modify__.pos.set(multiMat3Vec2(this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed, pPos));

		//Otherwise set local position
		else this.__Internal__Dont__Modify__.pos.set(pPos);

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : x - Get the global X position of the current Transform object
						(Accurate as of last updateTransforms call)
		08/08/2016

		@return number - Returns the value of the global X position as a number

		Example:

		//Get the world X position of the player
		var playerXPos = playerTransform.x;
	*/
	get x() {
		return this.__Internal__Dont__Modify__.glbMat.data[2][0];
	},

	/*
		Transform : x - Set the global X position of the current Transform
		08/08/2016

		@param[in] pVal - The new global X position stored as a number

		Example:

		//Move the X position of the player transform over time
		playerTransform.x = Math.sin(Date.now() * 0.001) * 50;
	*/
	set x(pVal) {
		//Check if the Transform has a parent
		if (this.__Internal__Dont__Modify__.parent instanceof Transform) {
			//Create a Vec2 object to hold the value
			var tempVec = new Vec2(pVal, 0);

			//Transform the position by the parent global matrix
			tempVec = multiMat3Vec2(this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed, tempVec);

			//Save the new local X value
			this.__Internal__Dont__Modify__.pos.x = tempVec.x;
		}

		//Otherwise the local position
		else this.__Internal__Dont__Modify__.pos.x = pVal;

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : y - Get the global Y position of the current Transform object
						(Accurate as of last updateTransforms call)
		08/08/2016

		@return number - Returns the value of the global Y position as a number

		Example:

		//Get the world Y position of the player
		var playerYPos = playerTransform.y;
	*/
	get y() {
		return this.__Internal__Dont__Modify__.glbMat.data[2][1];
	},

	/*
		Transform : y - Set the global Y position of the current Transform
		08/08/2016

		@param[in] pVal - The new global Y position stored as a number

		Example:

		//Move the Y position of the player transform over time
		playerTransform.y = Math.sin(Date.now() * 0.001) * 50;
	*/
	set y(pVal) {
		//Check if the Transform has a parent
		if (this.__Internal__Dont__Modify__.parent instanceof Transform) {
			//Create a Vec2 object to hold the value
			var tempVec = new Vec2(0, pVal);

			//Transform the position by the parent global matrix
			tempVec = multiMat3Vec2(this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed, tempVec);

			//Save the new local X value
			this.__Internal__Dont__Modify__.pos.y = tempVec.y;
		}

		//Otherwise the local position
		else this.__Internal__Dont__Modify__.pos.y = pVal;

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : rotation - Get the global rotation of the current Transform object
							   (Accurate as of last updateTransforms call)
		08/08/2016

		@return number - Returns the global rotation as a number (In degrees)

		Example:

		//Get the players global rotation
		var playerGLobalRot = playerTransform.rotation;
	*/
	get rotation() {
		return Math.atan2(this.__Internal__Dont__Modify__.glbMat.data[0][1], this.__Internal__Dont__Modify__.glbMat.data[1][1]) * 180 / Math.PI;
	},

	/*
		Transform : rotation - Set the global rotation of the current Transform object
		08/08/2016

		@param[in] pVal - The new global rotation stored in a number (In degrees)

		Example:

		//Reset the players rotation
		playerTransform.rotation = 0;
	*/
	set rotation(pVal) {
		//Check if this Transform has a parent
		if (this.__Internal__Dont__Modify__.parent instanceof Transform) {
			//Create a rotation matrix from the value
			var tempMat = createRotationMat(pVal * Math.PI / 180);

			//Multiply by the parents inverse
			tempMat = this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed.multiSet(tempMat);

			//Extract the rotation values
			this.__Internal__Dont__Modify__.rot = Math.atan2(tempMat.data[0][1], tempMat.data[1][1]) * 180 / Math.PI;
		}

		//Otherwise set local rotation
		else this.__Internal__Dont__Modify__.rot = pVal;

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : scale - Get the global scale of the current Transform object
							(Accurate as of last updateTransforms call)
		08/08/2016

		@return Vec2 - Returns the scale values stored in a Vec2 object

		Example:

		//Get the global scale of the player
		var playerGlobalScale = playerTransform.scale;
	*/
	get scale() {
		return new Vec2(
			Math.sqrt((this.__Internal__Dont__Modify__.glbMat.data[0][0] * this.__Internal__Dont__Modify__.glbMat.data[0][0]) +
				(this.__Internal__Dont__Modify__.glbMat.data[1][0] * this.__Internal__Dont__Modify__.glbMat.data[1][0])),
			Math.sqrt((this.__Internal__Dont__Modify__.glbMat.data[0][1] * this.__Internal__Dont__Modify__.glbMat.data[0][1]) +
				(this.__Internal__Dont__Modify__.glbMat.data[1][1] * this.__Internal__Dont__Modify__.glbMat.data[1][1])));
	},

	/*
		Transform : scale - Set the global scale of the current Transform object
		08/08/2016

		@param[in] pScl - The new global scale stored in a Vec2 object

		Example:

		//Set the players global scale to half regular size
		playerTransform.scale = new Vec2(0.5);
	*/
	set scale(pScl) {
		//Check if this transform has a parent
		if (this.__Internal__Dont__Modify__.parent instanceof Transform) {
			//Create a scale matrix from the values
			var tempMat = createScaleMat(pScl.x, pScl.y);

			//Multiply by the parents inverse
			tempMat = this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed.multiSet(tempMat);

			//Extract the scale values
			this.__Internal__Dont__Modify__.scale.x = Math.sqrt((tempMat.data[0][0] * tempMat.data[0][0]) + (tempMat.data[1][0] * tempMat.data[1][0]));
			this.__Internal__Dont__Modify__.scale.y = Math.sqrt((tempMat.data[0][1] * tempMat.data[0][1]) + (tempMat.data[1][1] * tempMat.data[1][1]));
		}

		//Otherwise set local scale
		else this.__Internal__Dont__Modify__.scale.set(pScl);

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : scaleX - Get the global scale on the X axis for the current Transform
							 (Accurate as of last updateTransforms call)
		08/08/2016

		@return number - Returns the global X scale as a number

		Example:

		//Get the players global X scale
		var playerXScale = playerTransform.scaleX;
	*/
	get scaleX() {
		return Math.sqrt((this.__Internal__Dont__Modify__.glbMat.data[0][0] * this.__Internal__Dont__Modify__.glbMat.data[0][0]) +
			(this.__Internal__Dont__Modify__.glbMat.data[1][0] * this.__Internal__Dont__Modify__.glbMat.data[1][0]));
	},

	/*
		Transform : scaleX - Set the global scale on the X axis for the current Transform object
		08/08/2016

		@param[in] pVal - The new global X scale values stored in a number

		Example:

		//Halve the length of the players x axis 
		playerTransform.scaleX = 0.5;
	*/
	set scaleX(pVal) {
		//Check if this transform has a parent
		if (this.__Internal__Dont__Modify__.parent instanceof Transform) {
			//Create a scale matrix from the value
			var tempMat = createScaleMat(pVal, pVal);

			//Multiply by the parents inverse
			tempMat = this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed.multiSet(tempMat);

			//Extract the scale values
			this.__Internal__Dont__Modify__.scale.x = Math.sqrt((tempMat.data[0][0] * tempMat.data[0][0]) + (tempMat.data[1][0] * tempMat.data[1][0]));
		}

		//Otherwise set local X scale
		else this.__Internal__Dont__Modify__.scale.x = pVal;

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : scaleY - Get the global scale on the Y axis for the current Transform
							 (Accurate as of last updateTransforms call)
		08/08/2016

		@return number - Returns the global Y scale as a number

		Example:

		//Get the players global Y scale
		var playerYScale = playerTransform.scaleY;
	*/
	get scaleY() {
		return Math.sqrt((this.__Internal__Dont__Modify__.glbMat.data[0][1] * this.__Internal__Dont__Modify__.glbMat.data[0][1]) +
			(this.__Internal__Dont__Modify__.glbMat.data[1][1] * this.__Internal__Dont__Modify__.glbMat.data[1][1]));
	},

	/*
		Transform : scaleY - Set the global scale on the Y axis for the current Transform object
		08/08/2016

		@param[in] pVal - The new global Y scale values stored in a number

		Example:

		//Halve the length of the players y axis 
		playerTransform.scaleY = 0.5;
	*/
	set scaleY(pVal) {
		//Check if this transform has a parent
		if (this.__Internal__Dont__Modify__.parent instanceof Transform) {
			//Create a scale matrix from the value
			var tempMat = createScaleMat(pVal, pVal);

			//Multiply by the parents inverse
			tempMat = this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed.multiSet(tempMat);

			//Extract the scale values
			this.__Internal__Dont__Modify__.scale.y = Math.sqrt((tempMat.data[0][1] * tempMat.data[0][1]) + (tempMat.data[1][1] * tempMat.data[1][1]));
		}

		//Otherwise set local X scale
		else this.__Internal__Dont__Modify__.scale.y = pVal;

		//Flag the transforms as invalid
		this.invalidTransforms = true;
	},

	/*
		Transform : right - Get the direction facing right from the current Transform
							(Accurate as of last updateTransforms call)
		08/08/2016

		@return Vec2 - Returns the direction values as a Vec2 object

		Example:

		//Get the direction of right from the player
		var playerRight = playerTransform.right;
	*/
	get right() {
		return new Vec2(this.__Internal__Dont__Modify__.glbMat.data[0][0], this.__Internal__Dont__Modify__.glbMat.data[0][1]).normalize();
	},

	/*
		Transform : forward - Get the direction facing forward from the current Transform
		08/08/2016

		@return Vec2 - Returns the direction vlaues as a Vec2 object

		//Get the direction of up from the player
		var playerForward = playerTransform.forward;
	*/
	get forward() {
		return new Vec2(this.__Internal__Dont__Modify__.glbMat.data[1][0], this.__Internal__Dont__Modify__.glbMat.data[1][1]).normalize();
	},

	/*
		Transform : globalMatrix - Get the global matrix for the current Transform
								  (Accurate as of last updateTransforms call)
		08/08/2016

		@return Mat3 - Returns a Mat3 object with the global matrix

		Example:

		//Get the local matrix of the player
		var playerGlobalMat = playerTransform.globalMatrix;
	*/
	get globalMatrix() {
		return this.__Internal__Dont__Modify__.glbMat;
	},

	/*
		Transform : globalMatrix - Set the global matrix for the current Transform
		08/08/2016

		@param[in] pMat - The new global matrix values stored in a Mat3 object

		Example:

		//Reset the player to origin
		playerTransform.globalMatrix = new Mat3();
	*/
	set globalMatrix(pMat) {
		//Check if the transform has a parent to bring into local space
		if (this.__Internal__Dont__Modify__.parent instanceof Transform)
			pMat = this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.inversed.multiSet(pMat);

		//Set the local matrix
		this.localMatrix = pMat;
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////																											 ////
	/////												  General Properties										 ////
	/////																											 ////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*
		Transform : parent - Get the parent Transform of the current object
		08/08/2016

		@return Transform - Returns the Transform parent object or null if none

		Example:

		//Get the players transform
		var playerParent = playerTransform.parent;
	*/
	get parent() {
		return this.__Internal__Dont__Modify__.parent;
	},

	/*
		Transform : parent - Set the parent Transform of the current object
		08/08/2016

		@param[in] pTrans - The Transform object to set as the currents parent

		Example:

		//Bind the weapon transform to the player
		weaponTransform.parent = player.Transform;
	*/
	set parent(pTrans) {
		//Add the current as a child of the transform
		pTrans.addChild(this);
	},
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////																											 ////
/////												Main Functions												 ////
/////																											 ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
	Transform : updateTransforms - Update the internal matricies based on transform values and hierarchy
	08/08/2016

	@param[in] pForce - Flags if the transform update should be forced 
	@param[in] pRecurse - Flags if the transform update should recurse into the children transforms

	Example:

	//Update the root transform before draw
	transformRoot.updateTransforms();
	OR
	transformRoot.updateTransforms(true);
	OR
	transformRoot.updateTransforms(true, true);

	//TODO: Render all transform obejcts in scene
*/
Transform.prototype.updateTransforms = function(pForce, pRecurse) {
	//Check the parameter
	if (this.invalidTransforms) pForce = true;
	else if (typeof pForce !== "boolean") pForce = false;

	//Check if transforms should be updated
	if (pForce) {
		//Get the local matrix
		this.__Internal__Dont__Modify__.lclMat = createTransform(
			this.__Internal__Dont__Modify__.pos.x, this.__Internal__Dont__Modify__.pos.y,
			this.__Internal__Dont__Modify__.rot * Math.PI / 180,
			this.__Internal__Dont__Modify__.scale.x, this.__Internal__Dont__Modify__.scale.y);

		//Set the global transform
		this.__Internal__Dont__Modify__.glbMat.set((this.__Internal__Dont__Modify__.parent instanceof Transform ?
			this.__Internal__Dont__Modify__.parent.__Internal__Dont__Modify__.glbMat.multi(this.__Internal__Dont__Modify__.lclMat) :
			this.__Internal__Dont__Modify__.lclMat));
	}

	//Check recurse flag
	if (pRecurse !== false) {
		//Call childrens update transforms
		for (var i = this.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--)
			this.__Internal__Dont__Modify__.children[i].updateTransforms(pForce);
	}

	//Reset the invalid transforms flag
	this.invalidTransforms = false;
};

/*
	Transform : addChild - Adds a Transform object as a child of the current
	08/08/2016

	@param[in] pChild - A Transform object to set as the child

	@return bool - Returns true if the Transform was added as child

	Example:

	//Add the hat transform to the player
	playerTransform.addChild(hatTransform);
*/
Transform.prototype.addChild = function(pChild) {
	//Check if already a child
	if (pChild.__Internal__Dont__Modify__.parent === this) return false;

	//If the new child has a parent remove them from that list
	if (pChild.__Internal__Dont__Modify__.parent instanceof Transform) {
		//Test the removal was a success
		if (!pChild.__Internal__Dont__Modify__.parent.removeChild(pChild))
			return false;
	}

	//Force the childs transforms to update
	pChild.updateTransforms(true, false);

	//Store the current global matrix
	var tempGlobal = pChild.__Internal__Dont__Modify__.glbMat;

	//Add the child to the children array
	this.__Internal__Dont__Modify__.children.push(pChild);

	//Set the childs parent
	pChild.__Internal__Dont__Modify__.parent = this;

	//Set the global matrix
	pChild.globalMatrix = tempGlobal;

	//Flag the new childs transform as invalid
	pChild.invalidTransforms = true;

	//Return success
	return true;
};

/*
	Transform : removeChild - Remove a Transform object from being a child of the current
	08/08/2016

	@param[in] pChild - A Transform to remove from the current's children

	@return bool - Returns true if the Transform was removed from the children list

	Example:

	//Player drops their weapon in environment
	playerTransform.removeChild(weaponTransform);
*/
Transform.prototype.removeChild = function(pChild) {
	//Check the parent is the current
	if (pChild.__Internal__Dont__Modify__.parent !== this) return false;

	//Loop through the children list
	for (var i = this.__Internal__Dont__Modify__.children.length - 1; i >= 0; i--) {
		//Look for matching child object
		if (this.__Internal__Dont__Modify__.children[i] === pChild) {
			//Force the childs transforms to update
			pChild.updateTransforms(true, false);

			//Transform values into the global space
			pChild.localMatrix = pChild.__Internal__Dont__Modify__.glbMat;

			//Remove the parent
			pChild.__Internal__Dont__Modify__.parent = null;

			//Remove the child from the list
			this.__Internal__Dont__Modify__.children.splice(i, 1);

			//Flag the new childs transform as invalid
			pChild.invalidTransforms = true;

			//Return success
			return true;
		}
	}

	//Default return false
	return false;
};

/*
	Transform : transformPoint - Transform a point from this Transforms local space to 
								 world space (Accurate as of last updateTransforms call)
	08/08/2016

	@param[in] pVec - The point to transform

	@return Vec2 - Returns a Vec2 object holding the transformed point

	Example:

	//Transform the point in front of the player into world space
	var ahead = playerTransform.transformPoint(new Vec2(0, 1).multi(AHEAD_CHECK_LENGTH));
*/
Transform.prototype.transformPoint = function(pVec) {
	return multiMat3Vec2(this.__Internal__Dont__Modify__.glbMat, pVec);
};

/*
	Transform : inverseTransformPoint - Transform a point from world space to this Transforms
			 							local space (Accurate as of last updateTransforms call)
	08/08/2016

	@param[in] pVec - The point to inversly transform

	@return Vec2 - Returns a Vec2 object holding the transformed point

	Example:

	//Transform the enemy position into players local space
	var enemyInLocal = playerTransform.inverseTransformPoint(enemyPos);
*/
Transform.prototype.inverseTransformPoint = function(pVec) {
	return multiMat3Vec2(this.__Internal__Dont__Modify__.glbMat.inversed, pVec);
};