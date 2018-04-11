import $ from 'jquery';
import './style.css';
import playButton from './svg/Play button.svg';
import removeButton from './svg/Remove button.svg';


$(document).ready(function() {
  var userPlayButton = new Image();
  userPlayButton.src = playButton;
  var userRemoveButton = new Image();
  userRemoveButton.src = removeButton;
  // console.log("userPlayButton ",PlayButton);
  // console.log("JSON.stringify(userPlayButton)",JSON.stringify(userPlayButton));
  // console.log("removeButton ", removeButton);
  
  var userLinkBase = "https://www.twitch.tv/";
  var usersObj = {};
  var apiInfo = {
    users: {
      url: "https://api.twitch.tv/helix/users?",
      formatIds: function(usersList){
        var usersUrlString = "";
        usersList.forEach(function(user){
          usersUrlString += 'login='+user+'&';
        });
        //slice off final ampersand and return string
        return usersUrlString.slice(0, usersUrlString.length - 1);
      }
    },
    streams: {
      url: "https://api.twitch.tv/helix/streams?",
      formatIds: function(usersList){
        var usersUrlString = "";
        usersList.forEach(function(user){
          usersUrlString += 'user_login='+user+'&';
        });
        //slice off final ampersand and return string
        return usersUrlString.slice(0, usersUrlString.length - 1);
      }
    },
    gameInfo: {
      url: "https://api.twitch.tv/helix/games?id="
    }
  }

  var userIdsMasterlist = ["esl_sc2","ogamingsc2","cretetion","freecodecamp","hardlydifficult","habathcx","robotcaleb","noobs2ninjas","esl_csgob","streamerhouse"];

  var userIdsDisplaylist = [...userIdsMasterlist];


  function userInfoObj(userName, idNo, profileImage, url, live = "Offline"){
    //first 4 from userInfo function
    this.userName = userName;
    this.idNo = idNo;
    this.profileImage = profileImage;
    this.url = url;
    this.live = live
    /* 5 from stream info
    this.thumbnail = thumbnail;
    this.gameId = gameId;
    this.title = title;
    this.viewers = viewers;
    //last 2 from game info
    this.gameName = gameName;
    this.gameArt = gameArt;
    */
    };

    function visitUser(user){
      window.open(usersObj[user].url);
    }



  function mouseOn(target, thumbImage, user){
    //check for not offline instead of live because sometimes people stream videos but are not 'live'
    if(usersObj[user].live !== "Offline"){
      let gameName = usersObj[user].gameName.length > 16? usersObj[user].gameName.slice(0, 16)+'...' : usersObj[user].gameName;
      $(target).replaceWith(
        "<div class='userBox' id='"+usersObj[user].userName+"'><img id='"+usersObj[user].userName+"playButton' class='playButton' src='"+playButton+"' alt='Play button' title='Watch: "+usersObj[user].userName+" play "+usersObj[user].gameName+" live!'/><img id='"+usersObj[user].userName+"removeButton' class='removeButton' src='"+removeButton+"' alt='remove button' title='Click to remove this user from your list'/><div class='titlePlate'><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+gameName+"<br> Viewers: "+usersObj[user].viewers+"</p></div></div>"
        );
      $("#"+usersObj[user].userName).css('background-image', "url("+thumbImage+")");
    }else{
      $(target).replaceWith(
        "<div class='userBox' id='"+usersObj[user].userName+"'><img id='"+usersObj[user].userName+"playButton' class='playButton' src='"+playButton+"' alt='play button' title='Click to visit!' /><img id='"+usersObj[user].userName+"removeButton' class='removeButton' src='"+removeButton+"' alt='remove button' title='Click to remove this user from your list'/><div class='titlePlate'><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></div></div>"
        );
      $("#"+usersObj[user].userName).css("background-image", "url("+usersObj[user].profileImage+")");
    }
    //set eventlisteners for play and remove buttons
    $("#"+usersObj[user].userName+"playButton").click(function(){visitUser(user)});
    $("#"+usersObj[user].userName+"removeButton").click(function(){removeUserRequest(user)});

    $("#"+usersObj[user].userName).mouseleave(function(){mouseOff("#"+usersObj[user].userName, user)});
  }


  function mouseOff(target, user){
     renderChannels([user])
   }
   
 
  //takes in an array of usernames and renders the associated user objects to screen
  function renderChannels(usersToRender){
    usersToRender.forEach(function(user){
        //if live update the live stream information
        if( usersObj[user].live !== "Offline"){
          $("#"+usersObj[user].userName).replaceWith(
            "<div class='userBox' id='"+usersObj[user].userName+"' title='usersObj[user].title'><div class='titlePlate'><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"<br>"+usersObj[user].title.slice(0, 13)+"...</p></div></div>"
          ); 
        }
        else{
          //if not live update the standard information
          $("#"+usersObj[user].userName).replaceWith(
            "<div class='userBox' id='"+usersObj[user].userName+"' title='Click to visit!'><div class='titlePlate'><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></div></div>"
          );    
        }
      
      //set background after rendering elements or they may be lost
      $("#"+usersObj[user].userName).css("background-image", "url("+usersObj[user].profileImage+")");
      //set mouse on / mouse off for all twitch channels
      $("#"+usersObj[user].userName).mouseenter(function(){mouseOn("#"+usersObj[user].userName, usersObj[user].thumbnail, user)});
      $("#"+usersObj[user].userName).mouseleave(function(){mouseOff("#"+usersObj[user].userName, user)});
    });
  }

  //takes in an array of usernames and adds the associated user objects to the twitchBox
  function addChannels(usersToAdd){
    usersToAdd.forEach(function(user){
      if( usersObj[user].live !== "Offline"){
        $("#twitchBox").append(
              "<div class='userBox' id='"+usersObj[user].userName+"' title='usersObj[user].title'><div class='titlePlate'><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"<br>"+usersObj[user].title.slice(0, 13)+"...</p></div></div>"
            );           
      }else{
        $("#twitchBox").append(
            "<div class='userBox' id='"+usersObj[user].userName+"'><div class='titlePlate'><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></div></div>"
          );
          //set background after rendering elements or they may be lost
      }
      //set background after rendering elements or they may be lost
      $("#"+usersObj[user].userName).css("background-image", "url("+usersObj[user].profileImage+")");
      //set mouse on for all added twitch channels
      $("#"+usersObj[user].userName).mouseover(function(){mouseOn("#"+usersObj[user].userName, usersObj[user].thumbnail, user)});
    });
  }

  function diplayAll(){
    $("#twitchBox").empty();
    userIdsDisplaylist = [...userIdsMasterlist];
    addChannels(userIdsDisplaylist);
  }

  
  function displayLive(){
    userIdsDisplaylist = [];
    for(let i=0; i<userIdsMasterlist.length; i++){
      if(usersObj[userIdsMasterlist[i]].live == "live"){
        userIdsDisplaylist.push(userIdsMasterlist[i]);
      }
    }
    $("#twitchBox").empty();
    addChannels(userIdsDisplaylist);
  }
  
  function displayOffline(){
    userIdsDisplaylist = [];
    for(let i=0; i<userIdsMasterlist.length; i++){
      if(usersObj[userIdsMasterlist[i]].live !== "live"){
      userIdsDisplaylist.push(userIdsMasterlist[i]);
      }
    }
    $("#twitchBox").empty();
    addChannels(userIdsDisplaylist);
  }
  
  function gameInfo(idNo, user){
    // return new Promise function(resolve, reject){
      $.ajax({
        url: apiInfo.gameInfo.url+idNo,
        dataType: 'json',
        type: 'GET',
        headers: { 'Client-ID': '7sc1a42jl4dpht7tojh4ey6fsmtg6j' },
          success: function(info){
            usersObj[user].gameName = info.data[0].name;
            usersObj[user].gameArt = info.data[0].box_art_url;
            
            // resolve(); 
        },
        error: function(status){
          alert("Error occured while making gameInfo API call. "+status.responseJSON.message);
          console.error("Error occured while making gameInfo API call ",status.responseJSON.message);
          // reject("Error occured while making gameInfo API call ",status.responseJSON.message);
        }
      });
    // }
  }

  //call the twitch api to get information about what users are streaming
  function streamInfo(getUsersData){
    // return new Promise function(resolve, reject){
      $.ajax({
        url: apiInfo.streams.url+apiInfo.streams.formatIds(getUsersData),
        dataType: 'json',
        type: 'GET',
        headers: { 'Client-ID': '7sc1a42jl4dpht7tojh4ey6fsmtg6j' },
    
        success: function(streams){
          streams.data.forEach(function(userData){
            for(let i = 0; i < getUsersData.length; i++){
              if(usersObj[getUsersData[i]].idNo === userData.user_id){
                usersObj[getUsersData[i]].live = userData.type;
                usersObj[getUsersData[i]].gameId = userData.game_id;
                usersObj[getUsersData[i]].title = userData.title;
                usersObj[getUsersData[i]].viewers = userData.viewer_count;
                usersObj[getUsersData[i]].thumbnail = userData.thumbnail_url.slice(0, -20)+"300x300.jpg";
                //uses the id of the game the user is streaming to call gameInfo and gather information on the game the user is currently streaming
                gameInfo(userData.game_id, getUsersData[i]);
              }
            }
          });
          // resolve(userIds);
          addChannels(getUsersData);
        },
        error: function(status){
          alert("Error occured while making streamInfo API call. "+status.responseJSON.message);
          console.error("Error occured while making streamInfo API call ",status.responseJSON.message);
          // reject(console.error("Error occured while making streamInfo API call ",status.responseJSON.message);)
        }
      });
    // }
  }

  //gathers user info from the twitch api for userIds passed in an array
  function userInfo(getUsersData){
    // return new Promise function(resolve, reject){
      $.ajax({
        //gets info for all ids passed in getUsersData array
        url: apiInfo.users.url+apiInfo.users.formatIds(getUsersData),
        dataType: 'json',
        type: 'GET',
        headers: { 'Client-ID': '7sc1a42jl4dpht7tojh4ey6fsmtg6j' },
        success: function(twitchUsers){
          //if less than one user was not found return error
          if(twitchUsers.data.length < 1){
            messageBox("Error", "User "+getUsersData[0]+" was not found.", "Please check the spelling and try again.");
            return
          }
          //if one single player added by user was found and user id to master list
          if(twitchUsers.data.length === 1){
            userIdsMasterlist.push(getUsersData[0]);
          }
          twitchUsers.data.forEach(function(user){
            //save user object names in lower case to simplify variable names
            usersObj[user.display_name.toLowerCase()] = new userInfoObj(user.display_name,user.id, user.profile_image_url, userLinkBase+user.display_name);

          });
          //calls streamInfo which gathers information on what live users are currently streaming
          // resolve(getUsersData);
          streamInfo(getUsersData)
        },
        error: function(status){
          messageBox("Error", "An error occured while trying to get information from twitch.tv", status.responseJSON.message)
          console.error("Error occured while making userinfo API call ",status.responseJSON.message);
          // reject("Error occured while making userinfo API call ",status.responseJSON.message);
        }
      });
    // }  
  }
  //calls userInfo on load and begins process of gathering user info for display 
  userInfo(userIdsDisplaylist);

  function messageBox(header, line1, line2, user){
    console.log("messageBox user: "+ user);
    $("#messageHeaderText").replaceWith(
        "<h2 id='messageHeaderText'>"+header+"</h2>"
      );
    $("#messageLine1").replaceWith(
      "<p id='messageLine1'>"+line1+"</p>"
    );
    if(line2){
      $("#messageLine2").replaceWith(
        "<p id='messageLine2'>"+line2+"</p>"
      );
    }else{
      $("#messageLine2").replaceWith(
        "<p id='messageLine2'></p>"
      );
    }
    if(user){
     $("#messageConfirm").css("display", "block");
     $("#messageConfirmButton").on('click', function(){removeUser(user); closeMessageBox()});
    }else{
      $("#messageConfirm").css("display", "none");
    }
    $("#messageContainer").css("display", "block");
    return
  }

  function closeMessageBox(){
    $("#messageContainer").css("display", "none");
    $("#messageConfirm").css("display", "none");
  }

function cancelMessageBoxAction(){
  $("#messageConfirmButton").off();
  closeMessageBox();
}

  $("#messageCloseButton").on('click', function(){closeMessageBox()})
  $("#messageCancelButton").on('click', function(){cancelMessageBoxAction()});

  function toggleDisplayButtons(button){
    var displayButtons = ['#all', '#live', '#offline'];
    for(let i = 0; i < displayButtons.length; i++){
      if(button === displayButtons[i]){
        $(button).addClass("navBarButtonPressed");
        $(button).css("color", "white");
      }else{
        $(displayButtons[i]).removeClass("navBarButtonPressed");
        $(displayButtons[i]).css("color", "black");
      }
    }
  }

  $("#all").on('click', function(){
    diplayAll();
    toggleDisplayButtons("#all");
  });
  
  $("#live").on('click', function(){
    displayLive();
    toggleDisplayButtons("#live");
  });
  
  $("#offline").on('click', function(){
    displayOffline();
    toggleDisplayButtons("#offline");
  });
  
  //runs display all on page load
  toggleDisplayButtons("#all");

  function addUser(){
    var userToAdd = [$("#searchBar").val().toLowerCase()];
    if(userToAdd[0].length < 1){
      return
    }else if(userToAdd[0].length > 0 && !usersObj[userToAdd]){
      userInfo(userToAdd);
    }else{
      messageBox("Alert", userToAdd+" is already in your list of streamers");
    }
    $("#searchBar").val("");
  }

  function removeUserRequest(user){
    console.log("removeUserRequest user: "+ user);
    messageBox("Warning", "Are you sure you want to remove "+usersObj[user].userName+" from your list?", null, user);
    return
  }

  function removeUser(user){
    console.log("removeUser user: "+ user);
    for(let i = 0; i < userIdsMasterlist.length; i++){
      if(userIdsMasterlist[i] === user){
        userIdsMasterlist.splice(i,1);
        break;
      }
    }
    delete usersObj[user];
    //$("#twitchBox").empty();
    if($('#all').hasClass('navBarButtonPressed')){
      diplayAll();
    } else if($('#live').hasClass('navBarButtonPressed')){
      displayLive();
    }else{
      displayOffline();
    }
  }

  $("input").on('keydown', function(e){
    if(e.keyCode === 13){      
      addUser();      
    }
  });

  $("#searchButton").on('click', function(){
    addUser();
  });
  
});
