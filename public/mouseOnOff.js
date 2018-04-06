function mouseOn(target, thumbImage, user){
        //check for not offline instead of live because sometimes people stream videos but are not 'live'
        if(usersObj[user].live !== "Offline"){
          console.log(" in mouseOn live");
          $(target).replaceWith(
            "<a href="+userLinkBase+usersObj[user].userName+" target='blank' class='link' title='Watch: "+usersObj[user].userName+" play "+usersObj[user].gameName+" live!' id="+usersObj[user].idNo+"><div class='userBox button' id='"+usersObj[user].userName+"'><button class='removeBtn' title='Click to remove user'>X</button><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>Playing: "+usersObj[user].gameName.slice(0, 13)+"...<br> Viewers: "+usersObj[user].viewers+"</p></span></div></div></a>"
            );
          $("#"+usersObj[user].userName).css('background-image', "url("+thumbImage+")");
        }else{
          $(target).replaceWith(
            "<a href="+userLinkBase+usersObj[user].userName+" target='blank' class='link' title='Click to visit!' id="+usersObj[user].idNo+"><div class='userBox button' id='"+usersObj[user].userName+"'><button class='removeBtn' title='Click to remove user'>X</button><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></span></div></div></a>"
            );
          $("#"+usersObj[user].userName).css("background-image", "url("+usersObj[user].profileImage+")");
        }
        $(target).mouseout(function(){mouseOff(target, usersObj[user].profileImage, user)}); 
      }
          
      function mouseOff(target, profileImage, user){
        if(usersObj[user].live !== "Offline"){
          $(target).replaceWith(
            "<a href="+userLinkBase+usersObj[user].userName+" target='blank' class='link' title='Click to visit! - "+usersObj[user].title.slice+"' id="+usersObj[user].idNo+"><div class='userBox button' id='"+usersObj[user].userName+"'><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"<br>"+usersObj[user].title.slice(0, 13)+"...</p></span></div></div></a>"
          );
            $("#"+usersObj[user].userName).css('background-image', "url("+profileImage+")");
        }else{
          $(target).replaceWith(
          "<a href="+userLinkBase+usersObj[user].userName+" target='blank' class='link' title='Click to visit!' id="+usersObj[user].idNo+"><div class='userBox button' id='"+usersObj[user].userName+"'><div class='titlePlate'><span><p class='titlePlateText' id='titlePlateText"+usersObj[user].userName+"'>"+usersObj[user].userName+" - "+usersObj[user].live+"</p></span></div></div></a>"
          );
          $("#"+usersObj[user].userName).css("background-image", "url("+usersObj[user].profileImage+")");
        }
        $(target).mouseenter(function(){mouseOn(target, usersObj[user].thumbnail, user)});
      }