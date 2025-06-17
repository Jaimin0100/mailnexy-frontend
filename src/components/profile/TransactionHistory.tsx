'use client';

import React from 'react';

const TransactionHistory: React.FC = () => {
  const transactions = [
    { id: 1, date: '2025-06-01', amount: '$99.00', status: 'Completed' },
    { id: 2, date: '2025-05-01', amount: '$99.00', status: 'Completed' },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 text-gray-600 font-medium">Date</th>
              <th className="py-3 text-gray-600 font-medium">Amount</th>
              <th className="py-3 text-gray-600 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100">
                <td className="py-3 text-gray-700">{transaction.date}</td>
                <td className="py-3 text-gray-700">{transaction.amount}</td>
                <td className="py-3 text-gray-700">{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;










// 'use client';

// import React from 'react';

// const TransactionHistory: React.FC = () => {
//   const transactions = [
//     { id: 1, date: '2025-06-01', amount: '$99.00', status: 'Completed' },
//     { id: 2, date: '2025-05-01', amount: '$99.00', status: 'Completed' },
//   ];

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h2>
//       {transactions.length === 0 ? (
//         <p className="text-gray-600">No transactions found.</p>
//       ) : (
//         <table className="w-full text-left text-sm">
//           <thead>
//             <tr className="border-b border-gray-100">
//               <th className="py-3 text-gray-600 font-medium">Date</th>
//               <th className="py-3 text-gray-600 font-medium">Amount</th>
//               <th className="py-3 text-gray-600 font-medium">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((transaction) => (
//               <tr key={transaction.id} className="border-b border-gray-100">
//                 <td className="py-3 text-gray-700">{transaction.date}</td>
//                 <td className="py-3 text-gray-700">{transaction.amount}</td>
//                 <td className="py-3 text-gray-700">{transaction.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default TransactionHistory;