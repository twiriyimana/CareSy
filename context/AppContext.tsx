
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "../lib/firebase";

import {
  getUserProfile,
} from "../lib/firebaseServices";

import {
  Role,
  UserProfile,
} from "../lib/data";

type AppContextValue = {
  role: Role | null;
  setRole: (role: Role) => void;

  userName: string;

  user: User | null;

  profile: UserProfile | null;

  loading: boolean;

  refreshProfile: () => Promise<void>;

  favoriteHospitalIds: string[];
  toggleFavoriteHospital: (hospitalId: string) => void;
};

const AppContext =
  createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] =
    useState<Role | null>(null);

  const [userName, setUserName] =
    useState("");

  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [favoriteHospitalIds, setFavoriteHospitalIds] =
    useState<string[]>(["sunrise-health-clinic", "golden-cardiology-center"]);

  const toggleFavoriteHospital = (hospitalId: string) => {
    setFavoriteHospitalIds((current) =>
      current.includes(hospitalId)
        ? current.filter((id) => id !== hospitalId)
        : [...current, hospitalId]
    );
  };

  /* =====================================================
     CLEAR PROFILE
  ===================================================== */

  const clearProfile = () => {
    setProfile(null);
    setRole(null);
    setUserName("");
  };

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  const loadProfile = async (
    currentUser: User | null
  ) => {
    if (!currentUser) {
      clearProfile();
      return;
    }

    try {
      console.log(
        "Loading Firestore profile for:",
        currentUser.uid
      );

      const profileData =
        await getUserProfile(
          currentUser.uid
        );

      if (!profileData) {
        console.log(
          "Firestore profile NOT FOUND:",
          currentUser.uid
        );

        clearProfile();
        return;
      }

      console.log(
        "Firestore profile FOUND:",
        profileData
      );

      setProfile(profileData);

      setRole(profileData.role);

      setUserName(
        profileData.name || ""
      );
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

      clearProfile();
    }
  };

  /* =====================================================
     AUTH STATE
  ===================================================== */

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          console.log(
            "AUTH STATE:",
            currentUser
              ? currentUser.uid
              : "No user"
          );

          setLoading(true);

          setUser(currentUser);

          if (!currentUser) {
            clearProfile();
            setLoading(false);
            return;
          }

          await loadProfile(
            currentUser
          );

          setLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  /* =====================================================
     REFRESH PROFILE
  ===================================================== */

  const refreshProfile =
    async () => {
      if (!user) {
        clearProfile();
        return;
      }

      await loadProfile(user);
    };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value =
    useMemo<AppContextValue>(
      () => ({
        role,

        setRole,

        userName,

        user,

        profile,

        loading,

        refreshProfile,

        favoriteHospitalIds,
        toggleFavoriteHospital,
      }),
      [
        role,
        userName,
        user,
        profile,
        loading,
        favoriteHospitalIds,
      ]
    );

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}

/* =====================================================
   USE APP
===================================================== */

export function useApp() {
  const value =
    useContext(AppContext);

  if (!value) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return value;
}

