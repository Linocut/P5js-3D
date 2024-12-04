
let world;
let light1;
let light2;

let lightSpeed = 0.22; 
let objectSpeed = 0.22; 
// array to hold some particles
let particles = [];
let particles2 =[];

var currentImage = 0;

function setup() {

	noCanvas();

	world = new World('VRScene');

	 let sky = new Sky({
        asset: 'sky1',
        fog: false, // Disable fog effect on skybox
       // position: "0 0 0",  // Set skybox far away from the camera
       // scale: "1 1 1"  // Scale it to make it huge
    });
	world.add(sky);

  
  	// create a plane to serve as our "ground"
		var g = new Plane({
						x:0, y:0, z:0,
						width:64, height:64,
						//asset: 'sand',
                      color: '#FFF',
						repeatX: 64,
						repeatY: 64,
						rotationX:-90, metalness:0.25
					   });

	// add the plane to our world
	world.add(g);
  
  	light1 = new Light({
		x: 0, y: 5, z: 2,
		color: '#FDACCD',
		type: 'point',
		intensity: 0.8
	})
	world.add(light1)


	// an ambient light - this light has no position and lights all entities equally
	light2 = new Light({
		color: '#C5E3F8',
		type: 'ambient',
		intensity: 0.3
	})
	world.add(light2)
    var light3 = new Light({
      x: 0.5, y: 1, z: 1,
      color: '#fff',
      type: 'directional', 
      intensity: 0.8, 
      
    })
 world.add(light3)

 
}

function draw() {
  // Move our light around
  light1.nudge(lightSpeed, 0, 0);

  // Bounce logic
  if (light1.getX() > 10 || light1.getX() < -10) {
    lightSpeed *= -1;
  }

  // Create a new particle (ball)
  let newParticle = new ball(random(-30, 30), random(-30, 30), random(-30, 30));
  particles.push(newParticle);

  // Draw and update all ball particles
  for (let particleIndex = 0; particleIndex < particles.length; particleIndex++) {
    let isParticleDone = particles[particleIndex].move();
    if (isParticleDone) {
      particles.splice(particleIndex, 1);
      particleIndex--; // Adjust index after removal
    }
  }

  // Create a new particle (line)
  let newLine = new Line(random(-30, 30), random(-30, 30), random(-30, 30));
  particles2.push(newLine);

  // Draw and update all line particles
  for (let lineIndex = 0; lineIndex < particles2.length; lineIndex++) {
    let isLineDone = particles2[lineIndex].move();
    if (isLineDone) {
      particles2.splice(lineIndex, 1);
      lineIndex--; // Adjust index after removal
    }
  }
}

class ball{
  
  
	constructor(x,y,z) {

		// construct a new Box that lives at this position
		this.myBall = new Sphere({
								x:x, y:y, z:z,
								color: '#000',
								radius: random(0.1,0.8)
		});

		// add the box to the world
		world.add(this.myBall);

		// keep track of an offset in Perlin noise space
		this.xOffset = random(1000);
		this.zOffset = random(2000, 3000);
	}
  
  
  	move() {
		// compute how the particle should move
		// the particle should always move up by a small amount
		var yMovement = 0.01;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.05, 0.05);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.05, 0.05);

		// update our poistions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.myBall.nudge(xMovement, yMovement, zMovement);

		// make the boxes shrink a little bit
		var boxScale = this.myBall.getScale();
		this.myBall.setScale( boxScale.x-0.005, boxScale.y-0.005, boxScale.z-0.005);

		// if we get too small we need to indicate that this box is now no longer viable
		if (boxScale.x <= 0) {
			// remove the box from the world
			world.remove(this.myBall);
			return true;
		}
		else {
			return false;
		}
	}
}

class Line {
  constructor(x, y, z) {
    // Construct a new Box that lives at this position
    this.myBox = new Box({
      x: x,
      y: y,
      z: z,
      color: '#000',
      width: random(0.3, 3),
      height: random(0.3, 3),
      depth: random(0.3, 3),
    });

    // Add the box to the world
    world.add(this.myBox);

    // Keep track of an offset in Perlin noise space
    this.xOffset = random(1000);
    this.zOffset = random(2000, 3000);
  }

  move() {
    // Ensure the box exists
    if (!this.myBox) return true;

    // Compute how the particle should move
    let yMovement = map(noise(this.xOffset), 0, 1, -0.05, 0.05);
    let xMovement = map(noise(this.xOffset), 0, 1, -0.05, 0.05);
    let zMovement = map(noise(this.zOffset), 0, 1, -0.05, 0.05);

    // Update Perlin noise offsets
    this.xOffset += 0.01;
    this.zOffset += 0.01;

    // Set the position of our box
    this.myBox.nudge(xMovement, yMovement, zMovement);

    // Shrink the box
    let boxScale = this.myBox.getScale();
    this.myBox.setScale(boxScale.x - 0.005, boxScale.y + random(-0.01, 0.01) , boxScale.z + random(-0.01, 0.01));

    // Remove the box if it shrinks too much
    if (boxScale.x <= 0) {
      world.remove(this.myBox);
      return true;
    }
    return false;
  }
}