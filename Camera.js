/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////																											 ////
/////											 Object Definition											 	 ////
/////																											 ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *		Name: Camera
 *		Author: Mitchell Croft
 *		Date: 02/08/2016
 *
 *		Requires:
 *		Vec2.js, Mat3.js
 *
 *		Version: 1.0
 *
 *		Purpose:
 *		Provide a basic 2D orthographic camera for rendering
 *		game worlds to a HTML5 canvas object
 **/

/*
	Camera : Constructor - Initialise with default values for specified viewport dimensions
	02/08/2016

	@param[in] pWidth - The width of the viewport the camera will using
	@param[in] pHeight - The height of the viewport the camera will using
	@param[in] pDist - Scales the drawn elements to give the appearance of
					   distance. 1 is regular. Must be greater than 0. (Default 0)

	Example:

	//Create the world camera
	var worldCam = new Camera(1280, 720);
	OR
	var worldCam = new Camera(1280, 720, 5);
*/
function Camera(pWidth, pHeight, pDist) {
	//Store the position of the camera in the world
	this.position = new Vec2();

	//Store the rotation of the camera (Radians)
	this.rotation = 0;

	//Create and store a projection matrix
	this.projection = new Mat3();
	this.projection.data[0][0] = this.projection.data[1][1] = 2 / pDist;
	this.projection.data[2][0] = pWidth / 2;
	this.projection.data[2][1] = pHeight / 2;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////																											 ////
/////												Property Definitions										 ////
/////																											 ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Camera.prototype = {
	/*
		Camera : width - Get the width of the vieport the camera is using
		02/08/2016

		@return number - Returns the width as a number

		Example:

		//Get the width of the camera's view
		var cameraWidth = Camera.width;
	*/
	get width() {
		return this.projection.data[2][0] * 2;
	},

	/*
		Camera : width - Set the width of the viewport the camera is using
		02/08/2016

		@param[in] pVal - The value to set the viewport width to

		Example:

		//Resize the camera width
		Camera.width = CANVAS_WIDTH;
	*/
	set width(pVal) {
		this.projection.data[2][0] = pVal / 2;
	},

	/*
		Camera : height - Get the height of the viewport the camera is using
		02/08/2016

		@return number - Returns the height as a number

		Example:

		//Get the height of the camera's view
		var cameraHeight = Camera.height;
	*/
	get height() {
		return this.projection.data[2][1] * 2;
	},

	/*
		Camera : height - Set the height of the viewport the camera is using
		02/08/2016

		@param[in] pVal - The value to set the viewport height to

		Example:

		//Resize camera height
		Camera.height = CANVAS_HEIGHT:
	*/
	set height() {
		this.projection.data[2][1] = pVal / 2;
	},

	/*
		Camera : x - Get the X position of the Camera object
		02/08/2016

		@return number - Returns the X position as a number

		Example:

		//Get the x position of the camera
		var camPosX = Camera.x;
	*/
	get x() {
		return position.x;
	},

	/*
		Camera : x - Set the X position of the Camera object
		02/08/2016

		@param[in] pVal - The new value to set as the X position

		Example:

		//Move the camera to the players X position
		Camera.x = playerPosition.x;
	*/
	set x(pVal) {
		this.position.x = pVal;
	},

	/*
		Camera : y - Get the Y position of the Camera object
		02/08/2016

		@return number - Returns the Y position as a number

		Example:

		//Get the y position of the camera
		var camPosY = Camera.y;
	*/
	get y() {
		return this.position.y;
	},

	/*
		Camera : y - Set the Y position of the Camera object
		02/08/2016

		@param[in] pVal - The new value to set as the Y position

		Example:

		//Move the camera to the players Y position
		Camera.y = playerPosition.y;
	*/
	set y(pVal) {
		this.position.y = pVal;
	},

	/*
		Camera : distance - Get the scale value emulating distance from the canvas
		02/08/2016

		@return number - Returns a number representing the distance of the camera

		Example:

		//Get the distance of the camera
		var camDistance = Camera.distance;
	*/
	get distance() {
		return 2 / this.projection.data[0][0];
	},

	/*
		Camera : distance - Set the scale value emulating distance from the canvas
		02/08/2016

		@param[in] pVal - The value to set the distance to

		Example:

		//Zoom the camera in and out over time
		Camera.distance = ((Math.sin(Date.now()) + 1) / 2) * (MAX - MIN) + MIN;
	*/
	set distance(pVal) {
		this.projection.data[0][0] =
			this.projection.data[1][1] = 2 / pVal;
	},

	/*
		Camera : transform - Get the transform for the Camera object
		02/08/2016

		@return Mat3 - Returns a Mat3 object holding the transform for the camera

		Example:

		//Get the camera's transform
		var camTransform = Camera.transform;
	*/
	get transform() {
		return createTransform(this.position.x, this.position.y, this.rotation);
	},

	/*
		Camera : view - Get the view matrix from the Camera object
		02/08/2016

		@return Mat3 - Returns a Mat3 object holding the view matrix for the camera

		Example:

		//Get the camera's view matrix
		var camView = Camera.view;
	*/
	get view() {
		return this.transform.inverse();
	},

	/*
		Camera : projectionView - Get the projection view matrix from the Camera object
		02/08/2016

		@return Mat3 - Returns a Mat3 object holding the projection view matrix for the camera

		Example:

		//Get the projection view matrix
		var projView = Camera.projectionView;
	*/
	get projectionView() {
		return this.projection.multi(this.view);
	}
};