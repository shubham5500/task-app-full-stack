// src/components/Table.js
import React from "react";

const Table = ({ columns = [], data = [] }) => {
  if (data.length) {
    return <p>No data found...</p>
  }
  return (
    <div className="container mx-auto p-4 text-white">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-200">
          <thead>
            <tr className="w-full bg-gray-800 border-b">
              {columns &&
                columns.length > 0 &&
                columns.map((col) => (
                  <th className="text-left p-4" key={col}>
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 && data?.map((item) => (
              <tr key={item.id} className="border-b ">
                {columns &&
                  columns.length > 0 &&
                  columns.map((col) => (
                    <td className="p-4" key={col}>
                      {item[col]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
