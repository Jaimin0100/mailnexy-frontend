'use client';

import { useState } from 'react';

export default function SendingOptions() {
  const [trackingClicks, setTrackingClicks] = useState(true);
  const [trackingOpens, setTrackingOpens] = useState(true);
  const [startEndCampaign, setStartEndCampaign] = useState(true);
  const [stopOnReply, setStopOnReply] = useState(true);
  const [oneClickUnsubscribe, setOneClickUnsubscribe] = useState(false);
  const [completeCampaign, setCompleteCampaign] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Sending options</h2>
      <p className="text-gray-600 mb-6">
        Campaign will start for all prospects from the list. If a new prospect is added to the list later, they'll join the campaign right away.
      </p>

      {/* Email Account Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-2">Email Account <span className="text-gray-500">[1]</span></h3>
        <p className="text-gray-600 mb-3">Use mailbox rotation for higher daily sending limit.</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full">Choose Email Account</button>
      </div>

      {/* Tracking Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-2">Tracking</h3>
        <p className="text-gray-600 mb-3">Enable tracking to follow your campaign KPIs and get engagement notifications.</p>
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={trackingClicks}
            onChange={() => setTrackingClicks(!trackingClicks)}
            className="w-5 h-5"
          />
          <span>Tracking Clicks</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={trackingOpens}
            onChange={() => setTrackingOpens(!trackingOpens)}
            className="w-5 h-5"
          />
          <span>Tracking Opens</span>
        </label>
      </div>

      {/* Schedule Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-2">Schedule</h3>
        <p className="text-gray-600 mb-3">Specify a sending window for your campaign. For higher engagement, we recommend sending during working hours.</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full">Choose Schedule</button>
      </div>

      {/* Campaign Duration Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-2">Campaign duration</h3>
        <p className="text-gray-600 mb-3">
          You can choose a start and/or end date for your campaign. This way, the campaign will be automatically launched and/or completed on a specific date.
        </p>
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={startEndCampaign}
            onChange={() => setStartEndCampaign(!startEndCampaign)}
            className="w-5 h-5"
          />
          <span>Start/end campaign at a specific time</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={stopOnReply}
            onChange={() => setStopOnReply(!stopOnReply)}
            className="w-5 h-5"
          />
          <span>Stop for those who reply</span>
        </label>
      </div>

      {/* One-click Unsubscribe Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-2">One-click unsubscribe</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Comply with Google's one-click unsubscribe policy by adding an unsubscribe link to email headers. We recommend also including the unsubscribe link in the email body.
          </p>
          <input
            type="checkbox"
            checked={oneClickUnsubscribe}
            onChange={() => setOneClickUnsubscribe(!oneClickUnsubscribe)}
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Complete Campaign Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-medium mb-2">Complete campaign automatically</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            When all recipients reach the end of the sequence, campaign will be automatically completed. Completed campaigns keep tracking statistics for the replies, bounces, opens and clicks, but you can no longer add new prospects.
          </p>
          <input
            type="checkbox"
            checked={completeCampaign}
            onChange={() => setCompleteCampaign(!completeCampaign)}
            className="w-5 h-5"
          />
        </div>
      </div>
    </div>
  );
}