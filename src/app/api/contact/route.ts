import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, tools, message } = body;

    // 检查环境变量
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const receiveEmail = process.env.RECEIVE_EMAIL;

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { success: false, message: '服务器配置错误' },
        { status: 500 }
      );
    }

    // 创建邮件发送器
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // 构建邮件内容
    const toolsList = tools.join('、');
    const mailOptions = {
      from: `"AI工具安装服务" <${emailUser}>`,
      to: receiveEmail || emailUser,
      subject: `🎉 新客户咨询 - ${name}需要安装${toolsList}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
            .info-card { background: #f9fafb; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .info-item { margin: 12px 0; }
            .label { font-weight: 600; color: #6b7280; font-size: 14px; }
            .value { color: #111; font-size: 16px; margin-top: 4px; }
            .tool-tag { display: inline-block; background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin: 2px; }
            .message-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 15px; }
            .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
            .badge { display: inline-block; background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 收到新的客户咨询</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">AI工具安装服务</p>
            </div>
            <div class="content">
              <div class="info-card">
                <div class="info-item">
                  <div class="label">👤 客户称呼</div>
                  <div class="value">${name}</div>
                </div>
                <div class="info-item">
                  <div class="label">📱 联系方式</div>
                  <div class="value">${contact}</div>
                </div>
                <div class="info-item">
                  <div class="label">🛠️ 需要安装的工具</div>
                  <div class="value">${tools.map((tool: string) => `<span class="tool-tag">${tool}</span>`).join('')}</div>
                </div>
              </div>

              ${message ? `
              <div class="message-box">
                <div class="label">💬 其他说明</div>
                <div class="value" style="margin-top: 8px;">${message}</div>
              </div>
              ` : ''}

              <div style="text-align: center; margin-top: 25px;">
                <span class="badge">请及时联系客户</span>
              </div>
            </div>
            <div class="footer">
              <p>此邮件由AI工具安装服务网站自动发送</p>
              <p>提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // 异步发送邮件，不阻塞响应
    transporter.sendMail(mailOptions).catch(err => {
      console.error('邮件发送失败:', err);
    });

    return NextResponse.json({ success: true, message: '提交成功' });
  } catch (error: any) {
    console.error('处理失败:', error.message || error);
    return NextResponse.json(
      { success: false, message: '提交失败' },
      { status: 500 }
    );
  }
}
