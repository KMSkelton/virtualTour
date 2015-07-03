//login/auth callback
var myDataRef = new Firebase('https://shining-fire-453.firebaseio.com');
var authClient = new FirebaseSimpleLogin(myDataRef, function(error, user) {
  if (error) {
    alert(error);
    return;
  }
  if (user) {
    // User is already logged in.
    doLogin(user);
  }
});
// close callback
function doLogin(user) {
  //pull user data to display favorites
  //redirect to user-enabled home page
  console.log("welcome back, welcome back, welcoooome baack...");
};
//User Reg form:

$("#registerButton").on("click", function() {
  var email = $("#registerEmail").val();
  var password = $("#registerPassword").val();
  var firstname = $("#firstname").val();
  var lastname = $("#lastname").val();
  authClient.createUser(email, password, function(error, user) {
    if (!error) {
      var name = firstname + " " + lastname;
      saveUser(name, user.uid);
      alert("Welcome! You're now an authorized user.");
      window.location = "http://localhost:8000/index.html";
    } else {
      alert(error);
    }
  });
  return false;
});

//end registration
//user login
$("#loginButton").on("click", function() {
  myDataRef.authWithPassword({
    email: $("#loginEmail").val(),
    password: $("#loginPassword").val()
  }, function(error, authData) {
    if (error) {
      switch (error.code) {
        case "INVALID_EMAIL":
          console.log("The specified user account email is invalid.");
          break;
        case "INVALID_PASSWORD":
          console.log("The specified user account password is incorrect.");
          break;
        case "INVALID_USER":
          console.log("The specified user account does not exist.");
          break;
        default:
          console.log("Error logging user in:", error);
      }
    } else {
      alert("Welcome back!");
      console.log("Authenticated successfully with payload:", authData);
      localStorage.setItem("uid", authData.uid);
      localStorage.setItem("provider", authData.provider);
      window.location = "http://localhost:8000/index.html";

    }
  });
  return false;
});
//end login
