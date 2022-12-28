#!/usr/bin/php -q
<?php
	$fd = fopen("php://stdin", "r");
	while (!feof($fd)) {
		$email_content .= fread($fd, 1024);
	}
    fclose($fd); 

    \Log::inf($email_content);
?>
    
