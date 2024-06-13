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

    // ensures password length is not less than 12
    $('#password').keyup(function() {
        var password = $('#password').val(); 

        if (password.length < 12) //means password length is not valid length
        {
            $('#password').css('background-color', 'red');
            $('#error').text('Password should at least have a length of 12 characters!');
        }
        else if (password.length == 64)
        {
            $('#error').text('Password limit of 64 characters has been reached!');
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

/*    function checkFileType(file) {
        // Allowed file types with their magic numbers (file signatures)
        const fileTypes = {
            'image/gif': '474946383761', // GIF87a
            'image/jpeg': 'ffd8ffe000104a464946', // JPEG/JFIF
            'image/png': '89504e470d0a1a0a', // PNG
        };
    
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function(e) {
                if (e.target.readyState == FileReader.DONE) {
                    const view = new DataView(e.target.result);
                    let signature = '';
                    for (let i = 0; i < 10; i++) {
                        signature += view.getUint8(i).toString(16).padStart(2, '0');
                    }
                    for (const type in fileTypes) {
                        if (signature.startsWith(fileTypes[type])) {
                            // Valid file type
                            resolve(true);
                            return;
                        }
                    }
                    // Invalid file type
                    resolve(false);
                }
            };
            reader.onerror = function() {
                reject(new Error("File reading error"));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    
    // Event listener for file input change
    $('#profile_pic').change(async function() {
        const file = this.files[0];
        if (file) {
            try {
                const isValid = await checkFileType(file);
                if (!isValid) {
                    // Invalid file type error handling
                    $('#error').text('Invalid photo format.');
                    $(this).val(''); // Clear file input
                } else {
                    // Valid file type handling (if needed)
                    $('#error').text('');
                }
            } catch (error) {
                // Handle errors (e.g., file reading errors)
                $('#error').text('Error reading file.');
                $(this).val(''); // Clear file input
            }
        }
    }); */

    function checkFileType(file) {
        // Allowed file types with their magic numbers (file signatures)
        const fileTypes = {
            'image/gif': '47494638', // GIF
            'image/jpeg': 'ffd8ffe0', // JPEG
            'image/png': '89504e47', // PNG
        };
    
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function(e) {
                if (e.target.readyState == FileReader.DONE) {
                    const view = new DataView(e.target.result);
                    let signature = '';
                    for (let i = 0; i < 4; i++) { // Read first 4 bytes
                        signature += view.getUint8(i).toString(16).padStart(2, '0');
                    }
                    for (const type in fileTypes) {
                        if (signature.startsWith(fileTypes[type])) {
                            // Valid file type
                            resolve(true);
                            return;
                        }
                    }
                    // Invalid file type
                    resolve(false);
                }
            };
            reader.onerror = function() {
                reject(new Error("File reading error"));
            };
            reader.readAsArrayBuffer(file);
        });
    }
    
    // Event listener for file input change
    $('#profile_pic').change(async function() {
        const file = this.files[0];
        if (file) {
            try {
                const isValid = await checkFileType(file);
                if (!isValid) {
                    // Invalid file type error handling
                    $('#error').text('Invalid photo format.');
                    $(this).val(''); // Clear file input
                } else {
                    // Valid file type handling (if needed)
                    $('#error').text('');
                }
            } catch (error) {
                // Handle errors (e.g., file reading errors)
                $('#error').text('Error reading file.');
                $(this).val(''); // Clear file input
            }
        }
    });
    
})
