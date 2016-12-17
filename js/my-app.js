// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});

// Export selectors engine
var $$ = Dom7;
var SERVER_ADDRESS = "http://192.168.254.103:8080/isaac";

						
$$(document).on('pageInit', function (e) {
	//alert('LOADING DB');
    /*CHECK PROGRAM COMPATIBILITY TO INDEXED DB*/
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	// DON'T use "var indexedDB = ..." if you're not in a function.
	// Moreover, you may need references to some window.IDB* objects:
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

	if (!window.indexedDB) {
		window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
	}
	
	/*CONNECT/OPEN DB*/
	var request = window.indexedDB.open("isaac", 1);
	request.onupgradeneeded = function(e) {
		var thisDB = e.target.result;
		if(!thisDB.objectStoreNames.contains("gentable")) {
			thisDB.createObjectStore("gentable", { keyPath: "TopicID" });
		}
		if(!thisDB.objectStoreNames.contains("symptoms")) {
			thisDB.createObjectStore("symptoms", { keyPath: "StepID" });
		}
	}
	
	/*ADD*/
	/*var request = window.indexedDB.open("isaac", 1);
	request.onsuccess = function(e) {
		var db = this.result;
		var objectStore = db.transaction(["gentable"], "readwrite").objectStore("gentable");
		
		var resultSet = objectStore.add({ TopicID: "02", name: "John Elwin", age: 26, email: "jepedregosa@gmail.com" });
		
		resultSet.onsuccess = function(event) {
		   alert("Topic has been added to your database.");
		};

		resultSet.onerror = function(event) {
		   alert("Unable to add data\r\Topic already exists in your database! ");
		}
	};*/
	
	/*VIEW*/
	/*var request = window.indexedDB.open("isaac", 1);
	request.onsuccess = function(e) {
		var db = this.result;
		var objectStore = db.transaction("gentable").objectStore("gentable");

		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
			//alert("TopicID: " + cursor.value.TopicID + ", Title:  " + cursor.value.Title+ ", Contents:  " + cursor.value.Contents);
			//var resultSet = objectStore.add({ TopicID: rec.TopicID, PageType: rec.PageType, Image: rec.Image, Title: rec.Title, Contents: rec.Contents});
			cursor.continue();
		  }
		  else {
			//alert("No more entries!");
		  }
		};
	}*/
	
});

// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    template7Pages: true,
    // Specify Template7 data for pages
    template7Data: {},
	allowDuplicateUrls: true,
	cache:true
});


// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false,
	domCache: true
});

myApp.init();

function mainHardwareInfo(){
	
	var request = window.indexedDB.open("isaac", 1);
	request.onsuccess = function(e) {
		var db = this.result;
		var objectStore = db.transaction("gentable").objectStore("gentable");
		var hwiData = new Object();
		var hwiArray = [];
		
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  console.log(cursor);
		  if (cursor) {
			var hwiData2 = new Object();
			hwiData2.TopicID = cursor.value.TopicID;
			hwiData2.Title = cursor.value.Title;
			hwiData2.Contents = cursor.value.Contents;
			hwiData2.PageType = cursor.value.PageType;
			if(hwiData2.PageType=='HARDWAREINFO'){
				hwiArray.push(hwiData2);
			}
			//alert("TopicID: " + cursor.value.TopicID + ", Title:  " + cursor.value.Title+ ", Contents:  " + cursor.value.Contents);
			//var resultSet = objectStore.add({ TopicID: rec.TopicID, PageType: rec.PageType, Image: rec.Image, Title: rec.Title, Contents: rec.Contents});
			cursor.continue();
		  }
		  else {
			//alert("No more entries!");
			hwiData.hardwareinformation = hwiArray;
			console.log(hwiData);
			mainView.router.load({url:'modules/hardwareinformation/hardwareinformation.html',context:hwiData});
		  }
		};
	}
}

function hardwareinfodetail(obj){
	var id = obj.id; 
	var request = window.indexedDB.open("isaac", 1);
	request.onsuccess = function(e) {
		var db = this.result;
		var objectStore = db.transaction("gentable").objectStore("gentable");
		var hwiData = new Object();
		///var hwiArray = [];
		
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
			if(cursor.value.TopicID==id){
				var hwiData = new Object();
				hwiData.TopicID = cursor.value.TopicID;
				hwiData.Title = cursor.value.Title;
				hwiData.Contents = cursor.value.Contents;
				//hwiArray.push(hwiData2);
				//hwiData.hardwareinformation = hwiArray;
				mainView.router.load({url:'modules/hardwareinformation/hardwareinformationdetail.html',context:hwiData});	
			}  
			cursor.continue();
		  }
		  else {
			//alert("No more entries!");
			//hwiData.hardwareinformation = hwiArray;
			mainView.router.load({url:'modules/hardwareinformation/hardwareinformationdetail.html',context:hwiData});
		  }
		};
	}
}


function mainAbout(){
	mainView.router.loadPage('modules/about/about.html');
}

function mainListOfProblem(){
	var requestLop = window.indexedDB.open("isaac", 1);
	requestLop.onsuccess = function(e) {
		console.log(e);
		var dbLop = this.result;
		var objectStoreLop = dbLop.transaction("gentable").objectStore("gentable");
		var lopData = new Object();
		var lopArray = [];
		
		objectStoreLop.openCursor().onsuccess = function(event) {
		  var cursorLop = event.target.result;
		  console.log(cursorLop);
		  if (cursorLop) {
			var lopData2 = new Object();
			lopData2.TopicID = cursorLop.value.TopicID;
			lopData2.Title = cursorLop.value.Title;
			lopData2.Contents = cursorLop.value.Contents;
			lopData2.PageType = cursorLop.value.PageType;
			if(lopData2.PageType=='PROBLEMS'){
				lopArray.push(lopData2);
			}
			//alert("TopicID: " + cursor.value.TopicID + ", Title:  " + cursor.value.Title+ ", Contents:  " + cursor.value.Contents);
			//var resultSet = objectStore.add({ TopicID: rec.TopicID, PageType: rec.PageType, Image: rec.Image, Title: rec.Title, Contents: rec.Contents});
			cursorLop.continue();
		  }
		  else {
			//alert("No more entries!");
			lopData.listofproblem = lopArray;
			console.log(lopData);
			mainView.router.load({url:'modules/listofproblem/listofproblem.html',context:lopData});
		  }
		};
	}
}

function listofproblemdetail(obj){
	var id = obj.id; 
	var requestLop = window.indexedDB.open("isaac", 1);
	requestLop.onsuccess = function(e) {
		var dbLop = this.result;
		var objectStoreLop = dbLop.transaction("gentable").objectStore("gentable");
		var lopData = new Object();
		///var hwiArray = [];
		
		objectStoreLop.openCursor().onsuccess = function(event) {
		  var cursorLop = event.target.result;
		  if (cursorLop) {
			if(cursorLop.value.TopicID==id){
				var lopData = new Object();
				lopData.TopicID = cursorLop.value.TopicID;
				lopData.Title = cursorLop.value.Title;
				lopData.Contents = cursorLop.value.Contents;
				//hwiArray.push(hwiData2);
				//hwiData.hardwareinformation = hwiArray;
				mainView.router.load({url:'modules/listofproblem/listofproblemdetail.html',context:lopData});	
			}  
			cursorLop.continue();
		  }
		  else {
			//alert("No more entries!");
			//hwiData.hardwareinformation = hwiArray;
			mainView.router.load({url:'modules/listofproblem/listofproblemdetail.html',context:lopData});
		  }
		};
	}
}

function mainSymptoms(){
	//myApp.alert('Redirect to symptoms','Notice');
	
	var request = window.indexedDB.open("isaac", 1);
	request.onsuccess = function(e) {
		var db = this.result;
		var objectStore = db.transaction("symptoms").objectStore("symptoms");
		var sympData = new Object();
		var sympArray = [];
		
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;	
		  if (cursor) {
			  for(var i=0; i<999; i++){
				if(cursor.value.IsHead==i){
					var sympData2 = new Object();
					sympData2.StepID = cursor.value.StepID;
					sympData2.SymptomDesc = cursor.value.SymptomDesc;
					sympData2.StepDesc = cursor.value.StepDesc;
					sympData2.YesStepID = cursor.value.YesStepID;
					sympData2.YesStepText = cursor.value.YesStepText;
					sympData2.NoStepID = cursor.value.NoStepID;
					sympData2.NoStepText = cursor.value.NoStepText;
					sympData2.IsHead = cursor.value.IsHead;
					sympData2.IsLeaf = cursor.value.IsLeaf;
					sympArray.push(sympData2);  
				}	
			  }
			  		
			//alert("TopicID: " + cursor.value.TopicID + ", Title:  " + cursor.value.Title+ ", Contents:  " + cursor.value.Contents);
			//var resultSet = objectStore.add({ TopicID: rec.TopicID, PageType: rec.PageType, Image: rec.Image, Title: rec.Title, Contents: rec.Contents});
			cursor.continue();
		  }
		  else {
			//alert("No more entries!");
			sympData.symptoms = sympArray;
			console.log(sympData);
			mainView.router.load({url:'modules/symptoms/symptoms.html',context:sympData});
		  }
		};
	}
}

function symptomsdetail(obj){
	var id = obj.id; 
	var request = window.indexedDB.open("isaac", 1);
	request.onsuccess = function(e) {
		var db = this.result;
		var objectStore = db.transaction("symptoms").objectStore("symptoms");
		var sympData = new Object();
		
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
			if(cursor.value.StepID==id){
				var sympData = new Object();
				sympData.StepID = cursor.value.StepID;
				sympData.SymptomDesc = cursor.value.SymptomDesc;
				sympData.StepDesc = cursor.value.StepDesc;
				sympData.YesStepID = cursor.value.YesStepID;
				sympData.YesStepText = cursor.value.YesStepText;
				sympData.NoStepID = cursor.value.NoStepID;
				sympData.NoStepText = cursor.value.NoStepText;
				sympData.IsHead = cursor.value.IsHead;
				sympData.IsLeaf = cursor.value.IsLeaf;
				mainView.router.load({url:'modules/symptoms/symptomsdetail.html',context:sympData});	
			}  
			cursor.continue();
		  }
		  else {
			//alert("No more entries!");
			//hwiData.hardwareinformation = hwiArray;
			mainView.router.load({url:'modules/symptoms/symptomsdetail.html',context:sympData});
		  }
		};
	}
}

function mainTips(){
	var requestTips = window.indexedDB.open("isaac", 1);
	requestTips.onsuccess = function(e) {
		var dbTips = this.result;
		var objectStoreTips = dbTips.transaction("gentable").objectStore("gentable");
		var tipsData = new Object();
		var tipsArray = [];
		
		objectStoreTips.openCursor().onsuccess = function(event) {
		  var cursorTips = event.target.result;
		  console.log(cursorTips);
		  if (cursorTips) {
			var tipsData2 = new Object();
			tipsData2.TopicID = cursorTips.value.TopicID;
			tipsData2.Title = cursorTips.value.Title;
			tipsData2.Contents = cursorTips.value.Contents;
			tipsData2.PageType = cursorTips.value.PageType;
			if(tipsData2.PageType=='TIPS'){
				tipsArray.push(tipsData2);
			}
			//alert("TopicID: " + cursor.value.TopicID + ", Title:  " + cursor.value.Title+ ", Contents:  " + cursor.value.Contents);
			//var resultSet = objectStore.add({ TopicID: rec.TopicID, PageType: rec.PageType, Image: rec.Image, Title: rec.Title, Contents: rec.Contents});
			cursorTips.continue();
		  }
		  else {
			//alert("No more entries!");
			tipsData.tips = tipsArray;
			console.log(tipsData);
			mainView.router.load({url:'modules/tips/tips.html',context:tipsData});
		  }
		};
	}
}

function tipsdetail(obj){
	var idTips = obj.id; 
	var requestTips = window.indexedDB.open("isaac", 1);
	requestTips.onsuccess = function(e) {
		var dbTips = this.result;
		var objectStoreTips = dbTips.transaction("gentable").objectStore("gentable");
		var TipsData = new Object();
		///var hwiArray = [];
		
		objectStoreTips.openCursor().onsuccess = function(event) {
		  var cursorTips = event.target.result;
		  if (cursorTips) {
			if(cursorTips.value.TopicID==idTips){
				var TipsData = new Object();
				TipsData.TopicID = cursorTips.value.TopicID;
				TipsData.Title = cursorTips.value.Title;
				TipsData.Contents = cursorTips.value.Contents;
				//hwiArray.push(hwiData2);
				//hwiData.hardwareinformation = hwiArray;
				mainView.router.load({url:'modules/tips/tipsdetail.html',context:TipsData});	
			}  
			cursorTips.continue();
		  }
		  else {
			//alert("No more entries!");
			//hwiData.hardwareinformation = hwiArray;
			mainView.router.load({url:'modules/tips/tipsdetail.html',context:TipsData});
		  }
		};
	}
}

function mainVideos(){
	mainView.router.loadPage('modules/videos/videos.html');
}

function updateLocalDB(){
	myApp.alert('Update Local DB','Notice');
	
	$$.ajax({
		url: SERVER_ADDRESS + "/gentable?action=SEARCH",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			var data = JSON.parse(response);
			
			var dataArr = data.data;
			
			var request = window.indexedDB.open("isaac", 1);
			request.onsuccess = function(e) {
				var db = this.result;
				var objectStore = db.transaction(["gentable"], "readwrite").objectStore("gentable");
				objectStore.clear();
				for(var i=0; i<dataArr.length; i++){
				
					var rec = dataArr[i];
					
					var resultSet = objectStore.add({ TopicID: rec.TopicID, PageType: rec.PageType, Image: rec.Image, Title: rec.Title, Contents: rec.Contents});
				
					resultSet.onsuccess = function(event) {
						console.log('added');
					};

					resultSet.onerror = function(event) {
					   console.log('skipped');
					}
				}
			};
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
	
	$$.ajax({
		url: SERVER_ADDRESS + "/symptoms?action=SEARCH",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			var data = JSON.parse(response);
			
			var dataArr = data.data;
			
			var request = window.indexedDB.open("isaac", 1);
			request.onsuccess = function(e) {
				var db = this.result;
				var objectStore = db.transaction(["symptoms"], "readwrite").objectStore("symptoms");
				objectStore.clear();
				for(var i=0; i<dataArr.length; i++){
				
					var rec = dataArr[i];
					
					console.log(rec);
					
					var resultSet = objectStore.add({StepID: rec.StepID, SymptomDesc: rec.SymptomDesc, StepDesc: rec.StepDesc, YesStepID: rec.YesStepID, YesStepText: rec.YesStepText, NoStepID: rec.NoStepID, NoStepText: rec.NoStepText, IsHead: rec.IsHead, IsLeaf: rec.IsLeaf});
				
					resultSet.onsuccess = function(event) {
						console.log('added');
					};

					resultSet.onerror = function(event) {
					   console.log('skipped');
					}
				}
			};
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
}
