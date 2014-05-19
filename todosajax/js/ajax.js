var xmlhttp;
var content;
var d = new Date();

if(window.XMLHttpRequest)
{
	xmlhttp = new XMLHttpRequest();
}
else
{
	xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
}

function loadContent(course, section, action){
	if(window.XMLHttpRequest)
	{
		xmlhttp = new XMLHttpRequest();
	}
	else
	{
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.onreadystatechange=function()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			content = xmlhttp.responseText;
			$('#content').html(content);
			$('#loader').hide();
			$('#content').slideDown();
		}
		else if(xmlhttp.status == 404)
		{
			$('#content').html('Sorry, Content Not Found');
		}
		else
		{
			$('#loader').show();
		}
	}
	xmlhttp.open('POST','../redirect.php?course=' + course + '&'+'subsection=' + section + '&t=' + d.getTime(), action);
	xmlhttp.send();
};