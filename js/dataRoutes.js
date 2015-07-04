function reportError(error) {
  if (error) {
    alert("Data could not be saved." + error);
  } else {
    alert("Data saved successfully.");
  }
}


function thingExists(){
  if (exists) {
    return true;
  } else{
    return false;
  }
}

//checkPhoto -- checks to see if the photo is in the database
function checkPhoto (requestedOperation, photoURL, currentSlideCaptionText, currentPlan, uid) {
  console.log("checkPhoto Called", requestedOperation, photoURL, currentSlideCaptionText, currentPlan, uid);
  // start adding the photo
  var photosRef = myDataRef.child("photos");
  //check to see if the photo exists
  photosRef.orderByChild('photoURL').equalTo(photoURL).once("value",function(snapshot) {
    console.log("existing photo:",snapshot.val());
    //call savePhoto ? maybe as callback to once?
    if (snapshot.val() === null && requestedOperation === "save") {
      savePhoto(photoURL,currentSlideCaptionText,currentPlan,uid);
    } else if (snapshot.val() != null && requestedOperation === "check") {
      savedHeart();
    } else if (snapshot.val() != null && requestedOperation === "delete") {
      
      var data = snapshot.val();
      console.log("checkPhotos snapshot",snapshot,data,Object.keys(data));
      deletePhoto(Object.keys(snapshot.val())[0],currentPlan,uid);
    }  
  });
}

// savePhoto --adds a photo to the photosJSON, usersJSON and plansJSON.
function savePhoto(photoURL, currentSlideCaptionText, currentPlan, uid){
  //save the photo to photos using push
  var plansObj = {};
  plansObj[currentPlan] = true;

  console.log("saving photo",photoURL, uid, plansObj,currentSlideCaptionText,currentPlan);
  var photosRef = myDataRef.child("photos");
  var newPhotoRef = photosRef.push({
      photoURL: photoURL,
      users: uid,
      plans: plansObj,
      captionText: currentSlideCaptionText
  }, reportError());
  console.log("newPhotoRef",newPhotoRef);
  photoID = newPhotoRef.key();
  console.log("photoID",photoID);

  //update plans with the photoUID
  var plansRef = myDataRef.child("plans");
  plansRef.child(currentPlan).child("photos").child(photoID).set(true);

  //update users with the photoUID
  myDataRef.child("users").child(uid).child("photos").child(photoID).set(true);
}

//saveUser --creates user in usersJSON, not the same as 'register' function
function saveUser(name, simpleuserid) {
  var usersRef = myDataRef.child("users").child(simpleuserid);
  console.log("saving user",name,simpleuserid)
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
function updatePlan(planId,uid){  // NOT TESTED
  //update users currentPlan
  usersRef = myDataRef.child("users").child(simpleuserid);
  usersRef.child("currentPlan").set(planId);
}

//deletePhoto --click filled heart to show broken heart (on click calls 'deletePhoto') removes photoUID from photos key in usersJSON. removes user from users key in photosJSON.
function deletePhoto(photoId,planId,uid) {
    console.log("deletePhoto called with",photoId,planId,uid);
      photoRef = myDataRef.child("photos").child(photoId);
      console.log("removing photo", photoRef);
      photoRef.remove(reportError());
      
      userPhotoRef = myDataRef.child("users").child(uid).child("photos").child(photoId);
      console.log("removing user photo",userPhotoRef);
      userPhotoRef.remove(reportError());
      planPhotoRef = myDataRef.child("plans").child(planId).child("photos").child(photoId);
      console.log("removing plan photo",planPhotoRef);
      planPhotoRef.remove(reportError());
    
}

//deletePlan -- button. removes plan from plansJSON, usersJSON and photosJSON. NOT MVP.
// we expect user to delete currentPlan, so set a new currentPlan that is the latest in the list
function deletePlan(planId,uid) {
  planRef = myDataRef.child("plans").child(planId);
  console.log("deleting plan",planRef);
  //planRef.remove(reportError());
  userRef = myDataRef.child("users").child(uid);
  userPlanRef = userRef.child("plans").child(planId);
  console.log("deleting user plan",userPlanRef);
  //userPlanRef.remove(reportError());
  
  // get the latest plan for the user  # NEEDS FIXING
  myDataRef.child("plans").orderByChild("users").equalTo(uid).once("value", function(snap) {
    console.log("deletePlan snap".snap.val());  
  }); 
  
  //set the latest plan to currentPlan
  //userRef.child("currentPlan").set(planId);
  
}