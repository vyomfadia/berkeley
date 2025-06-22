import React from 'react';
import Link from 'next/link';

export default function Alerts() {
  // Sample alerts data for demonstration
  const alertsData = [
    { 
      id: 'ALT-001',
      type: 'critical', 
      title: 'Irregular Heartbeat Detected', 
      description: 'Arrhythmia pattern detected at 14:32. Heart rate fluctuated between 65-110 BPM within 2 minutes.',
      time: '14:32',
      date: 'Today',
      acknowledged: false
    },
    { 
      id: 'ALT-002',
      type: 'warning', 
      title: 'Heart Rate Elevated', 
      description: 'Heart rate increased to 95 BPM during rest period. This is above your normal resting rate.',
      time: '12:30',
      date: 'Today',
      acknowledged: false
    },
    { 
      id: 'ALT-003',
      type: 'critical', 
      title: 'Possible Sleep Apnea', 
      description: 'Breathing irregularities detected during sleep. Multiple instances of breathing pauses were recorded.',
      time: '22:15',
      date: '2 days ago',
      acknowledged: true
    },
    { 
      id: 'ALT-004',
      type: 'warning', 
      title: 'Stress Level Elevated', 
      description: 'Heart rate variability decreased, suggesting elevated stress levels. Consider relaxation techniques.',
      time: '14:10',
      date: 'Yesterday',
      acknowledged: true
    },
    { 
      id: 'ALT-005',
      type: 'info', 
      title: 'Battery Low', 
      description: 'Your heart monitor battery is at 15%. Please charge your device soon.',
      time: '08:45',
      date: 'Today',
      acknowledged: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col p-4 pb-20">
      {/* Header with cyberpunk styling */}
      <header className="border-b border-cyan-500 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-300">Alerts</h1>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs text-red-400">2 UNREAD</span>
          </div>
        </div>
        <p className="text-xs text-cyan-600 mt-1">USER ID: #AX-7291-B</p>
      </header>

      {/* Filter tabs */}
      <div className="mb-6 border-b border-gray-800">
        <div className="flex">
          <button className="py-2 px-4 text-sm font-medium text-cyan-300 border-b-2 border-cyan-500">
            All Alerts
          </button>
          <button className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-300">
            Unacknowledged
          </button>
          <button className="py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-300">
            Acknowledged
          </button>
        </div>
      </div>

      {/* Alerts list */}
      <main className="flex-1 space-y-4">
        {alertsData.map((alert) => (
          <div 
            key={alert.id}
            className={`bg-gray-900 border rounded-lg p-4 ${
              alert.type === 'critical' ? 'border-red-800 shadow-[0_0_15px_rgba(255,0,0,0.15)]' :
              alert.type === 'warning' ? 'border-yellow-800 shadow-[0_0_15px_rgba(255,255,0,0.1)]' :
              'border-cyan-800'
            } ${!alert.acknowledged ? 'relative' : 'opacity-80'}`}
          >
            {/* Unread indicator */}
            {!alert.acknowledged && (
              <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            )}
            
            {/* Alert header */}
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {alert.type === 'critical' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : alert.type === 'warning' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className={`font-bold ${
                    alert.type === 'critical' ? 'text-red-400' :
                    alert.type === 'warning' ? 'text-yellow-400' :
                    'text-cyan-300'
                  }`}>{alert.title}</h3>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{alert.date}</p>
                <p className="text-sm text-gray-300 mt-2">{alert.description}</p>
                
                {/* Action buttons */}
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      alert.type === 'critical' ? 'bg-red-900/50 text-red-300' :
                      alert.type === 'warning' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-cyan-900/50 text-cyan-300'
                    }`}>
                      {alert.type.toUpperCase()}
                    </span>
                    <span className="text-xs ml-2 text-gray-500">ID: {alert.id}</span>
                  </div>
                  <div className="flex gap-2">
                    {!alert.acknowledged && (
                      <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-3 rounded border border-gray-700">
                        Acknowledge
                      </button>
                    )}
                    <button className={`text-xs ${
                      alert.type === 'critical' ? 'bg-red-900/30 hover:bg-red-800/30 text-red-300 border-red-800' :
                      alert.type === 'warning' ? 'bg-yellow-900/30 hover:bg-yellow-800/30 text-yellow-300 border-yellow-800' :
                      'bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 border-cyan-800'
                    } py-1 px-3 rounded border`}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* No alerts message (hidden in this demo) */}
        <div className="hidden text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-gray-500">No alerts to display</p>
          <p className="mt-2 text-sm text-gray-600">Your heart health is looking good!</p>
        </div>
      </main>

      {/* Settings button */}
      <div className="mt-6 mb-4">
        <button className="w-full bg-gray-900 hover:bg-gray-800 text-cyan-300 text-sm py-2 rounded border border-cyan-800 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Alert Settings
        </button>
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-cyan-800 p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500">
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
        <Link href="/dashboard/alerts" className="flex flex-col items-center text-cyan-400">
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