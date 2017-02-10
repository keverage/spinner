<?php
    $out = array();

    for ($i = 0; $i < 10; $i++) {
        $out[] = file_get_contents('http://assets.barcroftmedia.com.s3-website-eu-west-1.amazonaws.com/assets/images/recent-images-11.jpg');
    }

    echo json_encode($out);
?>