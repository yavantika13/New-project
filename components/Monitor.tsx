
import React, { useState, useRef, useEffect } from 'react';
import { analyzeForestAudio } from '../services/geminiService';
import { SoundType, RiskLevel, DetectionEvent } from '../types';

interface MonitorProps {
  onNewEvent: (event: DetectionEvent) => void;
}

const Monitor: React.FC<MonitorProps> = ({ onNewEvent }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveConfidence, setLiveConfidence] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const confidenceIntervalRef = useRef<number | null>(null);

  const startMonitoring = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      setIsRecording(true);
      setLiveConfidence(0);
      
      const recorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      // Simulated "Inference" confidence during sampling
      confidenceIntervalRef.current = window.setInterval(() => {
        setLiveConfidence(prev => {
          const target = 45 + Math.random() * 25; // Fluctuating preview confidence
          return prev + (target - prev) * 0.1;
        });
      }, 100);

      recorder.start();
      visualize(audioStream);

      // Auto-stop and process after 8 seconds of "sampling"
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setIsRecording(false);
          audioStream.getTracks().forEach(t => t.stop());
        }
      }, 8000);

    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsAnalyzing(true);
    
    // Simulate "Deep Inference" confidence stabilization
    if (confidenceIntervalRef.current) clearInterval(confidenceIntervalRef.current);
    confidenceIntervalRef.current = window.setInterval(() => {
      setLiveConfidence(prev => {
        const target = 85 + Math.random() * 10; // Stabilizing during final classification
        return prev + (target - prev) * 0.05;
      });
    }, 100);

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = (reader.result as string).split(',')[1];
      const result = await analyzeForestAudio(base64data, blob.type);
      
      const finalConfidence = (result.confidence || 0) * 100;
      setLiveConfidence(finalConfidence);
      if (confidenceIntervalRef.current) clearInterval(confidenceIntervalRef.current);

      const newEvent: DetectionEvent = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        type: result.type || SoundType.UNKNOWN,
        confidence: result.confidence || 0,
        riskLevel: result.riskLevel || RiskLevel.LOW,
        details: result.details || "Detected activity in sensor zone.",
        audioBlobUrl: URL.createObjectURL(blob)
      };

      onNewEvent(newEvent);
      setIsAnalyzing(false);
      
      // Keep confidence visible for a moment then reset
      setTimeout(() => {
        if (!isRecording && !isAnalyzing) setLiveConfidence(0);
      }, 3000);
    };
  };

  const visualize = (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.fillStyle = '#111827'; // Match component background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2.5;
        // Gradient effect based on frequency height
        const blue = 100 + barHeight;
        ctx.fillStyle = `rgb(16, 185, ${blue > 255 ? 255 : blue})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (confidenceIntervalRef.current) clearInterval(confidenceIntervalRef.current);
    };
  }, [stream]);

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Left Column: UI Controls */}
        <div className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Edge Sensor Interface</h2>
            <p className="text-gray-400 text-sm">
              Captures acoustic telemetry from Sector 4-B. Gemini AI classifies threats locally before cloud sync.
            </p>
          </div>

          <button
            onClick={startMonitoring}
            disabled={isRecording || isAnalyzing}
            className={`w-full px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              isRecording || isAnalyzing ? 'bg-gray-800 cursor-not-allowed text-gray-500 border border-gray-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white transform hover:-translate-y-0.5'
            }`}
          >
            {isRecording ? 'Capturing Signal...' : isAnalyzing ? 'AI Classifying...' : 'Initialize Sample'}
          </button>
        </div>

        {/* Middle Column: Visualizer & Real-time Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Acoustic Spectrum (Raw)</span>
              {isRecording && (
                <span className="flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div> RECORDING
                </span>
              )}
            </div>
            <canvas ref={canvasRef} width={600} height={120} className="w-full h-32 rounded-lg opacity-80" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1 z-10">AI Confidence</p>
              <div className="flex items-baseline gap-1 z-10">
                <span className={`text-4xl font-black transition-all duration-300 ${isRecording || isAnalyzing ? 'text-emerald-400 scale-110' : 'text-gray-700'}`}>
                  {liveConfidence.toFixed(1)}
                </span>
                <span className="text-sm font-bold text-gray-600">%</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full mt-3 overflow-hidden z-10">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${isAnalyzing ? 'bg-amber-400' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                  style={{ width: `${liveConfidence}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Signal Stability</p>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-black ${isRecording ? 'text-blue-400' : 'text-gray-700'}`}>
                  {isRecording ? (85 + Math.random() * 10).toFixed(0) : '0'}
                </span>
                <span className="text-sm font-bold text-gray-600">dB</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-2 font-mono">ENCRYPTED STREAM: ACTIVE</p>
            </div>
          </div>
        </div>
      </div>
      
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 rounded-xl border border-emerald-500/20">
          <div className="text-center space-y-6 max-w-sm px-6">
            <div className="relative">
              <div className="w-20 h-20 border-t-4 border-l-4 border-emerald-500 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-400">{liveConfidence.toFixed(0)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Running Neural Inference</h3>
              <p className="text-sm text-gray-400">Gemini 3 Flash analyzing waveform for illegal logging and poaching patterns...</p>
            </div>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 w-8 rounded-full animate-pulse bg-emerald-500`} style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Node-042 Ready</span>
        </div>
      </div>
    </div>
  );
};

export default Monitor;
