const flowerDivs = document.querySelectorAll(".flower-div");
const rootCss = document.querySelector(":root");
const themeButton = document.querySelector(".theme-btn");
const bigDiv = document.querySelector(".big-div");
const themeIcon = document.getElementById("icon");
const distanceBeforeChange = 500 // distance that has to be hit before changeing opacity
toggleDarkMode()



const userAgent = navigator.userAgent.toLowerCase();
const isTablet = /(ipad|tablet|(android(.*mobile)|(.*phone))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
//check for pc theme
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches
) {
  toggleDarkMode();
}
let flowerDivList = [];
//add flower divs to a list and remove them from the display
for (let flower of flowerDivs) {
  flowerDivList.push(flower);
  flower.remove();
}
let mouseX = 0;
let mouseY = 0;
let flowerCounter = 0;
let flowerNumber = 40;
let speration = 100; //px seperation between flowers
const tiltAngle = 45; //deg flower div tilt
let retries = 100; //how many time to try and seperate the flowers
//these variables are to generate the flowers inside the div
const divWidth = bigDiv.getBoundingClientRect().width;
const divHeight = bigDiv.getBoundingClientRect().height;
const screenHeight = window.screen.height;
const screenWidth = window.screen.width;
const svgOffset = 0.04;
const svgCenterX = screenWidth * svgOffset;
const svgCenterY = screenHeight * svgOffset;
let clonedFlowerDivList = [];
console.log(isTablet)
if(isTablet){
  retries=10;
  flowerNumber=30;
  speration=20
}
if(!isTablet)
{
bigDiv.addEventListener("mousemove", updateDisplay);
bigDiv.addEventListener("mouseenter", updateDisplay);
bigDiv.addEventListener("mouseleave", updateDisplay);
}
function updateDisplay(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
  //check the distance of each flower
  for (let fDiv of clonedFlowerDivList) {
    updateOpacity(fDiv[0], fDiv[1], fDiv[2]);
  }
}
function toggleDarkMode() {
  rootCss.classList.toggle("dark-theme");
  if (rootCss.classList.contains("dark-theme")) {
    themeIcon.src = "png/sun.png";
  } else {
    themeIcon.src = "png/moon.png";
  }
}
//change theme
themeButton.addEventListener("click", toggleDarkMode);

for (let i = 0; i < flowerNumber; i++) {
  let randIdx = Math.floor(Math.random() * flowerDivList.length);
  let newFlower = flowerDivList[randIdx].cloneNode(true);

  const uniqueId = `flower-${flowerCounter}`;
  flowerCounter++;

  newFlower.setAttribute("id", uniqueId);
  //generate random height
  let randHeight = Math.floor(
    Math.abs(divHeight * Math.random() - 100 - svgCenterY)
  );
  //generate random width
  let randWidth = Math.floor(
    Math.abs(divWidth * Math.random() - 100 - svgCenterX)
  );
  //check for overlap

  let nRetries = 0;
  while (overlapDiv(randHeight, randWidth) || nRetries < retries) {
    nRetries++;
    randHeight = Math.floor(
      Math.abs(divHeight * Math.random() - 100 - svgCenterY)
    );
    randWidth = Math.floor(
      Math.abs(divWidth * Math.random() - 100 - svgCenterX)
    );
  }
  //apply height width
  newFlower.style.top = `${randHeight}px`;
  newFlower.style.left = `${randWidth}px`;

  //apply random roation
  randRotation = Math.floor(
    Math.random() * tiltAngle - Math.random() * tiltAngle
  );
  newFlower.style.rotate = `${randRotation}deg`;
  idx = newFlower.getAttribute("id");
  clonedFlowerDivList.push([idx, randHeight, randWidth]);
  bigDiv.append(newFlower);
}

function updateOpacity(idx, randHeight, randWidth) {
  let self = document.getElementById(idx);
  let distanceX = Math.floor(
    Math.sqrt(Math.pow(randHeight + svgCenterY - mouseY, 2))
  );
  let distanceY = Math.floor(
    Math.sqrt(Math.pow(randWidth + svgCenterX - mouseX, 2))
  );
  let value = Math.floor(distanceX + distanceY);

 
  if (value < distanceBeforeChange) {
    self.style.opacity = `${value / 6}%`;
  } else {
    self.style.opacity = `100%`;
  }
}

function overlapDiv(h, w) {
  for (let fDiv of clonedFlowerDivList) {
    let flowerHeight = fDiv[1];
    let flowerWidth = fDiv[2];
    let distanceX = Math.floor(Math.sqrt(Math.pow(w - flowerWidth, 2)));
    let distanceY = Math.floor(Math.sqrt(Math.pow(h - flowerHeight, 2)));
    let distance = distanceX * distanceY;
    if (distance < speration) {
      return true;
    }
  }
  console.log("tried");
  return false;
}
