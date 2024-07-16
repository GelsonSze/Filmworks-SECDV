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

$(document).ready(function() {
    const textareaValue = $('#description').val().trim();
    const ratingValue = $('#editRating').val().trim();

    $('#editButton').click(function() {
        $('#description').removeAttr('readonly');
        $('#editRating').removeAttr('readonly');

        $('#editButton').hide();
        $('#saveButton').show();
    });

    $('#saveButton').click(function(event) {
        var textarea = $('#description').val().trim();
        var rating = $('#editRating').val().trim();

        if (!textarea || !rating) {
            alert('The fields cannot be empty.');
            $('#description').val(textareaValue);
            $('#editRating').val(ratingValue);

            $('#description').attr('readonly', true);
            $('#editRating').attr('readonly', true);

            $('#editButton').show();
            $('#saveButton').hide();
            event.preventDefault();
        } else if ( rating < 1 || rating > 5) {
            alert('Rating ranges from 1 to 5 only.');
            $('#description').val(textareaValue);
            $('#editRating').val(ratingValue);

            $('#description').attr('readonly', true);
            $('#editRating').attr('readonly', true);
            
            $('#editButton').show();
            $('#saveButton').hide();
            event.preventDefault();
        }
    });
})

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
} */