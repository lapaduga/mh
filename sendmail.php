<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->Charset = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

// От кого письмо
$mail->setFrom('deniskotov29042015@gmail.com', 'Денис Котов');
// Кому отправить
$mail->addAddress('deniskotov29042015@gmail.com');
// Тема письма 
$mail->Subject = 'New Letter!';

// Тело письма
$body = '<h1>Новая заявка на обучение</h1>';

if (trim(!empty($_POST['block-name']))) {
	$body .= '<p><strong>ФИО:</strong> ' . $_POST['block-name'] . '</p>';
}
if (trim(!empty($_POST['block-email']))) {
	$body .= '<p><strong>E-mail:</strong> ' . $_POST['block-email'] . '</p>';
}
if (trim(!empty($_POST['block-phone']))) {
	$body .= '<p><strong>Телефон:</strong> ' . $_POST['block-phone'] . '</p>';
}
if (trim(!empty($_POST['block-message']))) {
	$body .= '<p><strong>Сообщение:</strong> ' . $_POST['block-message'] . '</p>';
}

$mail->Body = $body;

// Отправка
if (!$mail->send()) {
	$message = 'Ошибка';
} else {
	$message = 'Данные отправлены!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
