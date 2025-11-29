// 简单的内存数据库存储GPS数据
let gpsData = [];

export default async function handler(req, res) {
  // 设置CORS头，允许所有域名访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // 处理预检请求
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // 接收GPS数据
      const { lat, lng, alt, speed, time } = req.body;
      
      console.log('收到GPS数据:', { lat, lng, alt, speed, time });
      
      // 添加到内存数据库
      const newData = {
        id: Date.now(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        alt: alt ? parseFloat(alt) : 0,
        speed: speed ? parseFloat(speed) : 0,
        time: time || new Date().toISOString()
      };
      
      gpsData.push(newData);
      
      // 只保留最近100条数据，避免内存过大
      if (gpsData.length > 100) {
        gpsData = gpsData.slice(-100);
      }
      
      res.status(200).json({ 
        status: 'success',
        message: 'GPS数据接收成功',
        id: newData.id
      });
      
    } catch (error) {
      console.error('处理GPS数据错误:', error);
      res.status(500).json({ 
        status: 'error',
        message: '数据处理失败: ' + error.message 
      });
    }
    return;
  }

  if (req.method === 'GET') {
    // 返回所有GPS数据
    res.status(200).json({
      status: 'success',
      data: gpsData,
      count: gpsData.length
    });
    return;
  }

  // 其他HTTP方法
  res.status(405).json({ 
    status: 'error',
    message: '方法不允许' 
  });
}