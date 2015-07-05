var myDataRef = new Firebase('https://shining-fire-453.firebaseio.com');

function reportError(error) {
  if (error) {
    alert("Data could not be saved." + error);
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

  function updatePlanWikiScrollBox(photoData) {
    wikiSearchExtract(photoData.wikiExtractURL);
    $("#wikiLink").html(photoData.wikiURL);
  }

  function loadPlanViewer(planId) {               
    $("#viewer-container").html('<ul class="bxslider">');
    myDataRef.child("photos").orderByChild("plans").equalTo(planId).once("value",function(snap) {
      if (snap.val() === null) {
        $('.bxslider').append('<li><img src="images/colosseum2-1024.jpg"><div class="newCaption"><p>Colosseum (Rome)</p></div></li>');
        $('#wikiScrollBox').html('<p>No images in this plan.  Please add an image via the search page.</p>');
      }else {
        var first;
        var cnt = 0;
        snap.forEach(function(data){
          if (cnt == 0) { first = data.val(); cnt++;}
          addPlanSlide(data.val());
        });
        updatePlanWikiScrollBox(first);
      }
      $("#viewer-container").append('</ul>');
      loadPlanSlider();
            
    });
  } 
 
  function addPlanSlide(data){
     $('.bxslider').append('<li><img src="'+ data.photoURL + '"><div class="newCaption">'+ data.captionText +'</div></li>');
  }
   
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
        updateFavorites(data,elementId);
    });
  }


//checkPhoto -- checks to see if the photo is in the database
function checkPhoto (requestedOperation, photoURL, currentSlideCaptionText, wikiURL, wikiExtractURL, currentPlan, uid) {
  var photosRef = myDataRef.child("photos");
  photosRef.orderByChild('photoURL').equalTo(photoURL).once("value",function(snapshot) {
    if (snapshot.val() === null && requestedOperation === "save") {
      savePhoto(photoURL,currentSlideCaptionText,wikiURL,wikiExtractURL,currentPlan,uid);
    } else if (snapshot.val() != null && requestedOperation === "check") {
      savedHeart();
    } else if (snapshot.val() != null && requestedOperation === "delete") {
      var data = snapshot.val();
      deletePhoto(Object.keys(snapshot.val())[0],currentPlan,uid);
    }  
  });
}

// savePhoto --adds a photo to the photosJSON, usersJSON and plansJSON.
function savePhoto(photoURL, currentSlideCaptionText, wikiLink, wikiExtractURL, currentPlan, uid){
  var photosRef = myDataRef.child("photos");
  var newPhotoRef = photosRef.push({
      "photoURL": photoURL,
      "users": uid,
      "plans": currentPlan,
      "captionText": currentSlideCaptionText,
      "wikiLink": wikiLink,
      "wikiExtractURL": wikiExtractURL
  }, reportError());
  photoID = newPhotoRef.key();

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
  }, reportError());

  var planId = newPlanRef.key();
  var usersPlansRef = myDataRef.child("users").child(simpleuserid).child("plans");
  usersPlansRef.child(planId).set(true);

  var usersRef = myDataRef.child("users").child(simpleuserid);
  usersRef.child("currentPlan").set(planId);
  localStorage.setItem("currentPlan",planId);
}

//updatePlan --updates currentPlan in usersJSON. called when user clicks on a not-current plan (from sidebar).
function updatePlan(planId,uid){  // NOT TESTED
  //update users currentPlan
  usersRef = myDataRef.child("users").child(simpleuserid);
  usersRef.child("currentPlan").set(planId);
}

//deletePhoto --click filled heart to show broken heart (on click calls 'deletePhoto') removes photoUID from photos key in usersJSON. removes user from users key in photosJSON.
function deletePhoto(photoId,planId,uid) {
      photoRef = myDataRef.child("photos").child(photoId);
      photoRef.remove(reportError());
      //remove index reference in users
      userPhotoRef = myDataRef.child("users").child(uid).child("photos").child(photoId);
      userPhotoRef.remove(reportError());
      //remove index reference in plans      
      planPhotoRef = myDataRef.child("plans").child(planId).child("photos").child(photoId);
      planPhotoRef.remove(reportError());
}

//deletePlan -- button. removes plan from plansJSON, usersJSON and photosJSON. NOT MVP.
// we expect user to delete currentPlan, so set a new currentPlan that is the latest in the list
function deletePlan(planId,uid) {
  planRef = myDataRef.child("plans").child(planId);
  planRef.remove(reportError());
  //remove index reference in users::plans
  userRef = myDataRef.child("users").child(uid);
  userPlanRef = userRef.child("plans").child(planId);
  userPlanRef.remove(reportError());
  
  // get the latest plan for the user and set current plan to this plan
  myDataRef.child("plans").orderByChild("user").equalTo(uid).once("value", function(snap) {
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