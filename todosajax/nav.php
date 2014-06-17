<?php
$mobile = '';
if($loggedIn) $mobile = ' class="mobile"';
echo '
<header id="main-header">
	<nav id="top-nav"'. $mobile .'>
		<a id="home-button" href="#home" class="top-nav-link"><img id="home-img" href="home" class="ajax-request" src="images/home.png"></a>';
if($loggedIn)
{
	$homedir = new Node(1,"home",0,0,"00-00-0000","00-00-0000");
	for ($i=0; $i < count($treeId); $i++) { 
		$homedir->addChild(createSQL($treeId[$i],8));
	}
	echo '
		<a id="todo-button" class="top-nav-link">Todo</a>';
	//createULS($homedir,"top-element",true);
	echo '
	<div id="add-form-container">
		<h3>Add Todo</h3>
		<form action="index.php" method="POST" id="add-form">
			<label>Title:<input type="text" id="todo-name" name="todoname" value=""/></label>
			<label>Description:<textarea rows="10" type="text" id="todo-desc" name="tododesc" value=""/></textarea></label>
			<label>Due Date:<input type="text" id="todo-date" name="tododate" value=""/></label>
			<br class="clear"/>
			<p>Add Image:</p><button id="browse-image1" class="browse-button" name="browse" value="browse">Browse</button>
			<p>Add Image:</p><button id="browse-image2" class="browse-button" name="browse" value="browse">Browse</button>
			<p>Add Image:</p><button id="browse-image3" class="browse-button" name="browse" value="browse">Browse</button>
			<input type="hidden" id="todo-status" name="status" value="add">
			<br class="clear"/>
			<button id="cancel-button" name="submit" value="submit">Cancel</button>
			<button id="add-button" name="submit" value="submit">Add</button>
			<p id="invalid-todo">invalid todo</p>
			<br class="clear"/>
		</form>
	</div>
	';
		/*<ul id="todo-nav" class="top-nav-item todolist text-nav">
			<li class="li-title">Home</li>
			<li href="todoview" class="ajax-request"><a href="#todoview-setupdb">Setup up DB</a></li>
			<li href="todolist" class="ajax-request"><a href="#todolist-inputec2install">Input EC2 Install</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-writephp">Write Php</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
			<li href="todoview" class="ajax-request"><a href="#todoview-test">Test</a></li>
		</ul>
		';*/
}
echo '
		<a id="repo-button" class="top-nav-link">Repo</a>
		<ul id="repo-nav" class="top-nav-item">
			<li class="image-li">
				<a href="#sage"></a><img class="repo-icon" src="images/sage.png"></a>
				<ul class="repo-sub sage text-nav">
					<li class="li-title"><a href="index.php">Sage</a></li>
					<li href="repolist" class="ajax-request"><a href="#test">Test</a></li>
				</ul>
			</li>
			<li class="image-li">
				<a href="#android"></a><img class="repo-icon" src="images/android.png"></a>
				<ul class="repo-sub android text-nav">
					<li class="li-title"><a href="">Android</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-1-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-2-fragments">Fragments</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-3-activities">Activities</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-4-sqllite">sqllite</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-5-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-6-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-7-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-8-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-9-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-10-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-11-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-12-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-13-services">Services</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-14-services">Services</a></li>
				</ul>
			</li>
			<li class="image-li">
				<a href="#amazon"></a><img class="repo-icon" src="images/amazon.png"></a>
				<ul class="repo-sub amazon text-nav">
					<li class="li-title"><a href="">Amazon</a></li>
					<li href="repolist" class="ajax-request"><a href="#repolist-15-amazonec2setup">EC2 Install</a></li>
				</ul>
			</li>
			<li class="image-li">
				<a href="#wanderful"></a><img class="repo-icon" src="images/wanderful.png" ></a>
				<ul class="repo-sub wanderful text-nav">
					<li class="li-title"><a href="">Wanderful</a></li>
				</ul>
			</li>
			<li class="image-li">
				<a href="#php"></a><img class="repo-icon" src="images/php.png"></a>
				<ul class="repo-sub php text-nav">
					<li class="li-title"><a href="">PHP</a></li>
				</ul>
			</li>
		</ul>
	</nav>
	<nav id="util-nav"'. $mobile .'>
	';
if($loggedIn)
{
	echo '
		<a id="log-button" class="top-nav-link"> WorkLog</a>
		<ul id="log-nav" class="top-nav-item text-nav">
				<li class="li-title">Work Log</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff0900">stuff done at 9am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1000">stuff done at 10am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1020">stuff done at 1020am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff0900">stuff done at 9am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1000">stuff done at 10am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1020">stuff done at 1020am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff0900">stuff done at 9am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1000">stuff done at 10am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1020">stuff done at 1020am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff0900">stuff done at 9am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1000">stuff done at 10am</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuff1020">stuff done at 1020am</li>
				<li class="li-title">Notifications</li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuffbob">bob said at 9am</a></li>
				<li href="todoview" class="ajax-request"><a href="#todoview-stuffgeorge">george said at 10am</a></li>
		</ul>
		<a id="settings-button" class="top-nav-link"><img src="images/settings-icon.png"></a>
		<ul id="settings-nav" class="top-nav-item text-nav">
			<li class="li-title">'.$userName.'\'s Settings</li>
			<li class="ajax-request" href="settings"><a href="#settings">Change Profile</a></li>
			<li class="ajax-request" href="settings"><a href="#settings">Settings</a></li>
			<li>
				<form action="index.php" method="POST" id="logout-form"><input type="hidden" id="status" name="status" value="logout"/></form>
				<a id="logout-button" href="#logout-button">LogOut</a>
			</li>
		</ul>
	';
}
else 
{
	echo '
	<a id="login-drop" class="top-login-link">Login</a>
	<div id="login-menu">
		<form action="index.php" method="POST" id="login-form">
			<label>User Name:<input type="text" id="username" name="username" value=""/></label>
			<label>Password:<input type="password" id="password" name="password" value=""/></label>
			<input type="hidden" id="status" name="status" value="login">
			<button id="login-button" name="submit" value="submit">Log In</button>
			<p id="invalid-login">invalid login</p>
		</form>
	</div>
	';
}
echo '
	</nav>
</header>
';
?>
