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
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("provider", user.provider);
      localStorage.setItem("firstName",firstname);
      window.location = "http://localhost:8000/index.html";
    } else {
      alert(error);
    }
  });
  return false;
});

function goHome() {
  window.location = "http://localhost:8000/index.html"
}

function getUserData(authData) {
  //pull user data to display favorites
  var userRef = new Firebase("https://shining-fire-453.firebaseio.com/users");
  userRef.child(authData.uid).once("value",function(snapshot) {
    var fullName = snapshot.val().name;
    var displayName = fullName.split(' ');
    localStorage.setItem("firstName", displayName[0]);
    var currentPlan = snapshot.val().currentPlan;
    localStorage.setItem("currentPlan", currentPlan);
    //redirect to user-enabled home page
    goHome();
   });  
}

//end registration
//user login
$("#loginButton").on("click", function(e) {
  e.preventDefault();
  myDataRef.authWithPassword({
    email: $("#loginEmail").val(),
    password: $("#loginPassword").val()
  }, function(error, authData) {
    if (error)   {
      switch (error.code) {
        case "INVALID_EMAIL":
          console.log("The specified user account email is invalid.");
          alert("The specified user account email is invalid.");
          break;
        case "INVALID_PASSWORD":
          console.log("The specified user account password is incorrect.");
          alert("The specified user account password is incorrect.");
          break;
        case "INVALID_USER":
          console.log("The specified user account does not exist.");
          alert("The specified user account does not exist.");
          break;
        default:
          console.log("Error logging user in:", error);
      }
    } else {
      alert("Welcome back!");
      localStorage.setItem("uid", authData.uid);
      localStorage.setItem("provider", authData.provider);
      getUserData(authData);      
    }
    return false;
  });
});
//end login
