'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileCode,
  Terminal,
  Upload,
  XCircle,
} from 'lucide-react';

type SecurityLevel = 'low' | 'medium' | 'high';
type LogType = 'info' | 'warning' | 'success' | 'error';

type LogEntry = {
  id: number;
  message: string;
  type: LogType;
  time: string;
};

type UploadResult = {
  isSuccess: boolean;
  message: string;
} | null;

const levelDescriptions: Record<SecurityLevel, string> = {
  low: 'No validation. The server accepts any filename and any content.',
  medium:
    'Basic blacklist rules block .php and some dangerous content types, but common bypasses still work.',
  high:
    'The server uses an extension allowlist and basic content validation. This is harder to bypass and pushes attackers toward polyglot files.',
};

export default function FileUploadLab() {
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('low');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showBypassTips, setShowBypassTips] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult>(null);

  const addLog = (message: string, type: LogType = 'info') => {
    setLogs((prev) =>
      [
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          message,
          type,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 10),
    );
  };

  const selectedFileDetails = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return {
      name: selectedFile.name,
      type: selectedFile.type || 'unknown',
      sizeKb: Math.max(1, Math.round(selectedFile.size / 1024)),
    };
  }, [selectedFile]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadResult(null);
  };

  const simulateUpload = () => {
    if (!selectedFile) {
      return;
    }

    addLog(`Uploading ${selectedFile.name}...`, 'info');

    let isSuccess = false;
    let message = '';
    const fileName = selectedFile.name.toLowerCase();
    const fileType = selectedFile.type;

    if (securityLevel === 'low') {
      isSuccess = true;
      message = `Upload accepted. The file was stored at /uploads/${selectedFile.name}.`;
      if (fileName.endsWith('.php') || fileName.endsWith('.phtml')) {
        message += ' Potential RCE: executable server-side code reached the upload directory.';
        addLog('Critical: executable extension accepted by the server.', 'error');
      }
    } else if (securityLevel === 'medium') {
      if (fileType === 'application/x-php' || fileName.endsWith('.php')) {
        isSuccess = false;
        message =
          'Upload blocked. The server rejected the .php extension or the application/x-php content type.';
        addLog('Blocked: blacklist matched .php or PHP content type.', 'warning');
      } else if (fileName.endsWith('.php5') || fileName.endsWith('.phtml')) {
        isSuccess = true;
        message =
          'Bypass successful. The blacklist blocked .php but allowed .php5 or .phtml.';
        addLog('Success: bypassed a weak blacklist with an alternate extension.', 'error');
      } else {
        isSuccess = true;
        message = 'Upload accepted.';
      }
    } else {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const extension = fileName.split('.').pop() || '';

      if (!allowedExtensions.includes(extension)) {
        isSuccess = false;
        message = 'Upload blocked. Only JPG and PNG files are allowed.';
        addLog('Blocked: extension is not in the image allowlist.', 'warning');
      } else {
        isSuccess = true;
        message =
          'Upload accepted after extension and basic content validation. A realistic attacker would now try a polyglot image payload.';
        addLog('Upload passed allowlist checks.', 'success');
      }
    }

    setUploadResult({ isSuccess, message });
    addLog(
      isSuccess ? 'Server response: 200 OK' : 'Server response: 403 Forbidden',
      isSuccess ? 'success' : 'warning',
    );
  };

  return (
    <div className="bg-[#181825] p-6 rounded-xl border border-zinc-800 my-8">
      <div className="flex items-center mb-6">
        <h3 className="text-xl font-bold text-cyan-400 m-0">
          Lab: File Upload Validator
        </h3>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
        <div className="space-y-6">
          <section className="rounded-xl border border-zinc-800 bg-[#11111b] p-5">
            <h4 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">
              Security Level
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as SecurityLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSecurityLevel(level);
                    setUploadResult(null);
                    addLog(`Security level changed to ${level.toUpperCase()}.`, 'info');
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-bold uppercase transition ${
                    securityLevel === level
                      ? 'bg-cyan-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-cyan-900/40 bg-cyan-950/30 p-3 text-sm text-cyan-200">
              {levelDescriptions[securityLevel]}
            </div>
          </section>

          <section className="rounded-xl border-2 border-dashed border-zinc-700 bg-[#11111b] p-6 text-center transition-colors hover:border-cyan-500/50">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900">
              <Upload className="text-cyan-400" />
            </div>
            <input
              type="file"
              id="file-upload-input"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload-input"
              className="cursor-pointer text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Choose a file to simulate
            </label>
            <p className="mt-2 text-xs text-zinc-500">
              Try names like `shell.php`, `avatar.png`, or `shell.phtml`
            </p>

            {selectedFileDetails && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <FileCode className="text-cyan-400 shrink-0" size={16} />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-zinc-200">
                      {selectedFileDetails.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {selectedFileDetails.type} · {selectedFileDetails.sizeKb} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-zinc-500 hover:text-red-400"
                  aria-label="Remove selected file"
                >
                  <XCircle size={16} />
                </button>
              </div>
            )}

            <button
              disabled={!selectedFile}
              onClick={simulateUpload}
              className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                selectedFile
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              Upload to Server <ChevronRight size={16} />
            </button>

            {uploadResult && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-lg border p-4 text-left ${
                  uploadResult.isSuccess
                    ? 'border-emerald-500/30 bg-emerald-900/20 text-emerald-300'
                    : 'border-red-500/30 bg-red-900/20 text-red-300'
                }`}
              >
                {uploadResult.isSuccess ? (
                  <CheckCircle2 className="shrink-0" size={18} />
                ) : (
                  <XCircle className="shrink-0" size={18} />
                )}
                <div>
                  <p className="text-sm font-bold">
                    {uploadResult.isSuccess ? 'Upload Successful' : 'Upload Failed'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed opacity-90">
                    {uploadResult.message}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-[#11111b] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
              <Terminal size={12} />
              Server Console
            </h4>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-zinc-600 hover:text-zinc-400"
            >
              Clear
            </button>
          </div>

          <div className="min-h-[240px] flex-1 space-y-3 overflow-y-auto font-mono text-[11px]">
            {logs.length === 0 && (
              <div className="italic text-zinc-700">
                Waiting for simulated upload activity...
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-zinc-600">[{log.time}]</span>
                <span
                  className={
                    log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'warning'
                        ? 'text-amber-400'
                        : log.type === 'success'
                          ? 'text-emerald-400'
                          : 'text-cyan-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-zinc-800 pt-4">
            <button
              onClick={() => setShowBypassTips((prev) => !prev)}
              className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300"
            >
              Bypass Tips
              <ChevronDown
                size={14}
                className={`transition-transform ${showBypassTips ? 'rotate-180' : ''}`}
              />
            </button>
            {showBypassTips && (
              <div className="mt-3 space-y-2 text-[11px]">
                <div className="rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400">
                  `LOW`: upload `shell.php` directly and look for executable handling.
                </div>
                <div className="rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400">
                  `MEDIUM`: try `shell.phtml` or spoof the request `Content-Type` to an image value.
                </div>
                <div className="rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400">
                  `HIGH`: use an image extension and experiment with polyglot payloads that keep valid magic bytes.
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
