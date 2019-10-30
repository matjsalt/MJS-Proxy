var proxyOn;

chrome.extension.getBackgroundPage().chrome.storage.local.get("proxyOn", function(result) {
    proxyOn = result.proxyOn;
	if(proxyOn){
		var config = {
			mode: "fixed_servers",
			rules: {
			  singleProxy: {
				scheme: "http",
				host: "127.0.0.1",
				port: 8080
			  }
			}
		  };
		  chrome.proxy.settings.set(
			  {value: config, scope: 'regular'},
			  function() {});
	
			chrome.browserAction.setIcon({path: "/images/barrier_close/tile060.png"});
	} else {
		var config = {
			  mode: "direct"
			};
			chrome.proxy.settings.set(
				{value: config, scope: 'regular'},
				function() {});
			chrome.browserAction.setIcon({path: "/images/barrier_open/tile060.png"});
	}
});

function onoff(){
	if(proxyOn){
		var config = {
			  mode: "direct"
			};
			chrome.proxy.settings.set(
				{value: config, scope: 'regular'},
				function() {});
			setDirectIcon();
		chrome.storage.local.set({"proxyOn": false}, function() {});
		proxyOn = false;
	}else{
		var config = {
			  mode: "fixed_servers",
			  rules: {
				singleProxy: {
				  scheme: "http",
				  host: "127.0.0.1",
				  port: 8080
				},
				bypassList: ["foobar.com"]
			  }
			};
			chrome.proxy.settings.set(
				{value: config, scope: 'regular'},
				function() {});
			setProxyIcon();
		chrome.storage.local.set({"proxyOn": true}, function() {});
		proxyOn = true;
	}
}

function setDirectIcon(){
var min = 0;
var max = 59;
var current = min;

var keep_switching_icon = true;

function openBarrier() {
  if (keep_switching_icon) {
    chrome.browserAction.setIcon({path:"/images/barrier_open/tile" + ("00" + current).slice(-3) + ".png"});
    if (current++ > max) {
      keep_switching_icon = false;
    };
    window.setTimeout(openBarrier, 10);
  }
}
openBarrier();
}

function setProxyIcon(){
var min = 0;
var max = 59;
var current = min;

var keep_switching_icon = true;

function closeBarrier() {
  if (keep_switching_icon) {
    chrome.browserAction.setIcon({path:"/images/barrier_close/tile" + ("00" + current).slice(-3) + ".png"});
    if (current++ > max) {
      keep_switching_icon = false;
    };
    window.setTimeout(closeBarrier, 10);
  }
}
closeBarrier();
}

chrome.commands.onCommand.addListener( function(command) {
    if(command === "onoff"){
		onoff();
    }
});