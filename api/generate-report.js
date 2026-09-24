export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({success:false,message:'Method not allowed'});
  const {image,name=''}=req.body||{};
  if(!image) return res.status(400).json({success:false,message:'Palm image is required.'});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({success:false,message:'Report service is not configured.'});
  const prompt=`आप एक अनुभवी पारंपरिक हस्तरेखा पाठक हैं। दी गई हथेली की तस्वीर के आधार पर एक विस्तृत, संतुलित और व्यक्तिगत हस्तरेखा रिपोर्ट हिंदी में लिखें। इसे निश्चित वैज्ञानिक भविष्यवाणी या गारंटी के रूप में प्रस्तुत न करें। केवल वही रेखाएं और पर्वत बताएं जो तस्वीर में पर्याप्त रूप से दिखाई देते हैं; अस्पष्ट चीजों को निश्चित तथ्य की तरह न बनाएं।${name?` ग्राहक का नाम: ${name}.`:''}

रिपोर्ट बहुत स्वाभाविक, मानवीय और विस्तारपूर्ण हो। इन विषयों को अलग-अलग स्पष्ट भागों में कवर करें: समग्र व्यक्तित्व और जीवन की दिशा; जीवन रेखा; मस्तिष्क/मस्तक रेखा; हृदय रेखा; भाग्य रेखा; सूर्य रेखा यदि दिखाई दे; गुरु, शनि, सूर्य, बुध, शुक्र और चंद्र पर्वत जहां दिखाई दें; प्रेम और संबंध; विवाह और वैवाहिक जीवन; धन, बचत और आर्थिक उतार-चढ़ाव; नौकरी और करियर; व्यापार और निर्णय क्षमता; परिवार और जिम्मेदारियां; संपत्ति और बड़े अवसर; तनाव/दुविधा और निर्णय लेने की प्रवृत्ति; प्रमुख रुकावटें; आने वाले 2-3 वर्षों के व्यापक चरण; व्यावहारिक सुझाव।

भाषा सरल, सम्मानजनक और प्राकृतिक हिंदी हो। exact उम्र, exact तारीख, मृत्यु, बीमारी, लॉटरी या निश्चित धन/विवाह की गारंटी न दें। ग्राहक को डराने वाली भाषा न रखें। जहां संकेत मजबूत हों वहां स्पष्ट व्याख्या करें और जहां संकेत कमजोर हों वहां संभावना की भाषा रखें। रिपोर्ट में किसी तकनीकी मॉडल, कंप्यूटर सिस्टम या ऐसी तकनीक का उल्लेख न करें।`;
  const payload={model:'gpt-4.1-mini',input:[{role:'user',content:[{type:'input_text',text:prompt},{type:'input_image',image_url:image}]}],max_output_tokens:5000};
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await r.json();
  let text=data.output_text||'';
  if(!text&&Array.isArray(data.output)) for(const item of data.output) for(const c of (item.content||[])) if(c.text) text+=c.text;
  if(!r.ok||!text) return res.status(500).json({success:false,message:'रिपोर्ट अभी तैयार नहीं हो सकी। कृपया फिर प्रयास करें।'});
  return res.status(200).json({success:true,report:text});
}
