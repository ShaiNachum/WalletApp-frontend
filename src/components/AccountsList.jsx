import { useState, useEffect } from "react";
import api from "../lib/axios";

const AccountsList = ({ onAccountSelect, selectedAccountId, refreshTrigger }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger !== lastRefreshTime) {
      fetchAccounts();
      setLastRefreshTime(refreshTrigger);
    }
  }, [refreshTrigger, lastRefreshTime]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/GetAccounts");
      setAccounts(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (account) => {
    onAccountSelect(account);
  };

  const formatRefreshTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Accounts List</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-2 text-gray-300">Loading accounts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Accounts List</h2>
        <div className="text-red-400 text-center py-4">
          {error}
          <button 
            onClick={fetchAccounts}
            className="ml-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Accounts List</h2>
      </div>

      {accounts.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No accounts found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="pb-3 text-gray-300 font-semibold">Owner Name</th>
                <th className="pb-3 text-gray-300 font-semibold">Owner TAZ</th>
                <th className="pb-3 text-gray-300 font-semibold">Account ID</th>
                <th className="pb-3 text-gray-300 font-semibold">Account Name</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account.accountID}
                  onClick={() => handleRowClick(account)}
                  className={`
                    cursor-pointer transition-colors border-b border-gray-700/50 hover:bg-gray-700/50
                    ${selectedAccountId === account.accountID ? 'bg-emerald-900/30 border-emerald-500/50' : ''}
                  `}
                >
                  <td className="py-3 text-white">{account.ownerName}</td>
                  <td className="py-3 text-gray-300">{account.ownerTaz}</td>
                  <td className="py-3 text-emerald-400 font-mono">{account.accountID}</td>
                  <td className="py-3 text-white">{account.accountName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          Total: {accounts.length} accounts
        </div>
      )}
    </div>
  );
};

export default AccountsList;