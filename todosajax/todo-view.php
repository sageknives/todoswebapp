<?php
include '0700_inc/common_inc.php';
include '0700_inc/conn_inc.php';
include '0700_inc/class.model_inc.php';
$view = getViewInfo($theTitle);

include 'todo-view-template.php';
?>