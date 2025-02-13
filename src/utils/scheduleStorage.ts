export interface SavedSchedule {
  id: string;
  name: string;
  subjects: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  scheduleData: {
    date: string;
    subject: string;
    completed?: boolean;
  }[];
}
export const saveSchedule = (schedule: Omit<SavedSchedule, 'id' | 'createdAt'>) => {
  const schedules = getSavedSchedules();
  const newSchedule: SavedSchedule = {
    ...schedule,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('schedules', JSON.stringify([...schedules, newSchedule]));
  return newSchedule;
};
export const getSavedSchedules = (): SavedSchedule[] => {
  const schedules = localStorage.getItem('schedules');
  return schedules ? JSON.parse(schedules) : [];
};
export const generateSchedule = (subjects: string[], startDate: string, endDate: string, completed: boolean) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const scheduleData: {
    date: string;
    subject: string;
    completed?: boolean;
  }[] = [];
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      scheduleData.push({
        date: date.toISOString().split('T')[0],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        completed: completed
      });
    }
  }
  return scheduleData;
};
export const updateTaskCompletion = (scheduleId: string, date: string, completed: boolean) => {
  const schedules = getSavedSchedules();
  const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
  if (scheduleIndex === -1) return null;
  const schedule = schedules[scheduleIndex];
  const taskIndex = schedule.scheduleData.findIndex(task => task.date === date);
  if (taskIndex === -1) return null;
  schedule.scheduleData[taskIndex].completed = completed;
  schedules[scheduleIndex] = schedule;
  localStorage.setItem('schedules', JSON.stringify(schedules));
  return schedule;
};
export const removeScheduleById = (scheduleId: string): SavedSchedule[] => {

  const schedules = getSavedSchedules();
  
  const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleId);

  localStorage.setItem('schedules', JSON.stringify(updatedSchedules));

  return updatedSchedules;
};

export const getTaskStatus = (date: string, completed?: boolean) => {
  const today = new Date();
  const taskDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);
  if (taskDate > today) return 'upcoming';
  if (taskDate < today && !completed) return 'missed';
  if (completed) return 'completed';
  if (taskDate.getTime() === today.getTime()) return 'today';
  return 'missed';
};