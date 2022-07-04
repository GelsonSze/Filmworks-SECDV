/*
PHASE 2 & 3 
CCAPDEV S11
    Group Members: 
        Ng, Sherilyn Kaye
        Vizmanos, Julianne 
*/

$(document).ready(function() {
    // check if email is part of database
    // if yes, shows error message as email should be unique per user 
    $('#email').keyup(function() {
        var email = $('#email').val(); 
            $.get('/verify', {email: email}, function (result){
                if (result.email == email) //means email is part of database
                {
                    $('#email').css('background-color', 'red');
                    $('#error').text('Email already exists in database!');
                }
                else //means email is new
                {
                    $('#email').css('background-color', 'white');
                    $('#error').text("");
                }
            });
    });

    // check if username is part of database
    // if yes, shows error message as username should be unique per user 
    // should have a minimum length of 5
    $('#username').keyup(function() {
        var username = $('#username').val(); 
            $.get('/username', {username: username}, function (result){
                if (result.username == username) //means is part of database
                {
                    $('#username').css('background-color', 'red');
                    $('#error').text('Username already exists in database!');
                }
                else if (username.length < 5)
                {
                    $('#username').css('background-color', 'red');
                    $('#error').text('Number of characters for username should be at least 5!');
                }
                else //means email is new
                {
                    $('#username').css('background-color', 'white');
                    $('#error').text("");
                }
            });
    });

    // ensures password length is not less than 8
    $('#password').keyup(function() {
        var password = $('#password').val(); 

        if (password.length < 8) //means password length is not valid length
        {
            $('#password').css('background-color', 'red');
            $('#error').text('Password should at least have a length of 8 characters!');
        }
        else if (password.length == 20)
        {
            $('#error').text('Password limit of 20 characters has been reached!');
        }
        else
        { 
            $('#password').css('background-color', 'white');
            $('#error').text("");
        }
    });

    // checks that confirm password matches the password
    $('#cpassword').keyup(function() {
        var password = $('#password').val(); 
        var cpassword = $('#cpassword').val(); 
        if (password != cpassword)
        {
            $('#password').css('background-color', 'red');
            $('#cpassword').css('background-color', 'red');
            $('#error').text('Password and Confirm Password do not match!');
        }
        else //means no problems
        {
            $('#password').css('background-color', 'white');
            $('#cpassword').css('background-color', 'white');
            $('#error').text("");
        }
    });
})
