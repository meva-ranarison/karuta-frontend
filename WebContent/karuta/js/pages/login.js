

//==================================
function getURLParameter(sParam) {
//==================================
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for ( var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}

//==================================
function callCAS()
//==================================
{
	var url = window.location.href;
	var serverURL = url.substring(0,url.lastIndexOf(appliname+"/")-1);
	var locationURL = cas_url+"/login?service="+serverURL+"/"+serverBCK_API.substring(9)+"/credential/login/cas?redir="+serverURL+"/"+appliname+"/application/htm/karuta.htm";
	window.location = locationURL;
}

//==============================
function callSubmit(encrypt_url,lang)
//==============================
{
	var data = "<credential><login>"+document.getElementById("useridentifier").value+"</login><password>"+document.getElementById("password").value+"</password></credential>";
	$.ajax({
		contentType: "application/xml",
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/credential/login",
		data: data,
		i : encrypt_url,
		lang :lang,
		success : function(data) {
			if (self.encrypt_url=="")
				window.location="karuta.htm";
			else
				window.location="public.htm?i="+self.encrypt_url+"&lang="+self.lang
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Identification : "+jqxhr.responseText);
		}
	});
}

//==============================
function loginPublic()
//==============================
{
	var data = "<credential><login>public</login><password>public</password></credential>";
	$.ajax({
		async:false,
		contentType: "application/xml",
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/credential/login",
		data: data,
		success : function(data) {
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Identification : "+jqxhr.responseText);
		}
	});
}

//==============================
function callSend()
//==============================
{
	var data = "<credential><login>"+document.getElementById("useridentifier_new").value+"</login></credential>";
	$.ajaxSetup({
		Accept: "application/xml",
		contentType: "application/xml"
		});
	$.ajax({
		type : "POST",
		dataType : "text",
		url : serverBCK_API+"/credential/forgot",
		data: data,
		success : function(data) {
			alertHTML(karutaStr[LANG]['password-sent']);
			window.location="login.htm?lang="+LANG;
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Identification : "+karutaStr[LANG]['inexistent-user']);
		}
	});
}

//==============================
function getLogin(encrypt_url,lang)
//==============================
{
	var html = "";
	html += "<div id='connection-cas' style='display:none'>";
	html += "<h5>Connexion avec un compte universitaire (CAS)</h5>";
	html += "<button class='button-login' onclick='javascript:callCAS()'>"+karutaStr[LANG]['login']+"</button>";
	html += "<h5>Connexion hors compte universitaire</h5>";
	html += "</div>";

	html += "<input id='useridentifier' class='form-control' placeholder=\""+karutaStr[LANG]['username']+"\" type='text'>";
	html += "<input id='password' class='form-control' placeholder=\""+karutaStr[LANG]['password']+"\" type='password'>";
	html += "<button class='button-login' onclick=\"javascript:callSubmit('"+encrypt_url+"','"+lang+"')\">"+karutaStr[LANG]['login']+"</button>";
	return html;
}

//==============================
function getNew()
//==============================
{
	var html = "";
	html += "<p>"+karutaStr[LANG]['newpassword']+"</p>";
	html += "<input id='useridentifier_new' class='form-control' placeholder=\""+karutaStr[LANG]['username']+"\" type='text'/>";
	html += "<button id='form-send' onclick='javascript:callSend()'>"+karutaStr[LANG]['button-send']+"</button>";
	html += "<p><br/>"+karutaStr[LANG]['tipnewpassword']+"</p>";
	return html;
}

//==============================
function getNewAccount()
//==============================
{
	var html = "";
	html += "<p>"+karutaStr[LANG]['new-account']+"</p>";
	html += "<a id='newaccount-button' class='btn btn-account' href='createAccount.htm?lang="+LANG+"'>"+karutaStr[LANG]['sign-up']+"</a>";
	return html;
}

//==============================
function displayKarutaLogin()
//==============================
{
	loginPublic();
	var html = "";
	html += "<div id='main-welcome'>";
	html += "<div id='navigation-bar'></div>";
	html += "<div id='main-container' class='container'>";
	html += "	<div id='form-signin' class='form-signin'>";
	html += "		<div id='welcome1'></div>";
	html += "		<div id='welcome-version'></div>";
	html += "		<div id='welcome2'></div>";
	html += "		<div id='welcome3'></div>";
	html += "		<div id='login'></div>";
	html += "	</div>";
	html += "	<div class='form-newpassword' id='newpassword'></div>";
	html += "	<div class='form-newaccount' id='newaccount'></div>";
	html += "</div>";
	html += "</div>";
	$('body').html(html);
	$('body').append(alertBox());
	$('body').append(EditBox());

	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK+"/version",
		data: "",
		success : function(data) {		
			karuta_backend_version = $("number",$("#backend",data)).text();
			karuta_backend_date = $("date",$("#backend",data)).text();
			karuta_fileserver_version = $("number",$("#fileserver",data)).text();
			karuta_fileserver_date = $("date",$("#fileserver",data)).text();
		}
	});
	loadLanguages(function(data) {
		getLanguage();
		$("#navigation-bar").html(getNavBar('login',null));
		$("#login").html(getLogin(encrypt_url,lang));
		$("#useridentifier").focus();
		$("#newpassword").html(getNew());
		if(karuta_create_account)
			$("#newaccount").html(getNewAccount());
		if (typeof cas_url != 'undefined' &&cas_url!="")
			$("#connection-cas").show();
		getAndApplyLoginConfiguration();
		});
	$('#password').keypress(function(e) {
		var code= (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
			callSubmit();
	});
	//----------------------------------------------
	$.ajaxSetup({async: true});
}

//------------------------------
//------------------------------
//------------------------------
var encrypt_url = getURLParameter('i');
if (encrypt_url==null)
	encrypt_url = "" ;
//------------------------------
var lang = getURLParameter('lang');
if (lang==null)
	lang = "" ;
//-------------------------------

//==============================
function getAndApplyLoginConfiguration()
//==============================
{
	var url = serverBCK_API+"/portfolios/portfolio/code/karuta.configuration?resources=true";
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			UICom.parseStructure(data);
			
			applyNavbarConfiguration(data);
			applyLoginConfiguration(data);
		}
	});

}

//==============================
function applyLoginConfiguration(data)
//==============================
{
	//========================================
	var login_page_background_url = UICom.structure.ui[getNodeid('config-login-background-image',data)].resource.getView(null,"url");
	$('body').css("background-image", "url('"+login_page_background_url+"')");
	//========================================
	UICom.structure.ui[getNodeid('config-login-logo',data)].resource.displayView("welcome1");
	$("#welcome1").attr("style",UICom.structure.ui[getNodeid('config-login-logo',data)].getContentStyle());
	//---------------------
	UICom.structure.ui[getNodeid('config-login-subtitle',data)].resource.displayView("welcome2");
	$("#welcome2").attr("style",UICom.structure.ui[getNodeid('config-login-subtitle',data)].getContentStyle());
	//---------------------
	UICom.structure.ui[getNodeid('config-login-subtext',data)].resource.displayView("welcome3");
	$("#welcome3").attr("style",UICom.structure.ui[getNodeid('config-login-subtext',data)].getContentStyle());
	//---------------------
	var login_background_color = UICom.structure.ui[getNodeid('config-login-background-color',data)].resource.getValue();
	$('#form-signin').css("background-color",login_background_color);
	//---------------------
	var login_text_color = UICom.structure.ui[getNodeid('config-login-text-color',data)].resource.getValue();
	$('#form-signin').css("color",login_text_color);
	//---------------------
	var login_button_color = UICom.structure.ui[getNodeid('config-login-button-color',data)].resource.getValue();
	$('button.button-login').css("background-color",login_button_color);
	//---------------------
	var login_button_text_color = UICom.structure.ui[getNodeid('config-login-button-text-color',data)].resource.getValue();
	$('button.button-login').css("color",login_button_text_color);
	//========================================
	var newpassword_display = UICom.structure.ui[getNodeid('config-login-new-password-display',data)].resource.getValue();
	if (newpassword_display=="0")
		$('#newpassword').hide();
	//---------------------
	var newpassword_background_color = UICom.structure.ui[getNodeid('config-login-new-password-background-color',data)].resource.getValue();
	$('#newpassword').css("background-color",newpassword_background_color);
	//---------------------
	var newpassword_text_color = UICom.structure.ui[getNodeid('config-login-new-password-text-color',data)].resource.getValue();
	$('#newpassword').css("color",newpassword_text_color);
	//---------------------
	var newpassword_button_color = UICom.structure.ui[getNodeid('config-login-new-password-button-color',data)].resource.getValue();
	$('#form-send').css("background-color",newpassword_button_color);
	//---------------------
	var newpassword_button_text_color = UICom.structure.ui[getNodeid('config-login-new-password-button-text-color',data)].resource.getValue();
	$('#form-send').css("color",newpassword_button_text_color);
	//========================================
	var newaccount_display = UICom.structure.ui[getNodeid('config-login-new-account-display',data)].resource.getValue();
	if (newaccount_display=="0")
		$('#newaccount').hide();
	//---------------------
	var newaccount_background_color = UICom.structure.ui[getNodeid('config-login-new-account-background-color',data)].resource.getValue();
	$('#newaccount').css("background-color",newaccount_background_color);
	//---------------------
	var newaccount_text_color = UICom.structure.ui[getNodeid('config-login-new-account-text-color',data)].resource.getValue();
	$('#newaccount').css("color",newaccount_text_color);
	//---------------------
	var newaccount_button_color = UICom.structure.ui[getNodeid('config-login-new-account-button-color',data)].resource.getValue();
	$('#newaccount-button').css("background-color",newaccount_button_color);
	//---------------------
	var newaccount_button_text_color = UICom.structure.ui[getNodeid('config-login-new-account-button-text-color',data)].resource.getValue();
	$('#newaccount-button').css("color",newaccount_button_text_color);
}

