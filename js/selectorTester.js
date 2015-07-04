$(document).ready(function() {

  if (localStorage.uid !== undefined){
    $("#login-container").replaceWith("<p>Welcome back " + "<a href='/plans.html'>insert getUser code here</a>" + "!</p>" + "<p><a id='logout' href='loggedOut.html'>Log Out</a>");
  };
  
    // load Current Plans into planSelect using jQuery AJAX calls   - deprecated
  /*  function loadUserPlans(uid) {
      $(".add_select").html(); //reset the select values
      $.get("https://shining-fire-453.firebaseio.com/users/"+uid+"/.json"
      ).then(function(data) {
        console.log("data in ajax call is ",data);
        for (var planId in data.plans) {
          console.log("planId in data",planId);
          $.get(
            "https://shining-fire-453.firebaseio.com/plans/"+planId+"/.json"
            ).done(function(planData) {
              console.log("planData",planData);
              var option = "<option value='' id='"+planId+"' ";
              if (data.current == planId) {
                option += 'selected="selected"';
              }
              option += ">" + planData.name + "</option>";
              $(".add_select").append(option);
            });
        }
      });
    }
      */
    
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
  loadUserPlans(localStorage.uid);

  //logging Out
  $("#logout").click(function(){
    alert("Come back soon!");
    window.localStorage.clear();
    location.reload();
    return false;
  })
});
