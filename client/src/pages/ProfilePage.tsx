import { useAuthStore } from "../store/useAuthStore";

export function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.username}
              className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>

          <div className="border-t border-gray-200 w-full pt-4 mt-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Member since:</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
