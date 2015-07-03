$(document).ready(function() {
console.log("local storage says:" + localStorage.uid);
if (localStorage.uid !== undefined){
  $("#login-container").replaceWith("<p>Welcome back " + "<a href='/plans.html'>insert getUser code here</a>" + "!</p>" + "<p><a id='logout' href='loggedOut.html'>Log Out</a>");
};

  // load Current Plans into planSelect
  function loadUserPlans(uid) {
    $(".add_select").html(); //reset the select values
    var plans = getUserPlans(uid);
    console.log("plans in loadUserPlans",plans);
    for (var planId in plans){
      var planName = plans[planId];
      var option = "<option value='' id='"+planId+"' ";
      if (plans["current"] == planId) {
        option += 'selected="selected"';
      }
      option += ">" + planName + "</option>";
      $(".add_select").append(option);
    }
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
    //loadUserPlans(localStorage.uid);
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
