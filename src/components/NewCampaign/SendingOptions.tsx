"use client";

import { useState } from "react";
import SchedulesModal from "@/components/sendingoptions/SchedulesModal";
import NewScheduleModal from "@/components/sendingoptions/NewScheduleModal";

export default function SendingOptions() {
  const [trackingClicks, setTrackingClicks] = useState(true);
  const [trackingOpens, setTrackingOpens] = useState(true);
  const [startEndCampaign, setStartEndCampaign] = useState(true);
  const [stopOnReply, setStopOnReply] = useState(true);
  const [oneClickUnsubscribe, setOneClickUnsubscribe] = useState(false);
  const [completeCampaign, setCompleteCampaign] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("New schedule");
  const [timeZone, setTimeZone] = useState("GMT+05:30) Asia/Calcutta");
  const [scheduleDays, setScheduleDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [providerMatching, setProviderMatching] = useState(true);
  const [campaignPriority, setCampaignPriority] = useState("Medium");
  const [dailyLimit, setDailyLimit] = useState(100);
  const [sendingPriority, setSendingPriority] = useState("follow-ups");
  const [newRecipientsLimit, setNewRecipientsLimit] = useState(0);
  const [isNewRecipientsLimitEnabled, setIsNewRecipientsLimitEnabled] = useState(false);

  const handleDayChange = (day) => {
    setScheduleDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl text-[#53545C] font-semibold mb-2">Sending options</h2>
      <p className="text-[#53545C] text-sm mb-6">
        Campaign will start for all prospects from the list. If a new prospect is added to the list later, they'll join the campaign right away.
      </p>

      {/* Email Account Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C]">
          Email Account <span className="text-[#5570F1]">0/1</span>
        </h3>
        <p className="text-[#53545C] text-sm mb-3">Use mailbox rotation for higher daily sending limit.</p>
        <button className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700">
          Choose Email Account
        </button>
      </div>

      {/* Tracking Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C]">Tracking</h3>
        <p className="text-[#53545C] text-sm mb-3">
          Enable tracking to follow your campaign KPIs and get engagement notifications.
        </p>
        <label className="flex items-center space-x-2 mb-2 text-[#53545C] text-sm">
          <input
            type="checkbox"
            checked={trackingClicks}
            onChange={() => setTrackingClicks(!trackingClicks)}
            className="w-4 h-4 bg-[#5570F1]"
          />
          <span>Tracking Clicks</span>
        </label>
        <label className="flex items-center space-x-2 text-[#53545C] text-sm">
          <input
            type="checkbox"
            checked={trackingOpens}
            onChange={() => setTrackingOpens(!trackingOpens)}
            className="w-4 h-4 bg-[#5570F1]"
          />
          <span>Tracking Opens</span>
        </label>
      </div>

      {/* Schedule Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C]">Schedule</h3>
        <p className="text-[#53545C] mb-3 text-sm">
          Specify a sending window for your campaign. For higher engagement, we recommend sending during working hours.
        </p>
        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="px-4 py-2 border border-[#5570F1] text-[#53545C] rounded-lg font-bold text-sm hover:bg-[#5570F1] hover:text-white"
        >
          Choose Schedule
        </button>
      </div>

      {/* Campaign Duration Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C]">Campaign duration</h3>
        <p className="text-[#53545C] mb-3 text-sm">
          You can choose a start and/or end date for your campaign. This way, the campaign will be automatically launched and/or completed on a specific date.
        </p>
        <label className="flex items-center space-x-2 mb-2 text-sm text-[#53545C]">
          <input
            type="checkbox"
            checked={startEndCampaign}
            onChange={() => setStartEndCampaign(!startEndCampaign)}
            className="w-4 h-4"
          />
          <span>Start/end campaign at a specific time</span>
        </label>
        <label className="flex items-center space-x-2 text-sm text-[#53545C]">
          <input
            type="checkbox"
            checked={stopOnReply}
            onChange={() => setStopOnReply(!stopOnReply)}
            className="w-4 h-4"
          />
          <span>Stop for those who reply</span>
        </label>
      </div>

      {/* One-click Unsubscribe Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C]">One-click unsubscribe</h3>
        <div className="flex items-center justify-between">
          <p className="text-[#53545C] text-sm">
            Comply with Google's one-click unsubscribe policy by adding an unsubscribe link to email headers. We recommend also including the unsubscribe link in the email body.
          </p>
          <label className="relative inline-flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              checked={oneClickUnsubscribe}
              onChange={() => setOneClickUnsubscribe(!oneClickUnsubscribe)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
          </label>
        </div>
      </div>

      {/* Complete Campaign Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C]">Complete campaign automatically</h3>
        <div className="flex items-center justify-between">
          <p className="text-[#53545C] text-sm">
            When all recipients reach the end of the sequence, campaign will be automatically completed. Completed campaigns keep tracking statistics for the replies, bounces, opens and clicks, but you can no longer add new prospects.
          </p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={completeCampaign}
              onChange={() => setCompleteCampaign(!completeCampaign)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
          </label>
        </div>
      </div>

      {/* Advanced Settings Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C] border-b border-gray-300 pb-2">Advanced settings</h3>
        <div className="mb-4 border-b border-gray-300 pb-2">
          <h4 className="text-sm font-semibold text-[#53545C] mb-1">Provider matching</h4>
          <p className="text-[#53545C] text-xs mb-2">Match sender account's provider with the recipient's (e.g. Outlook to Outlook, Google to Google) for optimal deliverability.</p>
          <label className="flex items-center space-x-2 text-[#53545C] text-sm">
            <input
              type="checkbox"
              checked={providerMatching}
              onChange={() => setProviderMatching(!providerMatching)}
              className="w-4 h-4"
            />
            <span>Enable provider matching</span>
          </label>
        </div>
        <div className="mb-4 border-b border-gray-300 pb-2">
          <h4 className="text-sm font-semibold text-[#53545C] mb-1">Campaign priority</h4>
          <p className="text-[#53545C] text-xs mb-2">Campaigns with higher priority are sent first. Learn more.</p>
          <select
            value={campaignPriority}
            onChange={(e) => setCampaignPriority(e.target.value)}
            className="p-2 border border-gray-300 rounded text-[#53545C] text-sm"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#53545C] mb-1">Campaign daily sending limit</h4>
          <p className="text-[#53545C] text-xs mb-2">If you have multiple active campaigns, you can set the daily email limit for each campaign. This way, one campaign won't use up the account's sending limit and disrupt the sending of other campaigns.</p>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="p-2 border border-gray-300 rounded text-[#53545C] text-sm w-20"
            />
            <span className="text-[#53545C] text-sm">emails</span>
            <button className="px-2 py-1 bg-[#5570F1] text-white rounded hover:bg-blue-700 text-sm">Set limit</button>
          </div>
        </div>
      </div>

      {/* Sending Priority Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-bold mb-2 text-[#53545C]">Sending priority</h3>
        <p className="text-[#53545C] text-sm mb-3">
          Choose how to prioritize the campaign's daily sending limit. Learn more.
        </p>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-[#53545C] text-sm">
            <input
              type="radio"
              name="sendingPriority"
              checked={sendingPriority === "follow-ups"}
              onChange={() => setSendingPriority("follow-ups")}
              className="w-4 h-4 text-[#5570F1]"
            />
            <span>Prioritize follow-ups</span>
          </label>
          <label className="flex items-center space-x-2 text-[#53545C] text-sm">
            <input
              type="radio"
              name="sendingPriority"
              checked={sendingPriority === "new-recipients"}
              onChange={() => setSendingPriority("new-recipients")}
              className="w-4 h-4 text-[#5570F1]"
            />
            <span>Prioritize new recipients</span>
          </label>
        </div>
      </div>

      {/* New Recipients Daily Limit Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold mb-2 text-[#53545C]">New recipients daily limit</h3>
        <p className="text-[#53545C] text-sm mb-3">
          Set how many new recipients you'll contact per day. Once the limit is reached, the rest of your daily sending limit will go to follow-ups.
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setNewRecipientsLimit(Math.max(0, newRecipientsLimit - 1))}
            className="px-2 py-1 bg-gray-200 rounded text-[#53545C] text-sm"
          >
            -
          </button>
          <input
            type="number"
            value={newRecipientsLimit}
            onChange={(e) => setNewRecipientsLimit(Math.max(0, e.target.value))}
            className="p-2 border border-gray-300 rounded text-[#53545C] text-sm w-20 text-center"
            disabled={!isNewRecipientsLimitEnabled}
          />
          <button
            onClick={() => setNewRecipientsLimit(newRecipientsLimit + 1)}
            className="px-2 py-1 bg-gray-200 rounded text-[#53545C] text-sm"
          >
            +
          </button>
          <span className="text-[#53545C] text-sm">new recipients</span>
          <button
            onClick={() => setIsNewRecipientsLimitEnabled(!isNewRecipientsLimitEnabled)}
            className="ml-2 px-2 py-1 bg-[#5570F1] text-white rounded hover:bg-blue-700 text-sm"
          >
            Set limit
          </button>
          <label className="flex items-center ml-4">
            <input
              type="checkbox"
              checked={isNewRecipientsLimitEnabled}
              onChange={() => setIsNewRecipientsLimitEnabled(!isNewRecipientsLimitEnabled)}
              className="w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Schedules Modal */}
      {isScheduleModalOpen && (
        <SchedulesModal
          onClose={() => setIsScheduleModalOpen(false)}
          onNewSchedule={() => {
            setIsNewScheduleModalOpen(true);
            setIsScheduleModalOpen(false);
          }}
          onApply={() => setIsScheduleModalOpen(false)}
        />
      )}

      {/* New Schedule Modal */}
      {isNewScheduleModalOpen && (
        <NewScheduleModal
          onClose={() => setIsNewScheduleModalOpen(false)}
          onSave={() => {
            setIsNewScheduleModalOpen(false);
            setIsScheduleModalOpen(true);
          }}
          scheduleName={scheduleName}
          setScheduleName={setScheduleName}
          timeZone={timeZone}
          setTimeZone={setTimeZone}
          scheduleDays={scheduleDays}
          handleDayChange={handleDayChange}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />
      )}
    </div>
  );
}






// "use client";

// import { useState } from "react";
// import SchedulesModal from "@/components/sendingoptions/SchedulesModal";
// import NewScheduleModal from "@/components/sendingoptions/NewScheduleModal";

// export default function SendingOptions() {
//   const [trackingClicks, setTrackingClicks] = useState(true);
//   const [trackingOpens, setTrackingOpens] = useState(true);
//   const [startEndCampaign, setStartEndCampaign] = useState(true);
//   const [stopOnReply, setStopOnReply] = useState(true);
//   const [oneClickUnsubscribe, setOneClickUnsubscribe] = useState(false);
//   const [completeCampaign, setCompleteCampaign] = useState(false);
//   const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
//   const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
//   const [scheduleName, setScheduleName] = useState("New schedule");
//   const [timeZone, setTimeZone] = useState("GMT+05:30) Asia/Calcutta");
//   const [scheduleDays, setScheduleDays] = useState({
//     Monday: true,
//     Tuesday: true,
//     Wednesday: true,
//     Thursday: true,
//     Friday: true,
//     Saturday: false,
//     Sunday: false,
//   });
//   const [startTime, setStartTime] = useState("09:00 AM");
//   const [endTime, setEndTime] = useState("06:00 PM");

//   const handleDayChange = (day) => {
//     setScheduleDays((prev) => ({ ...prev, [day]: !prev[day] }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-xl text-[#53545C] font-semibold mb-2">Sending options</h2>
//       <p className="text-[#53545C] text-sm mb-6">
//         Campaign will start for all prospects from the list. If a new prospect is added to the list later, they'll join the campaign right away.
//       </p>

//       {/* Email Account Section */}
//       <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">
//           Email Account <span className="text-[#5570F1]">0/1</span>
//         </h3>
//         <p className="text-[#53545C] text-sm mb-3">Use mailbox rotation for higher daily sending limit.</p>
//         <button className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700">
//           Choose Email Account
//         </button>
//       </div>

//       {/* Tracking Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">Tracking</h3>
//         <p className="text-[#53545C] text-sm mb-3">
//           Enable tracking to follow your campaign KPIs and get engagement notifications.
//         </p>
//         <label className="flex items-center space-x-2 mb-2 text-[#53545C] text-sm">
//           <input
//             type="checkbox"
//             checked={trackingClicks}
//             onChange={() => setTrackingClicks(!trackingClicks)}
//             className="w-4 h-4 bg-[#5570F1]"
//           />
//           <span>Tracking Clicks</span>
//         </label>
//         <label className="flex items-center space-x-2 text-[#53545C] text-sm">
//           <input
//             type="checkbox"
//             checked={trackingOpens}
//             onChange={() => setTrackingOpens(!trackingOpens)}
//             className="w-4 h-4 bg-[#5570F1]"
//           />
//           <span>Tracking Opens</span>
//         </label>
//       </div>

//       {/* Schedule Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">Schedule</h3>
//         <p className="text-[#53545C] mb-3 text-sm">
//           Specify a sending window for your campaign. For higher engagement, we recommend sending during working hours.
//         </p>
//         <button
//           onClick={() => setIsScheduleModalOpen(true)}
//           className="px-4 py-2 border border-[#5570F1] text-[#53545C] rounded-lg font-bold text-sm hover:bg-[#5570F1] hover:text-white"
//         >
//           Choose Schedule
//         </button>
//       </div>

//       {/* Campaign Duration Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">Campaign duration</h3>
//         <p className="text-[#53545C] mb-3 text-sm">
//           You can choose a start and/or end date for your campaign. This way, the campaign will be automatically launched and/or completed on a specific date.
//         </p>
//         <label className="flex items-center space-x-2 mb-2 text-sm text-[#53545C]">
//           <input
//             type="checkbox"
//             checked={startEndCampaign}
//             onChange={() => setStartEndCampaign(!startEndCampaign)}
//             className="w-4 h-4"
//           />
//           <span>Start/end campaign at a specific time</span>
//         </label>
//         <label className="flex items-center space-x-2 text-sm text-[#53545C]">
//           <input
//             type="checkbox"
//             checked={stopOnReply}
//             onChange={() => setStopOnReply(!stopOnReply)}
//             className="w-4 h-4"
//           />
//           <span>Stop for those who reply</span>
//         </label>
//       </div>

//       {/* One-click Unsubscribe Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">One-click unsubscribe</h3>
//         <div className="flex items-center justify-between">
//           <p className="text-[#53545C] text-sm">
//             Comply with Google's one-click unsubscribe policy by adding an unsubscribe link to email headers. We recommend also including the unsubscribe link in the email body.
//           </p>
//           <label className="relative inline-flex items-center justify-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={oneClickUnsubscribe}
//               onChange={() => setOneClickUnsubscribe(!oneClickUnsubscribe)}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
//           </label>
//         </div>
//       </div>

//       {/* Complete Campaign Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200">
//         <h3 className="font-bold mb-2 text-[#53545C]">Complete campaign automatically</h3>
//         <div className="flex items-center justify-between">
//           <p className="text-[#53545C] text-sm">
//             When all recipients reach the end of the sequence, campaign will be automatically completed. Completed campaigns keep tracking statistics for the replies, bounces, opens and clicks, but you can no longer add new prospects.
//           </p>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={completeCampaign}
//               onChange={() => setCompleteCampaign(!completeCampaign)}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
//           </label>
//         </div>
//       </div>

//       {/* Schedules Modal */}
//       {isScheduleModalOpen && (
//         <SchedulesModal
//           onClose={() => setIsScheduleModalOpen(false)}
//           onNewSchedule={() => {
//             setIsNewScheduleModalOpen(true);
//             setIsScheduleModalOpen(false);
//           }}
//           onApply={() => setIsScheduleModalOpen(false)}
//         />
//       )}

//       {/* New Schedule Modal */}
//       {isNewScheduleModalOpen && (
//         <NewScheduleModal
//           onClose={() => setIsNewScheduleModalOpen(false)}
//           onSave={() => {
//             setIsNewScheduleModalOpen(false);
//             setIsScheduleModalOpen(true);
//           }}
//           scheduleName={scheduleName}
//           setScheduleName={setScheduleName}
//           timeZone={timeZone}
//           setTimeZone={setTimeZone}
//           scheduleDays={scheduleDays}
//           handleDayChange={handleDayChange}
//           startTime={startTime}
//           setStartTime={setStartTime}
//           endTime={endTime}
//           setEndTime={setEndTime}
//         />
//       )}
//     </div>
//   );
// }










// 'use client';

// import { useState } from 'react';

// export default function SendingOptions() {
//   const [trackingClicks, setTrackingClicks] = useState(true);
//   const [trackingOpens, setTrackingOpens] = useState(true);
//   const [startEndCampaign, setStartEndCampaign] = useState(true);
//   const [stopOnReply, setStopOnReply] = useState(true);
//   const [oneClickUnsubscribe, setOneClickUnsubscribe] = useState(false);
//   const [completeCampaign, setCompleteCampaign] = useState(false);

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h2 className="text-xl text-[#53545C] font-semibold mb-2">Sending options</h2>
//       <p className="text-[#53545C] text-sm mb-6">
//         Campaign will start for all prospects from the list. If a new prospect is added to the list later, they'll join the campaign right away.
//       </p>

//       {/* Email Account Section */}
//       <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">Email Account <span className="text-[#5570F1]">0/1</span></h3>
//         <p className="text-[#53545C] text-sm mb-3">Use mailbox rotation for higher daily sending limit.</p>
//         <button className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700">Choose Email Account</button>
//       </div>

//       {/* Tracking Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">Tracking</h3>
//         <p className="text-[#53545C] text-sm mb-3">Enable tracking to follow your campaign KPIs and get engagement notifications.</p>
//         <label className="flex items-center space-x-2 mb-2 text-[#53545C] text-sm">
//           <input
//             type="checkbox"
//             checked={trackingClicks}
//             onChange={() => setTrackingClicks(!trackingClicks)}
//             className="w-4 h-4 bg-[#5570F1]"
//           />
//           <span>Tracking Clicks</span>
//         </label>
//         <label className="flex items-center space-x-2 text-[#53545C] text-sm">
//           <input
//             type="checkbox"
//             checked={trackingOpens}
//             onChange={() => setTrackingOpens(!trackingOpens)}
//             className="w-4 h-4 bg-[#5570F1]"
//           />
//           <span>Tracking Opens</span>
//         </label>
//       </div>

//       {/* Schedule Section */}
//       <div className="bg-white p-4 rounded-lg  border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">Schedule</h3>
//         <p className="text-[#53545C] mb-3 text-sm">Specify a sending window for your campaign. For higher engagement, we recommend sending during working hours.</p>
//         <button className="px-4 py-2 border border-[#5570F1] text-[#53545C] rounded-lg font-bold text-sm hover:bg-[#5570F1] hover:text-white">Choose Schedule</button>
//       </div>

//       {/* Campaign Duration Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">Campaign duration</h3>
//         <p className="text-[#53545C] mb-3 text-sm">
//           You can choose a start and/or end date for your campaign. This way, the campaign will be automatically launched and/or completed on a specific date.
//         </p>
//         <label className="flex items-center space-x-2 mb-2 text-sm text-[#53545C]">
//           <input
//             type="checkbox"
//             checked={startEndCampaign}
//             onChange={() => setStartEndCampaign(!startEndCampaign)}
//             className="w-4 h-4"
//           />
//           <span>Start/end campaign at a specific time</span>
//         </label>
//         <label className="flex items-center space-x-2 text-sm text-[#53545C]">
//           <input
//             type="checkbox"
//             checked={stopOnReply}
//             onChange={() => setStopOnReply(!stopOnReply)}
//             className="w-4 h-4"
//           />
//           <span>Stop for those who reply</span>
//         </label>
//       </div>

//       {/* One-click Unsubscribe Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//         <h3 className="font-bold mb-2 text-[#53545C]">One-click unsubscribe</h3>
//         <div className="flex items-center justify-between">
//           <p className="text-[#53545C] text-sm">
//             Comply with Google's one-click unsubscribe policy by adding an unsubscribe link to email headers. We recommend also including the unsubscribe link in the email body.
//           </p>
//           <label className="relative inline-flex items-center justify-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={oneClickUnsubscribe}
//               onChange={() => setOneClickUnsubscribe(!oneClickUnsubscribe)}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
//           </label>
//         </div>
//       </div>

//       {/* Complete Campaign Section */}
//       <div className="bg-white p-4 rounded-lg border border-gray-200">
//         <h3 className="font-bold mb-2 text-[#53545C]">Complete campaign automatically</h3>
//         <div className="flex items-center justify-between">
//           <p className="text-[#53545C] text-sm">
//             When all recipients reach the end of the sequence, campaign will be automatically completed. Completed campaigns keep tracking statistics for the replies, bounces, opens and clicks, but you can no longer add new prospects.
//           </p>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               checked={completeCampaign}
//               onChange={() => setCompleteCampaign(!completeCampaign)}
//               className="sr-only peer"
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// }