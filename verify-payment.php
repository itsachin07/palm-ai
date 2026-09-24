<?php
session_start(); require_once __DIR__.'/config.php'; header('Content-Type: application/json; charset=utf-8');
$body=json_decode(file_get_contents('php://input'),true) ?: [];$order=$body['razorpay_order_id']??'';$payment=$body['razorpay_payment_id']??'';$sig=$body['razorpay_signature']??'';
if(!$order||!$payment||!$sig||empty($_SESSION['order_id'])||!hash_equals($_SESSION['order_id'],$order)){http_response_code(400);echo json_encode(['success'=>false,'message'=>'Payment details are invalid.']);exit;}
$expected=hash_hmac('sha256',$order.'|'.$payment,RAZORPAY_KEY_SECRET);if(!hash_equals($expected,$sig)){http_response_code(400);echo json_encode(['success'=>false,'message'=>'Payment verification failed.']);exit;}
$_SESSION['payment_verified']=true;$_SESSION['payment_id']=$payment;echo json_encode(['success'=>true]);
?>
