var login = function() {
    if(!$('#txt_username').val() || !$('#txt_password').val() ) {
        alert('Fill up all information  please');
        return;
    }

    var user = {
            username: $('#txt_username').val(),
            password: $('#txt_password').val()
        }
     $.ajax({url: "user/login", type: "POST", contentType: 'application/json', data: JSON.stringify(user), success: function(result){ // go to category-date to get data from model
             if(result == 'fail') {
                alert('Sai username hoặc password');
             } else {
                sessionStorage["sessionId"] = result;
                location.href = "home";
             }
     }});
}

var checkUserLogin = function() {
    //var sessionId = sessionStorage["sessionId"];
//    if(sessionId) {
        $.ajax({url: "user/getUser", success: function(result){
            $('#user_login').text(result.username);// here nếu ko có username thì .text = login
             $('#user_login').parent().attr('href', '#');
            if(result.authorities[0].authority == 'ROLE_ADMIN' && document.referrer.endsWith('login')) {
                location.href="admin";
            }
        }});
//    }
}


var loadProfile = function () {
    console.log("---------------------->loadprofile work");
  $.ajax({
    url: "user/getUser-info",
    success: function (result) {
      if (!result.lastname) {
        // check null
        result.lastname = "";
      }
      if (!result.firstname) {
        result.firstname = "";
      }
      if (result.gender == true) {
        result.gender = "Male";
      } else {
        result.gender = "Female";
      }
      console.log("---------->", result);
      var tableProfile =
        ' <table><tr><th colspan="2" style="color:blue">Your profile</th></tr><tr><td>Name</td><td style="color:blue">' +
        result.lastname +
        " " +
        result.firstname +
        '</td></tr><tr><td>Username</td><td style="color:blue">' +
        result.username +
        '</td></tr> <tr> <td>Gender</td><td style="color:blue"> ' +
        result.gender +
        '</td></tr ><tr><td>Email</td><td style="color:blue">' +
        result.email +
        "</td></tr> </table>"+
        '<a href="secu/logout" class="button  wc-forward">Logout</a>';
      //
      $("#profile-and-logout").html(tableProfile);
    },
  });
};


//$('#btn_login').click(function() {
//    login();
//});