root = exports ? this

now.ready () ->
  #setbackground()
  FB.getLoginStatus((loginStatus) ->
    if not loginStatus? or not loginStatus.authResponse? or not loginStatus.authResponse.accessToken?
      window.location = '/auth/facebook'
      return
    userid = loginStatus.authResponse.userID
    console.log 'nowjs initialized'
    $('#username').text(userid)
    now.getStatus(userid, (status) ->
      $('#status').text(status)
    )
    root.friendlist = []
    FB.api('/me/friends', (response) ->
      if not response? or not response.data?
        window.location = '/auth/facebook'
      for friend in response.data
        console.log friend
        root.friendlist.push friend.name
      $('#friendlist').autocomplete(
        {
          'autoFocus': true,
          'source': root.friendlist,
        }
      )
    )
  )

now.setVolume = (targetuser, volume) ->
  $('audio')[0].volume = volume/100.0

now.playSound = playSound = root.playSound = (targetuser, volume, soundfile) ->
  setbackground()
  console.log 'play sound received'
  if myid != targetuser
    return
  console.log 'playing sound!'
  $('audio')[0].src = soundfile
  $('audio')[0].volume = volume/100.0
  $('audio')[0].play()

now.refreshStatus = (targetuser, newstatus) ->
  if myid == targetuser
    $('#status').text(newstatus)

