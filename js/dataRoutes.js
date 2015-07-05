var myDataRef = new Firebase('https://shining-fire-453.firebaseio.com');

function reportError(error) {
  if (error) {
    alert("Data could not be saved." + error);
  } else {
    //alert("Data saved successfully.");
  }
}

  function loadUserPlans(uid) {
    var userRef = new Firebase("https://shining-fire-453.firebaseio.com/users");
    userRef.child(uid).once("value", function(snapshot) {
      //get the user's current plan
      var currentPlan = snapshot.val().currentPlan;
      myDataRef.child("users").child(uid).child("plans").once("value", function(snapshot) {
        for (var planId in snapshot.val()) {
          loadUserPlanData(currentPlan,planId);         
        }
      });
    });
  }

  function loadUserPlanData(currentPlan,planId){
   myDataRef.child("plans").child(planId).once("value", function(snap) {
            updateSelectBox(currentPlan, planId, snap.val());
          });
  }


  function loadPlanViewer(planId) {               
    $("#viewer-container").html('<ul class="bxslider">');
    console.log("viewer container at start",$("#viewer-container").html());
    myDataRef.child("photos").orderByChild("plans").equalTo(planId).once("value",function(snap) {
      console.log("loadPlanViewer snap",snap.val());
      if (snap.val() === null) {
        console.log("snap is null");
        $('.bxslider').append('<li><img src="images/colosseum2-1024.jpg"><div class="newCaption"><p>Colosseum (Rome)</p></div></li>');
        $('#wikiScrollBox').html('<p>No images in this plan.  Please add an image via the search page.</p>');
      }else {
        snap.forEach(function(data){
          console.log("loadCurrentPlanPhotos foreach",data.val());
          addPlanSlide(data.val());
          console.log("after loadPlanViewer");
          
        });
      }
      $("#viewer-container").append('</ul>');
      console.log("after snap for functions",$("#viewer-container").html());
      loadPlanSlider();
            
    });
    console.log("after loadCurrentPlanPhotos");
  } 
 
  function addPlanSlide(data){
    console.log("addPlanSlide",data,data.photoURL,data.captionText);
     $('.bxslider').append('<li><img src="'+ data.photoURL + '"><div class="newCaption">'+ data.captionText +'</div></li>');
     console.log("after append",$('#viewer-container').html());
  }
 /* 
  function loadUserPhotos(uid) {  //plan.html
    console.log("loadUserPhotos");
    var planPhotoRef = new Firebase("https://shining-fire-453.firebaseio.com/plans");
    planPhotoRef.child("photos").once("value", function(snapshot) {
      for (var photoId in snapshot.val()) {
        loadPhotoData(photoId);  
      }
    });
  }
  
  function loadPhotoData(photoId) {
        myDataRef.child("photos").child(photoId).once("value", function(snap) {
          console.log("loadPhotoData", uid, photoId, snap.val());
          loadUserPlanPhotos(snap.val().photoURL);
        });
  }
  
  function loadUserPlanPhotos(photoURL,photoCaption){
  
  }
  */
  
  function loadPlanLastPhoto(planId,elementId){
    myDataRef.child("photos").orderByChild("plans").equalTo(planId).limitToLast(1).once("value",function(snapshot) {
      snapshot.forEach(function(data) {
        loadPlanName(planId,data.val(),elementId);
      });
    });
  }

  function loadPlanName(planId,data,elementId){
    myDataRef.child("plans").child(planId).once("value",function(snapshot){
        data.planName = snapshot.val().planName;
        data.notes = snapshot.val().notes;
        data.wikiURL = snapshot.val().wikiURL;
        updateFavorites(data,elementId);
    });
  }


//checkPhoto -- checks to see if the photo is in the database
function checkPhoto (requestedOperation, photoURL, currentSlideCaptionText, currentPlan, uid) {
  //console.log("checkPhoto Called", requestedOperation, photoURL, currentSlideCaptionText, currentPlan, uid);
  // start adding the photo
  var photosRef = myDataRef.child("photos");
  //check to see if the photo exists
  photosRef.orderByChild('photoURL').equalTo(photoURL).once("value",function(snapshot) {
    //console.log("existing photo:",snapshot.val());
    //call savePhoto ? maybe as callback to once?
    if (snapshot.val() === null && requestedOperation === "save") {
      savePhoto(photoURL,currentSlideCaptionText,currentPlan,uid);
    } else if (snapshot.val() != null && requestedOperation === "check") {
      savedHeart();
    } else if (snapshot.val() != null && requestedOperation === "delete") {
      
      var data = snapshot.val();
      //console.log("checkPhotos snapshot",snapshot,data,Object.keys(data));
      deletePhoto(Object.keys(snapshot.val())[0],currentPlan,uid);
    }  
  });
}

// savePhoto --adds a photo to the photosJSON, usersJSON and plansJSON.
function savePhoto(photoURL, currentSlideCaptionText, currentPlan, uid){
  //save the photo to photos using push
  //console.log("saving photo",photoURL, uid, plansObj,currentSlideCaptionText,currentPlan);
  var photosRef = myDataRef.child("photos");
  var newPhotoRef = photosRef.push({
      photoURL: photoURL,
      users: uid,
      plans: currentPlan,
      captionText: currentSlideCaptionText
  }, reportError());
  //console.log("newPhotoRef",newPhotoRef);
  photoID = newPhotoRef.key();
  //console.log("photoID",photoID);

  //update plans with the photoUID
  var plansRef = myDataRef.child("plans");
  plansRef.child(currentPlan).child("photos").child(photoID).set(true);

  //update users with the photoUID
  myDataRef.child("users").child(uid).child("photos").child(photoID).set(true);
  loadFavorites();
}

//saveUser --creates user in usersJSON, not the same as 'register' function
function saveUser(name, simpleuserid) {
  var usersRef = myDataRef.child("users").child(simpleuserid);
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
    planName: planName,
    user: simpleuserid,
    notes: "", //max 750 char?
    wikiURL: ""
  }, reportError());

  var planId = newPlanRef.key();
  var usersPlansRef = myDataRef.child("users").child(simpleuserid).child("plans");
  usersPlansRef.child(planId).set(true);

  var usersRef = myDataRef.child("users").child(simpleuserid);
  usersRef.child("currentPlan").set(planId);
  localStorage.setItem("currentPlan",planId);
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
    //console.log("deletePhoto called with",photoId,planId,uid);
      photoRef = myDataRef.child("photos").child(photoId);
      //console.log("removing photo", photoRef);
      photoRef.remove(reportError());
      
      userPhotoRef = myDataRef.child("users").child(uid).child("photos").child(photoId);
      //console.log("removing user photo",userPhotoRef);
      userPhotoRef.remove(reportError());
      planPhotoRef = myDataRef.child("plans").child(planId).child("photos").child(photoId);
      //console.log("removing plan photo",planPhotoRef);
      planPhotoRef.remove(reportError());
     
}

//deletePlan -- button. removes plan from plansJSON, usersJSON and photosJSON. NOT MVP.
// we expect user to delete currentPlan, so set a new currentPlan that is the latest in the list
function deletePlan(planId,uid) {
  planRef = myDataRef.child("plans").child(planId);
  //console.log("deleting plan",planRef);
  planRef.remove(reportError());
  userRef = myDataRef.child("users").child(uid);
  userPlanRef = userRef.child("plans").child(planId);
  //console.log("deleting user plan",userPlanRef);
  userPlanRef.remove(reportError());
  
  // get the latest plan for the user  # NEEDS FIXING
  //console.log("finding plans for uid",uid);
  myDataRef.child("plans").orderByChild("user").equalTo(uid).once("value", function(snap) {
    //console.log("deletePlan snap",snap.val());
    for (var random in snap.val()) break;
    if (random === undefined) {
      random = "";
    }
    setUserPlan(random,uid);  
  }); 
 
}

function setUserPlan(planId,uid) {
  userRef = myDataRef.child("users").child(uid);
  //set the latest plan to currentPlan
  userRef.child("currentPlan").set(planId);
  localStorage.currentPlan = planId;
  $(".add_select").empty();
  loadUserPlans(localStorage.uid);
}