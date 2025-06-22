import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col p-4">
      {/* Header with cyberpunk styling */}
      <header className="border-b border-cyan-500 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-300 glitch-text" data-text="HeartBeat Monitor">HeartBeat Monitor</h1>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs neon-text">LIVE</span>
          </div>
        </div>
        <p className="text-xs text-cyan-600 mt-1">USER ID: #AX-7291-B</p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Heart rate monitor */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4 shadow-[0_0_15px_rgba(0,255,255,0.15)]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Heart Rate</h2>
            <span className="text-2xl font-mono text-cyan-300">78 BPM</span>
          </div>
          <div className="h-20 bg-black rounded border border-cyan-900 flex items-center justify-center overflow-hidden scanlines neon-box">
            {/* This would be replaced with an actual heart rate visualization */}
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[40px] flex items-center">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-[20px] w-[5%] bg-cyan-500 mx-[0.5%]"
                      style={{ 
                        height: `${Math.sin(i * 0.5) * 10 + 20}px`,
                        opacity: i % 3 === 0 ? 0.8 : 0.5
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-cyan-600 flex justify-between">
            <span>Last updated: Just now</span>
            <span className="text-green-400">Normal</span>
          </div>
        </section>

        {/* Abnormality Alert */}
        <section className="bg-red-900/30 border border-red-800 rounded-lg p-4 shadow-[0_0_15px_rgba(255,0,0,0.3)] animate-pulse relative overflow-hidden">
          {/* Warning stripes overlay */}
          <div className="absolute inset-0 opacity-10" style={{ 
            background: 'repeating-linear-gradient(45deg, #000, #000 10px, #ff0000 10px, #ff0000 20px)' 
          }}></div>

          <div className="flex items-start gap-3 relative z-10">
            <div className="mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-400 font-bold" style={{ textShadow: '0 0 5px #ff2d55' }}>Irregular Heartbeat Detected</h3>
              <p className="text-sm text-red-300 mt-1">Arrhythmia pattern detected at 14:32. Please remain calm and seated.</p>
              <button className="mt-3 bg-red-800/50 hover:bg-red-700/50 text-white text-sm py-1 px-3 rounded border border-red-600 transition-all hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                View Details
              </button>
            </div>
          </div>

          {/* Pulsing corner indicator */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 animate-ping opacity-75 rounded-full m-2"></div>
        </section>

        {/* Heart Health Metrics */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-cyan-800 rounded-lg p-3">
            <h3 className="text-sm font-semibold mb-1">Blood Pressure</h3>
            <p className="text-xl font-mono text-cyan-300">120/80</p>
            <p className="text-xs text-green-400 mt-1">Normal</p>
          </div>
          <div className="bg-gray-900 border border-cyan-800 rounded-lg p-3">
            <h3 className="text-sm font-semibold mb-1">Oxygen Level</h3>
            <p className="text-xl font-mono text-cyan-300">98%</p>
            <p className="text-xs text-green-400 mt-1">Optimal</p>
          </div>
          <div className="bg-gray-900 border border-cyan-800 rounded-lg p-3">
            <h3 className="text-sm font-semibold mb-1">Heart Rhythm</h3>
            <p className="text-xl font-mono text-yellow-300">Irregular</p>
            <p className="text-xs text-yellow-400 mt-1">Monitoring</p>
          </div>
          <div className="bg-gray-900 border border-cyan-800 rounded-lg p-3">
            <h3 className="text-sm font-semibold mb-1">Activity Level</h3>
            <p className="text-xl font-mono text-cyan-300">Low</p>
            <p className="text-xs text-blue-400 mt-1">Resting</p>
          </div>
        </section>

        {/* Recent History */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Recent History</h2>
          <div className="space-y-2">
            {[
              { time: '14:32', event: 'Irregular heartbeat detected', status: 'alert' },
              { time: '13:45', event: 'Blood pressure reading', status: 'normal' },
              { time: '12:30', event: 'Heart rate increased', status: 'warning' },
              { time: '10:15', event: 'Daily health check', status: 'normal' },
            ].map((item, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center p-2 text-sm rounded border ${
                  item.status === 'alert' ? 'border-red-800 bg-red-900/20 text-red-300' :
                  item.status === 'warning' ? 'border-yellow-800 bg-yellow-900/20 text-yellow-300' :
                  'border-cyan-800 bg-cyan-900/10 text-cyan-300'
                }`}
              >
                <span>{item.time}</span>
                <span>{item.event}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.status === 'alert' ? 'bg-red-900 text-red-300' :
                  item.status === 'warning' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-cyan-900 text-cyan-300'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-300 text-sm py-1.5 rounded border border-cyan-800">
            View Full History
          </button>
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-cyan-800 p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/dashboard/history" className="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs mt-1">History</span>
        </Link>
        <Link href="/dashboard/alerts" className="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-xs mt-1">Alerts</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
