/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/


var data = 00;

function decrement(){
    if (data > 0) {
        data--;
        data = (data < 10) ? "0" + data : data;
    }
    document.getElementById('number').innerHTML = data;
}

function increment(){
    data++;
    data = (data < 10) ? "0" + data : data;
    document.getElementById('number').innerHTML = data;
}

function play(){
    var displayPlay = document.getElementById("play");
    displayPlay.style.display = "block";
}

/*

function buy1(){
	console.log("OMG");
    var displayBuy = document.getElementById("buyTickets");
    if(getComputedStyle(displayBuy).display == "none"){
    	displayBuy.style.display = "block";
    	data = 0;
    	document.getElementById('number').innerHTML = data;
    }
    else {
    	data = 0;
    	data = (data < 10) ? "0" + data : data;
    	document.getElementById('number').innerHTML = data;
    }
    document.getElementById("date").innerHTML = document.getElementById("firstDate").innerHTML;
    document.getElementById("time").innerHTML = document.getElementById("firstTime").innerHTML;
    console.log("HELLO");
}
function buy2(){
    var displayBuy = document.getElementById("buyTickets");
    if(getComputedStyle(displayBuy).display == "none"){
    	displayBuy.style.display = "block";
    }
    else {
    	data = 0;
    	data = (data < 10) ? "0" + data : data;
    	document.getElementById('number').innerHTML = data;
    }
    document.getElementById("date").innerHTML = document.getElementById("firstDate").innerHTML;
    document.getElementById("time").innerHTML = document.getElementById("secondTime").innerHTML;
}
function buy3(){
    var displayBuy = document.getElementById("buyTickets");
    if(getComputedStyle(displayBuy).display == "none"){
    	displayBuy.style.display = "block";
    }
    else {
    	data = 0;
    	data = (data < 10) ? "0" + data : data;
    	document.getElementById('number').innerHTML = data;
    }
    document.getElementById("date").innerHTML = document.getElementById("secondDate").innerHTML;
    document.getElementById("time").innerHTML = document.getElementById("thirdTime").innerHTML;
}
function buy4(){
    var displayBuy = document.getElementById("buyTickets");
    if(getComputedStyle(displayBuy).display == "none"){
    	displayBuy.style.display = "block";
    }
    else {
    	data = 0;
    	data = (data < 10) ? "0" + data : data;
    	document.getElementById('number').innerHTML = data;
    }
    document.getElementById("date").innerHTML = document.getElementById("secondDate").innerHTML;
    document.getElementById("time").innerHTML = document.getElementById("fourthTime").innerHTML;
}
*/