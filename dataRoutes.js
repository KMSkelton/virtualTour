function reportError(error) {
  if (error) {
    alert("Data could not be saved." + error);
  } else {
    alert("Data saved successfully.");
  }
}

//savePhoto --adds a photo to the photosJSON, usersJSON and plansJSON.
//saveUser --creates user in usersJSON, not the same as 'register' function
function saveUser(name, simpleuserid) {
  var usersRef = myDataRef.child("users/").child(simpleuserid);
  usersRef.set({
    name: name,
    photos: {},
    currentPlan: "",
    plans: {}
  }, reportError());
  return false;
}
//savePlan --adds plan to plansJSON. updates 'autoincrement' (uses firebase-generated UID from push() method instead).
function savePlan(planName, simpleuserid) {
  var plansRef = myDataRef.child("plans");
  var newPlanRef = plansRef.push({
    name: planName,
    user: simpleuserid,
    notes: "", //max 750 char?
    flickrUID: {}, //hash to use Object.keys(plansJSON:photos).length ...slow, but cheap in lines of code :)
    wikiURL: ""
  }, reportError());
  var planId = newPlanRef.key();
  var usersPlansRef = myDataRef.child("users").child(simpleuserid).child("plans");
  usersPlansRef.set({
    planId: true
  }, reportError());
  var usersRef = myDataRef.child("users").child(simpleuserid);
  usersRef.set({
    currentPlan: planId
  }, reportError());

}

//updateUser --changes user info in usersJSON. NOT MVP.
//updatePlan --updates currentPlan in usersJSON. called when user clicks on a not-current plan (from sidebar).

//deletePhoto --click filled heart to show broken heart (on click calls 'deletePhoto') removes photoUID from photos key in usersJSON. removes user from users key in photosJSON.
//deletePlan -- button. removes plan from plansJSON, usersJSON and photosJSON. NOT MVP.
