
//save Plan
$("#savePlanButton").on("click", function() {
    console.log("in savePlanButton");
    var planName = $("#planName").val();
    if (localStorage.uid) {
        savePlan(planName, localStorage.uid);
    } else {
        alert("You must log in before trying to create a plan!");
    }
    return false;
});
