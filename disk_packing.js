function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

function load_disks(j) {
  diskStats = document.getElementsByClassName("diskStats");
  for (let i = 0; i < j.length; i++) {

    let newDiv = document.createElement("div");
    newDiv.classList.add("diskStatWrapper");
    let childDiv = document.createElement("div");
    let node = (j[i].size) + " mm Size, ";
    childDiv.innerHTML += node;
    newDiv.appendChild(childDiv);

    childDiv = document.createElement("div");
    let num = getRandomInt(3);
    j[i].quantity = num;
    node = "&nbsp;Quantity = " + num;
    childDiv.innerHTML += node;
    newDiv.appendChild(childDiv);

    

    diskStats[0].appendChild(newDiv);

  } 
  console.log(j);
}

function isCollision(newCircle, disks_sorted) {
  
  let canvasWidth = 1000;
  let canvasHeight = 1000;
  for (let i = 0; i < disks_sorted.length; i++) {
    const existingCircle = disks_sorted[i];

    if (existingCircle.x == 0 && existingCircle.y == 0) {
      return false;
    }

    // Calculate the distance between the centers of the circles
    const distance = Math.sqrt(
      Math.pow(newCircle.x - existingCircle.x, 2) + Math.pow(newCircle.y - existingCircle.y, 2)
    );

    // Check if there is a collision (overlap of diameters)
    if (distance < (newCircle.diameter / 2 + existingCircle.diameter / 2) + 2) {
      return true; // Collision detected
    }
    if (
      newCircle.x - newCircle.diameter / 2 < 0 ||
      newCircle.x + newCircle.diameter / 2 > canvasWidth ||
      newCircle.y - newCircle.diameter / 2 < 0 ||
      newCircle.y + newCircle.diameter / 2 > canvasHeight
    ) {
      return true; // Out of bounds
    }
  }
}

function findNewPoint(disks_sorted, i) {
  for (let referenceDisk = 0; referenceDisk < disks_sorted.length; referenceDisk++) {
    for (let angle = -90; angle < 270; angle++) {
      
      let result = new Object();

      let radians = (angle * Math.PI) / 180;

      let distance = disks_sorted[i].diameter / 2 + disks_sorted[referenceDisk].diameter / 2 + 2;
    
      if (angle >= -90 && angle < 0 ){
        //Quadrant 1
        
        result.x = disks_sorted[referenceDisk].x + Math.cos(radians) * distance;
        result.y = disks_sorted[referenceDisk].y - Math.sin(radians) * distance;
        console.log("I got here = " + distance);
      } else if (angle >= 0 && angle < 90 ){
        //Quadrant 2
        result.x = disks_sorted[referenceDisk].x + Math.cos(radians) * distance;
        result.y = disks_sorted[referenceDisk].y + Math.sin(radians) * distance;
      } else if (angle >= 90 && angle < 180 ){
        //Quadrant 3
        result.x = disks_sorted[referenceDisk].x - Math.cos(radians) * distance;
        result.y = disks_sorted[referenceDisk].y + Math.sin(radians) * distance;
      } else {
        //Quadrant 4
        result.x = disks_sorted[referenceDisk].x - Math.cos(radians) * distance;
        result.y = disks_sorted[referenceDisk].y - Math.sin(radians) * distance;
      }

      result.diameter = disks_sorted[i].diameter;
      console.log("I am resut = " + angle);

      if (!isCollision(result, disks_sorted)) {
        return result;
      } 
      

    }
  }
}

function sortArrayAscending(inputArray) {
  // Sorting array in ascending order
  const sortedArray = inputArray.slice().sort((a, b) => a.diameter - b.diameter);

  return sortedArray;
}

function calculate_disks(disks) {
  
  let disks_sorted = [];

  for (let i = 0; i < disks.length; i++) {
    for (let n = 0; n < disks[i].quantity; n++) {
      let disk = new Object();
      disk.diameter = disks[i].size;
      disk.x = 0;
      disk.y = 0;
      disks_sorted.push(disk);
      disks_sorted = sortArrayAscending(disks_sorted);
      disks_sorted.reverse();
    };
  };

  

  for (let i = 0; i < disks_sorted.length; i++) {
    
    // Place first disk in the top left corner
    if (i == 0) {
      disks_sorted[i].x = disks_sorted[i].diameter / 2 + 1;
      disks_sorted[i].y = disks_sorted[i].diameter / 2 + 1;
    } else {
      let newPoint = findNewPoint(disks_sorted, i);
      disks_sorted[i].x = newPoint.x;
      disks_sorted[i].y = newPoint.y;
      
    }
    
  }
  return disks_sorted;

}

function draw_circle(disk) {
  
  const canvas = document.getElementById("sheet");
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(disk.x, disk.y, disk.diameter / 2, 0, 2 * Math.PI);
  ctx.stroke(); 
  
  ctx.font = "16px Arial";
  ctx.fillText(disk.diameter + " mm", disk.x - 25, disk.y + 4); 
}

function draw_disks(disks) {
  const canvas = document.getElementById("sheet");
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(0,1000);
  ctx.lineTo(1000,1000);
  ctx.lineTo(1000,0);
  ctx.lineTo(0,0);
  ctx.stroke();

  for (let i = 0; i < disks.length; i++) {
    draw_circle(disks[i]);

  };

  
}

fetch('disks.json')
  .then(response => response.json())
  .then(jsonResponse => {
    const disks = jsonResponse; 
    load_disks(disks);
    draw_disks(calculate_disks(disks));

  } )     
   // outputs a javascript object from the parsed json


