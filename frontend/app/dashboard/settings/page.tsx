import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

export default function Settings() {
  // State for status message
  const [statusMessage, setStatusMessage] = useState({
    visible: false,
    type: 'success', // 'success', 'error', 'info'
    message: ''
  });

  // State for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // State for notification toggles
  const [notificationSettings, setNotificationSettings] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    dailyReports: false,
    soundAlerts: true
  });

  // State for edit modes
  const [editModes, setEditModes] = useState({
    heartRateThresholds: false,
    bloodPressureThresholds: false,
    monitoringFrequency: false,
    medicalConditions: false,
    medications: false,
    emergencyContact: false
  });

  // State for medical conditions
  const [medicalConditions, setMedicalConditions] = useState([
    'Hypertension',
    'Arrhythmia'
  ]);

  // State for new condition input
  const [newCondition, setNewCondition] = useState('');

  // Toggle notification setting
  const toggleNotification = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  // Toggle edit mode
  const toggleEditMode = (section) => {
    setEditModes({
      ...editModes,
      [section]: !editModes[section]
    });

    // Reset new condition input when toggling edit mode
    if (section === 'medicalConditions' && !editModes.medicalConditions) {
      setNewCondition('');
    }
  };

  // Add a new medical condition
  const addMedicalCondition = () => {
    if (newCondition.trim() !== '' && !medicalConditions.includes(newCondition.trim())) {
      setMedicalConditions([...medicalConditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  // Remove a medical condition
  const removeMedicalCondition = (condition) => {
    setMedicalConditions(medicalConditions.filter(c => c !== condition));
  };

  // Show status message and auto-hide after delay
  const showStatusMessage = (type, message, duration = 3000) => {
    setStatusMessage({
      visible: true,
      type,
      message
    });

    // Auto-hide after duration
    setTimeout(() => {
      setStatusMessage(prev => ({
        ...prev,
        visible: false
      }));
    }, duration);
  };

  // Save all changes
  const saveAllChanges = () => {
    // In a real app, this would save to a backend
    showStatusMessage('success', 'All changes saved successfully');
  };

  // Show confirmation dialog
  const showConfirmDialog = (title, message, onConfirm) => {
    setConfirmDialog({
      visible: true,
      title,
      message,
      onConfirm,
      onCancel: () => setConfirmDialog(prev => ({ ...prev, visible: false }))
    });
  };

  // Delete all data
  const deleteAllData = () => {
    // In a real app, this would delete data from a backend
    showStatusMessage('info', 'All data has been deleted');
    // Close the dialog
    setConfirmDialog(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col p-4 pb-20">
      {/* Status Message */}
      {statusMessage.visible && (
        <div 
          className={`fixed top-4 right-4 left-4 z-50 p-3 rounded-lg shadow-lg border animate-fadeIn ${
            statusMessage.type === 'success' ? 'bg-green-900/70 border-green-700 text-green-300' :
            statusMessage.type === 'error' ? 'bg-red-900/70 border-red-700 text-red-300' :
            'bg-cyan-900/70 border-cyan-700 text-cyan-300'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {statusMessage.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : statusMessage.type === 'error' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{statusMessage.message}</p>
            </div>
            <button 
              onClick={() => setStatusMessage(prev => ({ ...prev, visible: false }))}
              className="ml-auto flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full hover:bg-black/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header with cyberpunk styling */}
      <header className="border-b border-cyan-500 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-300">Settings</h1>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-green-400">SAVED</span>
          </div>
        </div>
        <p className="text-xs text-cyan-600 mt-1">USER ID: #AX-7291-B</p>
      </header>

      {/* Settings sections */}
      <main className="flex-1 space-y-6">
        {/* Profile section */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Profile</h2>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-cyan-900 flex items-center justify-center text-cyan-300 text-2xl font-bold mr-4">
              AX
            </div>
            <div>
              <h3 className="font-medium text-cyan-300">Alex Xander</h3>
              <p className="text-sm text-gray-400">ID: #AX-7291-B</p>
              <p className="text-xs text-gray-500 mt-1">Last sync: Today, 15:42</p>
            </div>
          </div>
          <button className="w-full bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 text-sm py-1.5 rounded border border-cyan-800 mt-2">
            Edit Profile
          </button>
        </section>

        {/* Monitoring settings */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Monitoring Settings</h2>

          <div className="space-y-4">
            {/* Heart rate thresholds */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Heart Rate Thresholds</h3>
                <button 
                  onClick={() => toggleEditMode('heartRateThresholds')} 
                  className="text-xs text-cyan-400 underline hover:text-cyan-300"
                >
                  {editModes.heartRateThresholds ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="bg-gray-800 rounded p-3 text-sm">
                {!editModes.heartRateThresholds ? (
                  // View mode
                  <>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Resting (Low)</span>
                      <span className="text-cyan-300 font-mono">50 BPM</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Resting (High)</span>
                      <span className="text-cyan-300 font-mono">85 BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maximum</span>
                      <span className="text-cyan-300 font-mono">160 BPM</span>
                    </div>
                  </>
                ) : (
                  // Edit mode
                  <>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-400 mb-1">Resting (Low)</label>
                        <div className="flex">
                          <input 
                            type="number" 
                            defaultValue={50}
                            className="w-full bg-gray-900 border border-cyan-800 rounded px-2 py-1 text-cyan-300 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="ml-2 text-gray-400 flex items-center">BPM</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Resting (High)</label>
                        <div className="flex">
                          <input 
                            type="number" 
                            defaultValue={85}
                            className="w-full bg-gray-900 border border-cyan-800 rounded px-2 py-1 text-cyan-300 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="ml-2 text-gray-400 flex items-center">BPM</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Maximum</label>
                        <div className="flex">
                          <input 
                            type="number" 
                            defaultValue={160}
                            className="w-full bg-gray-900 border border-cyan-800 rounded px-2 py-1 text-cyan-300 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                          <span className="ml-2 text-gray-400 flex items-center">BPM</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => {
                            toggleEditMode('heartRateThresholds');
                            showStatusMessage('success', 'Heart rate thresholds updated');
                          }}
                          className="flex-1 bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 text-xs py-1.5 rounded border border-cyan-800"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => toggleEditMode('heartRateThresholds')}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-1.5 rounded border border-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Blood pressure thresholds */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Blood Pressure Thresholds</h3>
                <button className="text-xs text-cyan-400 underline">Edit</button>
              </div>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Systolic (High)</span>
                  <span className="text-cyan-300 font-mono">140 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Diastolic (High)</span>
                  <span className="text-cyan-300 font-mono">90 mmHg</span>
                </div>
              </div>
            </div>

            {/* Monitoring frequency */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Monitoring Frequency</h3>
                <button className="text-xs text-cyan-400 underline">Edit</button>
              </div>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Heart Rate</span>
                  <span className="text-cyan-300 font-mono">Continuous</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blood Pressure</span>
                  <span className="text-cyan-300 font-mono">Every 4 hours</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notification settings */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Notification Settings</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Critical Alerts</h3>
                <p className="text-xs text-gray-500 mt-0.5">Immediate notifications for urgent issues</p>
              </div>
              <button 
                onClick={() => toggleNotification('criticalAlerts')}
                className="relative inline-block w-10 align-middle select-none transition-colors duration-200"
              >
                <div className={`block w-10 h-6 rounded-full border ${notificationSettings.criticalAlerts ? 'bg-cyan-900 border-cyan-700' : 'bg-gray-700 border-gray-600'}`}></div>
                <div 
                  className={`absolute top-1 w-4 h-4 rounded-full bg-cyan-400 transform transition-transform duration-200 ${notificationSettings.criticalAlerts ? 'right-1' : 'left-1'} ${notificationSettings.criticalAlerts ? 'bg-cyan-400' : 'bg-gray-400'}`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Warning Alerts</h3>
                <p className="text-xs text-gray-500 mt-0.5">Notifications for potential concerns</p>
              </div>
              <button 
                onClick={() => toggleNotification('warningAlerts')}
                className="relative inline-block w-10 align-middle select-none transition-colors duration-200"
              >
                <div className={`block w-10 h-6 rounded-full border ${notificationSettings.warningAlerts ? 'bg-cyan-900 border-cyan-700' : 'bg-gray-700 border-gray-600'}`}></div>
                <div 
                  className={`absolute top-1 w-4 h-4 rounded-full transform transition-transform duration-200 ${notificationSettings.warningAlerts ? 'right-1' : 'left-1'} ${notificationSettings.warningAlerts ? 'bg-cyan-400' : 'bg-gray-400'}`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Daily Reports</h3>
                <p className="text-xs text-gray-500 mt-0.5">Daily summary of your heart health</p>
              </div>
              <button 
                onClick={() => toggleNotification('dailyReports')}
                className="relative inline-block w-10 align-middle select-none transition-colors duration-200"
              >
                <div className={`block w-10 h-6 rounded-full border ${notificationSettings.dailyReports ? 'bg-cyan-900 border-cyan-700' : 'bg-gray-700 border-gray-600'}`}></div>
                <div 
                  className={`absolute top-1 w-4 h-4 rounded-full transform transition-transform duration-200 ${notificationSettings.dailyReports ? 'right-1' : 'left-1'} ${notificationSettings.dailyReports ? 'bg-cyan-400' : 'bg-gray-400'}`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Sound Alerts</h3>
                <p className="text-xs text-gray-500 mt-0.5">Play sound with notifications</p>
              </div>
              <button 
                onClick={() => toggleNotification('soundAlerts')}
                className="relative inline-block w-10 align-middle select-none transition-colors duration-200"
              >
                <div className={`block w-10 h-6 rounded-full border ${notificationSettings.soundAlerts ? 'bg-cyan-900 border-cyan-700' : 'bg-gray-700 border-gray-600'}`}></div>
                <div 
                  className={`absolute top-1 w-4 h-4 rounded-full transform transition-transform duration-200 ${notificationSettings.soundAlerts ? 'right-1' : 'left-1'} ${notificationSettings.soundAlerts ? 'bg-cyan-400' : 'bg-gray-400'}`}
                ></div>
              </button>
            </div>
          </div>
        </section>

        {/* Device settings */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Device Settings</h2>

          <div className="bg-gray-800 rounded p-3 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-sm">HeartBeat Monitor</h3>
                <p className="text-xs text-gray-500 mt-0.5">Connected</p>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-green-400">85%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 text-sm py-1.5 rounded border border-cyan-800 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync Device
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded border border-gray-700 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Connect New Device
            </button>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Data & Privacy</h2>

          <div className="space-y-3">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded border border-gray-700 flex items-center justify-center gap-2">
              Export Health Data
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded border border-gray-700 flex items-center justify-center gap-2">
              Privacy Settings
            </button>
            <button 
              onClick={() => showConfirmDialog(
                'Delete All Data', 
                'Are you sure you want to delete all your health data? This action cannot be undone.', 
                deleteAllData
              )}
              className="w-full bg-red-900/30 hover:bg-red-800/30 text-red-300 text-sm py-1.5 rounded border border-red-800 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete All Data
            </button>
          </div>
        </section>

        {/* Medical Information */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Medical Information</h2>

          <div className="space-y-4">
            {/* Medical conditions */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Medical Conditions</h3>
                <button 
                  onClick={() => toggleEditMode('medicalConditions')}
                  className="text-xs text-cyan-400 underline hover:text-cyan-300"
                >
                  {editModes.medicalConditions ? 'Done' : 'Edit'}
                </button>
              </div>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <div className="flex gap-2 flex-wrap">
                  {medicalConditions.map((condition, index) => (
                    <div key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-cyan-300 flex items-center">
                      {condition}
                      {editModes.medicalConditions && (
                        <button 
                          onClick={() => removeMedicalCondition(condition)}
                          className="ml-1 text-red-400 hover:text-red-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {editModes.medicalConditions ? (
                  <div className="mt-3">
                    <div className="flex">
                      <input
                        type="text"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addMedicalCondition();
                          }
                        }}
                        placeholder="Enter condition"
                        className="flex-1 bg-gray-900 border border-cyan-800 rounded-l px-2 py-1 text-cyan-300 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <button 
                        onClick={addMedicalCondition}
                        className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-300 px-2 py-1 rounded-r border border-cyan-800 border-l-0"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to add a new condition</p>
                  </div>
                ) : (
                  <button className="mt-2 text-xs text-cyan-400 flex items-center gap-1 hover:text-cyan-300" onClick={() => toggleEditMode('medicalConditions')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add condition
                  </button>
                )}
              </div>
            </div>

            {/* Medications */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Current Medications</h3>
                <button className="text-xs text-cyan-400 underline">Edit</button>
              </div>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lisinopril</span>
                    <span className="text-cyan-300 font-mono">10mg daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Metoprolol</span>
                    <span className="text-cyan-300 font-mono">25mg twice daily</span>
                  </div>
                </div>
                <button className="mt-3 text-xs text-cyan-400 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add medication
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">Emergency Contact</h3>
                <button className="text-xs text-cyan-400 underline">Edit</button>
              </div>
              <div className="bg-gray-800 rounded p-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name</span>
                    <span className="text-cyan-300">Jane Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Relationship</span>
                    <span className="text-cyan-300">Spouse</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone</span>
                    <span className="text-cyan-300 font-mono">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share with Doctor */}
            <div>
              <button className="w-full bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 text-sm py-2 rounded border border-cyan-800 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share with Healthcare Provider
              </button>
            </div>
          </div>
        </section>

        {/* Device Calibration */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Device Calibration</h2>

          <div className="space-y-4">
            <p className="text-sm text-gray-400">Calibrate your device to ensure accurate readings. Follow the instructions below:</p>

            <div className="bg-gray-800 rounded p-3">
              <ol className="list-decimal list-inside text-sm space-y-2 text-gray-300">
                <li>Place the device on a flat surface</li>
                <li>Remain still for 30 seconds</li>
                <li>Follow the on-screen prompts</li>
                <li>Confirm calibration when complete</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-300 text-sm py-1.5 rounded border border-cyan-800">
                Start Calibration
              </button>
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded border border-gray-700">
                Reset to Default
              </button>
            </div>
          </div>
        </section>

        {/* App info */}
        <section className="bg-gray-900 border border-cyan-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">About</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Version</span>
              <span className="text-cyan-300">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-cyan-300">Today</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded border border-gray-700">
              Terms of Service
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded border border-gray-700">
              Privacy Policy
            </button>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded border border-gray-700">
              Help & Support
            </button>
          </div>
        </section>

        {/* Save All Changes Button */}
        <div className="mt-6 mb-4">
          <button 
            onClick={saveAllChanges}
            className="w-full bg-cyan-700 hover:bg-cyan-600 text-white text-sm py-3 rounded-lg border border-cyan-600 flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save All Changes
          </button>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {confirmDialog.visible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-cyan-700 rounded-lg max-w-sm w-full p-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-cyan-300">{confirmDialog.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{confirmDialog.message}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 bg-red-900/50 hover:bg-red-800/50 text-red-300 text-sm py-2 rounded border border-red-800"
              >
                Confirm
              </button>
              <button 
                onClick={confirmDialog.onCancel}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded border border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
        <Link href="/dashboard/alerts" className="flex flex-col items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-xs mt-1">Alerts</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center text-cyan-400">
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
