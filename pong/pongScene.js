


function setUpScene(){
    camera.position.z = 75;

}



//bullshit object is place from center not top left so this just adjust it so its placed top left 
function adjustGeometryCenter(geometry, width, height, depth) {
    geometry.vertices.forEach(vertex => {
        vertex.x -= width / 2;
        vertex.y -= height / 2;
        vertex.z -= depth / 2;
    });
}





/*
function  getCameraDirection() {
    const direction = new THREE.Vector3(0, 0, -1); // Initial direction along the negative z-axis
    direction.applyQuaternion(camera.quaternion); // Apply camera's quaternion rotation
    return direction;
}

function handleMouseMove(event) {
    const sensitivity = 0.01; // Adjust this value to control the sensitivity of the camera movement
    
    // Calculate the change in mouse position
    const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    
    // Update camera position based on mouse movement
    camera.rotation.y -= deltaX * sensitivity;
    camera.rotation.x -= deltaY * sensitivity;

    // Clamp vertical rotation to avoid flipping
	const dir = getCameraDirection();
    console.log("dx = ", dir.x, "dy = ", dir.y, "dz = ", dir.z );
}

// Listen for mouse movement events
document.addEventListener('mousemove', handleMouseMove);


function handleKeyDown(event) {
    const moveDistance = 500; // Adjust this value to control the movement speed

    switch(event.key) {
        case 'ArrowUp':
            camera.position.z -= moveDistance;
            break;
        case 'ArrowDown':
            camera.position.z += moveDistance;
            break;
        case 'ArrowLeft':
            camera.position.x -= moveDistance;
            break;
        case 'ArrowRight':
            camera.position.x += moveDistance;
            break;
    }
    console.log("x = ", camera.position.x, "y = ", camera.position.y, "z = ", camera.position.z );
}

// Listen for keydown events
document.addEventListener('keydown', handleKeyDown);
*/