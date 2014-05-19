<?php
header('Content-type: text/html; charset=utf-8');
//page variables
$title = 'Home';
$loggedIn = false;
$noRequest = 0;
$treeId = null;
ini_set('session.gc_maxlifetime',10);
session_start();

if(isset($_SESSION['status']))
{
	if($_SESSION['status'] == 'true') 
	{
		$loggedIn = true;
		$treeId = $_SESSION['treeid'] ;
		$userName = $_SESSION['name'];
		
	}
	else $noRequest = 1 + $noRequest;
}
if (isset($_POST['status'])){
	if($_POST['status'] == 'login') {
		if(isset($_POST['username']) && isset($_POST['password']))
		{
			require_once '0700_inc/common_inc.php';
			require_once '0700_inc/conn_inc.php';
			$id = checkCred($_POST['username'],$_POST['password']);
			if($id != null)
			{
				$_SESSION['status'] = 'true';
				$_SESSION['treeid'] = $id;
				$_SESSION['name'] = $_POST['username'];
			}
			else{
				$_SESSION['status'] = 'false';
			}
		}
		
	}
	else{
		session_destroy();
	}
	header('Location: index.php');
}
else{
	$noRequest = 1 + $noRequest;
}
	

//includes
include 'header.php';
?>
<div id="spinner" class="hidden"><img src="images/spinner6.gif"></div>
<div id="content" class="onepcssgrid-1200">
</div>
<script>
	<?php 
	
		echo 'alert("Session"' . $_SESSION['status'] .');'; 
		?>
</script>

<footer id="main-footer"></footer>
