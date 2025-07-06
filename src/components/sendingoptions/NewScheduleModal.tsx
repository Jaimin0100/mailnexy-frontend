"use client";

import { useState, useRef, useEffect  } from "react";

// Generate time options with 30-minute intervals
const generateTimeOptions = () => {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      const formattedMinute = minute.toString().padStart(2, "0");
      options.push(`${displayHour}:${formattedMinute} ${period}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

// Time zones data
const timeZones = [
  "(GMT-12:00) International Date Line West",
  "(GMT-11:00) Midway Island, Samoa",
  "(GMT-10:00) Hawaii",
  "(GMT-09:00) Alaska",
  "(GMT-08:00) Pacific Time (US & Canada)",
  "(GMT-07:00) Mountain Time (US & Canada)",
  "(GMT-06:00) Central Time (US & Canada)",
  "(GMT-05:00) Eastern Time (US & Canada)",
  "(GMT-04:00) Atlantic Time (Canada)",
  "(GMT-03:00) Buenos Aires, Georgetown",
  "(GMT-02:00) Mid-Atlantic",
  "(GMT-01:00) Azores, Cape Verde Islands",
  "(GMT+00:00) London, Lisbon",
  "(GMT+01:00) Paris, Madrid",
  "(GMT+02:00) Athens, Istanbul",
  "(GMT+03:00) Moscow, St. Petersburg",
  "(GMT+04:00) Dubai, Abu Dhabi",
  "(GMT+05:00) Islamabad, Karachi",
  "(GMT+05:30) Mumbai, Kolkata, New Delhi",
  "(GMT+06:00) Astana, Dhaka",
  "(GMT+07:00) Bangkok, Jakarta",
  "(GMT+08:00) Beijing, Singapore",
  "(GMT+09:00) Tokyo, Seoul",
  "(GMT+10:00) Sydney, Melbourne",
  "(GMT+11:00) Solomon Islands",
  "(GMT+12:00) Auckland, Wellington",
];

// Define types
type Day = 
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

type ScheduleDays = Record<Day, boolean>;

interface NewScheduleModalProps {
  onClose: () => void;
  onSave: () => void;
  scheduleName: string;
  setScheduleName: (value: string) => void;
  timeZone: string;
  setTimeZone: (value: string) => void;
  scheduleDays: ScheduleDays;
  handleDayChange: (day: Day) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
}

const daysOfWeek: Day[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function NewScheduleModal({
  onClose,
  onSave,
  scheduleName,
  setScheduleName,
  timeZone,
  setTimeZone,
  scheduleDays,
  handleDayChange,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: NewScheduleModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

    // Ensure dropdowns always open downwards
    useEffect(() => {
      const modal = modalRef.current;
      if (!modal) return;
  
      const handleScroll = () => {
        // Reset scroll position to ensure dropdowns have space below
        modal.scrollTop = Math.max(0, Math.min(modal.scrollTop, modal.scrollHeight - modal.clientHeight - 100));
      };
  
      modal.addEventListener('scroll', handleScroll);
      return () => modal.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className={`bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-96 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#53545C]">New schedule</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule name
          </label>
          <input
            type="text"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
          />
        </div>
        
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Zone
          </label>
          {/* Dropdown container with bottom positioning */}
          <div className="relative">
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-700 appearance-none"
            >
              {timeZones.map((zone, index) => (
                <option key={index} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            {/* Custom dropdown indicator */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center mb-4 text-gray-700">
              <input
                type="checkbox"
                id={`day-${day}`}
                checked={scheduleDays[day]}
                onChange={() => handleDayChange(day)}
                className="w-4 h-4 text-[#9B59B6] focus:ring-[#9B59B6]"
              />
              <label htmlFor={`day-${day}`} className="ml-2 text-sm text-[#53545C] min-w-[80px]">
                {day}
              </label>
              
              <div className="ml-auto flex items-center">
                <div className="relative">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="ml-2 p-2 border border-gray-300 rounded-md text-sm appearance-none"
                    disabled={!scheduleDays[day]}
                    style={{ transform: 'translateY(0) !important' }}
                  >
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                
                <span className="mx-2">-</span>
                
                <div className="relative">
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm appearance-none"
                    disabled={!scheduleDays[day]}
                    style={{ transform: 'translateY(0) !important' }}
                  >
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#53545C] hover:bg-gray-100 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
