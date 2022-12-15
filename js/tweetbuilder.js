//Enables Tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover('show');
})

//Enables copy to clipboard
$(document).ready(function() {
  //enable clipboard
  var clipboard = new ClipboardJS('.btn');
})
//default strings
const default_image = "images/No_image_available.svg";
const verified_string = '<span class="twVerified">✔</span>';
const verifiedEmbed_string = '<span class="twVerifiedEmbed">✔</span>';
const month_names = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

//verify URL is a proper image URL
function checkImageURL(url, callBack){
  //not a valid image if it doesn't even have the accepted endings
  if (url.match(/\.(jpeg|jpg|gif|png)$/) == null) { callBack(false); }

  var img = new Image();
  img.src = url;
  img.onload = function() {
    callBack(true);
  };
  img.onerror = function() {
    callBack(false);
  }
}
function validateURLInput(inputID, validity){
  if (validity == true) {
    document.getElementById(inputID).classList.remove('is-invalid');
    document.getElementById(inputID).classList.add('is-valid');
  } else {
    document.getElementById(inputID).classList.remove('is-valid');
    document.getElementById(inputID).classList.add('is-invalid');
  }
}
//fix image into img elements
function buildImage(elementID, targetClass, altID) {
    hideCode();
    var newURL = DOMPurify.sanitize(document.getElementById(elementID).value);
    var altText = DOMPurify.sanitize(document.getElementById(altID).value);

    checkImageURL(newURL, function(imageExists){
      if (imageExists == false) {
        //use default image if image doesn't work
        $(targetClass).attr("src", default_image);
        validateURLInput(elementID, false);
      } else {
        $(targetClass).attr("src", newURL);
        validateURLInput(elementID, true);
      }
      //apply alternate ID if applicable
      if (altText.length == 0) {
        $(targetClass).attr("alt", "Image inserted here");
      } else {
        $(targetClass).attr("alt", altText);
      }
    });
}
//converts all escape characters and line breaks
function escapeInput(raw, noWhiteSpace){
  var refined = raw
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  if (noWhiteSpace) {
    refined = refined.replace(/ /g, '');
  }
  return refined;
}

//radio button like checkboxes
function checkboxShade(elementName) {
  var className = $(elementName).attr('name');
  if (className == null) {
    return;
  }
  $("input[name='" + className + "']").not(elementName).prop('checked', false);
  $("input[name='" + className + "']").not(elementName).parent().css("background", "transparent");
  $("input[name='" + className + "']").not(elementName).siblings().css("color", "#fff");
  if ($(elementName).is(':checked')){
    $(elementName).parent().css("background","#fff");
    $(elementName).siblings().css("color","#582630");
  } else {
    $(elementName).parent().css("background","transparent");
    $(elementName).siblings().css("color","#fff");
  }
}

/* Collapses code generators if anything has been change in inputs*/
function hideCode(){
  $('.genCode').collapse('hide');
  $('[data-toggle="popover"]').popover('hide');
}
/*Generate HTML Code*/
function generateCode(){
  var receivedHTML = document.getElementById('demonstration');
  document.getElementById('HTMLCode').value = receivedHTML.innerHTML.trim();
}

// $(document).ready(function () {
//     $('#sidebarCollapse').on('click', function () {
//         $('#sidebar').toggleClass('active');
//     });
// });

/*JS variable settings for mobile screen sizes*/
var media_query = window.matchMedia("(max-width: 700px)");
/*Sidenav drawer interactions*/
function openNav() {
  hideCode();
  if (media_query.matches){
    document.getElementById("mySidenav").style.width = "100%";
  } else {
    document.getElementById("mySidenav").style.width = "350px";
    document.getElementById("main").style.marginLeft = "350px";
  }
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

/*GENERAL SETTINGS*/
/*Toggle night mode for the website*/
function toggleSiteNM() {
  document.body.classList.toggle("siteNM");
}
/* Hide Dummy Text */
function hideDummy() {
  $('.dummyText.collapse').collapse('toggle')
}
//create critical region for #hideDummy
$(".dummyText.collapse").on("show.bs.collapse", function(){
  $('#hideDummyText').prop('disabled', true);
})
//reenable button once transition is complete
$(".dummyText.collapse").on("shown.bs.collapse", function(){
  $('#hideDummyText').prop('disabled', false);
})
//hide and disable all stuff in box when transition begins
$(".dummyText.collapse").on("hide.bs.collapse", function(){
  $('#hideDummyText').prop('disabled', true);
})
//reenable the checkbox once the collapse is complete
$(".dummyText.collapse").on("hidden.bs.collapse", function(){
  $('#hideDummyText').prop('disabled', false);
})
/*Changes the appearance of the Tweet (day/night/simple)*/
function editMode() {
  hideCode();
  //get value of radio button group
  var radioVal = $("input[name='twMode']:checked").val();
  //change Tweet appearance according to value
  switch(radioVal) {
    case "night":
      $(".tw").addClass("twNM");
      $(".tw").addClass("twBody");
      break;
    case "simple":
      $(".tw").removeClass("twBody");
      $(".tw").removeClass("twNM");
      break;
    default: //day
      $(".tw").addClass("twBody");
      $(".tw").removeClass("twNM");
  }
}

/*HEADER SETTINGS*/
/* if active, removes all elements and disables all boxes */
function hideUser(){
  hideCode();
  if (event.target.checked == true) {
    //disable all the inputs
    $('#inputAvatar').prop('disabled', true);
    $('#inputName').prop('disabled', true);
    $('#inputHandle').prop('disabled', true);
    $('#inputVerified').prop('disabled', true);
    //remove header
    $('.twUser').remove();
  } else {
    //enable all inputs
    $('#inputAvatar').prop('disabled', false);
    $('#inputName').prop('disabled', false);
    $('#inputHandle').prop('disabled', false);
    $('#inputVerified').prop('disabled', false);
    //recreate header
    if ($(".twUser")[0]){ return; }

    var newElement = document.createElement("div");
    newElement.classList.add("twUser");
    $('.tw').prepend(newElement);
    $('.twUser').append($("<img>", {src: default_image}).addClass("twAvatar"));
    $('.twUser').append($("<span>"));
    $('.twUser > span').append($("<span>").addClass("twName"));
    $('.twUser > span').append("</br>");
    $('.twUser > span').append($("<span>").addClass("twHandle"));

    //Call build functions
    buildAvatar();
    buildName();
    buildHandle();
    if (document.getElementById("inputVerified").checked == true) {
      $('.twName').after(verified_string);
    }
  }
}
/*add verified icon or remove it*/
function addVerified(){
  hideCode();
  if (event.target.checked == false) {
    //remove verified icon if exists
    $('.twVerified').remove();
  } else {
    if ($('.twVerified')[0]) { return; }
      $('.twName').after(verified_string);
  }
}
//builder functions for header
function buildAvatar(){
  hideCode();
  buildImage("inputAvatar", ".twAvatar", "inputAltAvatar");
}
function buildName(){
  hideCode();
  var newText = DOMPurify.sanitize(document.getElementById("inputName").value);
  $(".twName").text(escapeInput(newText, false));
}
function buildHandle(){
  hideCode();
  var newText = DOMPurify.sanitize(document.getElementById("inputHandle").value);
  $(".twHandle").text("@" + escapeInput(newText, true));
}

/*CONTENT SETTINGS*/
/* Add replying tag*/
function addReply() {
  hideCode();
  $('#addReply').collapse('toggle');
  if (event.target.checked == false) {
    $('.twReply').remove();
  } else {
    // <div class="twReply"><span>replying to </span><span>@officialeuphemia</span></div>
    if($(".twReply")[0]){ return; }
    //build initial element
    var newElement = document.createElement("div");
    newElement.classList.add("twReply");

    //insert after header or make first child if no header
    if ($(".twUser").length) {
      $(".twUser").after(newElement);
    } else {
      $(".tw").prepend(newElement);
    }

    $(".twReply").append($("<span>").text("replying to "));
    $(".twReply").append($("<span>"));
    buildReply();
  }
}
//create critical region for #addReply
$("#addReply").on("show.bs.collapse", function(){
  $('#showReplying').prop('disabled', true);
})
//reenable button once transition is complete
$("#addReply").on("shown.bs.collapse", function(){
  $('#showReplying').prop('disabled', false);
})
//hide and disable all stuff in box when transition begins
$("#addReply").on("hide.bs.collapse", function(){
  $('#showReplying').prop('disabled', true);

})
//reenable the checkbox once the collapse is complete
$("#addReply").on("hidden.bs.collapse", function(){
  $('#showReplying').prop('disabled', false);
})
/*changeReply on Input*/
function buildReply(){
  hideCode();
  var newText = DOMPurify.sanitize(document.getElementById("inputReplyHandle").value);
  $(".twReply span:last-child").text("@" + newText);
}

/*inputting Text into Text Area*/
$("#inputText").keyup(function(){
  hideCode();
  var newText = DOMPurify.sanitize(document.getElementById("inputText").value),
    charCount = newText.length,
    current = $('#current'),
    maximum = $('#maximum'),
    countBox = $('#charCount');

  //update character count
  current.text(charCount);
  if (charCount > 200 ) { //warn user that they're approach character count
    current.css("font-weight", "bold");
    current.css("color", "rgb(255, 0, 0, 1)");
  } else {
    current.css("font-weight", "normal");
    current.css("color", "rgb(255, 255, 255, 0.5)");
  }

  newText = cleanText(newText);

  //change new text
  // $(".twText").text(newText);
  $(".twText").first().html(newText);
});
//returns input that escaps special characters and linebreaks as well as hashtag
function cleanText(oldText){
  /*convert all special characters and linebreaks*/
  var newText = escapeInput(oldText, false);
  newText = newText.replace('\n', '<br />');

  /*Encloses all words that begin with a # with span tags for hashtags*/
  var hashtagText = newText.replace(/#(\w+)/ig, "<span>#$1</span>");

  return hashtagText;
}

/*main function to add/remove media*/
function addMedia(){
  //disable all buttons while elements are being built
  hideCode();
  checkboxShade(event.target);

  //remove all previous additional media (there can only be one or none at all)
  $(".twImage, .twEmbed, .twPoll, .twAPoll, .twPollStats").remove();
  //collapse all setting divs pertaining to said thing
  $("#" + event.target.value).collapse('toggle');
  $("#addPhoto, #addQuote, #addPoll").prop('disabled', true);

  if(event.target.checked == true) {
    if (event.target.value == "addPhoto"){
      $("#addQuote, #addPoll").collapse('hide');
      $("#addPhoto").prop('disabled', false);
      addPhoto();
    } else if (event.target.value == "addQuote") {
      $("#addPhoto, #addPoll").collapse('hide');
      $("#addQuote").prop('disabled', false);
      addQuote();
    } else {
      $("#addPhoto, #addQuote").collapse('hide');
      $("#addPoll").prop('disabled', false);
      addPoll();
    }
  }
}
//critcal region for addMedia, disable all buttons when transition begins
$(".mediaBox").on("show.bs.collapse", function(){
  $("input:checkbox[name='addMedia']").prop('disabled', true);
})
//reenable button once transition is complete
$(".mediaBox").on("shown.bs.collapse", function(){
  $("input:checkbox[name='addMedia']").prop('disabled', false);
})
//hide and disable all stuff in box when transition begins to hide
$(".mediaBox").on("hide.bs.collapse", function(){
  $("input:checkbox[name='addMedia']").prop('disabled', true);
})
//reenable the checkbox once the collapse is complete
$(".mediaBox").on("hidden.bs.collapse", function(){
  $("input:checkbox[name='addMedia']").prop('disabled', false);
})

//handlers for adding a photo
function addPhoto(){
  hideCode();
  $('.twText').first().after($("<img>", {src: default_image}).addClass("twImage"));
  buildPhoto();
}
function buildPhoto() {
  hideCode();
  buildImage("inputImage", ".twImage", "inputAltImage");
}

//handlers for adding quoted tweets
function addQuote(){
  hideCode();

  //construct skeleton embedded Tweet
  $('.twText').first().after($("<div>").addClass("twEmbed twBody"));
  $('.twEmbed').append($("<div>").addClass("twUserEmbed"));
  $('.twUserEmbed').append($("<img>", {src: default_image}).addClass("twAvatarEmbed"));
  $('.twUserEmbed').append($("<span>").addClass("twNameEmbed"));
  $('.twUserEmbed').append($("<span>").addClass("twHandleEmbed"));
  $('.twEmbed').append($("<div>").addClass("twText"));

  //build from basic details
  buildNameEmbed();
  buildHandleEmbed();
  addVerifiedEmbed();
  addPhotoEmbed();
}
function buildAvatarEmbed(){
  hideCode();
  buildImage("inputAvatarEmbed", ".twAvatarEmbed", "inputAltAvatarEmbed");
}
function buildNameEmbed(){
  hideCode();
  var newText = DOMPurify.sanitize(document.getElementById("inputNameEmbed").value);
  $(".twNameEmbed").text(escapeInput(newText, false));
}
function buildHandleEmbed(){
  hideCode();
  var newText = DOMPurify.sanitize(document.getElementById("inputHandleEmbed").value);
  var noWhiteSpace = newText.replace(/ /g, '');
  $(".twHandleEmbed").text("@" + escapeInput(newText, true));
}
$("#inputTextEmbed").keyup(function(){
  hideCode();
  var newText = DOMPurify.sanitize(document.getElementById("inputTextEmbed").value),
    charCount = newText.length,
    current = $('#currentEmbed'),
    maximum = $('#maximumEmbed'),
    countBox = $('#charCount2');

  //update character count
  current.text(charCount);
  if (charCount > 200 ) { //warn user that they're approach character count
    current.css("font-weight", "bold");
    current.css("color", "rgb(255, 0, 0, 1)");
  } else {
    current.css("font-weight", "normal");
    current.css("color", "rgb(255, 255, 255, 0.5)");
  }

  newText = cleanText(newText);

  //change new text
  // $(".twText").text(newText);
  $(".twText").last().html(newText);
});
function addVerifiedEmbed(){
  hideCode();
  if ($('#inputVerifiedEmbed').prop("checked") == false) {
    //remove verified icon if exists
    $('.twVerifiedEmbed').remove();
  } else {
    if ($('.twVerifiedEmbed')[0]) { return; }
      $('.twNameEmbed').after(verifiedEmbed_string);
  }
}
function addPhotoEmbed(){
  hideCode();
  var checked = $('#showPhotoEmbed').prop("checked");
  if (checked == true) {
    $("#addPhotoEmbed").collapse('show');
    $('.twEmbed').append($("<img>", {src: default_image}).addClass("twImageEmbed"));
    buildPhotoEmbed();
  } else {
    $("#addPhotoEmbed").collapse('hide');
    $('.twImageEmbed').remove();
  }
}
function buildPhotoEmbed(){
  hideCode();
  buildImage("inputPhotoEmbed", ".twImageEmbed", "inputAltPhotoEmbed");
}
//critcal region for addPhotoEmbed, disable all buttons when transition begins
$("#addPhotoEmbed").on("show.bs.collapse", function(){
  $("#showPhotoEmbed").prop('disabled', true);
})
//reenable button once transition is complete
$("#addPhotoEmbed").on("shown.bs.collapse", function(){
  $("#showPhotoEmbed").prop('disabled', false);
})
//hide and disable all stuff in box when transition begins to hide
$("#addPhotoEmbed").on("hide.bs.collapse", function(){
  $("#showPhotoEmbed").prop('disabled', true);
})
//reenable the checkbox once the collapse is complete
$("#addPhotoEmbed").on("hidden.bs.collapse", function(){
  $("#showPhotoEmbed").prop('disabled', false);
})

//handlers for adding polls
function addPoll(){
  hideCode();

  if (!$(".twStats")[0]) {
    $(".twText").after($("<div>").addClass("twStats"));
  }
  $('.twStats').prepend($("<span>").addClass("twPollStats"));
  buildPollOptions();
  buildPollTime();
}
function buildActivePoll() {
  //change all poll options to active poll formatting
  hideCode();
  var checked = $('#isActivePoll').prop("checked");
  if (checked){
    $("#addPollTime").collapse("show");
    $("#addPollTime").prop("disabled", false);
    buildPollOptions();
    buildPollTime();
  } else {
    //revert pollstats to "final results"
    $("#addPollTime").collapse("hide");
    $("#addPollTime").prop("disabled", true);
    buildPollOptions();
    buildPollTime();
  }
}
//critcal region for addPhotoEmbed, disable all buttons when transition begins
$("#addPollTime").on("show.bs.collapse", function(){
  $("#isActivePoll").prop('disabled', true);
})
//reenable button once transition is complete
$("#addPollTime").on("shown.bs.collapse", function(){
  $("#isActivePoll").prop('disabled', false);
})
//hide and disable all stuff in box when transition begins to hide
$("#addPollTime").on("hide.bs.collapse", function(){
  $("#isActivePoll").prop('disabled', true);
})
//reenable the checkbox once the collapse is complete
$("#addPollTime").on("hidden.bs.collapse", function(){
  $("#isActivePoll").prop('disabled', false);
})
function buildPollTime() {
  hideCode();
  var timedString = getTotalVotes() + " votes • ",
      checked = $('#isActivePoll').prop("checked");

  if (checked) {
    var daysLeft = parseInt(document.getElementById("inputPollDays").value) || 0;
    if (daysLeft < 0) {daysLeft = 0;}
    var hrsLeft = parseInt(document.getElementById("inputPollHours").value) || 0;
    if (hrsLeft < 0) {hrsLeft = 0;}
    if (daysLeft > 0) {
      timedString += daysLeft + " days"
    } else {
      timedString += hrsLeft + " hrs"
    }
    timedString += " left";
    $(".twPollStats").text(timedString);
  } else {
    $(".twPollStats").text(timedString + "Final results");
  }
  $('.twPollStats').append("</br>");
}
function buildPollOptions(){
  //clear all options to prepare for rerendering
  for (var j = 1; j < 5; j++){
    $(".twPoll" + j).remove();
  }
  var winner = getWinningID();

  //reenter all poll items and customize appearance depending on active or not
  for (var i = 1; i < 5; i++) {
    var optionClassName = ".twPoll" + i,
        optionResponse = DOMPurify.sanitize(document.getElementById("addPoll" + i).value).trim();

    //if response is empty, skip to next one
    if (optionResponse == "") {
      continue;
    }

    //create and add poll option and add to DOM before stats
    $(".twStats").before($("<div>").addClass("twPoll" + i));

    //customize responses
    $(optionClassName).text(optionResponse);
    if ($('#isActivePoll').prop("checked")) {
      $(optionClassName).addClass("twAPoll");
    } else {
      var votePercentage = getVotePercentage(i);
      $(optionClassName).addClass("twPoll");
      $(optionClassName).addClass("p" + votePercentage);
      if (i == winner) {
        $(optionClassName).addClass("twWin");
      } else {
        $(optionClassName).addClass("twOpt");
      }
      $(optionClassName).prepend($("<span>").addClass("twBold"));
      $(optionClassName + " .twBold").text(votePercentage + "%");
    }
  }
  buildPollTime();
}
function getTotalVotes() {
  var totalVotes = 0, rawVotes = 0;
  for (var i = 1; i < 5; i++) {
    if ($("#addPoll"+i).val().length > 0){
      totalVotes += getIndividualVotes(i);
    }
  }
  return totalVotes;
}
function getIndividualVotes(optionID) {
  var rawVotes = parseInt(document.getElementById("addVote" + optionID).value) || 0;
  if (rawVotes < 0) {rawVotes = 0;}
  return rawVotes;
}
function getVotePercentage(optionID) {
  var total = getTotalVotes();
  if (total == 0) { total = 1;}
  var votes = getIndividualVotes(optionID);
  // console.log(optionID + ":" + votes + "/" + total + " = " + Math.round(votes/total*100));
  return Math.round(votes/total * 100);
}
function getWinningID(){
  var winner = 1;
  var winVotes = getIndividualVotes(1);
  for (var i = 2; i < 5; i++) {
    if (getIndividualVotes(i) > winVotes){
      winVotes = getIndividualVotes(i);
      winner = i;
    }
  }
  return winner;
}

/*FOOTER SETTINGS*/
function hideFooter() {
  hideCode();
  if (event.target.checked == true) {
    //disable all the inputs
    $('#inputLikesCt').prop('disabled', true);
    $('#inputDate').prop('disabled', true);
    $('#hideComments').prop('disabled', true);
    $('#commentsBox :input').prop('disabled', true);
    $("input[name='addLikesMetric']").prop('disabled', true);

    //remove footer
    $('.twComments').remove();
    if (!$('.twPollStats')[0]) {  //if polls aren't in the tweet
      $('.twStats').remove();
    } else {
      $('.twLikes').remove();
      $('.twTime').remove();
    }
  } else {
    //enable all inputs
    $('#inputLikesCt').prop('disabled', false);
    $('#inputDate').prop('disabled', false);
    $("input[name='addLikesMetric']").prop('disabled', false);
    $('#hideComments').prop('disabled', false);

    //recreate footer
    if (!$(".twStats")[0]) {
      $(".tw").append($("<div>").addClass("twStats"));
      //TODO: add poll result stats if needed
    }
    $(".twStats").append($("<span>").addClass("twLikes"));
    $(".twStats").append($("<span>").addClass("twTime"));

    //Call build functions
    buildLikes();
    buildTime();
    hideComments();
  }
}
function hideComments(){
  hideCode();
  var commentsCheck = document.getElementById("hideComments").checked;

  if (commentsCheck) {
    $(".twComments").remove();
    $("#commentsBox").collapse('hide');
    $("#commentsBox :input").prop("disabled", true);
  } else {
    $("#commentsBox :input").prop("disabled", false);
    $("#commentsBox").collapse('show');
    if ($(".twComments")[0]) { return; }

    var newElement = document.createElement("div");
    newElement.classList.add("twComments");
    $(".tw").append(newElement);
    buildComments();
  }
}
//disable checkbox when transition to open box begins
$("#commentsBox").on("show.bs.collapse", function(){
  $('#hideComments').prop('disabled', true);
})
//reenable button once transition is complete
$("#commentsBox").on("shown.bs.collapse", function(){
  $('#hideComments').prop('disabled', false);
})
//hide and disable all stuff in comments box as soon as user choose to hide comments
$("#commentsBox").on("hide.bs.collapse", function(){
  $('#hideComments').prop('disabled', true);

})
//reenable the checkbox once the collapse is complete
$("#commentsBox").on("hidden.bs.collapse", function(){
  $('#hideComments').prop('disabled', false);
})
function toggleStats(){
  checkboxShade(event.target);
  if (event.target.name == "addLikesMetric") {
    buildLikes();
  } else {
    buildComments();
  }
}
function buildLikes(){
  hideCode();
  var count = parseFloat(document.getElementById("inputLikesCt").value) || 0;
  if (count < 0 ) {count = 0; }

  var letter = $("input[name='addLikesMetric']:checked").val();
  var newText = count;
  if (letter != null) {
    newText+= letter;
  }

  $(".twLikes").text("❤ " + newText);
}
function buildComments(){
  hideCode();
  var count = parseFloat(document.getElementById("inputComments").value) || 0;
  if (count < 0) { count = 0; }

  var letter = $("input[name='addCommentsMetric']:checked").val();
  var newText = count;

  if (letter != null) {
    newText+= letter;
  }

  if (count == 1 && letter == null) {
    newText += " person is";
  } else {
    newText += " people are";
  }
  newText += " talking about this";

  $(".twComments").text(newText);
}
function buildTime() {
  hideCode();
  var rawDate = new Date(document.getElementById("inputDate").value);
  var newText = " " + rawDate.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12:true});
  newText += " - " + month_names[rawDate.getMonth()] + " ";
  newText += rawDate.getDate() + ", " + rawDate.getFullYear();

  $(".twTime").text(newText);
}
