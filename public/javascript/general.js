$(document).ready(function() {
    var data = 0;

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
    });

    $('.addCartButton').click(function () {
        var quantity = $('#number').html();
        var movieID = $('#movieTitle').attr('alt');
        var timeslot = $('#time_slots').val()
        console.log(!isNaN(quantity))
        console.log(movieID)

        if(!isNaN(quantity) && Number(quantity) > 0){
            quantity = Number(quantity)
            $.post({url:`/addCart`, 
                // type: "POST",
                data: {
                    "quantity": quantity,
                    "movieID": movieID,
                    "timeslot": timeslot
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
        var cartItemID = $(this).attr('itemid');
        console.log(cartItemID);
        $.ajax({url:`/deletecart/${cartItemID}`, 
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