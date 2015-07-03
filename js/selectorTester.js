$(document).ready(function() {
  $("#addChildPlan").on("click", function() {
    console.log("clicked")
    if (localStorage.getItem("uid") === null) {
      console.log(localStorage.getItem("uid"));
      window.location = "http://localhost:8000/login-signup.html";
    }
    var html = '<div class="add_container"><input class="add_input" type="text" size="50" maxlength="255"/><a href="#" class="add_link">Add</a></div>';
    $("#plansParent").append(html);
  });
  $("#plansParent").on("click", ".add_link", function() {
    var option = $("<option value='' id='removeSel' selected='selected'>" + $(this).prev(".add_input").val() + "</option>");
    $(".add_select").append(option);
    $(".add_container").remove();
  });
});
