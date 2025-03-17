import { availableApis } from '@/lib/api/core';
import { IconButton } from '@/components/ui/IconButton';
import { RefreshCw } from '@/lib/icons';
import AuthTestingSection from '@/components/auth/AuthTestingSection';

interface ApiStatus {
  name: string;
  version: string;
  isEnabled: boolean;
  hasCredentials: boolean;
}

export default function Home() {
  // Define API versions
  const apiVersions: Record<string, string> = {
    replicate: 'v0.18.0',
    anthropic: 'v0.36.3',
    openai: 'v4.6.0',
    deepgram: 'v2.4.0',
    resend: 'v1.1.0',
    mediawiki: 'v6.4.1',
    'react-pdf': 'v3.1.12',
    stripe: 'v13.3.0',
    elevenlabs: 'v1.1.1',
  };

  // Get API statuses
  const apiStatuses: ApiStatus[] = Object.entries(availableApis).map(([name, api]) => ({
    name,
    version: apiVersions[name] || 'Unknown',
    isEnabled: api.isEnabled(),
    hasCredentials: process.env[`${name.toUpperCase()}_API_KEY`] !== undefined,
  }));

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">BH Standard Repository</h1>
          <p className="text-gray-600 dark:text-gray-400">
            A comprehensive Next.js template with integrated API support
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">API Status</h2>
              <div className="flex gap-2">
                <IconButton 
                  icon={RefreshCw} 
                  variant="outline" 
                  size="sm"
                >
                  Refresh
                </IconButton>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      API
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Credentials
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {apiStatuses.map((api) => (
                    <tr key={api.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {api.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {api.version}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          api.isEnabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {api.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          api.hasCredentials
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {api.hasCredentials ? 'Configured' : 'Missing credentials'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Authentication Testing Section */}
        <AuthTestingSection />
      </div>
    </main>
  );
}
