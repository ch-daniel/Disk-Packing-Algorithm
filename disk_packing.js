function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

function load_disks(j) {
  diskStats = document.getElementsByClassName("diskStats");
  for (let i = 0; i < j.length; i++) {

    let newDiv = document.createElement("div");
    newDiv.classList.add("diskStatWrapper");
    let childDiv = document.createElement("div");
    let node = (j[i].size / 2) + " mm Size, ";
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

function findNewPoint(x, y, angle, distance, prev_disk) {
  var result = {};
  console.log("distance = " + distance);

  result.x = prev_disk.x + Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
  result.y = prev_disk.y + Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

  return result;
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
    };
  };

  for (let i = 0; i < disks_sorted.length; i++) {
    
    // Place first disk in the top left corner
    if (i == 0) {
      disks_sorted[i].x = disks_sorted[i].diameter / 2 + 1;
      disks_sorted[i].y = disks_sorted[i].diameter / 2 + 1;
    } else {
      for (let angle = 0; angle < 360; angle++) {
        
        let newPoint = findNewPoint(disks_sorted[i].x, disks_sorted[i].y, angle, (disks_sorted[i].diameter / 2) + (disks_sorted[i-1].diameter / 2) + 2, disks_sorted[i-1])
        if ((newPoint.x > (0 + disks_sorted[i].diameter/2 + 2)) && (newPoint.x < (1000 - disks_sorted[i].diameter/2 - 2)) && (newPoint.y > (0 + disks_sorted[i].diameter/2 + 2)) && (newPoint.y < (1000 - disks_sorted[i].diameter/2 - 2))) {
          disks_sorted[i].x = newPoint.x;
          disks_sorted[i].y = newPoint.y;
          break;
        }
        
        console.log(disks_sorted);

      }
    }
  }
  console.log(disks_sorted);
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


