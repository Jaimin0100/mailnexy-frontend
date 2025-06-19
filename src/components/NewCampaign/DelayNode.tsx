import { useFormContext } from "react-hook-form";

export default function DelayNode() {
  const { register } = useFormContext();

  return (
    <div className="bg-yellow-100 p-2 rounded">
      <label className="text-sm text-yellow-600 font-medium flex items-center">
        <span className="mr-2">Delay After Opened Email</span>
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
  );
}