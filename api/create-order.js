export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success:false, message:'Method not allowed' });
  const { image, name='' } = req.body || {};
  if (!image || !/^data:image\/(jpeg|png|webp);base64,/.test(image)) return res.status(400).json({success:false,message:'Valid palm image is required.'});
  if (image.length > 14 * 1024 * 1024) return res.status(400).json({success:false,message:'Image is too large.'});
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return res.status(500).json({success:false,message:'Payment gateway is not configured.'});
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const orderRes = await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},body:JSON.stringify({amount:15100,currency:'INR',receipt:`palm_${Date.now()}`,notes:{service:'Palm Reading',name:String(name).slice(0,80)}})});
  const order = await orderRes.json();
  if (!orderRes.ok || !order.id) return res.status(500).json({success:false,message:'Payment order could not be created.'});
  return res.status(200).json({success:true,key:process.env.RAZORPAY_KEY_ID,order_id:order.id,amount:15100,currency:'INR',image,name});
}
