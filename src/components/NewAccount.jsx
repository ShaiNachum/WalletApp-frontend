import { useState } from "react";
import api from "../lib/axios";

const NewAccount = ({ onAccountCreated }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerTaz: "",
    ownerPassword: "",
    initialBalance: ""
  });
  const [messageAccount, setMessageAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if (!formData.ownerName || !formData.ownerTaz || !formData.ownerPassword || !formData.initialBalance) {
      setMessageAccount("All fields are required");
      return;
    }

    if (parseFloat(formData.initialBalance) < 0) {
      setMessageAccount("Initial balance cannot be negative");
      return;
    }

    setIsLoading(true);
    setMessageAccount("");

    try {
      const response = await api.post("/CreateAccount", {
        ownerName: formData.ownerName,
        ownerTaz: formData.ownerTaz,
        ownerPassword: formData.ownerPassword,
        initialBalance: parseFloat(formData.initialBalance)
      });

      if (response.data === true) {
        setMessageAccount("Account created successfully!");
        setFormData({
          ownerName: "",
          ownerTaz: "",
          ownerPassword: "",
          initialBalance: ""
        });

        if (onAccountCreated) {
          onAccountCreated();
        }
      } else {
        setMessageAccount("Create Account Failed");
      }
    } catch (error) {
      console.error("Create account error:", error);
      setMessageAccount("Create Account Failed");
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Account</h2>
      
      <form onSubmit={handleCreateAccount} className="space-y-4">
        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Owner Name
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
            placeholder="Enter owner name"
            required
          />
        </div>

        {/* Owner TAZ */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Owner TAZ
          </label>
          <input
            type="text"
            id="ownerTaz"
            name="ownerTaz"
            value={formData.ownerTaz}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
            placeholder="Enter owner TAZ"
            required
          />
        </div>

        {/* Owner Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Owner Password
          </label>
          <input
            type="password"
            id="ownerPassword"
            name="ownerPassword"
            value={formData.ownerPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
            placeholder="Enter owner password"
            required
          />
        </div>

        {/* Initial Balance */}
        <div>
          <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-300 mb-2">
            Initial Balance
          </label>
          <input
            type="number"
            id="initialBalance"
            name="initialBalance"
            value={formData.initialBalance}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-colors"
            placeholder="Enter initial balance"
            required
          />
        </div>

        {/* Message Display */}
        {messageAccount && (
          <div className={`text-sm text-center rounded-lg py-3 px-4 ${
            messageAccount.includes('successfully') 
              ? 'text-green-400 bg-green-900/20 border border-green-800' 
              : 'text-red-400 bg-red-900/20 border border-red-800'
          }`}>
            {messageAccount}
          </div>
        )}

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default NewAccount;