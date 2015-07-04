$('#search-form').submit(function(event) {
  event.preventDefault();
  photoSearch();
  wikiSearch();
});

$(document).ready(function() { //run on load with stock photos

});


$(document).ready(function() {
  if (window.location.pathname === "/plan.html" && localStorage.firstName === undefined) {
    $("#plansParent").replaceWith('<h4>Please log in to see your plans.</h4>');
  };

  if (localStorage.firstName !== undefined) {
    $("#login-container").replaceWith("<div class='three columns' id='login-container'> <p>Welcome back " + "<a href='/plan.html'>" +
      localStorage.firstName + "</a>" + "!</p>" + "<p><a id='logout' href='index.html'>Log Out</a></div>");
    $("#plansParent").append('<select width="100" id="planSelect" name="planSelect" class="add_select"></select> <button id="addChildPlan"> Add Plan </button><button id="deletePlan" name="deletePlanButton"> Delete Plan </button> <button class="yourPlans"> Your Plans </button>');
  };

  function updateSelectBox(current, planId, planData) {
    var option = "<option value='' id='" + planId + "' ";
    if (current == planId) {
      option += 'selected="selected"';
      localStorage.setItem("currentPlanName", planData.name);
    }
    option += ">" + planData.name + "</option>";
    $(".add_select").append(option);
  }


  function loadUserPlans(uid) {
    var userRef = new Firebase("https://shining-fire-453.firebaseio.com/users");
    userRef.child(uid).once("value", function(snapshot) {
      //get the user's current plan
      var currentPlan = snapshot.val().currentPlan;
      myDataRef.child("users").child(uid).child("plans").once("value", function(snapshot) {
        for (var planId in snapshot.val()) {
          myDataRef.child("plans").child(planId).once("value", function(snap) {
            updateSelectBox(currentPlan, planId, snap.val());
          });
        }
      });
    });
  }

  //plan.html
  function loadUserPhotos(uid) {
    var planPhotoRef = new Firebase("https://shining-fire-453.firebaseio.com/plans");
    planPhotoRef.child("photos").once("value", function(snapshot) {
      for (var photoId in snapshot.val()) {
        myDataRef.child("photos").child(photoId).once("value", function(snap) {
          console.log("loadUserPhotos", uid, photoId, snap.val());
          loadUserPlanPhotos(snap.val().photoURL);
        });
      }
    });
  }

  //add the user photos in the current plan to bxslider
  function loadUserPlanPhotos() {

  }

  // Show form for entering plan name and add link
  $("#addChildPlan").on("click", function() {
    var html = '<div class="add_container"><input class="add_input" type="text" size="50" maxlength="255"/><a href="#" class="add_link">Add</a></div>';
    $("#plansParent").append(html);
  });


  //redirect to plan.html when "your plans" button is pressed
  $(".yourPlans").click(function() {
    window.location = "/plan.html";
  });

  // Add the plan to the database and call updateSelector
  $("#plansParent").on("click", ".add_link", function() {
    var planName = $(this).prev(".add_input").val();
    if (localStorage.uid) {
      savePlan(planName, localStorage.uid);
    } else {
      alert("You must log in before trying to create a plan!");
      window.location = "/login-signup.html";
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
  $("#logout").click(function() {
    alert("Come back soon!");
    window.localStorage.clear();
    location.reload();
    return false;
  })

  $('.bxslider').bxSlider({
    adaptiveHeight: true,
    slideWidth: 850
  });

});
