'use client';

import { useFormContext } from "react-hook-form";
import Image from "next/image";

export default function ConditionNode() {
  const { register } = useFormContext();

  return (
    <>
      <div className="border border-gray-200 rounded-lg mb-2">
        <label className="text-sm bg-green-100 rounded-t-lg border-b border-gray-200 text-[#53545C] px-2 py-3 font-bold flex items-center">
          <input
            type="checkbox"
            {...register("openedEmailEnabled")}
            className="mr-2 h-4 w-4 text-green-600 rounded-lg border-gray-300 focus:ring-green-500"
          />
          <Image 
            src="/openemail-condition.svg" 
            alt="Opened Email" 
            width={32} 
            height={32} 
            className="mr-2"
          />
          Opened Email
        </label>
        <div className="mt-2 px-2">
          <select
            {...register("openedEmailWaitingTime")}
            className="w-26 text-black border border-gray-300 rounded-lg p-2"
          >
            <option value="">Select time...</option>
            <option value="+ 2 days">+ 2 days</option>
            <option value="+ 1 day">+ 1 day</option>
            <option value="+ 3 days">+ 3 days</option>
          </select>
          <p className="text-sm text-black mt-1">
            Set a timer for the recipient to open the email. If they open it
            within the set time, we'll move them to the "Yes" option when the
            timer runs out.
          </p>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg mb-2">
        <label className="text-sm bg-green-100 rounded-t-lg border-b border-gray-200 text-[#53545C] px-2 py-3 font-bold flex items-center">
          <input
            type="checkbox"
            {...register("clickedLinkEnabled")}
            className="mr-2 h-4 w-4 text-green-600 rounded-lg border-gray-300 focus:ring-green-500"
          />
          <Image 
            src="/clicklink-condition.svg" 
            alt="Clicked Link" 
            width={32} 
            height={32} 
            className="mr-2"
          />
          Clicked Link
        </label>
        <div className="mt-2 px-2">
          <select
            {...register("clickedLinkWaitingTime")}
            className="w-26 text-black border border-gray-300 rounded-lg p-2"
          >
            <option value="">Select time...</option>
            <option value="+ 2 days">+ 2 days</option>
            <option value="+ 1 day">+ 1 day</option>
            <option value="+ 3 days">+ 3 days</option>
          </select>
          <p className="text-sm text-black mt-1">
            Set a timer for the recipient to click the link. If they click it
            within the set time, we'll move them to the "Yes" option when the
            timer runs out.
          </p>
        </div>
      </div>
    </>
  );
}