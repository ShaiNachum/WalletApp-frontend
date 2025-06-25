import { useState, useEffect } from "react";
import api from "../lib/axios";

const NewTransfer = ({ onTransactionComplete, accountsRefreshTrigger }) => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    accountPayID: "",
    accountGetID: "",
    amount: ""
  });
  const [messageTransaction, setMessageTransaction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [lastAccountsRefreshTime, setLastAccountsRefreshTime] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accountsRefreshTrigger && accountsRefreshTrigger !== lastAccountsRefreshTime) {
      fetchAccounts();
      setLastAccountsRefreshTime(accountsRefreshTrigger);
      
      setFormData({
        accountPayID: "",
        accountGetID: "",
        amount: ""
      });
      setMessageTransaction("");
    }
  }, [accountsRefreshTrigger, lastAccountsRefreshTime]);

  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
      const response = await api.get("/GetAccounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setMessageTransaction("Failed to load accounts for dropdown");
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (messageTransaction) {
      setMessageTransaction("");
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    
    if (!formData.accountPayID || !formData.accountGetID || !formData.amount) {
      setMessageTransaction("All fields are required");
      return;
    }

    if (formData.accountPayID === formData.accountGetID) {
      setMessageTransaction("Cannot transfer to the same account");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setMessageTransaction("Amount must be greater than zero");
      return;
    }

    setIsLoading(true);
    setMessageTransaction("");

    try {
      const response = await api.post("/CreateTransaction", {
        accountPayID: parseInt(formData.accountPayID),
        accountGetID: parseInt(formData.accountGetID),
        amount: parseFloat(formData.amount)
      });

      if (response.data === true) {
        setMessageTransaction("Success");
        setFormData({
          accountPayID: "",
          accountGetID: "",
          amount: ""
        });

        if (onTransactionComplete) {
          onTransactionComplete();
        }
      } else {
        setMessageTransaction("Failed");
      }
    } catch (error) {
      console.error("Create transaction error:", error);
      setMessageTransaction("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getAccountDisplayName = (account) => {
    return `${account.accountName} (ID: ${account.accountID}) - ${account.ownerName}`;
  };

  const formatRefreshTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Create New Transfer</h2>
      </div>
      
      {accountsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-2 text-gray-300">Loading accounts...</span>
        </div>
      ) : (
        <form onSubmit={handleCreateTransaction} className="space-y-4">
          {/* From Account (Pay) */}
          <div>
            <label htmlFor="accountPayID" className="block text-sm font-medium text-gray-300 mb-2">
              Paying Account
            </label>
            <select
              id="accountPayID"
              name="accountPayID"
              value={formData.accountPayID}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-colors"
              required
            >
              <option value="">Select paying account</option>
              {accounts.map((account) => (
                <option key={account.accountID} value={account.accountID}>
                  {getAccountDisplayName(account)}
                </option>
              ))}
            </select>
          </div>

          {/* To Account (Get) */}
          <div>
            <label htmlFor="accountGetID" className="block text-sm font-medium text-gray-300 mb-2">
              Getting Account
            </label>
            <select
              id="accountGetID"
              name="accountGetID"
              value={formData.accountGetID}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white transition-colors"
              required
            >
              <option value="">Select getting account</option>
              {accounts.map((account) => (
                <option 
                  key={account.accountID} 
                  value={account.accountID}
                  disabled={account.accountID.toString() === formData.accountPayID}
                  className={account.accountID.toString() === formData.accountPayID ? 'text-gray-500' : ''}
                >
                  {getAccountDisplayName(account)}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Transfer Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0.01"
              className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
              placeholder="Enter transfer amount"
              required
            />
          </div>

          {/* Transfer Preview */}
          {formData.accountPayID && formData.accountGetID && formData.amount && (
            <div className="bg-gray-700/30 rounded-lg p-4 text-sm">
              <h4 className="text-white font-semibold mb-2">Transfer Preview:</h4>
              <div className="space-y-1 text-gray-300">
                <div>
                  <span className="text-red-400">From:</span> {
                    accounts.find(a => a.accountID.toString() === formData.accountPayID)?.accountName || "Unknown"
                  }
                </div>
                <div>
                  <span className="text-green-400">To:</span> {
                    accounts.find(a => a.accountID.toString() === formData.accountGetID)?.accountName || "Unknown"
                  }
                </div>
                <div>
                  <span className="text-yellow-400">Amount:</span> ${parseFloat(formData.amount || 0).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Message Display */}
          {messageTransaction && (
            <div className={`text-sm text-center rounded-lg py-3 px-4 ${
              messageTransaction === 'Success'
                ? 'text-green-400 bg-green-900/20 border border-green-800' 
                : 'text-red-400 bg-red-900/20 border border-red-800'
            }`}>
              {messageTransaction}
            </div>
          )}

          {/* Create Transaction Button */}
          <button
            type="submit"
            disabled={isLoading || accounts.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isLoading ? "Processing Transaction..." : "Create Transaction"}
          </button>

          {accounts.length === 0 && !accountsLoading && (
            <div className="text-yellow-400 text-sm text-center">
              No accounts available. Create accounts first.
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default NewTransfer;