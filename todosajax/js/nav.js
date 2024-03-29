$(function() {
	$(document).click(function() {closeNavs();});
	$(window).on('popstate',function() {updatePageWithModel();});
	$(window).resize(function() {resizeNavs();});
	$("#todo-date").datepicker({dateFormat : 'yy-mm-dd'});
	//log in log out function
	$('#login-drop').click(function(e) {
		if ($('#login-menu').css('marginRight') == '-260px') 
		{
			$("#login-menu").animate({marginRight : '0'});
			$("#username").focus();
		} 
		else $("#login-menu").animate({marginRight : '-260px'});
	});
	$('#login-button').click(function() {$("#login-form").submit();});
	$('#logout-button').click(function() {$("#logout-form").submit();});
	$('.top-nav-link').click(function(e) 
	{
		e.stopPropagation();
		closeNavs($(this).css("id"));
		var element = $(this).next();
		var height = $(window).height() - 90;
		if ($('#log-button').attr('id') == null || $(window).width() > 480) height += 40;
		element.css("height", height);
		if (checkNavs(element) || checkListNav() && $(this).attr('id') == 'todo-button') closeNavs();
		else 
		{
			if ($(this).attr('id') == 'repo-button' || $(this).attr('id') == 'todo-button' && currentMenuId == '') 
			{
				checkListNav();
				$(this).next().animate({marginLeft : '0'}, 200, "easeOutQuint");
			} else if ($(this).attr('id') == 'todo-button') {
				// gets the previous spot the todolist was open to on reopen
				checkListNav();
				$(currentMenuId).show();
				$(currentMenuId).animate({
					marginLeft : "0",
					height : height
				}, 200, "easeOutQuint");
			} else {
				$(this).next().animate({
					marginRight : '0'
				}, 200, "easeOutQuint");
			}
		}
	});
	$('.repo-icon').click(function(e) {
		e.stopPropagation();
		var element = $(this).next();
		closeSubNavs(element);
		if (element.css('marginLeft') == '102px')
			element.animate({
				marginLeft : '-480px',
				zIndex : '-1'
			});
		else {
			var height = $(window).height() - 90;
			if ($('#log-button').attr('id') == null || $(window).width() > 480)
				height += 40;
			var width = $(window).width();
			if (width < 480) {
				width -= 100;
				element.css("width", width);
			}
			element.css("height", height);

			element.animate({
				marginLeft : '102px'
			});
		}
	});
	$('.repo-sub').click(function(e) {
		e.stopPropagation();
	});
});

//once todo tree has been populated it sets the variable and unsets all listeners and adds all new buttons for new content
function addButtons() {
	$(".close").click(function(e) {
		if ($(window).width() < 768)
			closeNavs();
		e.stopPropagation();
		e.stop
		$(this).parent().parent().slideUp();
	});

	$(".show-info").click(function(e) {
		if ($(window).width() < 768)
			closeNavs();
		e.stopPropagation();
		showComments('#count' + $(this).attr('id'), $(this).attr("href").toLowerCase());
	});

	$(".add-item").click(function(e) {
		e.stopPropagation();
		getTodoForm($(this).attr("href"));
	});

	$(".css-checkbox").click(function(e) {
		e.stopPropagation();
		updateTodoCompleted($(this).val(), $(this).is(":checked"));
	});
	$(".css-checkbox").change(function(e) {
		e.stopPropagation();
	});

	$(".add-sub-item").click(function(e) {
		e.stopPropagation();
		getTodoForm($(this).attr("href"));
	});

	//stops the nav from closing when ul is accidentally clicked
	$(".todolistnav").click(function(e) {
		e.stopPropagation();
	})
	$(".todolistnav li").click(function(e) {
		e.stopPropagation();
	})
	$("#add-form-container").click(function(e) {
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
	$(".browse-button").click(function(e) {
		e.preventDefault();
		alert("upload not available yet");
	})

	$(".todo-navigation").click(function(e) {
		e.stopPropagation();
		if ($("#list-" + $(this).attr("href")) == null)
			return;
		if ($(this).attr("href").substr(0, 1) == 'x') {
			//this is a leaf, no children,will return info on todo item to content
			return;
		}
		$(this).parent().parent().animate({
			marginLeft : "-101%",
			height : height
		});
		var height = $(window).height();
		var id = "#list-" + $(this).attr("href");
		setMenuId(id);
		$(id).show();
		$(id).animate({
			marginLeft : "0",
			height : height
		});

	})
	$('.back-navigation').click(function(e) {
		e.stopPropagation();
		if ($(this).attr("href") == '0') {
			closeNavs();
			return;
		}

		$(this).parent().animate({
			marginLeft : "-101%"
		});
		var id = "#list-" + $(this).attr("href");
		setMenuId(id);
		$(id).animate({
			marginLeft : "0"
		});
	})
}

function unsetListeners() {
	$(".ajax-request").unbind('click');
	$(".show-info").unbind('click');
	$(".close").unbind('click');
	$(".back-navigation").unbind('click');
	$(".todo-navigation").unbind('click');
	$(".browse-button").unbind('click');
	$("#cancel-button").unbind('click');
	$("#add-button").unbind('click');
	$("#add-form-container").unbind('click');
	$(".todolistnav").unbind('click');
	$(".todolistnav li").unbind('click');
	$(".add-sub-item").unbind('click');
	$(".css-checkbox").unbind('click');
	$(".css-checkbox").unbind('change');
	$(".add-item").unbind('click');
}

function scrollToElement(selector, time, verticalOffset) {
	time = typeof (time) != 'undefined' ? time : 200;
	verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : 0;
	element = $(selector);
	offset = element.offset();
	offsetTop = offset + verticalOffset;
	$('html, body').animate({
		scrollTop : offsetTop
	}, time);
}

function badLogin() {
	$("#login-menu").css("margin-right", "0");
	$("#invalid-login").show();
	$("#username").focus();
}

function closeNavs(text) {
	closeSubNavs($('#rep-nav'));
	if (text != 'repo-button') {
		$('#repo-nav').animate({
			marginLeft : '-100%'
		});
	}
	if (text != 'todo-button') {
		$('#todo-nav').animate({
			marginLeft : '-100%'
		});
		$(".todolistnav").animate({
			marginLeft : '-101%'
		});
	}
	if (text != 'log-button') {
		$('#log-nav').animate({
			marginRight : '-100%'
		});
	}
	if (text != 'settings-button') {
		$('#settings-nav').animate({
			marginRight : '-100%'
		});
	}
}

function closeSubNavs(element) {
	$('.repo-sub').each(function() {
		if (element.attr("class") != $(this).attr("class"))
			$(this).animate({
				marginLeft : '-480px'
			});
	})
}

function checkListNav() {
	var isOpen = false;
	$(".todolistnav").each(function() {
		if ($(this).css('marginLeft') == "0px") {
			isOpen = true;
		}
	})
	return isOpen;
}

function resizeNavs() {
	var height = $(window).height() - 50;
	if ($('#log-button').attr('id') == null || $(window).width() > 480)
		height += 40;
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

function findOpenNav() {
	var listId = '';
	$(".todolistnav").each(function() {
		if ($(this).css('marginLeft') == "0px") {
			listId = $(this).attr("id");
		}
	})
	return listId;
}

function removeTodoForm() {
	var addForm = $("#add-form-container");
	addForm.animate({
		marginLeft : "-100%"
	});
	//clear out form
	$("#todo-name").val('');
	$("#todo-desc").val('');
	$("#todo-date").val('');
}

function getTodoForm(todoId) {
	var addForm = $("#add-form-container");
	var width = $(window).width();
	var slideOut = 0;
	var height = $(window).height() - 50;
	if (width > 768) {
		slideOut = 305;
		width = width - slideOut;
	}
	addForm.animate({
		marginLeft : "0",
		left : slideOut,
		width : width,
		height : height
	});
	$("#todo-status").val(todoId);
	$("#todo-name").focus();
}
