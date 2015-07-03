function reportError(error) {
  if (error) {
    alert("Data could not be saved." + error);
  } else {
    alert("Data saved successfully.");
  }
}

//getUserPlans
function getUserPlans(uid) {
  /*console.log("getUserPlans called");
  var userRef = new Firebase("https://shining-fire-453.firebaseio.com/users");
  var planRef = new Firebase("https://shining-fire-453.firebaseio.com/plans");
  var list = Firebase.getAsArray(userRef.child(uid));
    console.log("list is ",list);
  console.log("list is ",list.$indexOf("plans"));
  var index = list.$indexOf("plans");
  console.log("list plans are", list[index]); */
  var plans = {};
  /*
  userRef.child(uid).on("value",function(snapshot) {
    console.log("userRef snapshot val ",snapshot.val());
    for (var plan in snapshot.val().plans) {
      console.log("plan is",plan);
      planRef.child(plan).once("value",function(planSnap) {
        if (planSnap.val() != null) {
          console.log("planRef snapshot is",planSnap.val());
          plans[plan] = planSnap.val().name;
        }
        console.log("plans before return",plans);
     return plans;
      });
    }

  }, function(errorObject) {
      console.log("The read failed: "+ errorObject.code)
  });
  */
  plans["-JtFvtxXz2BnFRL9FP8m"] = "fda";  // id = name
  plans["current"] = "fjdklafjdla";
  plans["fjdklafjdla"] = "fdjkalfj";

}

//savePhoto --adds a photo to the photosJSON, usersJSON and plansJSON.
function savePhoto(photoURL, uid){
  console.log("savePhoto Called", photoURL, uid);
  //get user
  var userRef = new Firebase("https://shining-fire-453.firebaseio.com/users");
  userRef.child(uid).once("value",function(snapshot) {
    console.log("snapshot val ",snapshot.val());
    //get the user's current plan
    var currentPlan = snapshot.val().currentPlan;
    console.log("currentPlan", currentPlan);

    // start adding the photo
    var photosRef = myDataRef.child("photos");
    //check to see if the photo exists
    var photoID = "";
    photosRef.orderByChild('photoURL').equalTo(photoURL).once("value",function(snapshot) {
      console.log("photoURL checks",snapshot.val());
      if (snapshot.val() == null) {
        //save the photo to photos using push
        var plansObj = {};
        plansObj[currentPlan] = true;

        console.log()
        var newPhotoRef = photosRef.push({
          photoURL: photoURL,
          users: uid,
          plans: plansObj
        }, reportError());
        console.log("newPhotoRef",newPhotoRef);
        photoID = newPhotoRef.key();
        console.log("photoID",photoID);

        //update plans with the photoUID
        var plansRef = myDataRef.child("plans");
        plansRef.child(currentPlan).child("photos").child(photoID).set(true);

        //update users with the photoUID
        userRef.child(uid).child("photos").child(photoID).set(true);
      }

    }, function(errorObject) {
      console.log("The read failed: "+ errorObject.code);
    });
  });
}

//saveUser --creates user in usersJSON, not the same as 'register' function
function saveUser(name, simpleuserid) {
  var usersRef = myDataRef.child("users/").child(simpleuserid);
  usersRef.set({
    name: name,
    currentPlan: "",
    //photos: {},
    //plans: {}
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
    flickrUID: {}, //hash to use   Object.keys(plansJSON:photos).length ...slow, but cheap in lines of code :)
    wikiURL: ""
  }, reportError());

  var planId = newPlanRef.key();
  var usersPlansRef = myDataRef.child("users").child(simpleuserid).child("plans");
  usersPlansRef.child(planId).set(true);

  var usersRef = myDataRef.child("users").child(simpleuserid);
  usersRef.child("currentPlan").set(planId);


}

//updateUser --changes user info in usersJSON. NOT MVP.
//updatePlan --updates currentPlan in usersJSON. called when user clicks on a not-current plan (from sidebar).

//deletePhoto --click filled heart to show broken heart (on click calls 'deletePhoto') removes photoUID from photos key in usersJSON. removes user from users key in photosJSON.
//deletePlan -- button. removes plan from plansJSON, usersJSON and photosJSON. NOT MVP.
