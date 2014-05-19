var xmlhttp;
var content;
var d = new Date();
var currentMenuId = '';

if(window.XMLHttpRequest) {
	xmlhttp = new XMLHttpRequest();
} else {
	xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
}

$(function() {
	$(document).click(function() {
		closeNavs();
		//show hide comments
	
	})
	$(window).on('popstate', function() {
      updatePage();
    });
	$(window).resize(function() {
		resizeNavs();
	})
	
	$(".add-item").click(function(e){
		e.stopPropagation();
		getTodoForm($(this).attr("href"));
		
		//alert("add todo to list " + $(this).attr("href"));
	});
	$(".add-sub-item").click(function(e){
		e.stopPropagation();
		getTodoForm($(this).attr("href"));
		//alert("add todo to list " + $(this).attr("href"));
	});
	addButtons();
	//stops the nav from closing when ul is accidentally clicked
	$(".todolistnav").click(function(e){
		e.stopPropagation();
	})
	$(".todolistnav li").click(function(e){
		e.stopPropagation();
	})
	$("#add-form-container").click(function(e){
		e.stopPropagation();
	})
	$('#add-button').click(function(e) {
		e.preventDefault();
		addTodo($("#todo-status").val());
		
	});
	$('#cancel-button').click(function(e) {
		e.preventDefault();
		removeTodoForm();
		
	});
	$(".browse-button").click(function(e){
		e.preventDefault();
		alert("upload not available yet");
	})
	
	$(".todo-navigation").click(function(e){
		e.stopPropagation();
		if($("#list-" + $(this).attr("href"))==null) return;
		if($(this).attr("href").substr(0,1) =='x') {
			//this is a leaf, no children,will return info on todo item to content
			return;
		}
		$(this).parent().parent().animate({
			marginLeft: "-101%",
			height: height
		});
		var height = $(window).height();
		var id = "#list-" + $(this).attr("href");
		currentMenuId = id;
		$(id).show();
		$(id).animate({
			marginLeft: "0",
			height: height
		});
		
	})
	$('.back-navigation').click(function(e){
		e.stopPropagation();
		if($(this).attr("href") =='0') {
			closeNavs();
			return;
		}
		
		$(this).parent().animate({
			marginLeft: "-101%"
		});
		var id = "#list-" + $(this).attr("href");
		$(id).animate({
			marginLeft: "0"
		});
	})
	//log in log out function
	$('#login-drop').click(function(e) {
		//e.stopPropagation();
		
		if($('#login-menu').css('marginRight') == '-260px'){
			$("#login-menu").animate({
				marginRight : '0'
			});
			$("#username").focus();
			
		}else {
			$("#login-menu").animate({
				marginRight : '-260px'
			});
		}
		
	});
	$('#login-button').click(function() {
		$("#login-form").submit();
	})
	$('#logout-button').click(function() {
		$("#logout-form").submit();
	})
	$('.top-nav-link').click(function(e) {
		e.stopPropagation();
		
		closeNavs($(this).css("id"));
		var element = $(this).next();
		var height = $(window).height() - 90;
		if($('#log-button').attr('id') == null || $(window).width() > 480) height += 40;
		element.css("height", height);
		if(checkNavs(element) || checkListNav() && $(this).attr('id') == 'todo-button')
		{
			closeNavs();			
		}	
		else
		{
			if($(this).attr('id') == 'repo-button' ||$(this).attr('id') == 'todo-button' && currentMenuId == '')
			{
				checkListNav();
				$(this).next().animate({
					marginLeft : '0'
				}, 200, "easeOutQuint");
			}
			else if($(this).attr('id') == 'todo-button')
			{
				// gets the previous spot the todolist was open to on reopen
				checkListNav();
				$(currentMenuId).show();
				$(currentMenuId).animate({
					marginLeft: "0",
					height: height
				}, 200, "easeOutQuint");
			}
			else{
				$(this).next().animate({
					marginRight : '0'
				}, 200, "easeOutQuint");
			}
		}
			

	})
	$('.repo-icon').click(function(e) {
		e.stopPropagation();
		var element = $(this).next();
		closeSubNavs(element);
		if(element.css('marginLeft') == '102px')
			element.animate({
				marginLeft : '-480px',
				zIndex : '-1'
			});
		else {
			var height = $(window).height() - 90;
			if($('#log-button').attr('id') == null || $(window).width() > 480) height += 40;
			var width = $(window).width();
			if(width < 480) {
				width -= 100;
				element.css("width", width);
			}
			element.css("height", height);

			element.animate({
				marginLeft : '102px'
			});
		}

	})
	$('.repo-sub').click(function(e) {
		e.stopPropagation();
	})
});
function resizeNavs() {
	
	var height = $(window).height() - 50;
	if($('#log-button').attr('id') == null || $(window).width() > 480) height += 40;
	$('.repo-sub').each(function() {

		$(this).css("height", height);
	});
	$('.top-nav-item').each(function() {
		$(this).css("height", height);
	});
}

function checkNavs(element) {
	return element.css('marginLeft') == "0px" && element.attr("id") == "repo-nav" || element.css('marginLeft') == "0px" && element.attr("id") == "todo-nav" || element.css('marginRight') == "0px" && element.attr("id") == "log-nav" || element.css('marginRight') == "0px" && element.attr("id") == "settings-nav";
}

function checkListNav()
{
	var isOpen = false;
	$(".todolistnav").each(function(){
		if($(this).css('marginLeft') == "0px"){
			isOpen = true;
		}
	})
	return isOpen;
}

function closeSubNavs(element) {
	$('.repo-sub').each(function() {
		if(element.attr("class") != $(this).attr("class"))
			$(this).animate({
				marginLeft : '-480px'
			});

	})
}
function getTodoForm(todoId){
	var addForm = $("#add-form-container");
		var width = $(window).width();
		if(width > 768) width = width/2 - 150;
		else width = '0';
		addForm.animate({
			marginLeft: "0",
			left: width
		});
	$("#todo-status").val(todoId);
	$("#todo-name").focus();
}
function removeTodoForm(){
	var addForm = $("#add-form-container");
		addForm.animate({
			marginLeft: "-100%"
		});
		//clear out form
		$("#todo-name").val('');
		$("#todo-desc").val('');  
}
function closeNavs(text) {
	closeSubNavs($('#rep-nav'));
	if(text != 'repo-button') {
		$('#repo-nav').animate({
			marginLeft : '-100%'
		});
	}
	if(text != 'todo-button') {
		$('#todo-nav').animate({
			marginLeft : '-100%'
		});
		$(".todolistnav").animate({
			marginLeft : '-101%'
		});
	}
	if(text != 'log-button') {
		$('#log-nav').animate({
			marginRight : '-100%'
		});
	}
	if(text != 'settings-button') {
		$('#settings-nav').animate({
			marginRight : '-100%'
		});
	}

}
function addTodo(id)
{
	
	if(id == "todo-nav") id = 0;
	if($("#todo-name").val() == '')
	{
		$("#invalid-todo").show();
		return;
	}
	else{
		$("#invalid-todo").hide();
	}
	var requestLink = "http://sagegatzke.com/todosajax/redirect.php?treeId=" + id + '&name=' + $("#todo-name").val() + '&info=' + $("#todo-desc").val();
	$.ajax({
		url : requestLink,
		beforeSend: function(){
                   $("#spinner").show();
               },
		success : function(result) {
			$("#spinner").hide();
			//$("#content").html(result);
			if(result == '') {
				alert("Shared folders not createable yet");
				return;
			}
			else if(result == 0) {
				alert("please try again");
				return;
			}
			alert($("#todo-name").val() + " was successfully added");
			
			removeTodoForm();
		}
	});

}

function addButtons()
{
	// ajax jquery calls
	$(".ajax-request").click(function(e) {
		if($(window).width() < 768) closeNavs();
		e.stopPropagation();
		var requestLink = "http://sagegatzke.com/todosajax/redirect.php?requestedinfo=" + $(this).attr("href").toLowerCase();
		$.ajax({
			url : requestLink,
			beforeSend: function(){
                       $("#spinner").show();
                   },
			success : function(result) {
				$("#spinner").hide();
				unsetListeners();
				$("#content").html(result);
				addButtons();
				//scrollToElement($('#content'));
			}
		});
	});
	$(".close").click(function(e) {
		if($(window).width() < 768) closeNavs();
		e.stopPropagation();
		$(this).parent().parent().slideUp();
		
	});
	$(".show-info").click(function(e) {
		if($(window).width() < 768) closeNavs();
		e.stopPropagation();
		var element = '#count' + $(this).attr('id');
		var requestLink = "http://sagegatzke.com/todosajax/redirect.php?requestedinfo=" + $(this).attr("href").toLowerCase();
		$.ajax({
			type: "POST",
			url : requestLink,
			beforeSend: function(){
                       $("#spinner").show();
                   },
			success : function(result) {
				$("#spinner").hide();
				unsetListeners();
				//$(element).append('hi');
				//alert(element.attr("class"));
				$(element).css("width","100%");
				$(element).html(result);
				$(element).hide();
				$(element).slideDown();
				scrollToElement($(element),1000,-150);
				addButtons();
			}
		});
	});
}


function unsetListeners()
{
	$(".ajax-request").unbind('click');
	$(".show-info").unbind('click');
	$(".close").unbind('click');
}
function scrollToElement(selector, time, verticalOffset) {
    time = typeof(time) != 'undefined' ? time : 200;
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time);
}
function updatePage()
{
	var pathname = ($(location).attr('hash')).substring(1);
	//alert(($(location).attr('hash')).substring(1));
	var requestLink = "http://sagegatzke.com/todosajax/redirect.php?requestedinfo=" +pathname.toLowerCase();
	$.ajax({
		url : requestLink,
		beforeSend : function() {
			$("#spinner").show();
		},
		success : function(result) {
			$("#spinner").hide();
			unsetListeners();
			$("#content").html(result);
			addButtons();
			scrollToElement($('#content'));
		}
	});
}

function badLogin()
{
	$("#login-menu").css("margin-right", "0");
	$("#invalid-login").show();
	$("#username").focus();
}
//old ajax
/*
function loadContent(requestedInfo, action) {
	if(window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			content = xmlhttp.responseText;
			$('#content').html(content);
			$('#loader').hide();
			$('#content').slideDown();

		} else if(xmlhttp.status == 404) {
			$('#content').html('Sorry, Content Not Found');
		} else {
			$('#loader').show();
		}
	}
	xmlhttp.open('POST', 'http://sagegatzke.com/todosajax/redirect.php?requestedinfo=' + requestedInfo + '&t=' + d.getTime(), action);
	xmlhttp.send();
};
*/