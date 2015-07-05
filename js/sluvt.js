
function updateSelectBox(current, planId, planData) {
   var option = "<option value='' id='" + planId + "' ";
  if (current == planId) {
    option += 'selected="selected"';
    localStorage.setItem("currentPlanName", planData.planName);
  }
  option += ">" + planData.planName + "</option>";
  $(".add_select").append(option);
}

function updateFavorites(data,elementId) {
    $('#'+elementId).find('img').attr('src',data.photoURL);
    $('#'+elementId).find('p').html(data.captionText);
    $('#'+elementId).find('h3').html('<h3>'+data.planName+'</h3>'); 
 }


function updateUserSavedPlans(snapshot) {
  var ids = ["horiz--left","horiz--center","horiz--right"];
  var cnt = 0;
  snapshot.forEach(function(data){
    updateFavorites(data.val(),ids[cnt]);
    cnt++;
  });      
} 

 function loadFavorites() { 
    if (window.location.pathname === "/plan.html") {
      myDataRef.child("users").child(localStorage.uid).child("plans").orderByKey().limitToLast(3).once("value",function(snapshot) {
        var ids = ["horiz--left","horiz--center","horiz--right"];
        var cnt = 0;
        snapshot.forEach(function(data) {
          loadPlanLastPhoto(data.key(),ids[cnt]);
          cnt++;
        });            
      });
    } else{
      // get 3 latest photos and display
      myDataRef.child("photos").orderByKey().limitToLast(3).once("value", function(snapshot) {
        var ids = ["horiz--left","horiz--center","horiz--right"];
        var cnt = 0;
        snapshot.forEach(function(data){
          updateFavorites(data.val(),ids[cnt]);
          cnt++;
        });    
      });
    }
  }

function reloadSlider(slider) {
  slider.reloadSlider();
}
  
  function loadPlanSlider(){
     //called after loadCurrentPlanPhotos(planId) executes in callback chain
      
      console.log("after loadPhotos");    
      $("#viewer-container").append('<div id="hearts" class="openHeart"></div>');
      console.log("viewer should be complete",$("#viewer-container").html());            
      slider = $('.bxslider').bxSlider({
        pager: true,
        pagerType:'short',  //use numbers instead of dots
        captions: false ,    //will show captions from text in title field of <img>
        adaptiveHeight: true,
        slideWidth: 850,
        maxSlides: 1,
        onSliderLoad: function(currentSlide,currentIndex){
          var currentSlideCaptionText = currentSlide[0].children[1].innerHTML;
          var currentImgURL = currentSlide[0].children[0].src;
          //console.log("loading first hearts ",currentImgURL,currentSlideCaptionText);
          setupHearts(currentImgURL,currentSlideCaptionText);
          checkPhoto("check",currentImgURL,currentSlideCaptionText,localStorage.currentPlan, localStorage.uid);
          loadFavorites();
        },
        onSlideAfter: function(currentSlide, previousSlideNumber, currentSlideNumber){
          $("#hearts").unbind();  // remove the old handler
          var currentSlideCaptionText = currentSlide[0].children[1].innerHTML;
          var currentImgURL = currentSlide[0].children[0].src;
          //console.log("hearts should ",currentImgURL,currentSlideCaptionText);
          setupHearts(currentImgURL,currentSlideCaptionText);  // add new handler
          checkPhoto("check",currentImgURL,currentSlideCaptionText,localStorage.currentPlan, localStorage.uid);
          loadFavorites();
        }
      });
      
      console.log("slider should be setup");
      reloadSlider(slider);      
    }
  

$(document).ready(function() {
  if (window.location.pathname === "/plan.html") {
    if(localStorage.firstName === undefined) {
      $("#plansParent").replaceWith('<h4>Please log in to see your plans.</h4>');
      $('.bxslider').bxSlider({
        adaptiveHeight: true,
        slideWidth: 850
      });
    } else {
      loadFavorites();
      loadPlanViewer(localStorage.currentPlan);
    }
  } else {
    loadFavorites();
  }

  if (localStorage.firstName !== undefined) {
    $("#login-container").replaceWith("<div class='three columns' id='login-container'> <p>Welcome back " + "<a href='/plan.html'>" +
      localStorage.firstName + "</a>" + "!</p>" + "<p><a id='logout' href='index.html'>Log Out</a></div>");
    $("#plansParent").append('<select width="100" id="planSelect" name="planSelect" class="add_select"></select> <button id="addChildPlan"> Add Plan </button><button id="deletePlan" name="deletePlanButton"> Delete Plan </button> <button class="yourPlans"> Your Plans </button>');
  };

  // EVENT HANDLERS
  $('#location-search-submit').on("click",(function(event) {
    event.preventDefault();
    photoSearch();
    wikiSearch();
  }));

  //redirect to plan.html when "your plans" button is pressed
  $(".yourPlans").click(function() {
    event.preventDefault();
    window.location = "/plan.html";
  });

  // PLAN HANDLERS  
  // Show form for entering plan name and add link
  $("#addChildPlan").on("click", function(event) {
    event.preventDefault();
    
    var html = '<div class="add_container"><h3>Plan Name:</h3><input class="add_input" type="text" size="50" maxlength="255"/><button id="add-plan-submit" class="add_link">Add</button></div>';
    $("#addFormParent").append(html);
    $("#addFormParent").removeClass().addClass("navbar");
  });

  // Add the plan to the database and call updateSelector
  $("#addFormParent").on("click", ".add_link", function(event) {
    event.preventDefault();
    var planName = $(this).prev(".add_input").val();
    if (localStorage.uid) {      
      savePlan(planName, localStorage.uid);
    } else {
      alert("You must log in before trying to create a plan!");
      window.location = "/login-signup.html";
    }
    $(".add_container").remove();
    $(".add_select").empty();
    $("#addFormParent").removeClass().addClass("hidden");
    loadUserPlans(localStorage.uid);
  });
  
  //Delete the plan from the database
  $("#deletePlan").on("click",function(event) {
    event.preventDefault();
    deletePlan(localStorage.currentPlan,localStorage.uid);
  });

  // on select plan change update the database and localstorage
  $("#planSelect").change(function(event){
    var newPlanName = $(this).children(":selected").html();
    var newPlanId = $(this).children(":selected").attr("id");
    localStorage.setItem("planName",newPlanName);
    localStorage.setItem("currentPlan",newPlanId);                                                 
    setUserPlan(newPlanId,localStorage.uid);
    if (window.location.pathname === "/plan.html") {    
      loadPlanViewer(localStorage.currentPlan);
    }
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

  if(window.location.pathname === "/index.html" ){
    $('.bxslider').bxSlider({
      adaptiveHeight: true,
      slideWidth: 850
    });
  }
  
  
});
