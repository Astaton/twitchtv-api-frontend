//jshint esnext:true
$(document).ready(function() {
  
  var userLinkBase = "https://www.twitch.tv/";
  var mouseOffTimer;
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

  var userIdsDisplaylist = ["esl_sc2","ogamingsc2","cretetion","freecodecamp","hardlydifficult","habathcx","robotcaleb","noobs2ninjas","esl_csgob","streamerhouse"];


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
      console.log("visit");
      window.open(usersObj[user].url);
    }



      function mouseOn(target, thumbImage, user){
        //clear mouseoffTimer so that it does not rerender the DOM
        // console.log("in mouseOn");
        // clearInterval(mouseOffTimer);
        //check for not offline instead of live because sometimes people stream videos but are not 'live'
        if(usersObj[user].live !== "Offline"){
          $(target).replaceWith(
            "<div class='userBox' id='"+usersObj[user].userName+"'><img id='"+usersObj[user].userName+"playButton' class='playButton' src='SVG/Play button.svg' alt='Play button' title='Watch: "+usersObj[user].userName+" play "+usersObj[user].gameName+" live!'/><img id='"+usersObj[user].userName+"removeButton' class='removeButton' src='SVG/Remove button.svg' alt='remove button' title='Click to remove this user from your list'/><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>Playing: "+usersObj[user].gameName.slice(0, 13)+"...<br> Viewers: "+usersObj[user].viewers+"</p></span></div></div>"
            );
          $("#"+usersObj[user].userName).css('background-image', "url("+thumbImage+")");
        }else{
          $(target).replaceWith(
            "<div class='userBox' id='"+usersObj[user].userName+"'><img id='"+usersObj[user].userName+"playButton' class='playButton' src='SVG/Play button.svg' alt='play button' title='Click to visit!' /><img id='"+usersObj[user].userName+"removeButton' class='removeButton' src='SVG/Remove button.svg' alt='remove button' title='Click to remove this user from your list'/><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></span></div></div>"
            );
          $("#"+usersObj[user].userName).css("background-image", "url("+usersObj[user].profileImage+")");
        }
        //set mouse off event listner
        $(target).mouseout(function(){mouseOff()}); 
        //set eventlisteners for play and remove buttons
        $("#"+usersObj[user].userName+"playButton").click(function(){visitUser(user)});
        $("#"+usersObj[user].userName+"removeButton").click(function(){removeUser(user)});
        //add class to fade in buttons
        $("#"+usersObj[user].userName+"playButton").addClass('buttonFade');
        $("#"+usersObj[user].userName+"removeButton").addClass('buttonFade');
      }

      function mouseOff(){
        // console.log("in mouseOff");
        // var counter = 0;
        // mouseOffTimer = setInterval(function(){
        //   if(counter >= 25){
        //     console.log("mouseOff Timeout "+counter);
        //     clearInterval(mouseOffTimer);
        //     renderChannels(userIdsDisplaylist);
        //   }
        //   counter++;
        // },1);
        renderChannels(userIdsDisplaylist)
      }
  
      //takes in an array of usernames and renders the associated user objects to screen
  function renderChannels(usersToRender){
    usersToRender.forEach(function(user){
      //if it is a new element being added append the twitch box
      if($("#"+usersObj[user].userName).length === 0){
        $("#twitchBox").append(
          "<div class='userBox' id='"+usersObj[user].userName+"'><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></span></div></div>"
        );
      }
      else{//if the element exits udpate the info in it
        //if live update the live stream information
        if( usersObj[user].live == "live"){
          $("#"+usersObj[user].userName).replaceWith(
            "<div class='userBox' id='"+usersObj[user].userName+"' title='usersObj[user].title'><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"<br>"+usersObj[user].title.slice(0, 13)+"...</p></span></div></div>"
          ); 
        }
        else{
          //if not live update the standard information
          $("#"+usersObj[user].userName).replaceWith(
            "<div class='userBox' id='"+usersObj[user].userName+"' title='Click to visit!'><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></span></div></div>"
          );
        }
      }
      
      //set background after rendering elements or they may be lost
      $("#"+usersObj[user].userName).css("background-image", "url("+usersObj[user].profileImage+")");
      //set mouse on / mouse off for all twitch channels
      $("#"+usersObj[user].userName).hover(function(){mouseOn("#"+usersObj[user].userName, usersObj[user].thumbnail, user)}, function(){mouseOff()});
    });
  }

  function diplayAll(){
    $("#twitchBox").empty();
    userIdsDisplaylist = [...userIdsMasterlist];
    renderChannels(userIdsDisplaylist);
  }

  
  function displayLive(){
    userIdsDisplaylist = [];
    for(i=0; i<userIdsMasterlist.length; i++){
      if(usersObj[userIdsMasterlist[i]].live == "live"){
        userIdsDisplaylist.push(userIdsMasterlist[i]);
      }
    }
    $("#twitchBox").empty();
    renderChannels(userIdsDisplaylist);
  }
  
  function displayOffline(){
    userIdsDisplaylist = [];
    for(i=0; i<userIdsMasterlist.length; i++){
      if(usersObj[userIdsMasterlist[i]].live !== "live"){
      userIdsDisplaylist.push(userIdsMasterlist[i]);
      }
    }
    $("#twitchBox").empty();
    renderChannels(userIdsDisplaylist);
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
            for(i = 0; i < getUsersData.length; i++){
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
          renderChannels(getUsersData);
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
            return alert("User "+getUsersData[0]+" was not found, please try again.");
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
          alert("Error occured while making userinfo API call. "+status.responseJSON.message);
          console.error("Error occured while making userinfo API call ",status.responseJSON.message);
          // reject("Error occured while making userinfo API call ",status.responseJSON.message);
        }
      });
    // }  
  }
  //calls userInfo on load and begins process of gathering user info for display 
  userInfo(userIdsMasterlist);

  function toggleDisplayButtons(button){
    var displayButtons = ['#all', '#live', '#offline'];
    for(i = 0; i < displayButtons.length; i++){
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
    if(userToAdd[0]){
      userInfo(userToAdd);
    }
    $("#searchBar").val("");
  }

  function removeUser(user){
    console.log("user");
    var index;
    for(i = 0; i < userIdsMasterlist.length; i++){
      if(userIdsMasterlist[i] === user){
        userIdsMasterlist.splice(i,1);
        break;
      }
    }
    delete usersObj[user];
    $("#twitchBox").empty();
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
