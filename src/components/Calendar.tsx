import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
type Event = {
  id: string;
  title: string;
  date: Date;
  type: "study" | "reading" | "other";
};
export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "study" as const
  });
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleAddEvent = () => {
    if (selectedDate && newEvent.title) {
      const event: Event = {
        id: Math.random().toString(),
        title: newEvent.title,
        date: selectedDate,
        type: newEvent.type
      };
      setEvents([...events, event]);
      setNewEvent({
        title: "",
        type: "study"
      });
      setShowAddEvent(false);
    }
  };
  return <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div key={day} className="text-center py-2 text-sm font-medium text-gray-600">
            {day}
          </div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map(date => {
        const dayEvents = events.filter(event => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
        return <div key={date.toString()} className={`min-h-[100px] p-2 border rounded-lg ${isSameMonth(date, currentDate) ? "bg-white" : "bg-gray-50"} ${isToday(date) ? "border-blue-500" : "border-gray-200"}`} onClick={() => {
          setSelectedDate(date);
          setShowAddEvent(true);
        }}>
              <div className="text-sm font-medium text-gray-600">
                {format(date, "d")}
              </div>
              <div className="mt-1">
                {dayEvents.map(event => <div key={event.id} className={`text-xs p-1 mb-1 rounded ${event.type === "study" ? "bg-blue-100 text-blue-800" : event.type === "reading" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {event.title}
                  </div>)}
              </div>
            </div>;
      })}
      </div>
      {showAddEvent && selectedDate && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">
              Add Event for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <input type="text" value={newEvent.title} onChange={e => setNewEvent({
          ...newEvent,
          title: e.target.value
        })} placeholder="Event title" className="w-full p-2 border rounded mb-4" />
            <select value={newEvent.type} onChange={e => setNewEvent({
          ...newEvent,
          type: e.target.value as "study" | "reading" | "other"
        })} className="w-full p-2 border rounded mb-4">
              <option value="study">Study</option>
              <option value="reading">Reading</option>
              <option value="other">Other</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddEvent(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
              <button onClick={handleAddEvent} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Event
              </button>
            </div>
          </div>
        </div>}
      <button onClick={() => {
      setSelectedDate(new Date());
      setShowAddEvent(true);
    }} className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600">
        <Plus className="w-6 h-6" />
      </button>
    </div>;
};