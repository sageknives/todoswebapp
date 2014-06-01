<?php
$loggedIn = false;
session_start();
if (isset($_SESSION['status'])) {
	if ($_SESSION['status'] == 'true')
		$loggedIn = true;
}
if (isset($_REQUEST['jsrequest'])) {
	include '0700_inc/common_inc.php';
	include '0700_inc/conn_inc.php';
	include '0700_inc/class.model_inc.php';

	if ($_REQUEST['jsrequest'] == "getall") {
		$treeId = $_SESSION['treeid'];
		$homedir = new Node("1","home","0","0");
		for ($i = 0; $i < count($treeId); $i++) {
			//echo $treeId[$i];
			$homedir->addChild(createSQL($treeId[$i], 8));
		}
		header('Content-Type: application/json');
		$encodedModel = json_encode($homedir->toArray());
		echo $encodedModel;
	}
} else
	echo 'nope';
?>