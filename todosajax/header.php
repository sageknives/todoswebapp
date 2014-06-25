<!DOCTYPE html>
<html lang="en">
<head>
<link rel="icon" type="image/x-icon" href="IR_favicon.ico" />
<meta charset="utf-8" />
<title><?php echo $title ?></title>
<meta name="description" content="Scrums" />
<meta name="author" content="sage" />
<meta name="viewport" content="width=device-width; initial-scale=1.0" />
<meta name="viewport" content="initial-scale=1.0" />
<!-- Replace favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
<!--<link rel="shortcut icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />-->
<!--Style sheets-->
<link type="text/css" rel="stylesheet" href="css/styles.css"/>
<link type="text/css" rel="stylesheet" href="css/onepcssgrid.css"/>
<link type="text/css" rel="stylesheet" href="css/nav.css"/>
<link href="css/dark-hive/jquery-ui-1.10.4.custom.min.css" rel="stylesheet">
<!--js files-->
<script src="js/jquery-1.11.0.min.js"></script>
<script src="js/jquery-ui-1.10.4.custom.min.js"></script>
<script src="js/sjcl.js"></script>
<script src="js/Model.js"></script>
<script src="js/draw.js"></script>
<script src="js/controller.js"></script>
<script src="js/commons.js"></script>
<script src="js/nav.js"></script>
<script>

$(function() {
if(<?php echo $noRequest; ?>== 1) 
{
	updatePage();
}
else if(<?php echo $noRequest; ?>== 2)
{
	updatePage();
	badLogin();
}
});
</script>
</head>
<body>
<?php 
require_once '0700_inc/conn_inc.php';
require_once( '0700_inc/common_inc.php');
require_once( '0700_inc/class.model_inc.php');
include 'nav.php' ;
?>
