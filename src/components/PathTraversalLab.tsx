'use client';

import React, { useState, useEffect } from 'react';

const VIRTUAL_FS: Record<string, string> = {
  '/var/www/html/assets/avatar.png': '[BINARY DATA] logic_image_010101',
  '/var/www/html/index.php': '<?php echo "Trang chủ hệ thống"; ?>',
  '/var/www/html/config.php': '<?php \n define("DB_PASS", "SUPER_SECRET_@123"); \n ?>',
  '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
};

const BASE_DIR = '/var/www/html/assets/';

const LEVEL_CONFIGS: Record<number, { desc: string; hints: string[] }> = {
  1: {
    desc: 'Cấp độ 1: Server không có bộ lọc. Pentester có thể dùng trực tiếp ../ để leo rank.',
    hints: ['../../../etc/passwd', 'config.php'],
  },
  2: {
    desc: "Cấp độ 2: Server xóa chuỗi '../' một cách ngây thơ. Thử dùng kỹ thuật 'Nested Path' (....//).",
    hints: ['....//....//....//etc/passwd', '....//config.php'],
  },
  3: {
    desc: 'Cấp độ 3: Server chặn các ký tự chấm và gạch chéo thông thường. Thử sử dụng URL Encoding hoặc Double Encoding.',
    hints: ['%2e%2e%2f%2e%2e%2fetc%2fpasswd', '%252e%252e%252fetc%252fpasswd'],
  },
  4: {
    desc: 'Cấp độ 4: Server kiểm tra xem file có kết thúc bằng .png không. Thử kỹ thuật Null Byte (%00) hoặc Path Truncation.',
    hints: ['../../../etc/passwd%00.png', 'config.php%00.png'],
  },
  5: {
    desc: 'Cấp độ 5: Server sử dụng realpath() và kiểm tra prefix của thư mục gốc. Rất khó để bypass.',
    hints: ['Không có gợi ý - Đây là môi trường an toàn'],
  },
};

function resolvePath(path: string) {
  const parts = path.split('/');
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '..') {
      if (stack.length > 0) stack.pop();
    } else if (part !== '.' && part !== '') {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

export default function PathTraversalLab() {
  const [level, setLevel] = useState(1);
  const [payload, setPayload] = useState('avatar.png');
  const [output, setOutput] = useState('Chờ đợi request...');
  const [statusCode, setStatusCode] = useState({ code: '200 OK', color: 'text-green-500' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputColor, setOutputColor] = useState('text-gray-400');

  const handleLevelChange = (lvl: number) => {
    setLevel(lvl);
    setPayload('avatar.png');
    setOutput('Chờ đợi request...');
    setStatusCode({ code: '200 OK', color: 'text-green-500' });
    setOutputColor('text-gray-400');
  };

  const simulateRequest = () => {
    setIsProcessing(true);
    setOutput('Đang xử lý request...');
    setOutputColor('text-gray-500');

    setTimeout(() => {
      let finalPath = '';
      let isBlocked = false;

      switch (level) {
        case 1:
          finalPath = resolvePath(BASE_DIR + payload);
          break;

        case 2: {
          const filtered = payload.replace(/\.\.\//g, '');
          finalPath = resolvePath(BASE_DIR + filtered);
          break;
        }

        case 3:
          if (payload.includes('../')) {
            isBlocked = true;
          } else {
            let decoded = decodeURIComponent(payload);
            try {
              decoded = decodeURIComponent(decoded);
            } catch (e) {
              // Ignore
            }
            finalPath = resolvePath(BASE_DIR + decoded);
          }
          break;

        case 4:
          if (!payload.toLowerCase().endsWith('.png')) {
            isBlocked = true;
            setOutput('Error 403: Forbidden - Server chỉ cho phép file .png');
          } else {
            let cleanPayload = payload.split('\0')[0];
            if (payload.includes('%00')) cleanPayload = payload.split('%00')[0];
            finalPath = resolvePath(BASE_DIR + cleanPayload);
          }
          break;

        case 5: {
          const securePath = resolvePath(BASE_DIR + payload);
          if (!securePath.startsWith(BASE_DIR)) {
            isBlocked = true;
            setOutput('Access Denied: Path traversal detected and blocked by Secure Validator.');
          } else {
            finalPath = securePath;
          }
          break;
        }
      }

      if (isBlocked && level !== 4) {
        setStatusCode({ code: '403 Forbidden', color: 'text-red-500' });
        if (!output.includes('Error')) {
          setOutput('Hành động bị chặn bởi Firewall/Filter của Server.');
        }
        setOutputColor('text-red-400');
      } else if (VIRTUAL_FS[finalPath]) {
        setStatusCode({ code: '200 OK', color: 'text-green-500' });
        setOutput(VIRTUAL_FS[finalPath]);
        setOutputColor('text-green-400');
      } else {
        setStatusCode({ code: '404 Not Found', color: 'text-yellow-500' });
        setOutput('File không tồn tại: ' + (finalPath || 'Unknown Path'));
        setOutputColor('text-yellow-400');
      }

      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="bg-[#181825] p-6 rounded-xl border border-zinc-800 my-8">
      <div className="flex items-center mb-6">
        <h3 className="text-xl font-bold text-cyan-400 m-0">Lab Thực hành: Virtual Vulnerable Server</h3>
      </div>

      <div className="mb-6">
        <p className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">Chọn cấp độ bảo mật của Server:</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition border ${
                level === lvl
                  ? lvl === 5
                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                    : 'bg-cyan-600 outline-none text-white border-cyan-500'
                  : 'bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              Lv {lvl}: {lvl === 1 ? 'No Filter' : lvl === 2 ? 'Basic Strip' : lvl === 3 ? 'URL Encoding' : lvl === 4 ? 'Extension Check' : 'Secure'}
            </button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-cyan-950/30 text-cyan-300 rounded text-sm border border-cyan-900/50">
          {LEVEL_CONFIGS[level].desc}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase">URL Parameter: ?file=</label>
          <div className="flex">
            <input
              type="text"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="flex-1 p-3 bg-[#11111b] border border-zinc-700 rounded-l text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500"
              onKeyDown={(e) => e.key === 'Enter' && simulateRequest()}
            />
            <button
              onClick={simulateRequest}
              disabled={isProcessing}
              className="bg-cyan-600 text-white px-4 md:px-6 py-3 rounded-r hover:bg-cyan-500 transition font-bold uppercase text-xs disabled:opacity-50"
            >
              Gửi Req
            </button>
          </div>

          <div className="mt-4 p-4 bg-[#11111b] rounded border border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-500 mb-2 uppercase">Gợi ý Payload cho Level này:</h4>
            <div className="flex flex-wrap gap-2">
              {LEVEL_CONFIGS[level].hints.map((hint, idx) => (
                <button
                  key={idx}
                  onClick={() => setPayload(hint)}
                  className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-cyan-300 hover:border-cyan-700 px-2 py-1 rounded font-mono transition"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-64 bg-[#11111b] p-4 rounded border border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-500 mb-2 uppercase">File System</h4>
          <ul className="text-xs font-mono text-zinc-400 space-y-1">
            <li className="text-yellow-600">/</li>
            <li className="ml-3 text-yellow-600">etc/</li>
            <li className="ml-6 text-red-400">passwd</li>
            <li className="ml-3 text-yellow-600">var/www/html/</li>
            <li className="ml-9 text-green-400">index.php</li>
            <li className="ml-9 text-green-400">config.php</li>
            <li className="ml-9 text-blue-500">assets/</li>
            <li className="ml-12 text-blue-300">avatar.png</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#11111b] border border-zinc-800 rounded-lg p-5 mt-4 relative shadow-inner">
        <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-2">
          <span className="text-xs text-zinc-500">HTTP Response</span>
          <span className={`text-xs font-bold ${statusCode.color}`}>{statusCode.code}</span>
        </div>
        <pre className={`text-sm whitespace-pre-wrap font-mono min-h-[120px] ${outputColor}`}>
          {output}
        </pre>
      </div>
    </div>
  );
}
