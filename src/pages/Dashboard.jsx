import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { updateWebhookUrl } from "../api/webhooks";
import { getUser } from "../api/auth";

export default function Dashboard() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const getUserhandler = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        setWebhookUrl(userData.webhookUrl || "");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch user data"
        );
      } finally {
        setFetching(false);
      }
    };

    getUserhandler();
  }, []);

  const handleWebhookUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateWebhookUrl({ webhookUrl });
      setUser((prev) => ({ ...prev, webhookUrl }));
      toast.success("Webhook URL updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {fetching ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading user data...</p>
          </div>
        ) : (
          user && (
            <>
              <div className="mb-8 bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Access Code</p>
                    <p className="font-medium">{user.accessCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product Code</p>
                    <p className="font-medium">{user.productCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product Amount</p>
                    <p className="font-medium">{user.productAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">API Token</p>
                    <div className="flex items-center">
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded mr-2 overflow-x-auto max-w-xs">
                        {user.apiToken}
                      </p>
                      <button
                        onClick={() => copyToClipboard(user.apiToken)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Webhook URL</p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                      {user.webhookUrl || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Webhook Settings</h2>
                <form onSubmit={handleWebhookUpdate}>
                  <div className="flex space-x-4">
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="Enter webhook URL"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
