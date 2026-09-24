<?php
session_start(); require_once __DIR__.'/config.php'; header('Content-Type: application/json; charset=utf-8');
if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'message'=>'Method not allowed']);exit;}
if(!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET){http_response_code(500);echo json_encode(['success'=>false,'message'=>'Payment gateway is not configured yet.']);exit;}
$body=json_decode(file_get_contents('php://input'),true) ?: [];
$image=$body['image']??''; $name=trim($body['name']??'');
if(!$image || !preg_match('/^data:image\/(jpeg|png|webp);base64,/',$image)){http_response_code(400);echo json_encode(['success'=>false,'message'=>'Valid palm image is required.']);exit;}
if(strlen($image)>14*1024*1024){http_response_code(400);echo json_encode(['success'=>false,'message'=>'Image is too large.']);exit;}
$_SESSION['palm_image']=$image; $_SESSION['customer_name']=$name;
$receipt='palm_'.bin2hex(random_bytes(6));
$payload=json_encode(['amount'=>PALM_PRICE,'currency'=>'INR','receipt'=>$receipt,'notes'=>['service'=>'Palm Reading','name'=>$name]],JSON_UNESCAPED_UNICODE);
$ch=curl_init('https://api.razorpay.com/v1/orders');curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>$payload,CURLOPT_HTTPHEADER=>['Content-Type: application/json'],CURLOPT_USERPWD=>RAZORPAY_KEY_ID.':'.RAZORPAY_KEY_SECRET,CURLOPT_TIMEOUT=>20]);$out=curl_exec($ch);$http=curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);$order=json_decode($out,true);
if($http<200||$http>=300||empty($order['id'])){http_response_code(500);echo json_encode(['success'=>false,'message'=>'Payment order could not be created.']);exit;}
$_SESSION['order_id']=$order['id'];
echo json_encode(['success'=>true,'key'=>RAZORPAY_KEY_ID,'order_id'=>$order['id'],'amount'=>PALM_PRICE,'currency'=>'INR']);
?>
