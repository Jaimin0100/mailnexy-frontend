import { useFormContext } from "react-hook-form";

export default function ConditionNode() {
  const { register } = useFormContext();

  return (
    <>
      <div className="bg-green-100 p-2 rounded mb-2">
        <label className="text-sm text-green-600 font-medium flex items-center">
          <span className="mr-2">Opened Email</span>
        </label>
        <div className="mt-2">
          <select
            {...register("waitingTime")}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="+ 2 days">+ 2 days</option>
            <option value="+ 1 day">+ 1 day</option>
            <option value="+ 3 days">+ 3 days</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Set a timer for the recipient to open the email. If they open it
            within the set time, we'll move them to the "Yes" option when the
            timer runs out.
          </p>
        </div>
      </div>
      <div className="bg-green-100 p-2 rounded">
        <label className="text-sm text-green-600 font-medium flex items-center">
          <span className="mr-2">Clicked Link</span>
        </label>
        <div className="mt-2">
          <select
            {...register("waitingTime")}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="+ 2 days">+ 2 days</option>
            <option value="+ 1 day">+ 1 day</option>
            <option value="+ 3 days">+ 3 days</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Set a timer for the recipient to click the link. If they open it
            within the set time, we'll move them to the "Yes" option when the
            timer runs out.
          </p>
        </div>
      </div>
    </>
  );
}