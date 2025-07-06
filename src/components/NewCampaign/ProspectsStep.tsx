import React, { useState, useEffect } from "react";

const ProspectsStep = ({ onNext, onBack }) => {
  const [leadLists, setLeadLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeadLists = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token'); // Replace with actual token retrieval logic (e.g., from context or local storage)
        const response = await fetch('http://localhost:5000/api/v1/lead-lists', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch lead lists');
        }
        const data = await response.json();
        setLeadLists(data.data || []); // Assuming response has a 'data' field; adjust based on actual API response
      } catch (err) {
        setError('Failed to load lead lists. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeadLists();
  }, []);

  const handleNext = () => {
    if (selectedList) {
      onNext({ leadListId: selectedList.id }); // Pass selected list ID to the next step
    }
  };

  return (
    <div className="p-6 bg-[#F5F7FA] min-h-screen">
      <h1 className="text-2xl font-bold text-[#53545C] mb-4">Prospects</h1>
      <div className="bg-white p-4 rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Campaign will start for all prospects from the list. If a new prospect is added to the list later, they'll join the campaign right away.
          </p>
          <button className="text-sm text-blue-600 hover:underline">Don't show this again</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2 font-bold">List name</label>
          {loading ? (
            <p className="text-gray-500">Loading lead lists...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : leadLists.length === 0 ? (
            <p className="text-gray-500">No lead lists available. Please create one first.</p>
          ) : (
            <select
              className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
              value={selectedList ? selectedList.id : ""}
              onChange={(e) => {
                const listId = e.target.value;
                const list = leadLists.find((l) => l.id === Number(listId));
                setSelectedList(list);
              }}
            >
              <option key="default" value="">Select a list</option>
              {leadLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name} ({list.member_count})
                </option>
              ))}
            </select>
          )}
          {selectedList && selectedList.member_count === 0 && (
            <div className="bg-yellow-100 text-yellow-800 text-sm p-2 mt-2 rounded">
              ! The list you've chosen is empty. To start sending, please add prospects to list {selectedList.name}.
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2 font-bold">If prospect has multiple email addresses, send to:</p>
          <div className="flex flex-row gap-x-4">
            <label className="flex items-center text-gray-700">
              <input type="radio" name="emailOption" defaultChecked className="mr-2" />
              All emails
            </label>
            <label className="flex items-center text-gray-700">
              <input type="radio" name="emailOption" className="mr-2" />
              First email
            </label>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Do not send to:</p>
          <div className="flex flex-row gap-x-5">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-[#5570F1] rounded border-gray-300 focus:ring-[#5570F1]"
              />
              Unverified emails
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-[#5570F1] rounded border-gray-300 focus:ring-[#5570F1]"
              />
              Unverifiable (Risky)
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-[#5570F1] rounded border-gray-300 focus:ring-[#5570F1]"
              />
              Invalid
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-bold">
            <p>Skip duplicates</p>
          </label>
          <label className="relative inline-flex items-center cursor-pointer mt-5 gap-3 text-gray-700">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
            Skip recipients added to other campaigns
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Do-not-email list name</label>
          <p className="text-gray-700 text-sm">Stop specific domains and email addresses from receiving your campaign, even if they appear on your prospect list by accident. Learn more</p>
          <select className="w-full p-2 border border-gray-300 rounded-md mt-2 text-gray-700">
            <option>Do-not-email List</option>
          </select>
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-2">If a prospect has a missing variable:</p>
          <div className="flex flex-row gap-4">
            <label className="flex items-center text-gray-700">
              <input type="radio" name="missingVar" defaultChecked className="mr-2" />
              Send it to the To check list
            </label>
            <label className="flex items-center text-gray-700">
              <input type="radio" name="missingVar" className="mr-2" />
              Send campaign anyway
            </label>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-2">Automatic Deals</p>
          <p className="text-sm text-gray-600">
            This feature helps automatically filter ready-to-convert prospects from uninteresting ones. Set up your conditions and Snow.io will create deals in the CRM for those who meet it. Find out more.
          </p>
          <label className="relative inline-flex items-center cursor-pointer mt-5 gap-3 text-gray-700">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
            Create deals based on prospect actions
          </label>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedList || loading || error}
            className="px-4 py-2 bg-[#5570F1] text-white rounded-md hover:bg-[#445cc8] disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProspectsStep;
