<?php
$content ='';
$content .= '
<section class="col4 home-block background">
	<h2 class="title">Get the App</h2>
	<a class="img-link" href="#androidapp"><img src="images/placeholder.png">Download For Android</a>
	<a class="img-link" href="#appleapp"><img src="images/placeholder.png">Download For iPhone</a>
	<p>The todo scrum app is to help you better organize your
		individual tasks and work with groups more efficiently.
		You also get the ability to add prewritten tutorials to your
		todo lists and use them to help you finish much needed
		difficult or confusing tasks you don’t yet know how to do.
	</p>
</section>
<section class="col4 home-block background">
	<h2 class="title">Top Tutorials</h2>
	<ul>
		<li href="repolist" class="ajax-request"><a href="#repolist-amazonec2setup">Amazon EC2 Setup</a></li>
		<li href="repolist" class="ajax-request"><a href="#repolist-introtowebservices">Intro to Webservices</a></li>
		<li href="repolist" class="ajax-request"><a href="#repolist-heirarchydatabasestructures">Heirarchy Database Structures</a></li>
		<li href="repolist" class="ajax-request"><a href="#repolist-introtomvc">Intro to MVC</a></li>
		<li href="repolist" class="ajax-request"><a href="#repolist-introtoandroidfragments">Intro to Android Fragments</a></li>
		<li href="repolist" class="ajax-request"><a href="#repolist-introtoandroidactivitylifecycles">Intro to Android Activity Lifecycles</a></li>
		<li href="repolist" class="ajax-request"><a href="#repolist-introtoandroiddebugging">Intro to Android Debugging</a></li>
	</ul>
</section>';
if($loggedIn)
{
	$content .= '
<section class="col4 home-block background">
	<h2 class="title">Todo this Week</h2>
	<ul>
		<li href="todoview" class="ajax-request"><a href="#todoview-mowlawn">Mow Lawn</a></li>
		<li href="todolist" class="ajax-request"><a href="#todolist-wireframes">WireFrames</a></li>
		<li href="todoview" class="ajax-request"><a href="#todoview-readjavachapter4">Read Java Chapter 4</a></li>
		<li href="todoview" class="ajax-request"><a href="#todoview-readjavachapter5">Read Java Chapter 5</a></li>
		<li href="todoview" class="ajax-request"><a href="#todoview-readjavachapter6">Read Java Chapter 6</a></li>
		<li href="todoview" class="ajax-request"><a href="#todoview-dopractiveandroidchapter1">do Practive android chapter 1</a></li>
		<li href="todolist" class="ajax-request"><a href="#todolist-introtoandroiddebugging">Intro to Android Debugging</a></li>
	</ul>
</section>';
}
else
{
	$content .= '
<section class="col4 home-block background">
	<h2 class="title">Signup</h2>
	<form>
		<label>First Name <input id="fname" type="text"/></label>
		<label>Last Name <input type="text" /></label>
		<label>Email <input type="text" /></label>
		<label>Gender <input type="text" /></label>
		<label>Date of Birth <input type="text" /></label>
		<label>Password <input type="password" /></label>
		<label>Password <input type="password" /></label>
		<button>Submit</button>
	</form>
</section>';
}
echo $content;
?>