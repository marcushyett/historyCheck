const time_conversions = {
  day: 1000*60*60*24,
  week: 1000*60*60*24*7,
  month: 1000*60*60*24*30,
  year: 1000*60*60*24*365
}

var root = {domain: ""};

function url_domain(data) {
  var a = document.createElement('a');
  a.href = data;

  return a.hostname;
}

function compare_visit_count(a,b) {
  if (a.visitCount > b.visitCount)
    return -1;
  else if (a.visitCount < b.visitCount)
    return 1;
  else
    return 0;
}

function timeConverter(timestamp){
  var a = new Date(timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = pad(date,2) + ' ' + month + ' ' + year + ' ' + pad(hour,2) + ':' + pad(min,2) + ':' + pad(sec,2) ;
  return time;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function render_list(visits) {
  var sorted_visits = visits.sort(compare_visit_count)
  var output = "<ul>";
  for (i in sorted_visits) {
    var title = sorted_visits[i].title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    output += "<li>";
    output += "<b class='link-title'><a target='blank' href='" + sorted_visits[i].url + "'>";
    if(title.length > 0){
      output += title.split(' ')[0] + " <span class='badge'>" + sorted_visits[i].visitCount + " visits</span>"
      output += "</b></a><p>";
      output += "<i>Last visited: " + timeConverter(sorted_visits[i].lastVisitTime, "YYYY/MM/DD HH:ii:ss") + "</i><br>"
      output += title;
      output +="</p></li>";
    } else {
      output += "untitled <span class='badge'>" + sorted_visits[i].visitCount + " visits</span>"
      output += "</b></a><p>";
      output += "<i>Last visited: " + timeConverter(sorted_visits[i].lastVisitTime, "YYYY/MM/DD HH:ii:ss") + "</i><br>"
      output += "Please click through to see more detail"
      output +="</p></li>";
    }
    output += "<hr>";
    console.log(sorted_visits[i])
  }

  output += "</ul>";

  document
    .getElementById('output')
    .innerHTML = output;
}

function update_history() {
  var time_range = document.getElementById('time_range').value
  chrome
    .history
    .search(
      {
        text: root.domain,
        startTime: +new Date() - time_conversions[time_range]
      }, function(history) {
        render_list(history)
      })
}

chrome.tabs.getSelected(null, function(tab) {
  root.domain = url_domain(tab.url);
  document.getElementById('title').innerHTML = "<img width='32' height='32' src='" + tab.favIconUrl + "'/> " + root.domain;
  document.getElementById('time_range').addEventListener("change", function() {
    update_history();
  });
  update_history();
});
