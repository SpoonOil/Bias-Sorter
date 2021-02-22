/* This code isn't very clean or best practice but it gets the job done and works flawlessly (to my knowledge). The default item set is mostly a bunch of joke images from when I'm publishing this, 2/21/2021*/

/*----------------------------------------------------------*/

/* Items to be sorted. These are stored as objects with their name and img source. The actual object name doesnt matter. Add as many as you want, just make sure to add them to the "items" array as well*/

var A = {
  name: "Marianne",
  score: 0,
  fought: [],
  img: "https://media.discordapp.net/attachments/270670857444130816/813138676687175740/EePlrFhU0AArcqL.png?width=403&height=701",
};

var B = {
  name: "Iron Maidger",
  score: 0,
  fought: [],
  img: "https://media.discordapp.net/attachments/270670857444130816/813143296292946000/xvze4eo6udf61.png",
};

var C = {
  name: "Ninja Trollolololol",
  score: 0,
  fought: [],
  img: "https://media.discordapp.net/attachments/270670857444130816/812777665433174106/A3XpoU1CIAA1_UY.png?width=524&height=701",
};

var D = {
  name: "19 Dollar Fortnite Card",
  score: 0,
  fought: [],
  img: "https://media.discordapp.net/attachments/270670857444130816/812132247955308584/6426792_sd.png?width=485&height=701",
};

var E = {
  name: "Thanos be grindin",
  score: 0,
  fought: [],
  img: "https://media.discordapp.net/attachments/270670857444130816/811794422974119956/HcMZ4wYmeX7Pjdo04H64lw7chI36bYTFUZd7cWj_ue6jgqbNHByIUVA5oxkRHa6MWtm_D9ea1ulyLws479-nd.png",
};

//list with all objects you want to sort
var items = [A, B, C, D, E];

//How many images to display on results. 0 displays none.
var resultsImgAmount = 3;



var sortedFList;
var cItem1;
var cItem2;
var nextFighter;
var resultsTableData = [];

//initializing with start button
function start() {
  //console.log("started!");
  document.getElementById("note").remove();
  document.getElementById("button1").disabled = false;
  document.getElementById("button2").disabled = false;
  document.getElementById("startBtn").disabled = true;
  reset();
  pollUser(items[0], randOpponent(items[0]));
}

//unused reset function
function reset() {
  sortedFList = undefined;
  cItem1 = undefined;
  cItem2 = undefined;
  nextFighter = undefined;
  resultsText = "No Results Yet";
  for (i = 0; i < items.length; i++) {
    items[i].fought = [];
  }
}

//given 1 fighter finding a random opponent that isnt a mirror match
function randOpponent(fighter) {
  var opponent = items[Math.floor(Math.random() * items.length)];
  while (opponent == fighter || fighter.fought.includes(opponent)) {
    opponent = items[Math.floor(Math.random() * items.length)];
    //console.log(opponent);
  }
  return opponent;
}

//store what is currently being polled and tracking whos fought who
function pollUser(i1, i2) {
  cItem1 = i1;
  cItem2 = i2;
  i1.fought.push(i2);
  i2.fought.push(i1);
  //console.log(i1.fought);
  updateText();
}

//rewriting button text and updating images
function updateText() {
  document.getElementById("button1").innerHTML = cItem1.name;
  document.getElementById("box1").src = cItem1.img;
  document.getElementById("box2").src = cItem2.img;
  document.getElementById("button2").innerHTML = cItem2.name;
}

// when left pressed add 1 to left fighter's score fighters are ordered by score at the results
function chooseLeft() {
  cItem1.score++;
  goNext();
}

// right chosen
function chooseRight() {
  cItem2.score++;
  goNext();
}

//randomly choose fighter 1 (excluding fighters who've fought all possible opponents)
function decideNextFighter() {
  var nf = items[Math.floor(Math.random() * items.length)];
  while (nf.fought.length == (items.length - 1)) {
    nf = items[Math.floor(Math.random() * items.length)];
  }
  return nf;
}

//check if everyone has fought everyone
function checkAllFought() {
  var allFought = true;
  for (i = 0; i < items.length; i++) {
    if (items[i].fought.length != (items.length - 1)) {
      allFought = false;
    }
  }
  return allFought;
}

//sort fighters based on score
//permutes through all fighters combos (including mirror matches) and swaps array positions when a fighter higher on the array has a lower score that an opponent lower on the array.
function sortFighters() {
  sortedFList = items;
  //console.log(sortedFList);
  for (i1 = 0; i1 < items.length; i1++) {
    for (i2 = 0; i2 < items.length; i2++) {
      //console.log(i1 + " " + i2);
      if (sortedFList[i1].score > sortedFList[i2].score) {
        swap(sortedFList, i1, i2);
      }
    }
  }

  return sortedFList;
}

//swap func
function swap(sArray, leftIndex, rightIndex) {
  var temp = sArray[leftIndex];
  sArray[leftIndex] = sArray[rightIndex];
  sArray[rightIndex] = temp;
}

//Start a new matchup if not everyone has fought
function goNext() {
  if (!checkAllFought()) {
    nextFighter = decideNextFighter();
    pollUser(nextFighter, randOpponent(nextFighter));
  } else {
    //console.log("everyone fought");
    tallyResults();
  }
}

//display final results
function tallyResults() {
  resultsTableData = sortFighters();
  document.getElementById("button1").disabled = true;
  document.getElementById("button2").disabled = true;
  // document.getElementById("startBtn").disabled = false;
  generateResultsTable();
  updateText();
}

//Messy, lengthy, and franky terrible table generation code that works flawlessly
function generateResultsTable() {
  var resultsTableElement = document.getElementById("resultsTable");
  generateTableHead(resultsTableElement, resultsTableData);
  generateTableRows(resultsTableElement, resultsTableData);
}

function generateTableRows(table, data) {
  for (i1 = 0; i1 < data.length; i1++) {
    var row = table.insertRow();
    var cell1 = row.insertCell();
    var text1 = document.createTextNode(data[i1].name);
    var cell2 = row.insertCell();
    var text2 = document.createTextNode(i1 + 1);
    cell1.appendChild(text1);
    cell2.appendChild(text2);
    if (i1 < resultsImgAmount) {
      var img = document.createElement("img");
      img.setAttribute('src', data[i1].img);
      img.classList.add("resultsImg");
      cell1.appendChild(img);
    }
  }
}

//hardcoded header cells
function generateTableHead(table) {
  var thead = table.createTHead();
  var row = thead.insertRow();
  var thName = document.createElement("th");
  var thPlace = document.createElement("th");
  var thText1 = document.createTextNode("Name");
  var thText2 = document.createTextNode("Place");
  thName.appendChild(thText1);
  thPlace.appendChild(thText2);
  row.appendChild(thName);
  row.appendChild(thPlace);
}
