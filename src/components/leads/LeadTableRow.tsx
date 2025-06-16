import { FaRegStar, FaStar } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Lead } from './types';

interface LeadTableRowProps {
  lead: Lead;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onToggleStar: (id: number) => void;
}

const LeadTableRow = ({ lead, isSelected, onSelect, onToggleStar }: LeadTableRowProps) => {
  return (
    <tr key={lead.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(lead.id)}
          className="h-4 w-4 text-blue-600 rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button 
            onClick={() => onToggleStar(lead.id)} 
            className="mr-2 text-gray-400 hover:text-yellow-500"
          >
            {lead.isStarred ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
          </button>
          <div>
            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
            <div className="text-sm text-gray-500">{lead.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{lead.company}</div>
        <div className="text-sm text-gray-500">{lead.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lead.industry}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lead.customFields.employees}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lead.customFields.revenue}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
          lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
          lead.status === 'interested' ? 'bg-green-100 text-green-800' :
          lead.status === 'converted' ? 'bg-indigo-100 text-indigo-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {lead.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-gray-400 hover:text-gray-600">
          <BsThreeDotsVertical />
        </button>
      </td>
    </tr>
  );
};

export default LeadTableRow;