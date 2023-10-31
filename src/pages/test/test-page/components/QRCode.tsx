import React from 'react';
import { Button, Input, QRCode, Space } from 'antd';

const TestQRCode = () => {
  const [text, setText] = React.useState('http://127.0.0.1:5173/test/test-page');
  const downloadQRCode = () => {
    const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.download = 'QRCode.png';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  return (
    <Space direction="horizontal" align="center">
      <div id="myqrcode">
        <QRCode value={text || '-'} bgColor="#fff" bordered />
        <Input
          placeholder="-"
          maxLength={60}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={downloadQRCode}>
          Download
        </Button>
      </div>
      <QRCode value="https://ant.design/" status="loading" size={200} />
      <QRCode value="https://ant.design/" status="expired" onRefresh={() => console.log('refresh')} />
    </Space>
  );
};

export default TestQRCode;
