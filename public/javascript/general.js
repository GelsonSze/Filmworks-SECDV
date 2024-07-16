$(document).ready(function() {
    var data = 0;

    // displays the date and time of the specific time slot selected by the user
    // $('.timeslot').click(function () {
    //     data = 0;
    //     $('#number').html(data);

    //     var time = $(this).text();
    //     var div = $(this).prev();
    
    //     if ($('#buyTickets').css('display') === "none") {
    //         $('#buyTickets').css('display', 'block');
    //     }
    //     else {
    //         data = 0;
    //         data = (data < 10) ? "0" + data : data;
    //     }

    //     while(div.text().includes("AM") || div.text().includes("PM")) {
    //         div = div.prev();
    //     }

    //     $('#date').html(div.text());
    //     $('#time').html(time);
    //     $('#errorMessage').text('');
    //     $('.addCartButton').prop('disabled', false);
    // });

    // reduces the count of the quantity of the tickets the user is planning to buy
    $('#minus').click(function(){
        if (data > 0) {
            data--;
            data = (data < 10) ? "0" + data : data;
        }

        $('#number').html(data);
        $('#plus').prop('disabled', false);
        $('.addCartButton').prop('disabled', false);
        $('#errorMessage').text(''); 
    });

    // displays error messages and disables the + and addToCart button if the tickets currently selected by the user is
    // exceeds the current amount of tickets available    
    $('#plus').click(function(){
        data++;
        data = (data < 10) ? "0" + data : data;

        $('#number').html(data);

        var quantity = $('#number').html();         // quantity of tickets
        // var movie = $(".normal4").attr('alt');      // id number of movie
        // var displayedDate = $('#date').html();      // date displayed in the page
        // var displayedTime = $('#time').html();      // time displayed in the page
        // var pm = false;

        // var currentDate = new Date();           
        // var year = currentDate.getFullYear();                       // year right now
        // var convertMonth = Date.parse(displayedDate + ", " + year); // temp variable to convert month

        // if(!isNaN(convertMonth))
        //     var month = new Date(convertMonth).getMonth() + 1;      // value corresponding to the month

        // var date = displayedDate.split(" ");
        // date = date[2];

        // var hour;
        // var minute;

        // if (displayedTime.includes('AM'))
        //     pm = false;
        // else if (displayedTime.includes('PM'))
        //     pm = true;

        // if (pm){
        //     var a = displayedTime.replace('PM', '');
        //     var b = a.split(" : ");
        //     hour = parseInt(b[0]);
        //     minute = parseInt(b[1]);
        //     if (hour != 12)
        //         hour += 12;
        // }
        // else {
        //     var a = displayedTime.replace('AM', '');
        //     var b = a.split(" : ");
        //     hour = parseInt(b[0]);
        //     minute = parseInt(b[1]);
        // }

        // var dateQuery = new Date(year, month-1, date, hour, minute, 0, 0);
        // var dateQ = dateQuery.toISOString();
        
        // $.get('/find-quantity', {m_id: movie, ticket: dateQ}, function(result){
        //     if (parseInt(result) < parseInt(quantity)) {
        //         $('#plus').prop('disabled', true);
        //         $('.addCartButton').prop('disabled', true);
        //         $('#errorMessage').css('color', 'maroon');
        //         $('#errorMessage').text('Quantity ordered exceeded the available amount of tickets.');
        //     }
        //     else {
        //         $('#errorMessage').text(''); 
        //     }
        // });
    });

    // adds a movie to the cart of the user
    // displays error messages and disables the addToCart button if the selected date has already expired or 
    // the quantity of the tickets currently selected by the user is 0 or exceeds the current amount of tickets available
    // $('.addCartButton').click(function () {
    //     var quantity = $('#number').html();
    //     var movie = $(".normal4").attr('alt');

    //     var timeSlot = $('#date').html() + " - " + $('#time').html();

    //     var displayedDate = $('#date').html();      // date displayed in the page
    //     var displayedTime = $('#time').html();      // time displayed in the page
    //     var pm = false;

    //     var currentDate = new Date();           
    //     var year = currentDate.getFullYear();                       // year right now
    //     var convertMonth = Date.parse(displayedDate + ", " + year); // temp variable to convert month

    //     if(!isNaN(convertMonth))
    //         var month = new Date(convertMonth).getMonth() + 1;      // value corresponding to the month

    //     var date = displayedDate.split(" ");
    //     date = date[2];

    //     var hour;
    //     var minute;

    //     if (displayedTime.includes('AM'))
    //         pm = false;
    //     else if (displayedTime.includes('PM'))
    //         pm = true;

    //     if (pm){
    //         var a = displayedTime.replace('PM', '');
    //         var b = a.split(" : ");
    //         hour = parseInt(b[0]);
    //         minute = parseInt(b[1]);
    //         if (hour != 12)
    //             hour += 12;
    //     }
    //     else {
    //         var a = displayedTime.replace('AM', '');
    //         var b = a.split(" : ");
    //         hour = parseInt(b[0]);
    //         minute = parseInt(b[1]);
    //     }

    //     var dateQuery = new Date(year, month-1, date, hour, minute, 0, 0);
    //     var dateQ = dateQuery.toISOString();

    //     if (currentDate > dateQuery) {
    //         $('.addCartButton').prop('disabled', true);
    //         $('#errorMessage').css('color', 'maroon');
    //         $('#errorMessage').text('Date and Time chosen have already expired. Please look for other available dates.');
    //     }
    //     else if (quantity == 0 || !movie) {
    //         $('.addCartButton').prop('disabled', true);
    //         $('#errorMessage').css('color', 'maroon');
    //         $('#errorMessage').text('No order made. Please input quantity of tickets to be purchased.');
    //     }
    //     else { 
    //         $('#errorMessage').text('');
    //         $.get('/add-cart', {m_id: movie, quantity: quantity, movie_timeSlot: timeSlot, movie_date: dateQ}, function (result) {
    //             if (result) {
    //                alert('Added to your cart!');
    //                window.location.href = "/cart";
    //             }
    //         });
    //     }
    // });

    $('.addCartButton').click(function () {
        var quantity = $('#number').html();
        var movieID = $('#movieTitle').attr('alt');
        console.log(!isNaN(quantity))
        console.log(movieID)

        if(!isNaN(quantity) && Number(quantity) > 0){
            quantity = Number(quantity)
            $.post({url:`/addCart`, 
                // type: "POST",
                data: {
                    "quantity": quantity,
                    "movieID": movieID
                },
                success: async function(result) {
                    window.location.href = '/cart';
                },
                error: async function(result){
                    window.location.href = '/error';
                }
            });
        }
    })

    // if remove button is clicked, the movie is removed from the cart of the user
    $('.movieInfo').on('click', '.ticketRemove', function () {  
        var movieID = $(this).siblings('.movieTitle').attr('alt');
        console.log("IM IN general.js")
        console.log(movieID)
        $.ajax({url:`/deletecart/${movieID}`, 
            type: "DELETE",
            success: async function(result) {
                if (result){
                    $(this).parent().siblings().remove();
                    $(this).parent().parent().remove();
                    $(this).parent().remove();
                    window.location.reload();
                } 
            }
        });
    });
    
    // when the person clicks delete, it should
    $('.deleteAccount').click(function () {
        var username = $('#normal4').text(); 
        username = username.replace("USERNAME: ", "");
        $.get('/delete_account', {username: username}, function (data, result){
            if (result == "success") {
                alert('Deleted successfully!');
                window.location.href = "/";
            }
        });
    });

    // computes for the total amount of the cart, including the 20% discounts of senior citizen and pwd
    // $('#compute').click(function(){
    //     var tempPrices = $('.ticketPrice').map(function() {
    //         return this.innerText;
    //     }).get();
        
    //     var tempQuantity = $('.ticketQuantity').map(function() {
    //         return this.innerText;
    //     }).get();

    //     var allPrices = [];
    //     var allQuantity = [];

    //     for (i = 0; i < tempPrices.length; i++){
    //         var price = tempPrices[i].replace('PRICE: ₱ ', '');
    //         var quantity = tempQuantity[i].replace('QTY: ', '');
    //         allPrices.push(price);
    //         allQuantity.push(quantity);
    //     }

    //     var subPrice = 0;
    //     var totalTickets = 0;
    //     var totalDiscount = 0;
    //     var totalPrice = 0;

    //     if (allPrices.length == allQuantity.length)
    //         for (var i = 0; i < allPrices.length; i++) {
    //             subPrice = subPrice + (parseInt(allPrices[i]) * parseInt(allQuantity[i]));
    //             totalTickets = totalTickets + parseInt(allQuantity[i]);
    //         }

    //     $.get('/checkStatus', {}, function(result){
    //         if (result === 'SENIOR CITIZEN/PWD'){
    //             totalDiscount = subPrice * 0.2;

    //             totalPrice = subPrice - totalDiscount;

    //             $('#subtotal').text(subPrice);
    //             $('#quantity').text(totalTickets);
    //             $('#discount').text(totalDiscount);
    //             $('#total').text(totalPrice);
    //         }
    //         else {
    //             totalPrice = subPrice - totalDiscount;

    //             $('#subtotal').text(subPrice);
    //             $('#quantity').text(totalTickets);
    //             $('#discount').text(totalDiscount);
    //             $('#total').text(totalPrice);
    //         }
    //     })
    // });
    // check value before submit
    $('#paymentform').on('submit', function(event){
        const cardNumRegex = /^[0-9]{16}$/
        const nameRegex = /^[a-zA-Z\s]+$/
        const cardExpireRegex = /^[0-9]{4}\/(0[1-9]|1[0-2])$/
        const cvvRegex = /^[0-9]{3}$/

        var num = $('#cardnum').val(); 
        var name = $('#fullname').val(); 
        var expiration = $('#expiration').val(); 
        var cvv = $('#cvv').val(); 
        if(!cardNumRegex.test(num) || !nameRegex.test(name) || !cardExpireRegex.test(expiration) || !cvvRegex.test(cvv)){
            event.preventDefault();
        }
    });

    // if expiration is not greater than current date it is fine
    $('#expiration').keyup(function() {
        var expiration = $('#expiration').val(); 
        const cardExpireRegex = /^[0-9]{4}\/(0[1-9]|1[0-2])$/
        expirationval = expiration 
        expirationdate = new Date(Date.parse(expiration));
        var current = new Date();

        if (expirationdate.getTime() > current.getTime() && cardExpireRegex.test(expirationval)) {
            $('#expiration').css('background-color', 'white');
            $('#error').text("");
        }
        else {
            $('#expiration').css('background-color', 'red');
            $('#error').text('Expiration date of card already passed! Please try again.');
        }
    });

    // ensures that input values for the card number is valid
    $('#cardnum').keyup(function() {
        var num = $('#cardnum').val(); 
        const cardNumRegex = /^[0-9]{16}$/
        if (!cardNumRegex.test(num)) {
            $('#cardnum').css('background-color', 'red');
            $('#error').text('Invalid card number or input!');
        }
        else {
            $('#cardnum').css('background-color', 'white');
            $('#error').text("");
        }
    });

    $('#fullname').keyup(function() {
        var name = $('#fullname').val(); 
        const nameRegex = /^[a-zA-Z\s]+$/
        if (!nameRegex.test(name)) {
            $('#fullname').css('background-color', 'red');
            $('#error').text('Empty or Invalid name input!');
        }
        else {
            $('#fullname').css('background-color', 'white');
            $('#error').text("");
        }
    });

    // ensures that input values for the cvv is valid
    $('#cvv').keyup(function() {
        var cvv = $('#cvv').val(); 
        const cvvRegex = /^[0-9]{3}$/

        if (!cvvRegex.test(cvv)) {
            $('#cvv').css('background-color', 'red');
            $('#error').text('Invalid CVV!');
        }
        else {
            $('#cvv').css('background-color', 'white');
            $('#error').text("");
        }
    });

    //if user is banner, a pop up shows up confirming one's decision
    $('#banButton').click(function(){
        
    });
})