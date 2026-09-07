import React, { useState } from 'react';
import {
  X,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Bell,
  Trash2,
  ChevronRight,
  Filter,
  Mic,
  Sprout,
  Heart,
  Droplets,
  Layers,
  Sparkles
} from 'lucide-react';
import { FarmTask, TaskCategory, Field, Animal } from '../types';

interface FarmingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: FarmTask[];
  onSaveTask: (task: FarmTask) => void;
  onDeleteTask: (taskId: string) => void;
  fields: Field[];
  animals?: Animal[];
  activeFieldId?: string;
  activeAnimalId?: string;
}

export const FarmingCalendarModal: React.FC<FarmingCalendarModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onSaveTask,
  onDeleteTask,
  fields,
  animals = [],
  activeFieldId,
  activeAnimalId,
}) => {
  if (!isOpen) return null;

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week' | 'field' | 'animal'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('irrigation');
  const [taskTargetType, setTaskTargetType] = useState<'field' | 'animal' | 'general'>('field');
  const [taskTargetId, setTaskTargetId] = useState(activeFieldId || fields[0]?.id || '');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskDueTime, setTaskDueTime] = useState('08:00');
  const [taskRepeat, setTaskRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [taskNotes, setTaskNotes] = useState('');

  // Voice Task Simulation / Parser
  const [voiceInputText, setVoiceInputText] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Browser notification permission
  const [notifState, setNotifState] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestNotificationPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const perm = await Notification.requestPermission();
      setNotifState(perm);
      if (perm === 'granted') {
        new Notification('किसान मित्र आठवण सूचना सक्रिय!', {
          body: 'शेतीची कामे, पाणी, खते आणि जनावरांच्या लसीकरणाची आठवण वेळेवर दिली जाईल.',
        });
      }
    }
  };

  // Quick Voice Command Handler
  const handleSimulateVoiceCommand = (sampleCommand: string) => {
    setVoiceInputText(sampleCommand);
    // Parse simulated command
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (sampleCommand.includes('पाणी') || sampleCommand.includes('irrigation')) {
      setTaskTitle('सोयाबीन शेताला पाणी देणे');
      setTaskCategory('irrigation');
      setTaskDueDate(tomorrowStr);
      setTaskDueTime('08:00');
      setShowAddForm(true);
    } else if (sampleCommand.includes('लस') || sampleCommand.includes('vaccine')) {
      setTaskTitle('गाईला लाळ्या खुरकूत (FMD) लस देणे');
      setTaskCategory('animal_vaccination');
      setTaskTargetType('animal');
      setTaskDueDate(tomorrowStr);
      setShowAddForm(true);
    } else if (sampleCommand.includes('खत') || sampleCommand.includes('fertilizer')) {
      setTaskTitle('युरिया / DAP खताचा हप्ता देणे');
      setTaskCategory('fertilizer');
      setTaskDueDate(tomorrowStr);
      setShowAddForm(true);
    }
  };

  // Toggle Task Completion
  const handleToggleComplete = (task: FarmTask) => {
    onSaveTask({
      ...task,
      completed: !task.completed,
    });
  };

  // Create Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    let targetName = 'शेती';
    if (taskTargetType === 'field') {
      const f = fields.find((x) => x.id === taskTargetId);
      targetName = f ? `${f.name} (${f.crop})` : 'शेत';
    } else if (taskTargetType === 'animal') {
      const a = animals.find((x) => x.id === taskTargetId);
      targetName = a ? `${a.name} (${a.type})` : 'जनावर';
    }

    const newTask: FarmTask = {
      id: `task_${Date.now()}`,
      title: taskTitle.trim(),
      category: taskCategory,
      targetType: taskTargetType,
      targetId: taskTargetId || undefined,
      targetName,
      dueDate: taskDueDate,
      dueTime: taskDueTime || undefined,
      repeat: taskRepeat,
      completed: false,
      notes: taskNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveTask(newTask);
    setTaskTitle('');
    setTaskNotes('');
    setShowAddForm(false);
  };

  // Filter Tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'today') return t.dueDate === todayStr;
    if (activeFilter === 'field') return t.targetType === 'field';
    if (activeFilter === 'animal') return t.targetType === 'animal';
    return true;
  });

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'fertilizer':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'spray':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'animal_vaccination':
      case 'animal_health_followup':
      case 'animal_breeding':
        return <Heart className="w-4 h-4 text-rose-600" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-xl shadow-inner">
              📅
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                स्मार्ट शेती कॅलेंडर व कामे
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                पाणी, खत, फवारणी व लसीकरणाच्या नियमित आठवणी (Reminders)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-emerald-700/60 rounded-xl text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Permission Banner */}
        {notifState !== 'granted' && (
          <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-bold">
              <Bell className="w-4 h-4 text-amber-700" />
              <span>मोबाईल / स्क्रीनवर कामांची आठवण मिळवण्यासाठी परवानगी द्या:</span>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="bg-amber-800 text-white font-extrabold px-3 py-1 rounded-lg hover:bg-amber-900 text-[11px] cursor-pointer"
            >
              परवानगी द्या
            </button>
          </div>
        )}

        {/* Quick Voice Bar */}
        <div className="bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto text-xs">
            <span className="font-bold text-stone-600 shrink-0">बोलून काम जोडा:</span>
            <button
              onClick={() =>
                handleSimulateVoiceCommand('उद्या सकाळी 8 वाजता सोयाबीनच्या शेताला पाणी देण्याची आठवण करून दे.')
              }
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:border-emerald-300 border border-stone-200 rounded-xl text-stone-700 font-medium text-[11px] shrink-0 cursor-pointer"
            >
              🎤 "उद्या सकाळी ८ वाजता सोयाबीनला पाणी..."
            </button>
            <button
              onClick={() =>
                handleSimulateVoiceCommand('गाईला लाळ्या खुरकूत लस देण्याची आठवण ठेव.')
              }
              className="px-2.5 py-1 bg-stone-100 hover:bg-rose-50 hover:border-rose-300 border border-stone-200 rounded-xl text-stone-700 font-medium text-[11px] shrink-0 cursor-pointer"
            >
              🎤 "गाईला लाळ्या खुरकूत लस..."
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नवीन काम</span>
          </button>
        </div>

        {/* Add Task Form (Collapsible) */}
        {showAddForm && (
          <form onSubmit={handleCreateTask} className="bg-stone-100 border-b border-stone-300 p-4 space-y-3">
            <h4 className="font-extrabold text-stone-900 text-xs">नवीन काम व आठवण जोडा</h4>

            <div>
              <label className="text-xs font-bold text-stone-700">कामाचे नाव (Task Name):</label>
              <input
                type="text"
                required
                placeholder="उदा. सोयाबीन शेताला पाणी देणे, गाईला लस देणे"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700">प्रकार (Category):</label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                >
                  <option value="irrigation">पाणी देणे (Irrigation)</option>
                  <option value="fertilizer">खत देणे (Fertilizer)</option>
                  <option value="spray">फवारणी (Spray)</option>
                  <option value="crop_inspection">पीक पाहणी (Inspection)</option>
                  <option value="harvest">काढणी (Harvest)</option>
                  <option value="animal_vaccination">पशु लसीकरण (Vaccination)</option>
                  <option value="animal_health_followup">पशु उपचार फॉलोअप</option>
                  <option value="animal_breeding">पशु प्रजोत्पादन (Breeding)</option>
                  <option value="custom">इतर काम</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700">कशासाठी आहे?</label>
                <select
                  value={taskTargetType}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setTaskTargetType(t);
                    if (t === 'field') setTaskTargetId(fields[0]?.id || '');
                    if (t === 'animal') setTaskTargetId(animals[0]?.id || '');
                  }}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1"
                >
                  <option value="field">शेतासाठी (Field)</option>
                  <option value="animal">जनावरासाठी (Animal)</option>
                  <option value="general">सामान्य शेती (General)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700">तारीख:</label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700">वेळ:</label>
                <input
                  type="time"
                  value={taskDueTime}
                  onChange={(e) => setTaskDueTime(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-bold"
                />
              </div>
            </div>

            {/* Target Selector */}
            {taskTargetType === 'field' && fields.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-stone-700">शेत निवडा:</label>
                <select
                  value={taskTargetId}
                  onChange={(e) => setTaskTargetId(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-semibold"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.crop} ({f.acreage} {f.acreageUnit || 'एकर'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {taskTargetType === 'animal' && animals.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-stone-700">जनावर निवडा:</label>
                <select
                  value={taskTargetId}
                  onChange={(e) => setTaskTargetId(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl text-xs mt-1 font-semibold"
                >
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type} — {a.breed})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="w-1/3 bg-stone-300 hover:bg-stone-400 text-stone-800 font-bold py-2 rounded-xl text-xs cursor-pointer"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>काम जतन करा</span>
              </button>
            </div>
          </form>
        )}

        {/* Task Filter Pills */}
        <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'all', label: `सर्व (${tasks.length})` },
            { id: 'today', label: 'आजची कामे' },
            { id: 'field', label: 'शेती कामे' },
            { id: 'animal', label: 'पशु कामे' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeFilter === f.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300">
              <CalendarIcon className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-700 text-sm mt-2">कोणतेही नियोजित काम नाही</p>
              <p className="text-xs text-stone-500 mt-0.5">
                पाणी, खत किंवा लसीकरणाची आठवण जोडण्यासाठी वर "नवीन काम" दाबा.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  task.completed
                    ? 'bg-stone-100 border-stone-200 opacity-60'
                    : 'bg-white border-stone-300 shadow-2xs hover:border-emerald-400'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(task)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 cursor-pointer shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-extrabold ${
                          task.completed ? 'line-through text-stone-500' : 'text-stone-900'
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                        {getCategoryIcon(task.category)}
                        <span>{task.dueDate}</span>
                        {task.dueTime && <span>({task.dueTime})</span>}
                      </span>

                      {task.targetName && (
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                          {task.targetName}
                        </span>
                      )}
                    </div>

                    {task.notes && (
                      <p className="text-[11px] text-stone-500 mt-1">{task.notes}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="text-stone-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
