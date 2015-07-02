
//save Plan
$("#savePlanButton").on("click", function() {
    console.log("in savePlanButton");
    var planName = $("#planName").val();
    if (localStorage.user_id) {
        savePlan(planName, localStorage.user_id);
    } else {
        alert("You must log in before trying to create a plan!");
    }
    return false;
});
