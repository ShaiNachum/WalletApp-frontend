import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountsList from "../components/AccountsList";
import AccountBalance from "../components/AccountBalance";
import NewAccount from "../components/NewAccount";
import NewTransfer from "../components/NewTransfer";

const DashboardPage = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const [accountsRefreshTrigger, setAccountsRefreshTrigger] = useState(null);
  const [balanceRefreshTrigger, setBalanceRefreshTrigger] = useState(null);

  const navigate = useNavigate();

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const handleAccountCreated = () => {
    const refreshTime = Date.now();
    setAccountsRefreshTrigger(refreshTime);
    setSelectedAccount(null);
  };

  const handleTransactionComplete = () => {
    const refreshTime = Date.now();
    setBalanceRefreshTrigger(refreshTime);
  };

  const handleLogout = () => {
    // Clear any stored user data if needed (for future authentication state)
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-6">
        {/* Header with logout button */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Wallet Dashboard
              </h1>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Top Row - Accounts List and Balance */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Accounts List Section */}
            <div className="xl:col-span-1">
              <AccountsList
                onAccountSelect={handleAccountSelect}
                selectedAccountId={selectedAccount?.accountID}
                refreshTrigger={accountsRefreshTrigger}
              />
            </div>

            {/* Account Balance Section */}
            <div className="xl:col-span-1">
              <AccountBalance
                selectedAccount={selectedAccount}
                refreshTrigger={balanceRefreshTrigger}
              />
            </div>
          </div>

          {/* Bottom Row - New Account and New Transfer */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* New Account Section */}
            <div className="xl:col-span-1">
              <NewAccount onAccountCreated={handleAccountCreated} />
            </div>

            {/* New Transfer Section */}
            <div className="xl:col-span-1">
              <NewTransfer 
                onTransactionComplete={handleTransactionComplete}
                accountsRefreshTrigger={accountsRefreshTrigger}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;