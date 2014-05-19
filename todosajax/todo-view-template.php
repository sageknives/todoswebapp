<?php
$checked = '';
if($view != null && $view->isCompleted()) $checked = "checked";
?>
<div id="view-'<?php echo $view->getId()?>'">
<h2 class="title"><?php echo $view->getTitle()?></h2>
<section class="col12 list-block background">
	<div class="li-obj">
		<?php
			$images = $view->getImages();
			if(count($images) > 0)
			{
				echo '
				<div class="li-obj-l col7">
					<img class="main-img" src="'.$images[0].'" />
				</div>
				';
			}
		?>
		
		<div class="li-obj-r col5">
			<header>
				<?php
				if(count($images) > 1)
				{
					for ($i=0; $i < count($images); $i++) { 
						echo '<img src="'.$images[$i].'" />';
					}
					echo '<br class="clear"/>';
				}
				?>
				<p><?php echo $view->getDesc(); ?></p>
			</header>
			
		</div>
		<footer class="col5">
			<div class="obj-info col8">
				<p>5 of 7</p>
				<p>Complete</p>
			</div>
			<div class="obj-action col3">
				<label><input type="checkbox" <?php echo $checked ?>>Mark As Done</label>
				<p class="show-info" href="comments" id="0">Comments/WorkLog</p>
			</div>
		</footer>
		<br class="clear"/>
	</div>
</section>
<div id="count0">
<?php 
	include 'comments.php';
?>
</div>
</div>