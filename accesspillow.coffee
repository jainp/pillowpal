root = exports ? this

now.ready () ->
  email = root.email = $.cookie('pillowemail')
  if not email?
    window.location = '/auth/facebook'
  else
    email = root.email = email.split('http://www.facebook.com/').join('')
  fullname = root.fullname = $.cookie('pillowfullname')
  console.log 'nowjs initialized'
  $('#username').text(email)
  now.getStatus email, (status) ->
    $('#status').text(status)
  root.friendlist = []
  FB.api('/me/friends', (response) ->
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
  
now.refreshStatus = (targetuser, newstatus) ->
  if root.email == targetuser
    $('#status').text(newstatus)
