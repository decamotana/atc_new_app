<?php

?>

<style type="text/css">
	<!--
	@page {
		padding-right: 10px !important;
	}


	.bold-text {
		font-family: "Times", serif;
		font-size: 11px;
	}


	span.cls_003 {
		font-family: "Times", serif;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-weight: normal;
		font-style: normal;
		text-decoration: none;
		letter-spacing: 0.6px;
	}

	div.cls_003 {
		font-family: "Times", serif;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-weight: normal;
		font-style: normal;
		text-decoration: none;
		letter-spacing: 0.6px;
	}

	span.cls_004 {
		font-family: "Times", serif;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-style: normal;
		text-decoration: none;
	}

	div.cls_004 {
		font-family: "Times", serif;
		font-weight: normal;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-style: normal;
		text-decoration: none;
	}

	div.spacing {

		display: flex !important;
		width: 94% !important;
		text-align: justify;
	}

	span.cls_006 {
		font-family: Arial, serif;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-weight: normal;
		font-style: normal;
		text-decoration: none;
	}

	div.cls_006 {
		font-family: Arial, serif;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-weight: normal;
		font-style: normal;
		text-decoration: none;
	}

	span.cls_007 {
		font-family: Arial, serif;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-weight: normal;
		font-style: normal;
		text-decoration: none;
	}

	div.cls_007 {
		font-family: Arial, serif;
		font-size: 11px;
		color: rgb(0, 0, 0);
		font-weight: normal;
		font-style: normal;
		text-decoration: none;
	}

	span.cls_002 {
		font-family: "Times", serif;
		font-size: 9px;
		color: rgb(32, 29, 30);
		font-weight: normal;
		font-style: italic;
		text-decoration: none;
	}

	div.cls_002 {
		font-family: "Times", serif;
		font-size: 9px;
		color: rgb(32, 29, 30);
		font-weight: normal;
		font-style: italic;
		text-decoration: none;
	}

	div.term_list {

		margin-bottom: 3px;

	}

	.span_title {
		padding-left: 10px;
	}
	-->
</style>


<page orientation="portrait" format="170x210" style="font-size: 1.0em;">
	<img src="assets/pdf_template_images/mnda1.jpg" style="
            width: 600px;
            height: 740px;
            background-repeat: no-repeat;
            background-size: cover;
            left: 0px;
            top: 0px;
            position: absolute;
            overflow: hidden;
        " alt="BG image" />
</page>

<page orientation="portrait" format="170x210" style="font-size: 1.0em;">
	<img src="assets/pdf_template_images/mnda2.jpg" style="
            width: 600px;
            height: 740px;
            background-repeat: no-repeat;
            background-size: cover;
            left: 0px;
            top: 0px;
            position: absolute;
            overflow: hidden;
        " alt="BG image" />
</page>

<page orientation="portrait" format="170x210" style="font-size: 1.0em;">
	<img src="assets/pdf_template_images/mnda3.jpg" style="
            width: 600px;
            height: 740px;
            background-repeat: no-repeat;
            background-size: cover;
            left: 0px;
            top: 0px;
            position: absolute;
            overflow: hidden;
        " alt="BG image" />
</page>

<page orientation="portrait" format="170x210" style="font-size: 1.0em;">
	<img src="assets/pdf_template_images/mnda4.jpg" style="
            width: 600px;
            height: 740px;
            background-repeat: no-repeat;
            background-size: cover;
            left: 0px;
            top: 0px;
            position: absolute;
            overflow: hidden;
        " alt="BG image" />
</page>

<page orientation="portrait" format="170x210" style="font-size: 1.0em;">
	<img src="assets/pdf_template_images/mnda5.jpg" style="
            width: 600px;
            height: 740px;
            background-repeat: no-repeat;
            background-size: cover;
            left: 0px;
            top: 0px;
            position: absolute;
            overflow: hidden;
        " alt="BG image" />
</page>

<page orientation="portrait" format="170x210" style="font-size: 1.0em;">
	<img src="assets/pdf_template_images/mnda6.jpg" style="
            width: 600px;
            height: 740px;
            background-repeat: no-repeat;
            background-size: cover;
            left: 0px;
            top: 0px;
            position: absolute;
            overflow: hidden;
        " alt="BG image" />
</page>

<page orientation="portrait" format="170x210" style="font-size: 1.0em;">

	<img src="assets/pdf_template_images/mnda7.jpg" style="
            width: 600px;
            height: 740px;
            background-repeat: no-repeat;
            background-size: cover;
            left: 0px;
            top: 0px;
            position: absolute;
            overflow: hidden;
        " alt="BG image" />

	<div style="position: absolute; right: 200px; top: 227px; max-width: 190px; max-height: 50px;">
		<?php if ($date) { ?>
		<span class="bold-text">
			<?php echo $date; ?>
		</span>
		<?php } ?>
	</div>
	<div style="position: absolute; left: 145px; top: 323px; max-width: 190px; max-height: 50px;">
		<?php if ($mainAddress) { ?>
		<span class="bold-text">
			<?php echo $mainAddress; ?>
		</span>
		<?php } ?>
	</div>
	<div style="position: absolute; left: 145px; top: 370px; max-width: 190px; max-height: 50px;">
		<?php if ($cityStateAndZip) { ?>
		<span class="bold-text">
			<?php echo $cityStateAndZip; ?>
		</span>
		<?php } ?>
	</div>
	<div style="position: absolute; right: 160px; top: 323px; max-width: 190px; max-height: 50px;">
		<?php if ($name) { ?>
		<span class="bold-text">
			<?php echo $name; ?>
		</span>
		<?php } ?>
	</div>
	<div style="position: absolute; right: 98px; top: 355px; max-width: 140px; max-height: 130px; ">
		<?php if ($signature) { ?>
		<span class="bold-text">
			<img style="width: 100%; " src="<?php echo $signature; ?>" />
		</span>
		<?php } ?>
	</div>

	<div style="position: absolute; right: 200px; top: 417px; max-width: 190px; max-height: 50px;">
		<?php if ($date) { ?>
		<span class="bold-text">
			<?php echo $date; ?>
		</span>
		<?php } ?>
	</div>
</page>