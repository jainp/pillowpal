root = exports ? this

now.ready () ->
  FB.getLoginStatus((loginStatus) ->
    if not loginStatus? or not loginStatus.authResponse? or not loginStatus.authResponse.accessToken?
      window.location = '/auth/facebook'
      return
    userid = loginStatus.authResponse.userID
    console.log 'nowjs initialized'
    
    
    
    FB.api('/me', (response) ->
      if not response? or not response.name?
        window.location = '/auth/facebook'
      $('#username').text(response.name)
    )
    

    
    now.getStatus(userid, (status) ->
      $('#status').text(status)
    )
    root.friendlist = []
    FB.api('/me/friends', (response) ->
      if not response? or not response.data?
        window.location = '/auth/facebook'
      $('#friendinvitelist').html('')
      for friend in response.data
        console.log friend
        root.friendlist.push friend.name
        $('#friendinvitelist').append($("<div>").addClass('friend-wrapper').append($('<input>').addClass('invitableFriend').attr('friendname', friend.name).attr('friendid', friend.id).attr('type', 'checkbox')).append("<span class='friend-info'>" + friend.name + " </span>"))
    )
  )

friendsInvited = root.friendsInvited = () ->
  allowedFriendIds = []
  for friend in $('.invitableFriend')
    friendname = $(friend).attr('friendname')
    friendid = $(friend).attr('friendid')
    if $(friend).is(':checked')
      allowedFriendIds.push friendid
  console.log 'invited friends'
  now.setFriendsAllowed(myid, allowedFriendIds) # myid is initialized in the js in invitetopillow.coffee

now.refreshStatus = (targetuser, newstatus) ->
  if root.email == targetuser
    $('#status').text(newstatus)

