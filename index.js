
  	function showFile(id) {
			$('#myfile').empty();
			filetype=getFileExtension(id);
			if (filetype=='jpg'||filetype=='png'||filetype=='jpeg')
			{
				$('#myfile').html('<img src="'+id+'" class="fullscreen" />');
				$('a#download').attr('href', id);
			}
			else if (filetype=='zip'||filetype=='txt')
			{	
				$.ajax({
					url : id,
					dataType: "text",
					success : function (data) {
						$('#myfile').css('font-family','Courier New');
						$("#myfile").html(data);
						$('a#download').attr('href', id);
					}
				});
			}			
			else if (filetype=='mp3')
			{
				$('#myfile').html('<audio controls><source src="'+id+'" type="audio/mpeg">Your browser does not support the audio element.</audio>');
				$('a#download').attr('href', id);
			}			
			else if (filetype=='mp4')
			{
				$('#myfile').html('<video width="320px" height="240px" controls><source src="'+id+'" type="video/mp4">Your browser does not support the video tag.</video>');
				$('a#download').attr('href', id);
			}
		}		//showfile
		
		function icon_filter_fn(filename){
			var retxt='';
			filetype=getFileExtension(filename);
			if (filetype=='txt'){
				retxt='txt.png';
			}
			else if (filetype=='jpg'||filetype=='jpeg'||filetype=='png'||filetype=='bmp'){
				retxt='image.png';
			}
			else if (filetype=='mp4'){
				retxt='movie.png';
			}
			else if (filetype=='mp3'){
				retxt='sound.png';
			}
			else if (filetype=='ai'){
				retxt='ai.png';
			}
			else if (filetype=='eps'){
				retxt='eps.png';
			}
			else if (filetype=='pdf'){
				retxt='pdf.png';
			}
			else if (filetype=='doc'){
				retxt='doc.png';
			}
			else if (filetype=='xls'){
				retxt='xls.png';
			}
			else if (filetype=='ppt'){
				retxt='ppt.png';
			}
			else if (filetype=='rar'){
				retxt='rar.png';
			}
			else if (filetype=='zip'){
				retxt='zip.png';
			}
			else {
				retxt='other.png';
			}
			return retxt;
		}
		
		function showfolder(id) {
			$.mobile.showPageLoadingMsg();
			var creds=localStorage['creds'];
			$.getJSON(folder_j(creds,id,0,19), function(content_response) {
				var x = $.parseJSON(content_response.d);

				var output='';
				output+=objtolist(x,creds);
				$("#myfolder ul.ui-listview").empty();
				$("#myfolder ul").append(output).listview('refresh');
				current_folder=id;					//global
				tofolder();
				$.mobile.hidePageLoadingMsg();
			})
		}

		function showtheFile(fileid) {
			$.mobile.showPageLoadingMsg();
			var creds=localStorage['creds'];
			$.getJSON('http://ozibox.com/webservices/ozibox.asmx/GetDownloadUrl_JSON?headers_Json=' + creds +'&FileID='+fileid+'&format=json&callback=?', function(response_file_val) {
				var id=response_file_val.d;
				
				showFile(id);
				var filetype=getFileExtension(id);
				tofile();
				$.mobile.hidePageLoadingMsg();
			})
		}

		function rootfolder(low,high) {						//refresh tou rootfolder
			var creds=localStorage['creds'];
			$.getJSON(folder_j(creds,0,low,high), function(content_response) {
				var x = $.parseJSON(content_response.d);

				var output='';
				output+=objtolist(x,creds);
				$("#ozimain ul").append(output).listview('refresh');
				$.mobile.changePage('#ozimain ul li:eq(low)');
				$.mobile.hidePageLoadingMsg();
			})
		}

		function foldercont(id,low,high) {						//refresh tou foldercont
			var creds=localStorage['creds'];
			$.getJSON(folder_j(creds,id,low,high), function(content_response) {
				var x = $.parseJSON(content_response.d);

				var output='';
				output+=objtolist(x,creds);
				
				$("#myfolder ul").append(output).listview('refresh');
				$.mobile.changePage('#folder ul li:eq(low)');
				$.mobile.hidePageLoadingMsg();
			})
		}

		function getFileExtension(filename) {
			return filename.split('.').pop();
		}

		function jsonized_login(){							//jsonize gia to login
			
			var md5_data='\"{\\"login\\":\\"';
			md5_data+=hex_md5($('input#Login').val());
			md5_data+='\\",\\"pass\\":\\"';
			md5_data+=hex_md5($('input#Pass').val());
			md5_data+='\\"}\"';
			
			return md5_data;
		}

		function save_login(){								//local credentials save
		
			$("input#Login-settings").val($('input#Login').val());
			$("input#Pass-settings").val($('input#Pass').val());
			localStorage['creds']=jsonized_login();
			
		}
		
		function succsfllogin(formData){
			$.getJSON(driveinfo(), function(driveinfovar) {
				var x = $.parseJSON(driveinfovar.d);
			
					var output='';	


					var ts=parseFloat(x.TotalSpace);
					ts=ts/1073741824;
					var us=parseFloat(x.UsedSpace);
					us=us/1073741824;
					var rs=ts-us;
					
					//output+=int(rs);
					output+=Math.floor( rs );
					fts=Math.floor( ts );

				output+='GB free of '+fts+'GB';
				$("#oziboxspace").text(output);
			})
									
			$.getJSON(folder_j(formData,0,0,19), function(content_response) {
				x = $.parseJSON(content_response.d);

				output='';
				output+=objtolist(x,formData); 
				$("#ozimain ul").append(output);
				tologin();
			})
		}
		
		function tofolder(){
			$.mobile.changePage( "#folder");
		}

		function tofile(){
			$.mobile.changePage('#files');
		}

		function tologin(){
			$.mobile.changePage('#home');
		}

		function tologout(){
				alert('goodbye');
				console.log('goodbye');
			$.mobile.changePage('#login');
		}

		function driveinfo(){
			var url='http://ozibox.com/webservices/ozibox.asmx/';
			var fn='GetDriveInfo_JSON';
			var login_args='?headers_Json=';
			var creds=localStorage['creds'];
			var closing='&format=json&callback=?';

			var string=url+fn+login_args+creds+closing;

			return string;
		}
		
		function login_j(creds){							//xtizei to login string tou ajax_login
			var url='http://ozibox.com/webservices/ozibox.asmx/';
			var fn='LoginUser_JSON';
			var login_args='?headers_Json=';
			//creds here
			var closing='&format=json&callback=?';
			
			var string=url+fn+login_args+creds+closing;
			
			return string;
		}

		function folder_j(creds,folder,strt,end){
			var url='http://ozibox.com/webservices/ozibox.asmx/';
			var fn='GetFolderContent_JSON';
			var login_args='?headers_Json=';
			//creds here
			var fldr_opts='&FolderID='+folder+'&FileID_Start='+strt+'&FileID_End='+end;
			var closing='&format=json&callback=?';

			var string=url+fn+login_args+creds+fldr_opts+closing;
			return string;
		}

		function todate(num){
		var nbr=parseFloat(num);
			var date = new Date(nbr);
			var ddt=date.toString('dd-MM-yyyy');
			return ddt;
		}

		function objtolist(x,creds){								//apo json object se list
			output='';
			$.each(x,function(key,val) {
				if(val.isFolder=="true"){							//if folder
			
					var tempDiv = document.createElement("tempDiv");
					tempDiv.innerHTML = val.FileName;
					$("a",tempDiv).remove();
					var excerpt = tempDiv.innerHTML;	
				
					output += '<li data-icon="false" data-filtertext="'+val.FileName+'">';
					output += '<a href="#folder" onclick="showfolder('+val.FileID+')">';
					output += '<h3>' + val.FileName + '</h3>';
					output += '<img src="themes/img/folder.png" alt="a files folder" style="position: absolute;left: 15px;top: 15px;height:40px;width:40px;" />';
					output += '<p>uploaded at ';
					output += todate(val.CreateDateTime);
					output += '</p>';
					output += '</a>';
					output += '</li>';
				}
				else{
					var tempDiv = document.createElement("tempDiv");
					tempDiv.innerHTML = val.FileName;
					$("a",tempDiv).remove();
					var excerpt = tempDiv.innerHTML;

					output += '<li data-icon="false" data-filtertext="'+val.FileName+'">';
					output += '<a href="#files" onclick="showtheFile(' + val.FileID + ')">';
					output += '<h3>' + val.FileName + '</h3>';
					output += '<img src="themes/img/filepics/';
					output += icon_filter_fn(val.FileName);
					//output += 'txt.png';				//edw icon_filter_fn
					output += '" alt="a files folder" style="position: absolute;left: 15px;top: 15px;height:40px;width:40px;" />';
					output += '<p>uploaded at ';
					output += todate(val.CreateDateTime);
					output += '</p>';
					output += '</a>';
					output += '</li>';
				}
				
			});
			return output;
		}

		function howmany(){
			console.log('we this form data ='+formData);
		}

	$(window).scroll(function(){							//bottom hit alert
		if($(document).height() > $(window).height())
		{
			if($(window).scrollTop() == $(document).height() - $(window).height()){
			
				//alert("The Bottom");
				
				if ($('#home').hasClass('ui-page-active')){					//gia to #home
					if (home_count != $("#ozimain li").size()){
						$.mobile.showPageLoadingMsg();
						var tntymore=$("#ozimain li").size()+19;
						rootfolder($("#ozimain li").size(),tntymore);
					}					
					home_count=$("#ozimain li").size();						//global
				}
				
				if ($('#folder').hasClass('ui-page-active')){					//gia to #folder
					if (folder_count != $("#folder li").size()){
						$.mobile.showPageLoadingMsg();
						var tntymore=$("#folder li").size()+19;
						foldercont(current_folder,$("#folder li").size(),tntymore);
					}					
					folder_count=$("#folder li").size();					//global
				}
			}
		}
	});
	
        $(document).bind('pageinit',function() {
		
			window.home_count='';												//global vars
			window.folder_count='';												//global vars
			window.current_folder='';											//global vars
		
			$("#submit").click(function(e){
			
				e.preventDefault();

				var formData=jsonized_login();
				
				$.getJSON(login_j(formData), function(response) {
					// Do something with the request
					
					var login_details = $.parseJSON(response.d);
					
					if(login_details.HasErrors=='false'){
						save_login();
						
						succsfllogin(formData);
						
					}
					else{
						alert('wrong username or password');
						localStorage.clear();
						tologout();
					}
					
				});
            });
			
            $("#logout").click(function(){
				localStorage.clear();
				tologout();				
            });
        });

var downloadDirectory;

document.addEventListener("deviceready", onDeviceReady, true);

function onDeviceReady() {
	
	alert('Le device is rdy!');
	console.log('Le device is rdy!');
				if(localStorage['creds']==undefined)
				{tologout();}
				else
				{succsfllogin(localStorage['creds']);}
		
	window.requestFileSystem(
		LocalFileSystem.PERSISTENT, 
		0, 
		onFileSystemSuccess, 
		null
	);
	
}

	$("#files a#download").click(function(e) {
		e.preventDefault();
		alert('Le click was done!');
		console.log('Le click was done!');
		download();
	});

function download() {

	var fileURL = $('#files a#download').attr('href');
	var localFileName = getFilename(fileURL);
	
	alert('download started');
	console.log('download started');
	
	
	var fileTransfer = new FileTransfer();
	fileTransfer.download(fileURL, downloadDirectory.fullPath + '/' + localFileName, 
		function(entry){

			alert('Download complete. File saved to: ' + entry.fullPath);
			console.log('Download complete. File saved to: ' + entry.fullPath);
		}, 
		function(error){
			alert("Download error source " + error.source);
			console.log("Download error source " + error.source);
		}
	);
}

// Obtain the filename
function getFilename(url) {
	return url.split('=').pop();
}

function onFileSystemSuccess(fileSystem) {
	fileSystem.root.getDirectory('ozibox',{create:true},
		function(dir) {
			downloadDirectory = dir;
		},fail);
}

function fail(error) {
	alert('We encountered a problem: ' + error.code);
	console.log("Download error source " + error.source);
}
