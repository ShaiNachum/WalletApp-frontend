import { useState, useEffect } from "react";
import api from "../lib/axios";

const AccountBalance = ({ selectedAccount, refreshTrigger }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  useEffect(() => {
    if (selectedAccount) {
      fetchBalance(selectedAccount.accountID);
    } else {
      setBalance(null);
      setError("");
    }
  }, [selectedAccount]);


  useEffect(() => {
    if (refreshTrigger && refreshTrigger !== lastRefreshTime && selectedAccount) {
      fetchBalance(selectedAccount.accountID);
      setLastRefreshTime(refreshTrigger);
    }
  }, [refreshTrigger, selectedAccount, lastRefreshTime]);

  const fetchBalance = async (accountId) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/GetBalanceAccount", {
        params: { accountId }
      });
      setBalance(response.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
      if (error.response?.status === 404) {
        setError("No balance found for this account");
      } else {
        setError("Failed to load balance information");
      }
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedAccount) {
      fetchBalance(selectedAccount.accountID);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // ADDED: Format refresh time for display
  const formatRefreshTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Account Balance</h2>
      </div>

      {!selectedAccount ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Account Selected</h3>
          <p className="text-gray-400">Click on an account from the table to view its balance</p>
        </div>
      ) : (
        <div>
          {/* Balance Information */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <span className="ml-2 text-gray-300">Loading balance...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-400 mb-4">{error}</div>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          ) : balance ? (
            <div className="space-y-6">
              {/* Balance Display */}
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Current Balance</div>
                <div className={`text-4xl font-bold mb-2 ${
                  balance.balanceValue >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatCurrency(balance.balanceValue)}
                </div>
              </div>

              {/* Balance Date */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                  <div className="text-white font-mono text-sm">
                    {formatDateTime(balance.balanceTime)}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AccountBalance;