import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { SeniorView } from './components/SeniorView';
import { RelativeView } from './components/RelativeView';
import { PingNotification } from './components/ThinkingOfYou';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_TASKS, SENIOR_PROFILE } from './data/constants';
import { playCompletionSound, playSuccessSound, playPingSound } from './utils/sounds';
import { FEATURES } from './config/features';
import './index.css';

export default function TrygApp() {
  const [view, setView] = useState('senior');
  const [tasks, setTasks] = useLocalStorage('tryg-tasks', INITIAL_TASKS);
  const [lastCheckIn, setLastCheckIn] = useLocalStorage('tryg-checkin', null);
  const [symptomLogs, setSymptomLogs] = useLocalStorage('tryg-symptoms', []);
  const [familyStatus, setFamilyStatus] = useLocalStorage('tryg-family-status', 'work');
  const [activePing, setActivePing] = useState(null);
  const [notification, setNotification] = useState(null);

  // Phase 5: Emotional Connection state
  const [weeklyAnswers, setWeeklyAnswers] = useLocalStorage('tryg-weekly-answers', []);
  const [helpOffers, setHelpOffers] = useLocalStorage('tryg-help-offers', []);
  const [helpRequests, setHelpRequests] = useLocalStorage('tryg-help-requests', []);

  // Simulated notification after 5 seconds (only if enabled)
  useEffect(() => {
    if (!FEATURES.demoNotification) return;
    const timer = setTimeout(() => {
      setNotification({
        title: "Husk at drikke vand",
        body: "Det er tid til dit glas vand kl. 10:00",
        icon: Activity
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Clear notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    const willBeCompleted = task && !task.completed;

    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));

    // Play sound when completing (not uncompleting)
    if (willBeCompleted) {
      playCompletionSound();
    }
  };

  const handleCheckIn = (status) => {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setLastCheckIn(timeString);
    if (status === 'checked-in') {
      playSuccessSound(); // Celebratory sound for check-in
      console.log('Check-in registered:', timeString);
    }
  };

  const addSymptom = (symptomType) => {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    setSymptomLogs(prev => [{
      ...symptomType,
      time: timeString,
      date: new Date().toLocaleDateString('da-DK')
    }, ...prev]);

    console.log('Symptom logged:', symptomType.label);
  };

  const handleAddTaskFromRelative = (newTask) => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    setTasks(prev => [...prev, { ...newTask, id: newId, completed: false }]);
  };

  // Send "thinking of you" ping
  const handleSendPing = (fromName, toView) => {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
      now.getMinutes().toString().padStart(2, '0');
    setActivePing({
      fromName,
      toView,
      time: timeString
    });
  };

  // Weekly question answer handler
  const handleWeeklyAnswer = (answer) => {
    setWeeklyAnswers(prev => [answer, ...prev]);
  };

  // Help exchange handlers
  const handleHelpOffer = (offer) => {
    setHelpOffers(prev => [{ ...offer, timestamp: new Date().toISOString() }, ...prev]);
  };

  const handleHelpRequest = (request) => {
    setHelpRequests(prev => [{ ...request, timestamp: new Date().toISOString() }, ...prev]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-800 p-4 font-sans">

      {/* Phone Frame Simulator */}
      <div className="relative w-full max-w-md h-[850px] bg-white rounded-[3rem] overflow-hidden border-8 border-zinc-900 shadow-2xl ring-1 ring-zinc-400/50">

        {/* Push Notification Banner */}
        <div className={`
                    absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl z-[60]
                    transform transition-all duration-500 ease-out border border-stone-200
                    ${notification ? 'translate-y-12 opacity-100' : '-translate-y-40 opacity-0'}
                `}>
          {notification && (
            <div className="flex gap-3 items-center">
              <div className="bg-teal-100 p-2 rounded-xl">
                <notification.icon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h4 className="font-bold text-stone-800 text-sm">{notification.title}</h4>
                <p className="text-stone-500 text-xs">{notification.body}</p>
              </div>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black/5 z-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white/80 p-1 rounded-full flex text-xs font-bold shadow-lg">
            <button
              onClick={() => setView('senior')}
              className={`px-4 py-2 rounded-full transition-colors ${view === 'senior' ? 'bg-teal-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              Senior View
            </button>
            <button
              onClick={() => setView('relative')}
              className={`px-4 py-2 rounded-full transition-colors ${view === 'relative' ? 'bg-indigo-600 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              Pårørende View
            </button>
          </div>
        </div>

        <div className="pt-14 h-full">
          {/* Ping Notification - shows when receiving a ping in current view */}
          {activePing && activePing.toView === view && (
            <PingNotification
              ping={activePing}
              onDismiss={() => setActivePing(null)}
            />
          )}

          {view === 'senior' ? (
            <SeniorView
              tasks={tasks}
              toggleTask={toggleTask}
              updateStatus={handleCheckIn}
              addSymptom={addSymptom}
              familyStatus={familyStatus}
              onSendPing={() => handleSendPing('Birthe', 'relative')}
              weeklyAnswers={weeklyAnswers}
              onWeeklyAnswer={handleWeeklyAnswer}
              helpOffers={helpOffers}
              helpRequests={helpRequests}
              onHelpOffer={handleHelpOffer}
              onHelpRequest={handleHelpRequest}
            />
          ) : (
            <RelativeView
              tasks={tasks}
              profile={SENIOR_PROFILE}
              lastCheckIn={lastCheckIn}
              symptomLogs={symptomLogs}
              onAddTask={handleAddTaskFromRelative}
              familyStatus={familyStatus}
              onFamilyStatusChange={setFamilyStatus}
              onSendPing={() => handleSendPing('Louise', 'senior')}
              weeklyAnswers={weeklyAnswers}
              onWeeklyAnswer={handleWeeklyAnswer}
              helpOffers={helpOffers}
              helpRequests={helpRequests}
            />
          )}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50"></div>
      </div>
    </div>
  );
}
