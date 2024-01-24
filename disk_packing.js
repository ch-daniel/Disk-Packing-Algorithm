function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

function load_disks(j) {
  diskStats = document.getElementsByClassName("diskStats");
  for (let i = 0; i < j.length; i++) {

    let newDiv = document.createElement("div");
    newDiv.classList.add("diskStatWrapper");
    let childDiv = document.createElement("div");
    let node = j[i].size + " mm Size, ";
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

function draw_circle(disk) {
  ctx.beginPath();
  let x = getRandomInt(1000);
  let y = getRandomInt(1000);
  ctx.arc(x, y, disk.size / 2, 0, 2 * Math.PI);
  ctx.stroke(); 
  
  ctx.font = "16px Arial";
  ctx.fillText(disk.size + " mm", x - 25, y + 4); 
}

function draw_disks(j) {
  const canvas = document.getElementById("sheet");
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(0,1000);
  ctx.lineTo(1000,1000);
  ctx.lineTo(1000,0);
  ctx.lineTo(0,0);
  ctx.stroke();

  for (let i = 0; i < j.length; i++) {
    for (let n = 0; n < j[i].quantity; n++) {

      draw_circle(j[i]);

    };
  };

  
}

fetch('disks.json')
  .then(response => response.json())
  .then(jsonResponse => {
    const disks = jsonResponse; 
    load_disks(disks);
    draw_disks(disks);
  } )     
   // outputs a javascript object from the parsed json


