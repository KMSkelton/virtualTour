$(document).ready(function() {

  if (localStorage.uid !== undefined){

    $("#login-container").replaceWith("<div class='three columns' id='login-container'> <p>Welcome back " + "<a href='/plans.html'>" +
      localStorage.firstName
    +"</a>" + "!</p>" + "<p><a id='logout' href='loggedOut.html'>Log Out</a></div>");
  };

  function updateSelectBox(current,planId,planData) {
      var option = "<option value='' id='" + planId + "' ";
      if (current == planId) {
          option += 'selected="selected"';
      }
      option += ">" + planData.name + "</option>";
      $(".add_select").append(option);
  }


  function loadUserPlans(uid) {
    var userRef = new Firebase("https://shining-fire-453.firebaseio.com/users");
    userRef.child(uid).once("value",function(snapshot) {
       //get the user's current plan
      var currentPlan = snapshot.val().currentPlan;
      myDataRef.child("users").child(uid).child("plans").once("value", function(snapshot){

        for (var planId in snapshot.val()) {
          myDataRef.child("plans").child(planId).once("value", function(snap) {
            updateSelectBox(currentPlan,planId,snap.val());
          });
        }
      });
    });
  }

  // Show form for entering plan name and add link
  $("#addChildPlan").on("click", function() {
    var html = '<div class="add_container"><input class="add_input" type="text" size="50" maxlength="255"/><a href="#" class="add_link">Add</a></div>';
    $("#plansParent").append(html);
  });

  // Add the plan to the database and call updateSelector
  $("#plansParent").on("click", ".add_link", function() {
    var planName = $(this).prev(".add_input").val();
    if (localStorage.uid) {
      savePlan(planName, localStorage.uid);
    } else {
      alert("You must log in before trying to create a plan!");
        window.location = "http://localhost:8000/login-signup.html";
    }
    var option = $("<option value='' selected='selected'>" + planName + "</option>");
    $(".add_select").append(option);
    $(".add_container").remove();
  });

  // when everything has loaded check to load plans now
  if (localStorage.uid && localStorage.uid !== null) {
    loadUserPlans(localStorage.uid);
  }

  //logging Out
  $("#logout").click(function(){
    alert("Come back soon!");
    window.localStorage.clear();
    location.reload();
    return false;
  })
});
