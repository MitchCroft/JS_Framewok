/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                   Emitter Types                                            ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: EmitterType
 *      Author: Mitchell Croft
 *      Date: 25/10/2016
 *
 *      Purpose:
 *      Label the different types of emitter that 
 *      can be created
 **/

var EmitterType = { POINT: 0, DIRECTION: 1, LINE: 2 };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: ParticleComponent
 *      Author: Mitchell Croft
 *      Date: 25/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      ComponentBase.js, Color.js, ExtendProperties.js
 *
 *      Purpose:
 *      Provide a method for emitting basic particles 
 *      from a Game Object
 **/

/*
    ParticleComponent : Constructor - Initialise with default values
    25/10/2016
*/
function ParticleComponent() {
    //Call the Component Base Constructor for initial setup.
    ComponentBase.call(this, ComponentID.PARTICLES);

    //Flag if the emitter is currently running
    this.__Internal__Dont__Modify__.running = false;

    //Store the emitter values
    this.__Internal__Dont__Modify__.type = EmitterType.POINT;

    this.__Internal__Dont__Modify__.maximum = 25;
    this.__Internal__Dont__Modify__.aliveParticles = 0;

    this.__Internal__Dont__Modify__.emitTimer = 0;
    this.__Internal__Dont__Modify__.emitRate = 1.0 / 25;

    this.__Internal__Dont__Modify__.direction = new Vec2(0, -1);
    this.__Internal__Dont__Modify__.length = 100;

    this.__Internal__Dont__Modify__.runTime = -1;
    this.__Internal__Dont__Modify__.progress = 0;

    //Store the particle settings to be randomised
    this.__Internal__Dont__Modify__.minLife = 0;
    this.__Internal__Dont__Modify__.maxLife = 5;

    this.__Internal__Dont__Modify__.minVel = 100;
    this.__Internal__Dont__Modify__.maxVel = 500;

    this.__Internal__Dont__Modify__.negRot = -360;
    this.__Internal__Dont__Modify__.posRot = 360;

    //Store the particle change over life values
    this.__Internal__Dont__Modify__.startSize = 50;
    this.__Internal__Dont__Modify__.endSize = 0;

    this.__Internal__Dont__Modify__.startColor = new Color(255, 255, 255, 1);
    this.__Internal__Dont__Modify__.endColor = new Color(0, 0, 0, 0);

    this.__Internal__Dont__Modify__.particleImage = null;

    //Store an array of the particles
    this.__Internal__Dont__Modify__.particles = [];

    //Store a reference to the furthest particle from the origin
    this.__Internal__Dont__Modify__.furthestParticle = null;

    //Store the scale factor of the owner Game Object
    this.__Internal__Dont__Modify__.ownerScale = 1;
};

//Apply the ComponentBase prototype
ParticleComponent.prototype = Object.create(ComponentBase.prototype);
ParticleComponent.prototype.constructor = ParticleComponent;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                               Property Definitions                                         ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ExtendProperties(ParticleComponent, {
    /*
        ParticleComponent : running - Get's the running flag of the component
        25/10/2016

        @return bool - Returns true if the Particle Component is currently emitting

        Example:

        //Check if the particle component is currently active
        if (!particleComp.running)
            particleComp.start();
    */
    get running() {
        return this.__Internal__Dont__Modify__.running;
    },

    /*
        ParticleComponent : running - Set the running state of the component
        25/10/2016

        @param[in] pState - A bool value indicating the new running state

        Example:

        //Start the particle emitter
        particleComp.running = true;

        OR

        //Stop the particle emitter
        particleComp.running = false;
    */
    set running(pState) {
        //Switch based on state
        if (pState) this.start();
        else this.stop();
    },

    /*
        ParticleComponent : activeParticles - Get's the current number of active particles
        25/10/2016

        @return number - Returns a number containing the number of currently active particles

        Example:

        //Track the number of active particles
        console.log(particleComp.activeParticles);
    */
    get activeParticles() {
        return this.__Internal__Dont__Modify__.aliveParticles;
    },

    /*
        ParticleComponent : type - Get's the type of the Particle Component
        25/10/2016

        @return EmitterType - Returns a value that is defined in the EmitterType object

        Example:
        
        //Output the type of emitter the component is
        console.log(particleComp.type);
    */
    get type() {
        return this.__Internal__Dont__Modify__.type;
    },

    /*
        ParticleComponent : type - Set the type of emission this component will use
        25/10/2016

        @param[in] pVal - A value representing one of the types defined in the EmitterType
                          object.

        Example:

        //Set the emitter component to a point emitter
        particleComp.type = EmitterType.POINT;
    */
    set type(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set emitter type to " + pVal + " (Type: '" + typeof pVal + "') Please use a type defined in the EmitterType object");

        //Set the type
        this.__Internal__Dont__Modify__.type = pVal;
    },

    /*
        ParticleComponent : maximum - Get the maximum number of particles available
        25/10/2016

        @return number - Returns a number containing the maximum number of particles

        Example:

        //Get the maximum number of particles
        var max = particleComp.maximum;
    */
    get maximum() {
        return this.__Internal__Dont__Modify__.maximum;
    },

    /*
        ParticleComponent : maximum - Set the maximum number of particles available
                                      (Is only applied if not currently running)
        25/10/2016

        @param[in] pVal - A number representing the new maximum number of particles

        Example:

        //Set the maximum count for particles
        particleComp.maximum = 200;
    */
    set maximum(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set emitter maximum to " + pVal + " (Type: '" + typeof pVal + "') Please use a number");

        //Ensure that the emitter is not currently running
        if (!this.__Internal__Dont__Modify__.running) {
            //Set the value
            this.__Internal__Dont__Modify__.maximum = pVal;
        }
    },

    /*
        ParticleComponent : emitRate - Get the current emit rate for the particles
        25/10/2016

        @return number - Returns a number containing the number of particles 
                         emitted per second

        Example:

        //Get the number of particles emitted per second
        var perSec = particlesComp.emitRate;
    */
    get emitRate() {
        return (1 / this.__Internal__Dont__Modify__.emitRate);
    },

    /*
        ParticleComponent : emitRate - Set the emit rate of the Particle Component
        25/10/2016

        @param[in] pVal - A number defining the number of particles emitted per second

        Example:

        //Set high emit rate
        particleComp.emitRate = 500;
    */
    set emitRate(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set emitter's emit rate to " + pVal + " (Type: '" + typeof pVal + "') Please use a number");

        //Check the value is > 0
        if (pVal > 0) this.__Internal__Dont__Modify__.emitRate = 1 / pVal;

        //Otherwise stop the emission 
        else this.stop();
    },

    /*
        ParticleComponent : direction - Get the direction particles are emitted in local space
                                        (EmitterType.DIRECTION and EmitterType.LINE only)
        25/10/2016

        @return Vec2 - Returns a normalized Vec2 object defining the direction of emission

        Example:

        //Get the emitters direction
        var dir = particleComp.direction;
    */
    get direction() {
        return new Vec2(this.__Internal__Dont__Modify__.direction);
    },

    /*
        ParticleComponent : direction - Set the direction that particles will be emitted in local space
                                        (EmitterType.DIRECTION and EmitterType.LINE only)
        25/10/2016

        @param[in] pDir - A Vec2 object defining the direction

        Example:

        //Set the particles to emit up the screen
        particleComp.direction = new Vec2(0, -1);
    */
    set direction(pDir) {
        //Check the type
        if (!pDir instanceof Vec2)
            throw new Error("Can not set emitter direction to " + pDir + " (Type: '" + typeof pDir + "') Please use a Vec2 object");

        //Set the values
        this.__Internal__Dont__Modify__.direction.set(pDir);

        //Re-normalize the direction
        this.__Internal__Dont__Modify__.direction.normalize();
    },

    /*
        ParticleComponent : lineLength - Get the length of the line particles are emitted from
                                         (EmitterType.LINE only)
        25/10/2016

        @return number - Returns a number defining the length of the emission line

        Example:

        //Get the length of emission line
        var length = particleComp.lineLength;
    */
    get lineLength() {
        return this.__Internal__Dont__Modify__.length;
    },

    /*
        ParticleComponent : lineLength - Set the length of the line particles are emitted from
                                         (EmitterType.LINE only)
        25/10/2016

        @param[in] pVal - A number defining the new lenth of the emission line

        Example:

        //Set the emission line length 
        particleComp.lineLength = 600;
    */
    set lineLength(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set the line length of the emitter to " + pval + " (Type: '" + typeof pVal + "') Please use a number");

        //Set the length
        this.__Internal__Dont__Modify__.length = pVal;
    },

    /*
        ParticleComponent : runTime - Get's the length of time that the particles will
                                      be emitted for
        25/10/2016

        @return number - Returns a number with the total runtime in seconds

        Example:

        //Get the amount of time the emitter will run run
        var totalTime = particleComp.runTime;
    */
    get runTime() {
        return this.__Internal__Dont__Modify__.runTime;
    },

    /*
        ParticleComponent : runTime - Set the length of time that the particles will be 
                                      emitted for
        25/10/2016

        @param[in] pVal - A number defining the amount of time in seconds the emitter will
                          remain active (-1 is constant)

        Example:

        //Set the emitter to be constant
        particleComp.runTime = -1;
    */
    set runTime(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set the run time of the emitter to " + pVal + " (Type: '" + typeof pVal + "') Please use a number");

        //Set the time
        this.__Internal__Dont__Modify__.runTime = pVal;
    },

    /*
        ParticleComponent : minLife - Get's the minimum life span of a particle
        25/10/2016

        @return number - Returns a number containing the value

        Example:

        //Get the minimum life span of a particle
        var min = particleComp.minLife;
    */
    get minLife() {
        return this.__Internal__Dont__Modify__.minLife;
    },

    /*
        ParticleComponent : minLife - Set the minimum life span of a particle
        25/10/2016

        @param[in] pVal - A number defining the new minimum lifespan for a particle

        Example:

        //Set a very long life span for a particle
        particleComp.minLife = 60;
    */
    set minLife(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set the minimum life time of a particle to " + pVal + " (Type: '" + typeof pVal + "') Please use a number");

        //Set the value
        this.__Internal__Dont__Modify__.minLife = pVal;

        //Ensure the maximum is > the min
        if (this.__Internal__Dont__Modify__.maxLife < pVal)
            this.__Internal__Dont__Modify__.maxLife = pVal + 1;
    },

    /*
        ParticleComponent : maxLife - Get's the maximum life span of a particle
        25/10/2016

        @return number - Returns a number containing the value

        Example:

        //Get the maximum life span of a particle
        var max = particleComp.maxLife;
    */
    get maxLife() {
        return this.__Internal__Dont__Modify__.maxLife;
    },

    /*
        ParticleComponent : maxLife - Set the maximum life span of a particle
        25/10/2016

        @param[in] pVal - A number defining the new maximum lifespan for a particle

        Example:

        //Set a very short life span for a particle
        particleComp.maxLife = 1;
    */
    set maxLife(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set the maximum life time of a particle to " + pVal + " (Type: " + typeof pVal + "') Please use a number");

        //Set the value
        this.__Internal__Dont__Modify__.maxLife = pVal;

        //Ensure the minimum is < the max
        if (this.__Internal__Dont__Modify__.minLife > pVal)
            this.__Internal__Dont__Modify__.minLife = pVal - 1;
    },

    /*
        ParticleComponent : minVelocity - Get's the minimum velocity of particle
        25/10/2016

        @return number - Returns a number containing the minumum velocity

        Example:

        //Get the minimum velocity for a particle
        var min = particleComp.minVelocity;
    */
    get minVelocity() {
        return this.__Internal__Dont__Modify__.minVel;
    },

    /*
        ParticleComponent : minVelocity - Set the minimum velocity of a particle
        25/10/2016

        @param[in] pVal - A number defining the minimum velocity for a particle

        Example:

        //Set a high velocity
        particleComp.minVelocity = 5000;
    */
    set minVelocity(pVal) {
        //Check the type 
        if (typeof pVal !== "number")
            throw new Error("Can not set the minimum velocity of a particle to " + pVal + " (Type: " + typeof pVal + "') Please use a number");

        //Set the value
        this.__Internal__Dont__Modify__.minVel = pVal;

        //Ensure the minimum velocity is < the maximum
        if (this.__Internal__Dont__Modify__.maxVel < pVal)
            this.__Internal__Dont__Modify__.maxVel = pVal + 1;
    },

    /*
        ParticleComponent : maxVelocity - Get's the maximum velocity of a particle
        25/10/2016

        @return number - Returns a number containing the maximum velocity

        Example:

        //Get the maximum velocity for a particle
        var max = particleComp.maxVelocity;
    */
    get maxVelocity() {
        return this.__Internal__Dont__Modify__.maxVel;
    },

    /*
        ParticleComponent : maxVelocity - Set the maximum velocity of a particle
        25/10/2016

        @param[in] pVal - A number defining the maximum velocity for a particle

        Example:

        //Set a low velocity
        particleComp.maxvelocity = 5;
    */
    set maxVelocity(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set the maximum velocity of a particle to " + pVal + " (Type: '" + typeof pVal + "') Please use a number");

        //Set the value
        this.__Internal__Dont__Modify__.maxVel = pVal;

        //Ensure that the maximum velocity is > the minimum
        if (this.__Internal__Dont__Modify__.minVel > pVal)
            this.__Internal__Dont__Modify__.minVel = pVal - 1;
    },

    /*
        ParticleComponent : negativeRotation - Get's the maximum possible negative 
                                               rotation that can be generated
        25/10/2016

        @return number - Returns a number containing the maximum negative rotation

        Example:

        //Get the maximum negative rotation
        var maxNeg = particleComp.negativeRotation;
    */
    get negativeRotation() {
        return this.__Internal__Dont__Modify__.negRot;
    },

    /*
        ParticleComponent : negativeRotation - Set the maximum possible negative
                                               rotation that can be generated
        25/10/2016

        @param[in] pVal - A number defining the maximum negative rotation for a particle
                          (<= 0, In degrees per second)

        Example:

        //Set the maximum negative spin to two revolutions
        particleComp.negativeRotation = -720;
    */
    set negativeRotation(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set the maximum negative rotation of a particle to " + pVal + " (Type: '" + typeof pVal + "') Please use a number");

        //Set the value
        this.__Internal__Dont__Modify__.negRot = math.min(0, pVal);
    },

    /*
        ParticleComponent : positiveRotation - Get's the maximum possible positive
                                               rotation that can be generated
        25/10/2016

        @return number - Returns a number containing the maximum positive rotation

        Example:

        //Get the maximum positive rotation
        var maxPos = particleComp.positiveRotation;
    */
    get positiveRotation() {
        return this.__Internal__Dont__Modify__.posRot;
    },

    /*
        ParticleComponent : positiveRotation - Set the maximum possible positive
                                               rotation that can be generated
        25/10/2016

        @param[in] pVal - A number defining the maximum positive rotation for a particle
                          (>= 0, In degrees per second)

        Example:

        /Set the maximum positive spin to two revolutions
        particleComp.positiveRotation = 720;
    */
    set positiveRotation(pVal) {
        //Check the type
        if (typeof pVal !== "number")
            throw new Error("Can not set the maximum positive rotation of a particle to " + pVal + " (Type: " + typeof pVal + "') Please use a number");

        //Set the value
        this.__Internal__Dont__Modify__.posRot = math.max(0, pVal);
    },

    /*
        ParticleComponent : startColor - Get's the starting color for the particles
        25/10/2016

        @return Color - Returns a Color object containing the starting color

        Example:

        //Get the starting color of the particles
        var startCol = particleComp.startColor;
    */
    get startColor() {
        return this.__Internal__Dont__Modify__.startColor;
    },

    /*
        ParticleComponent : startColor - Set the starting color for the particles
        25/10/2016

        @param[in] pCol - A Color object defining the starting color for particles

        Example:

        //Start the particles as white 
        particleComp.startColor = new Color("#FFF");
    */
    set startColor(pCol) {
        //Check the type
        if (!pCol instanceof Color)
            throw new Error("Can not set the starting particle color to " + pCol + " (Type: '" + typeof pColor + "') Please use a color object");

        //Set the starting color
        this.__Internal__Dont__Modify__.startColor.set(pCol);
    },

    /*
        ParticleComponent : endColor - Get's the ending color for the particles
        25/10/2016

        @return Color - Returns a Color object containing the ending color

        Example:

        //Get the ending color of the particles
        var endCol = particleComp.endColor;
    */
    get endColor() {
        return this.__Internal__Dont__Modify__.endColor;
    },

    /*
        ParticleComponent : endColor - Set the ending color for the particles
        25/10/2016

        @param[in] pCol - A Color object defining the ending color for particles

        Example:

        //End the particles as black
        particleComp.endColor = new Color("#000");
    */
    set endColor(pCol) {
        //Check the type 
        if (!pCol instanceof Color)
            throw new Error("Can not set the ending particle color to " + pCol + " (Type: '" + typeof pCol + "') Please use a color object");

        //Set the ending color
        this.__Internal__Dont__Modify__.endColor;
    },

    /*
        ParticleComponent : particleImage - Get's the image object being used to display particles
        25/10/2016

        @return Image - Returns the Image object being used to display particles

        Example:

        //Get the image in use by the emitter
        var image = particleComp.particleImage;
    */
    get particleImage() {
        return this.__Internal__Dont__Modify__.particleImage;
    },

    /*
        ParticleComponent : particleImage - Set the image object being used to display particles
        25/10/2016

        @param[in] pImg - An Image object that will be used to display particles or null to remove

        Example:

        //Set the emitter to use smoke textures
        particleComp.particleImage = SMOKE_IMG_OBJ;
    */
    set particleImage(pImg) {
        //Check if the type is null
        if (!pImg) {
            //Clear the saved image
            this.__Internal__Dont__Modify__.particleImage = null;

            //Leave the function
            return;
        }

        //Check the type
        if (!pImg instanceof Image)
            throw new Error("Can not use " + pImg + " (Type: '" + typeof pImg + "') as the particle display image. Please use an Image object");

        //Set the value
        this.__Internal__Dont__Modify__.particleImage = pImg;
    },
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                  Main Definitions                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    ParticleComponent : start - Start emitting particles with the current settings
    25/10/2016

    Example:

    //Start the emitter
    particleComp.start();
*/
ParticleComponent.prototype.start = function() {
    //Ensure the emitter is not already running
    if (this.__Internal__Dont__Modify__.running) return;

    //Create all of the particle objects to re-use
    for (var i = 0; i < this.__Internal__Dont__Modify__.maximum; i++)
        this.__Internal__Dont__Modify__.particles[i] = new Particle();

    //Reset the emit timer
    this.__Internal__Dont__Modify__.emitTimer = 0;

    //Reset the furthest particle
    this.__Internal__Dont__Modify__.furthestParticle = null;

    //Flag the emitter as running
    this.__Internal__Dont__Modify__.running = true;
};

/*
    ParticleComponent : stop - Stop the emission of particles
    25/10/2016

    @param[in] pForce - Optional flag that indicates the immediate 
                        removal of all particles in use (Default false)

    Example:

    //Stop the particle emitter
    particleComp.stop();

    OR

    //Force the particle emitter to stop
    particleComp.stop(true);
*/
ParticleComponent.prototype.stop = function(pForce) {
    //Reset the running flag
    this.__Internal__Dont__Modify__.running = false;

    //Check the force flag
    if (pForce === true) {
        //Clear all particles
        this.__Internal__Dont__Modify__.particles = [];

        //Reset the alive particles coutner
        this.__Internal__Dont__Modify__.aliveParticles = 0;

        //Reset the furthest particle reference
        this.__Internal__Dont__Modify__.furthestParticle = null;
    }
};

/*
    ParticleComponent : emit - Emit a new particle with the current settings. This is called
                               by the update cycle automatically
    25/10/2016
*/
ParticleComponent.prototype.emit = function() {
    //Check there are particles that can be emitted
    if (this.__Internal__Dont__Modify__.aliveParticles >= this.__Internal__Dont__Modify__.maximum)
        return;

    //Get the next particle object
    var particle = this.__Internal__Dont__Modify__.particles[this.__Internal__Dont__Modify__.aliveParticles++];

    //Reset the lifetime
    particle.lifetime = 0;
    particle.lifespan = Math.random() * (this.__Internal__Dont__Modify__.maxLife - this.__Internal__Dont__Modify__.minLife) + this.__Internal__Dont__Modify__.minLife;

    //Set the starting size and color
    particle.size = this.__Internal__Dont__Modify__.startSize * this.__Internal__Dont__Modify__.ownerScale;
    particle.color.set(this.__Internal__Dont__Modify__.startColor);

    //Assign a rotation
    particle.rotation = 0;
    particle.rotationSpeed = (Math.random() * (this.__Internal__Dont__Modify__.posRot - this.__Internal__Dont__Modify__.negRot) + this.__Internal__Dont__Modify__.negRot) * Math.PI / 180;

    //Give the particle a starting position
    switch (this.__Internal__Dont__Modify__.type) {
        case EmitterType.POINT:
        case EmitterType.DIRECTION:
            particle.position.reset();
            break;
        case EmitterType.LINE:
            //Get the adjacent vector
            var adj = this.__Internal__Dont__Modify__.direction.right;

            //Backtrack along the line by half of the length
            var lineStart = adj.negative.multi(this.__Internal__Dont__Modify__.length / 2);

            //Get a random position along the line
            particle.position.set(lineStart.addSet(adj.multiSet(Math.random() * this.__Internal__Dont__Modify__.length)));
            break;
    }

    //Transform the position of the particle
    particle.position.set(this.owner.transform.transformPoint(particle.position));

    //Assign a direction 
    switch (this.__Internal__Dont__Modify__.type) {
        case EmitterType.POINT:
            particle.velocity.x = Math.random() * 2 - 1;
            particle.velocity.y = Math.random() * 2 - 1;
            particle.velocity.normalize();
            break;
        case EmitterType.DIRECTION:
        case EmitterType.LINE:
            //Give the particle the emitters direction
            particle.velocity.set(this.__Internal__Dont__Modify__.direction.rotated(this.owner.transform.rotation * Math.PI / 180));
            break;
    }

    //Generate a random velocity magnitude
    particle.velocity.multiSet(Math.random() * (this.__Internal__Dont__Modify__.maxVel - this.__Internal__Dont__Modify__.minVel) + this.__Internal__Dont__Modify__.minVel);
};

/*
    ParticleComponent : update - Update the positions and values of the particles being emitted
    25/10/2016

    @param[in] pDelta - The delta time for the cycle
*/
ParticleComponent.prototype.update = function(pDelta) {
    //Add onto the runtime progress 
    if (this.__Internal__Dont__Modify__.running && this.__Internal__Dont__Modify__.runTime >= 0) {
        //Add to the progress timer
        this.__Internal__Dont__Modify__.progress += pDelta;

        //Check if the runtime is over
        if (this.__Internal__Dont__Modify__.progress >= this.__Internal__Dont__Modify__.runTime)
            this.stop();
    }

    //Update the scale factor from the owner
    this.__Internal__Dont__Modify__.ownerScale = Math.max(this.owner.transform.scaleX, this.owner.transform.scaleY);

    //Store the value of the furthest distance particle
    var furthestDistSq = 0;

    //Update the alive particles
    var currDistSq = 0;
    for (var i = 0; i < this.__Internal__Dont__Modify__.aliveParticles;) {
        //Get the current particle
        var particle = this.__Internal__Dont__Modify__.particles[i];

        //Increase the lifetime
        particle.lifetime += pDelta;

        //Check if the particle is dead
        if (particle.lifetime > particle.lifespan) {
            //Swap with the last alive particle
            this.__Internal__Dont__Modify__.particles[i] = this.__Internal__Dont__Modify__.particles[this.__Internal__Dont__Modify__.aliveParticles - 1];
            this.__Internal__Dont__Modify__.particles[this.__Internal__Dont__Modify__.aliveParticles - 1] = particle;

            //Redice the alive particles
            this.__Internal__Dont__Modify__.aliveParticles--;

            //Continue to the next particle
            continue;
        }

        //Update the alive particle
        particle.position.addSet(particle.velocity.multi(pDelta));

        //Lerp for the size of the particle
        particle.size = (this.__Internal__Dont__Modify__.startSize * this.__Internal__Dont__Modify__.ownerScale) +
            ((this.__Internal__Dont__Modify__.endSize * this.__Internal__Dont__Modify__.ownerScale) - (this.__Internal__Dont__Modify__.startSize * this.__Internal__Dont__Modify__.ownerScale)) *
            (particle.lifetime / particle.lifespan);

        //Lerp for the color of the particle
        particle.color.set(colorLerp(this.__Internal__Dont__Modify__.startColor, this.__Internal__Dont__Modify__.endColor, particle.lifetime / particle.lifespan));

        //Add rotation
        particle.rotation += particle.rotationSpeed * pDelta;

        //Check if the particle is now the furthest
        if ((currDistSq = (particle.position.subtract(this.owner.transform.position).sqrMag + particle.size * particle.size)) > furthestDistSq) {
            //Store the furthest distance squared
            furthestDistSq = currDistSq;

            //Store the furthest particle
            this.__Internal__Dont__Modify__.furthestParticle = particle;
        }

        //Increase the loop progress
        i++;
    }

    //Spawn new particles
    if (this.__Internal__Dont__Modify__.running) {
        //Add time to the emitter timer
        this.__Internal__Dont__Modify__.emitTimer += pDelta;

        //Keep emitting particles while they are owed
        while (this.__Internal__Dont__Modify__.emitTimer >= this.__Internal__Dont__Modify__.emitRate) {
            //Emit a new particle
            this.emit();

            //Reduce the emit timer by the value
            this.__Internal__Dont__Modify__.emitTimer -= this.__Internal__Dont__Modify__.emitRate;
        }
    }
};

/*
    ParticleComponent : updateBounds - Update the visible bounds of the Particle Component
    25/10/2016

    @return bool - Returns true if the visible bounds have updated
*/
ParticleComponent.prototype.updateBounds = function() {
    //Check if the bounds will update 
    if (!this.__Internal__Dont__Modify__.furthestParticle) {
        //Check if the local bounds are already zeroed out
        if (this.lclBounds.min.equal(this.lclBounds.max) && this.lclBounds.min.sqrMag === 0)
            return false;

        //Otherwise update the min and max at zero
        this.lclBounds.min.set(this.lclBounds.max.reset());

        //Return updated 
        return true;
    }

    //Get the distance to the furthest particle
    var distance = this.__Internal__Dont__Modify__.furthestParticle.position.subtract(this.owner.transform.position).mag + this.__Internal__Dont__Modify__.furthestParticle.size;

    //Set the bounds
    this.lclBounds.min.x = this.lclBounds.min.y = -distance;
    this.lclBounds.max.x = this.lclBounds.max.y = distance;

    //Wipe the furthest particle reference
    this.__Internal__Dont__Modify__.furthestParticle = null;

    //Return the bounds have changed
    return true;
};

/*
    ParticleComponent : draw - Render all particle objects to the screen 
    25/10/2016

    @param[in] pCtx - The 2D context object to be used for rendering
    @param[in] pProjWorldView - The projection world view Mat3 object for the viewing camera
                           and the parent game object
*/
ParticleComponent.prototype.draw = function(pCtx, pProjWorldView) {
    //Get the projection view matrix
    var projView = pProjWorldView.multi(this.owner.transform.globalMatrix.inversed);

    //Loop through all active particles
    for (var i = 0; i < this.__Internal__Dont__Modify__.aliveParticles; i++) {
        //Get the current particle
        var particle = this.__Internal__Dont__Modify__.particles[i];

        //Create the particle transform
        var transform = projView.multi(createTransform(particle.position.x, particle.position.y, particle.rotation));

        //Set the transform
        pCtx.setTransform(transform.data[0][0], transform.data[0][1], transform.data[1][0], transform.data[1][1], transform.data[2][0], transform.data[2][1]);

        //If there is an image to draw
        if (this.__Internal__Dont__Modify__.particleImage) {
            //Set the global alpha
            pCtx.globalAlpha = particle.color.a;

            //Render the particle
            pCtx.drawImage(this.__Internal__Dont__Modify__.particleImage, -particle.size / 2, -particle.size / 2, particle.size, particle.size);
        }

        //If the colored rectangle is being drawn
        else {
            //Set the render color
            pCtx.fillStyle = particle.color.rgba;

            //Render the particle
            pCtx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        }
    }

    //Set the identity transform
    pCtx.setTransform(1, 0, 0, 1, 0, 0);

    //Reset the global alpha
    pCtx.globalAlpha = 1;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                                            ////
/////                                                 Object Definition                                          ////
/////                                                                                                            ////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 *      Name: Particle
 *      Author: Mitchell Croft
 *      Date: 25/10/2016
 *
 *      Version: 1.0
 *
 *      Requires:
 *      Vec2.js, Color.js
 *
 *      Purpose:
 *      Store relevant information related to the position
 *      and size of an individual particle
 **/

/*
    Particle : Constructor - Initialise with default values
    25/10/2016
*/
function Particle() {
    this.position = new Vec2();
    this.velocity = new Vec2();
    this.color = new Color();
    this.size = 0;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.lifetime = 0;
    this.lifespan = 0;
};