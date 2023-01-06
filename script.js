/*************ALL PRAISE TO STACK OVERFLOW, W3 SCHOOLS**************/

//to get the news updates
//var news= "Dankuni Kamalgazi back to old route, via Shyambazar Bonhoogly<br>"; 
//document.getElementById("update").innerHTML=news;  

//get all the bus routes from routes.js
var routes = [ ];


function loadRouteList() {
    if (document.getElementById("sel1").selectedIndex == "0") {
        routes = routes1;
        loadRoute();
        alert("Routes Loaded");
    } 
    else if (document.getElementById("sel1").selectedIndex == "1") {
        routes = routes2;
        loadRoute();
        alert("Routes Loaded");
    } 
}   


var arr = [ ];
var imgArr = [ ];
var imgArrTemp = [ ];
function loadRoute() {    
    arr = [ ];
    imgArr = [ ];
    imgArrTemp = [ ];
    for(var i=0;i<routes.length;i++) {
        arr[i] = [ ];
        //regex to extract routes and bus 
        var regexp = /(^[A-Z0-9a-z.\/\-\s]*?)\s*:\s*([a-zA-Z0-9()._\-\/ ]*?)\s*\[\s*via\s*:\s*(.*?)\s*\]\s|(.*?\S+)/g;
        var matches = Array.from(routes[i].matchAll(regexp));
        //console.log(matches[0][1]);    //2d array, i value should always be 0
        arr[i][0]=matches[0][1]; //bus no
        arr[i][1]=matches[0][2]; //bus name
        var viaArray = matches[0][3].split(","); //split via list
        for(var j=0;j<viaArray.length;j++){
            regexp = /\s*([0-9A-Za-z\/.\- ]*.)/g;  //get only 
            viaArray[j]=viaArray[j].replace(/ *\([^)]*\) */g, "");  //remove any term in brackets
            var place = Array.from(viaArray[j].matchAll(regexp));
            //arr[i]=arr[i].concat(place[0][1].trim().toLowerCase());  //remove whitespaces from a place and convert all places to lowercase
            arr[i]=arr[i].concat(place[0][1].trim()); //remove whitespaces from a place
        }
        imgArrTemp[i]=matches[1];
        if(imgArrTemp[i]) {
            //console.log(imgArrTemp[i][4]);
            imgArr.push(imgArrTemp[i][4]);
        }      
        else {
            imgArr.push("");
        }
    }
    //console.log(arr);
    imgArr.splice(imgArr.length - imgArr.length/2,imgArr.length);
    console.log(imgArr);

    //bus array, get only unique numbers
    var busList=[ ];
    for(var i=0;i<routes.length;i++) 
        busList.push(arr[i][0]);
    let uniqueRoute = busList.filter((c, index) => {
        return busList.indexOf(c) === index;
    });   
    console.log(uniqueRoute);
    var options1 = '';
    for (var i = 0; i < uniqueRoute.length; i++) 
        options1 += '<option value="' + uniqueRoute[i] + '" />';
    document.getElementById('buses').innerHTML = options1;

    //place array, get unique names   
    var placeList=[ ];
    for(var i=0;i<routes.length;i++) 
        for(var j=2;j<viaArray.length;j++)
            placeList.push(arr[i][j]);        
    let uniquePlace = placeList.filter((c, index) => {
        return placeList.indexOf(c) === index;
    });   
    uniquePlace.sort();
    console.log(uniquePlace);
    var options2 = '';
    for (var i = 0; i < uniquePlace.length; i++) 
        options2 += '<option value="' + uniquePlace[i] + '" />';
    document.getElementById('places').innerHTML = options2;

    //document.write(uniquePlace);
}    

//to load kolkata zone at first load
routes = routes1;
loadRoute();

//function to search bus, as per bus route no
function routeSearch() {
    document.getElementById("busRoute").style.borderWidth = "medium";
    if(document.getElementById("busRoute").value==="") {
        document.getElementById("routeRes").innerHTML = "<br>No routes number entered";
        document.getElementById("busRoute").style.borderColor = "red";
    }
    else {
        document.getElementById("busRoute").style.borderStyle = "solid";
        var busRoute=document.getElementById("busRoute").value.trim();
        var str="";
        var imgIndexArr = [ ];
        var Index=0;
        for(var i=0;i<arr.length;i++) {
            //absolute check by === , case insensitive search, add bus route numbers/names to the string str when match occurs 
            if( (busRoute.toLowerCase()===arr[i][0].toLowerCase())  || (busRoute.toLowerCase()===arr[i][0].replace('-', '').toLowerCase()) ) {
                //autocorrect if not properly entered
                if ( busRoute.toLowerCase()!=arr[i][0].toLowerCase() ) 
                    document.getElementById("busRoute").value=arr[i][0];
                str+="<b>"+arr[i][0]+" : "+arr[i][1]+"</b> : ";
                for(var j=2;j<arr[i].length;j++) {
                    if(j==arr[i].length-1) {
                        str+=arr[i][j];
                        imgIndexArr[Index++] = i;
                    }
                    else
                        str+=arr[i][j]+"->";
                }        
                str+="<br><br>";    
            }
        }
        if(str==="") {
            document.getElementById("busRoute").style.borderColor = "red";
            document.getElementById("routeRes").innerHTML = "<br>No such routes found";        
        }
        else {
            str+="<br><b>&#9658;Note:</b>Buses may divert routes in unusual cases like traffic block, short termination, etc. Please ask conductor before boarding.<br>";
            //console.log(imgArr.length);
            imgIndexArr.splice(imgIndexArr.length - imgIndexArr.length/2,imgIndexArr.length);
            console.log(imgIndexArr);
            document.getElementById("busRoute").style.borderColor = "green";
            for(var k=0;k<imgIndexArr.length;k++)
                str+="<br><br><img src="+imgArr[imgIndexArr[k]]+" alt=kbop style=height:200px;width:300px;>"; 
            str+="<br><b>&#9658;Note:</b> Buses models shown here are just for reference only, actual bus may appear different, please look at the board or ask conductor before boarding.<br>";
            document.getElementById("routeRes").innerHTML = "<br>"+str;
        }
    }   
}  


//search as per location
function locSearch() {
    document.getElementById("loc").style.borderWidth = "medium";
    var loc=document.getElementById("loc").value.trim();
    if(loc==="") {
        document.getElementById("locRes").innerHTML="<br>No location entered.";
        document.getElementById("loc").style.borderColor = "red";
    }
    else {
        var busArray = [ ];
        var comp,compHighest=0;
        //get the highest value of matching (compHighest) between the entered location and all places available
        for (var i = 0, l1 = arr.length; i < l1; i++) {
            for (var j = 2, l2 = arr[i].length; j < l2; j++) {
                comp = similarity(arr[i][j],loc);
                if(comp>compHighest)
                    compHighest = comp;
            }
        }            
        for (var i = 0, l1 = arr.length; i < l1; i++) {
            for (var j = 2, l2 = arr[i].length; j < l2; j++) {
                //if highest match compHighest==1 means exact match with entered value, therfore absolute check can be done using ===
                if(compHighest==1) {
                    if(arr[i][j].toLowerCase()===loc.toLowerCase()) {
                        busArray.push(arr[i][0]);
                        document.getElementById("loc").value=arr[i][j];
                    }    
                }
                //if not 1 then do approximate match and auto correction
                else {
                    var sim = similarity(arr[i][j],loc);
                    if(sim>=0.85 && sim<1) {
                        busArray.push(arr[i][0]); 
                        document.getElementById("loc").value=arr[i][j];
                    }
                }
                
            }
        }
        if(busArray.length!=0){
            //returns only unique values of bus routes
            let uniqueChars = busArray.filter((c, index) => {
                return busArray.indexOf(c) === index;
            });
            var str=""
            for(var i=0;i<uniqueChars.length;i++) {
                if(i==uniqueChars.length-1)
                    str+=uniqueChars[i]+". ";
                else    
                    str+=uniqueChars[i]+", ";   
            } 
            document.getElementById("locRes").innerHTML="<br>"+str+"<br><br><b>&#9658;Note:</b>There might be many location with same name. Search for the entire bus route to clarify your desired location.<br>";
            document.getElementById("loc").style.borderColor = "green";
        }
        else  {
            document.getElementById("locRes").innerHTML="<br>No bus runs at your entered location. Please try a new location or check spelling of the location given."  
            document.getElementById("loc").style.borderColor = "red";
        }
    }
}

//as per source dest info
function sdSearch() {
    document.getElementById("src").style.borderWidth = "medium";
    document.getElementById("des").style.borderWidth = "medium";
    var src=document.getElementById("src").value.trim().toLowerCase();
    var des=document.getElementById("des").value.trim().toLowerCase();
    if(src==="" || des==="") {
        document.getElementById("sdRes").innerHTML="<br>Enter both source and destination location";
        if (src ==="")
            document.getElementById("src").style.borderColor = "red";
        else
            document.getElementById("src").style.borderColor = "black";
        if (des ==="")
            document.getElementById("des").style.borderColor = "red";
        else
            document.getElementById("des").style.borderColor = "black";
    }   
    else {    
        var flag=0;
        var srcFlag=0;
        var desFlag=0;
        var busArray = [ ];
        var comp1,compHighest1=0,comp2,compHighest2=0;
        //get the highest value of matching (compHighest1) between the entered source location (src) and all places available
        for (var i = 0, l1 = arr.length; i < l1; i++) {
            for (var j = 2, l2 = arr[i].length; j < l2; j++) {
                comp1 = similarity(arr[i][j],src);
                if(comp1>compHighest1)
                    compHighest1 = comp1;
            }
        }      
        //get the highest value of matching (compHighest2) between the entered destination location (des) and all places available
        for (var i = 0, l1 = arr.length; i < l1; i++) {
            for (var j = 2, l2 = arr[i].length; j < l2; j++) {
                comp2 = similarity(arr[i][j],des);
                if(comp2>compHighest2)
                    compHighest2 = comp2;
            }
        }
        //set src and des flags if the entered src and des are valid locations 
        if(compHighest1>=0.85)
            srcFlag=1;
        if(compHighest2>=0.85)
            desFlag=1; 

        // run loop again for finding the match
        for (var i = 0, l1 = arr.length; i < l1; i++) {
            for (var j = 2, l2 = arr[i].length; j < l2; j++) {
                //if highest match compHighest1==1 means exact match with entered source value, therfore absolute check can be done using ===, set Flag=1 is hit occurs
                if(compHighest1==1) {
                    if(arr[i][j].toLowerCase()===src.toLowerCase()) {
                        flag=1;
                        document.getElementById("src").value=arr[i][j];
                    }
                }
                //if not 1 then do approximate match and auto correction, set Flag=1 is hit occurs
                else {
                    var sim = similarity(arr[i][j],src);
                    if(sim>=0.85 && sim<1) {
                        flag=1;
                        document.getElementById("src").value=arr[i][j];
                    }
                }

                //if highest match compHighest2==1 means exact match with entered destination value, therfore absolute check can be done using ===
                // if Flag==1, ie, if it has hit src before, then push that route no./name into array
                if(compHighest2==1) {
                    if( (arr[i][j].toLowerCase()===des.toLowerCase()) && flag==1) {
                        busArray.push(arr[i][0]);
                        flag=0;
                        document.getElementById("des").value=arr[i][j];
                    }
                }
                //if not 1 then do approximate match and auto correction, set srcFlag=1 is hit occurs
                else {
                    var sim = similarity(arr[i][j],des);
                    if(sim>=0.85 && sim<1 && flag==1) {
                        busArray.push(arr[i][0]);
                        flag=0;
                        document.getElementById("des").value=arr[i][j];
                    }
                }
            }
            flag=0;
        }

        if(busArray.length!=0) {
            var str=""
            for(var i=0;i<busArray.length;i++) {
                if(i==busArray.length-1)
                    str+=busArray[i]+". ";
                else    
                    str+=busArray[i]+", ";   
            } 
            document.getElementById("sdRes").innerHTML="<br>"+str;
            document.getElementById("src").style.borderColor = "green";
            document.getElementById("des").style.borderColor = "green";
        }
        else {
            if(srcFlag==0 && desFlag==0) {
                document.getElementById("src").style.borderColor = "red";
                document.getElementById("des").style.borderColor = "red";
                document.getElementById("sdRes").innerHTML="<br>Both source & destination location is incorrect. Check spelling, otherwise no such location exists";
            }
            else if(srcFlag==0 && desFlag==1) {
                document.getElementById("src").style.borderColor = "red";
                document.getElementById("des").style.borderColor = "black";
                document.getElementById("sdRes").innerHTML="<br>Source location is incorrect. Check spelling, otherwise no such location exists";
            }
            else if(srcFlag==1 && desFlag==0) {
                document.getElementById("src").style.borderColor = "black";
                document.getElementById("des").style.borderColor = "red";
                document.getElementById("sdRes").innerHTML="<br>Destination location is incorrect. Check spelling, otherwise no such location exists";
            }
            else {
                document.getElementById("src").style.borderColor = "black";
                document.getElementById("des").style.borderColor = "black";
                document.getElementById("sdRes").innerHTML="<br>No direct bus found between the routes";
            }
        }
    }   
}

//flip src dest
function flip() {
    var src=document.getElementById("src").value;
    var des=document.getElementById("des").value;
    document.getElementById("src").value=des;
    document.getElementById("des").value=src;
}

//reset everything
function reset(){
    document.getElementById("src").value="";
    document.getElementById("des").value="";
    document.getElementById("busRoute").value="";
    document.getElementById("loc").value="";
    document.getElementById("sdRes").innerHTML="";
    document.getElementById("routeRes").innerHTML="";
    document.getElementById("locRes").innerHTML="";
    document.getElementById("busRoute").style.borderColor = "black";
    document.getElementById("loc").style.borderColor = "black";
    document.getElementById("busRoute").style.borderWidth = "thin";
    document.getElementById("loc").style.borderWidth = "thin";
    document.getElementById("src").style.borderWidth = "thin";
    document.getElementById("des").style.borderWidth = "thin";
    document.getElementById("src").style.borderColor = "black";
    document.getElementById("des").style.borderColor = "black";
    
}

var lightFlag=1;
function lightdark(){
    if(lightFlag) {
        document.getElementById("bodyid").style.color= "white";
        document.getElementById("bodyid").style.backgroundColor = "#1F1B24";
        document.getElementById("bodyid").style.border= "15px solid #1F1B24";
        document.getElementById("src").style.backgroundColor= "#757575";
        document.getElementById("des").style.backgroundColor= "#757575";
        document.getElementById("loc").style.backgroundColor= "#757575";
        document.getElementById("busRoute").style.backgroundColor= "#757575";
        document.getElementById("src").style.color= "white";
        document.getElementById("des").style.color= "white";
        document.getElementById("loc").style.color= "white";
        document.getElementById("busRoute").style.color= "white";
        document.getElementsByClassName("modal-content")[0].style.backgroundColor="#585858";
        lightFlag=0;
    }
    else {
        document.getElementById("bodyid").style.color= "black";
        document.getElementById("bodyid").style.backgroundColor = "white";
        document.getElementById("bodyid").style.border= "15px solid white";
        document.getElementById("src").style.backgroundColor= "white";
        document.getElementById("des").style.backgroundColor= "white";
        document.getElementById("loc").style.backgroundColor= "white";
        document.getElementById("busRoute").style.backgroundColor= "white";
        document.getElementById("src").style.color= "black";
        document.getElementById("des").style.color= "black";
        document.getElementById("loc").style.color= "black";
        document.getElementById("busRoute").style.color= "black";
        document.getElementsByClassName("modal-content")[0].style.backgroundColor="white";
        lightFlag=1;
    }
}

function noGlow(x) {
    document.getElementById(x).style.borderWidth = "thin";
    document.getElementById(x).style.borderColor = "black";
}

function initialUppercase(str) {
    //split the above string into an array of strings whenever a blank space is encountered
    const arr = str.split(" ");
    //loop through each element of the array and capitalize the first letter.
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    //Join all the elements of the array back into a string using a blankspace as a separator 
    const str2 = arr.join(" ");
    return str2;
}

//likely strings pattern check function
//https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
    return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
        costs[j] = j;
        else {
        if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
        }
        }
    }
    if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

//MODAL
// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
}
}
