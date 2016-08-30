//Create the graphics manager
var graphics = new Graphics(window.innerWidth, window.innerHeight);

//Set the window resize callback
graphics.setWindowResizeCallback(function(pWidth, pHeight) {
    //Force the graphics canvas to match the window size
    graphics.size = new Vec2(pWidth, pHeight);

    //Debug out the new canvas dimensions
    console.log(pWidth + " " + pHeight);
});

//Set the canvas within the Input Manager
Input.setCanvas(graphics.canvas);

//Create the input axis
Input.addAxis(new InputAxis("move", Keys.W, Keys.S));
Input.addAxis(new InputAxis("turn", Keys.D, Keys.A, 2, 5));
Input.addAxis(new InputAxis("zoom", Keys.UP));

var PLAYER_SPEED = 350;
var PLAYER_TURN_SPEED = 270;

//Create the scene root node
var rootNode = new Transform();

//Define the player object
var player = {
    transform: new Transform(),
    shape: createPrimitiveShape(ShapeType.TRIANGLE, 30)
};
player.transform.parent = rootNode;
player.shape.fillColor = new Color("#F00");
player.shape.outlineColor = new Color();

//Define the player child
var playerChild = {
    transform: new Transform(),
    shape: createPrimitiveShape(ShapeType.CIRCLE, 10)
};
playerChild.transform.parent = player.transform;
playerChild.transform.localY = 15;
playerChild.transform.localYScale = 2;
playerChild.shape.fillColor = new Color().randomize();

//Define the area in which the game objects can spawn
var spawnBounds = new Vec2(graphics.width * 15, graphics.height * 15);

//Create the game objects
var objects = [];
for (var i = 0; i < 1000; i++) {
    objects[i] = {
        transform: new Transform(),
        shapes: [createPrimitiveShape(Math.floor(Math.random() * 3), Math.random() * 90 + 10),
            createPrimitiveShape(Math.floor(Math.random() * 3), Math.random() * 90 + 10)
        ]
    };

    //Generate a random position
    objects[i].transform.localPosition = new Vec2(-spawnBounds.x / 2 + Math.random() * spawnBounds.x, -spawnBounds.y / 2 + Math.random() * spawnBounds.y);

    //Generate a random rotation
    objects[i].localRotation = 360 * Math.random();

    //Add as a child of the root node
    objects[i].transform.parent = rootNode;

    //Generate a random fill color
    for (var j = 0; j < objects[i].shapes.length; j++)
        objects[i].shapes[j].fillColor = new Color().randomize();
}

//Create the camera
var camera = new Camera(graphics.canvas, 1920, 1080, 2);
var CAMERA_SPEED = 2;

//Create the cameras canvas size change callback
graphics.addCanvasResizeEvent(function(pWidth, pHeight) {
    //Set the canvas size
    camera.canvasDimensions = new Vec2(pWidth, pHeight);
});

///Initial update of all transforms
rootNode.updateTransforms();

function gameLoop(pDelta) {
    //Update the input manager
    Input.update(pDelta);

    //Move the player
    player.transform.localRotation += PLAYER_TURN_SPEED * Input.getAxis("turn") * pDelta;
    player.transform.localPosition = player.transform.localPosition.addSet(player.transform.forward.multi(PLAYER_SPEED * Input.getAxis("move") * pDelta));

    //Move the camera to center on player
    camera.position = camera.position.lerp(player.transform.position, CAMERA_SPEED * pDelta);
    camera.distance = Input.getAxis("zoom") * (20 - 2) + 2;

    //Clear the background
    graphics.draw.fillStyle = "black";
    graphics.draw.fillRect(0, 0, graphics.width, graphics.height);

    //Update all of the transforms
    rootNode.updateTransforms();

    //Get the camera projection view
    var projView = camera.projectionView;

    //Draw all objects
    for (var i = 0; i < objects.length; i++) {
        //Get the shape to render
        var merged = objects[i].shapes[0].morph(objects[i].shapes[1], (Math.sin(Date.now() * 0.001) + 1) / 2);

        //Render the shape
        merged.draw(graphics.draw, projView.multi(objects[i].transform.globalMatrix));
    }

    //Draw the player child
    playerChild.shape.draw(graphics.draw, projView.multi(playerChild.transform.globalMatrix));

    //Draw the player
    player.shape.draw(graphics.draw, projView.multi(player.transform.globalMatrix));

    //Display Text
    graphics.draw.font = "25px Arial";
    graphics.draw.textAlign = "left";
    graphics.outlineText("FPS: " + (1 / pDelta).toFixed(0), 5, 30);

    graphics.draw.textAlign = "right";

    graphics.outlineText("Player Transform Values", graphics.width - 5, 30);

    graphics.draw.font = "15px Arial";
    graphics.outlineText("Local Position: " + player.transform.localPosition.toString(0), graphics.width - 5, 50);
    graphics.outlineText("Local Rotation: " + player.transform.localRotation.toFixed(0), graphics.width - 5, 70);
    graphics.outlineText("Local Scale: " + player.transform.localScale.toString(0), graphics.width - 5, 90);

    graphics.outlineText("Global Position: " + player.transform.position.toString(0), graphics.width - 5, 130);
    graphics.outlineText("Global Rotation: " + player.transform.rotation.toFixed(0), graphics.width - 5, 150);
    graphics.outlineText("Global Scale: " + player.transform.scale.toString(0), graphics.width - 5, 170);

    graphics.draw.font = "25px Arial";

    graphics.outlineText("Child Transform Values", graphics.width - 5, 210);

    graphics.draw.font = "15px Arial";
    graphics.outlineText("Local Position: " + playerChild.transform.localPosition.toString(0), graphics.width - 5, 230);
    graphics.outlineText("Local Rotation: " + playerChild.transform.localRotation.toFixed(0), graphics.width - 5, 250);
    graphics.outlineText("Local Scale: " + playerChild.transform.localScale.toString(0), graphics.width - 5, 270);

    graphics.outlineText("Global Position: " + playerChild.transform.position.toString(0), graphics.width - 5, 310);
    graphics.outlineText("Global Rotation: " + playerChild.transform.rotation.toFixed(0), graphics.width - 5, 330);
    graphics.outlineText("Global Scale: " + playerChild.transform.scale.toString(0), graphics.width - 5, 350);
};

StateManager.setGameFunction(gameLoop);