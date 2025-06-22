import React from 'react';
import Link from 'next/link';

export default function History() {
  // Sample data for demonstration
  const historyData = [
    { date: 'Today', time: '14:32', event: 'Irregular heartbeat detected', status: 'alert', details: 'Arrhythmia pattern detected. Heart rate fluctuated between 65-110 BPM within 2 minutes.' },
    { date: 'Today', time: '13:45', event: 'Blood pressure reading', status: 'normal', details: '120/80 mmHg - Within normal range' },
    { date: 'Today', time: '12:30', event: 'Heart rate increased', status: 'warning', details: 'Heart rate increased to 95 BPM during rest period' },
    { date: 'Today', time: '10:15', event: 'Daily health check', status: 'normal', details: 'All vitals within normal parameters' },
    { date: 'Yesterday', time: '21:20', event: 'Sleep monitoring started', status: 'normal', details: 'Baseline heart rate: 62 BPM' },
    { date: 'Yesterday', time: '18:45', event: 'Exercise session completed', status: 'normal', details: 'Peak heart rate: 142 BPM, Duration: 32 minutes' },
    { date: 'Yesterday', time: '14:10', event: 'Stress level elevated', status: 'warning', details: 'Heart rate variability decreased, suggesting elevated stress' },
    { date: 'Yesterday', time: '09:30', event: 'Daily health check', status: 'normal', details: 'All vitals within normal parameters' },
    { date: '2 days ago', time: '22:15', event: 'Possible sleep apnea', status: 'alert', details: 'Breathing irregularities detected during sleep' },
    { date: '2 days ago', time: '16:40', event: 'Medication reminder', status: 'normal', details: 'Beta blocker scheduled dose' },
  ];

  // Group history data by date
  const groupedData = historyData.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col p-4 pb-20">
      {/* Header with cyberpunk styling */}
      <header className="border-b border-cyan-500 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-300">Health History</h1>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-xs">SYNCED</span>
          </div>
        </div>
        <p className="text-xs text-cyan-600 mt-1">USER ID: #AX-7291-B</p>
      </header>

      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button className="bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 text-xs py-1 px-3 rounded border border-cyan-800">
          All Events
        </button>
        <button className="bg-transparent hover:bg-red-900/30 text-red-400 text-xs py-1 px-3 rounded border border-red-800">
          Alerts
        </button>
        <button className="bg-transparent hover:bg-yellow-900/30 text-yellow-400 text-xs py-1 px-3 rounded border border-yellow-800">
          Warnings
        </button>
        <button className="bg-transparent hover:bg-cyan-900/30 text-cyan-400 text-xs py-1 px-3 rounded border border-cyan-800">
          Normal
        </button>
      </div>

      {/* Date range selector */}
      <div className="mb-6 bg-gray-900 border border-cyan-800 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold">Date Range</h2>
          <button className="text-xs text-cyan-300 underline">Custom Range</button>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="flex-1 bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 text-xs py-1 rounded border border-cyan-800">
            Today
          </button>
          <button className="flex-1 bg-transparent hover:bg-cyan-900/30 text-cyan-400 text-xs py-1 rounded border border-cyan-800">
            Week
          </button>
          <button className="flex-1 bg-transparent hover:bg-cyan-900/30 text-cyan-400 text-xs py-1 rounded border border-cyan-800">
            Month
          </button>
        </div>
      </div>

      {/* History timeline */}
      <main className="flex-1">
        {Object.keys(groupedData).map((date) => (
          <div key={date} className="mb-6">
            <h2 className="text-sm font-semibold text-cyan-300 mb-2 border-b border-cyan-900 pb-1">{date}</h2>
            <div className="space-y-3">
              {groupedData[date].map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-900 border rounded-lg p-3 ${
                    item.status === 'alert' ? 'border-red-800 shadow-[0_0_10px_rgba(255,0,0,0.1)]' :
                    item.status === 'warning' ? 'border-yellow-800 shadow-[0_0_10px_rgba(255,255,0,0.05)]' :
                    'border-cyan-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          item.status === 'alert' ? 'bg-red-500' :
                          item.status === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></span>
                        <h3 className={`font-medium ${
                          item.status === 'alert' ? 'text-red-400' :
                          item.status === 'warning' ? 'text-yellow-400' :
                          'text-cyan-300'
                        }`}>{item.event}</h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'alert' ? 'bg-red-900/50 text-red-300' :
                      item.status === 'warning' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-cyan-900/50 text-cyan-300'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-gray-300">{item.details}</p>
                  <div className="mt-3 flex justify-end">
                    <button className="text-xs text-cyan-400 hover:text-cyan-300">View Details →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Load more button */}
        <button className="w-full mt-3 mb-6 bg-gray-900 hover:bg-gray-800 text-cyan-300 text-sm py-2 rounded border border-cyan-800">
          Load More
        </button>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-cyan-800 p-3 flex justify-around">
        <Link href="/dashboard" className="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/dashboard/history" className="flex flex-col items-center text-cyan-400">
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