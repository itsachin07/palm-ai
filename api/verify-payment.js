import crypto from 'crypto';

export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({success:false,message:'Method not allowed'});
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature,image,name=''}=req.body||{};
  if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature) return res.status(400).json({success:false,message:'Payment details are incomplete.'});
  const expected=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if(!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(razorpay_signature))) return res.status(400).json({success:false,message:'Payment verification failed.'});
  return res.status(200).json({success:true,payment_id:razorpay_payment_id,image,name});
}
