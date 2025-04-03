// src/store/useProfileStore.ts
import { apiRequest } from '@/utils/api';
import { create } from 'zustand';
// Define the shape of the profile data
interface ProfileData {
  name: string;
  phone: string;
  address: string;
  city: string;
  bio: string;
}

// Define the store's state and actions
interface ProfileStore {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  updateProfileData: (updates: Partial<ProfileData>) => void;
  fetchProfile: (userId: string, token: string) => Promise<void>;
}

const useProfileStore = create<ProfileStore>((set) => ({
  profileData: {
    name: '',
    phone: '',
    address: '',
    city: '',
    bio: '',
  },
  setProfileData: (data: ProfileData) => set({ profileData: data }),
  updateProfileData: (updates: Partial<ProfileData>) =>
    set((state) => ({
      profileData: { ...state.profileData, ...updates },
    })),
  fetchProfile: async (userId: string, token: string) => {
    try {
      const response = await apiRequest(`/nixonbit/users/${userId}`, 'GET', null, token);
      if (response.success) {
        set({ profileData: response.data as ProfileData });
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
}));

export default useProfileStore;