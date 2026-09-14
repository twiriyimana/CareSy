import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  Unsubscribe,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth, db } from "./firebase";

import {
  Appointment,
  AppointmentStatus,
  Role,
  UserProfile,
} from "./data";

/* =====================================================
   FIREBASE CHECK
===================================================== */

function requireFirebase() {
  if (!auth || !db) {
    throw new Error(
      "Firebase is not configured. Check your Firebase configuration."
    );
  }

  return {
    auth,
    db,
  };
}

/* =====================================================
   CLOUDINARY DOCTOR PHOTO UPLOAD
===================================================== */

export async function uploadDoctorPhoto(
  photoUri: string,
  uid: string
): Promise<string> {
  const cloudName =
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME in .env"
    );
  }

  if (!uploadPreset) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env"
    );
  }

  if (!photoUri) {
    throw new Error(
      "Doctor profile photo is required."
    );
  }

  console.log("=================================");
  console.log("CLOUDINARY UPLOAD START");
  console.log("=================================");
  console.log("Cloud name:", cloudName);
  console.log("Upload preset:", uploadPreset);
  console.log("Doctor UID:", uid);
  console.log("Photo URI:", photoUri);

  try {
    /*
     * Read selected image
     */

    const imageResponse =
      await fetch(photoUri);

    if (!imageResponse.ok) {
      throw new Error(
        "Could not read the selected doctor photo."
      );
    }

    const blob =
      await imageResponse.blob();

    console.log(
      "Image blob created:",
      blob.type,
      blob.size
    );

    if (!blob.size) {
      throw new Error(
        "The selected image is empty."
      );
    }

    /*
     * Create FormData
     */

    const formData =
      new FormData();

    formData.append(
      "file",
      blob,
      `doctor_${uid}.jpg`
    );

    formData.append(
      "upload_preset",
      uploadPreset
    );

    formData.append(
      "folder",
      "caresync/doctors"
    );

    /*
     * Use unique public_id.
     *
     * This is important because your
     * Cloudinary preset uses Overwrite = false.
     *
     * Every new photo therefore gets a new ID.
     */

    formData.append(
      "public_id",
      `doctor_${uid}_${Date.now()}`
    );

    console.log(
      "Sending image to Cloudinary..."
    );

    /*
     * Upload to Cloudinary
     */

    const response =
      await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

    const result =
      await response.json();

    console.log(
      "Cloudinary response:",
      result
    );

    /*
     * Check response
     */

    if (!response.ok) {
      console.error(
        "Cloudinary upload failed:",
        result
      );

      throw new Error(
        result?.error?.message ||
          "Cloudinary upload failed."
      );
    }

    /*
     * Check secure URL
     */

    if (!result.secure_url) {
      throw new Error(
        "Cloudinary did not return an image URL."
      );
    }

    console.log("=================================");
    console.log(
      "CLOUDINARY UPLOAD SUCCESS"
    );
    console.log(
      "Image URL:",
      result.secure_url
    );
    console.log("=================================");

    return result.secure_url;
  } catch (error) {
    console.error("=================================");
    console.error(
      "CLOUDINARY UPLOAD ERROR"
    );
    console.error(error);
    console.error("=================================");

    throw error;
  }
}

/* =====================================================
   REGISTER USER
===================================================== */

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: Role,
  specialty = "General Medicine",
  experience = "",
  bio = "",
  photoUrl = "",
  phone = ""
) {
  const { auth, db } =
    requireFirebase();

  const cleanName =
    name.trim();

  const cleanEmail =
    email.trim().toLowerCase();

  const cleanPhone =
    phone.trim();

  let uid: string | null = null;

  try {
    console.log("=================================");
    console.log("REGISTER START");
    console.log("=================================");

    console.log(
      "1. Creating Authentication user..."
    );

    console.log(
      "Email:",
      cleanEmail
    );

    console.log(
      "Role:",
      role
    );

    /*
     * CREATE FIREBASE AUTH USER
     */

    const credential =
      await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

    uid =
      credential.user.uid;

    console.log(
      "2. Authentication user created:",
      uid
    );

    /*
     * CREATE FIRESTORE PROFILE
     */

    const profileRef =
      doc(
        db,
        "users",
        uid
      );

    const profileData = {
      uid,

      name:
        cleanName,

      email:
        cleanEmail,

      phone:
        cleanPhone,

      gender:
        "",

      dateOfBirth:
        "",

      role,

      specialty:
        role === "doctor"
          ? specialty.trim() ||
            "General Medicine"
          : "",

      experience:
        role === "doctor"
          ? experience.trim()
          : "",

      rating:
        role === "doctor"
          ? 5
          : 0,

      bio:
        role === "doctor"
          ? bio.trim() ||
            "Patient-centered care with a modern CareSync experience."
          : "",

      /*
       * Doctor photo only.
       *
       * Patients do not need a photo.
       */

      image:
        role === "doctor"
          ? photoUrl || ""
          : "",

      photoUrl:
        role === "doctor"
          ? photoUrl || ""
          : "",

      verificationStatus:
        "approved",

      status:
        "active",

      createdAt:
        serverTimestamp(),
    };

    console.log(
      "3. Saving Firestore profile..."
    );

    console.log(
      "Firestore path:",
      `users/${uid}`
    );

    await setDoc(
      profileRef,
      profileData
    );

    console.log(
      "4. Firestore profile created successfully!"
    );

    /*
     * VERIFY PROFILE
     */

    const verifySnapshot =
      await getDoc(
        profileRef
      );

    if (
      !verifySnapshot.exists()
    ) {
      throw new Error(
        `Firestore profile was not created for UID: ${uid}`
      );
    }

    console.log(
      "5. Firestore profile VERIFIED:",
      verifySnapshot.id
    );

    console.log("=================================");
    console.log(
      "REGISTER SUCCESS"
    );
    console.log(
      "UID:",
      uid
    );
    console.log("=================================");

    return {
      user:
        credential.user,

      uid,

      profile:
        verifySnapshot.data(),
    };
  } catch (error) {
    console.error("=================================");
    console.error(
      "REGISTRATION FAILED"
    );
    console.error(
      "Error:",
      error
    );
    console.error(
      "UID:",
      uid
    );
    console.error("=================================");

    throw error;
  }
}

/* =====================================================
   LOGIN USER
===================================================== */

export async function loginUser(
  email: string,
  password: string
) {
  const { auth } =
    requireFirebase();

  const cleanEmail =
    email.trim().toLowerCase();

  console.log(
    "Logging in:",
    cleanEmail
  );

  const credential =
    await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

  console.log(
    "Authentication successful:",
    credential.user.uid
  );

  return credential;
}

/* =====================================================
   LOGOUT
===================================================== */

export async function logoutUser() {
  const { auth } =
    requireFirebase();

  await signOut(auth);

  console.log(
    "User logged out successfully."
  );
}

/* =====================================================
   PASSWORD RESET
===================================================== */

export async function sendResetEmail(
  email: string
) {
  const { auth } =
    requireFirebase();

  const cleanEmail =
    email.trim().toLowerCase();

  console.log(
    "Sending password reset email to:",
    cleanEmail
  );

  try {
    await sendPasswordResetEmail(auth, cleanEmail);
  } catch (error: any) {
    const code = error?.code;

    if (code === "auth/invalid-email") {
      throw new Error("Please enter a valid email address.");
    }

    if (code === "auth/user-not-found") {
      throw new Error("No CareSync account was found for this email.");
    }

    if (code === "auth/too-many-requests") {
      throw new Error("Too many attempts. Please try again later.");
    }

    throw new Error(
      error?.message || "Unable to send the password reset email."
    );
  }

  console.log(
    "Password reset email sent successfully."
  );
}

/* =====================================================
   GET USER PROFILE
===================================================== */

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const { db } =
    requireFirebase();

  console.log(
    "Getting Firestore profile:",
    userId
  );

  const profileRef =
    doc(
      db,
      "users",
      userId
    );

  const snap =
    await getDoc(
      profileRef
    );

  if (!snap.exists()) {
    console.log(
      "Profile not found:",
      userId
    );

    return null;
  }

  const data =
    snap.data();

  console.log(
    "Profile found:",
    userId
  );

  return {
    id:
      snap.id,

    uid:
      data.uid ||
      snap.id,

    name:
      data.name ||
      "",

    email:
      data.email ||
      "",

    phone:
      data.phone ||
      "",

    gender:
      data.gender ||
      "",

    dateOfBirth:
      data.dateOfBirth ||
      "",

    role:
      data.role as Role,

    specialty:
      data.specialty ||
      "",

    experience:
      data.experience ||
      "",

    rating:
      data.rating ??
      0,

    bio:
      data.bio ||
      "",

    image:
      data.image ||
      data.photoUrl ||
      "",

    photoUrl:
      data.photoUrl ||
      data.image ||
      "",

    verificationStatus:
      data.verificationStatus ||
      "approved",
  };
}

/* =====================================================
   GET DOCTOR
===================================================== */

export async function getDoctor(
  doctorId: string
) {
  return getUserProfile(
    doctorId
  );
}

/* =====================================================
   UPDATE USER PROFILE
===================================================== */

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    nickname?: string;

    phone?: string;
    dateOfBirth?: string;
    gender?: string;

    photoUrl?: string;
    image?: string;

    experience?: string;
    specialty?: string;
    bio?: string;
  }
) {
  const { db } =
    requireFirebase();

  console.log(
    "Updating profile:",
    userId
  );

  console.log(
    "Profile update data:",
    data
  );

  await updateDoc(
    doc(
      db,
      "users",
      userId
    ),
    {
      ...data,

      updatedAt:
        serverTimestamp(),
    }
  );

  console.log(
    "Profile updated successfully:",
    userId
  );
}

/* =====================================================
   CREATE APPOINTMENT
===================================================== */

export async function createAppointment(
  input: Omit<
    Appointment,
    "id" |
      "status" |
      "createdAt"
  >
) {
  const { db } =
    requireFirebase();

  return addDoc(
    collection(
      db,
      "appointments"
    ),
    {
      ...input,

      status:
        "pending" as AppointmentStatus,

      createdAt:
        serverTimestamp(),
    }
  );
}

/* =====================================================
   UPDATE APPOINTMENT STATUS
===================================================== */

export async function updateAppointmentStatus(
  appointmentId: string,
  status: Extract<
    AppointmentStatus,
    "confirmed" |
      "rejected"
  >
) {
  const { db } =
    requireFirebase();

  await updateDoc(
    doc(
      db,
      "appointments",
      appointmentId
    ),
    {
      status,

      updatedAt:
        serverTimestamp(),
    }
  );
}

/* =====================================================
   SUBSCRIBE DOCTORS
===================================================== */

export function subscribeDoctors(
  callback: (
    doctors: UserProfile[]
  ) => void,

  onError?: (
    error: Error
  ) => void
): Unsubscribe {
  if (!db) {
    return () => undefined;
  }

  const q =
    query(
      collection(
        db,
        "users"
      ),

      where(
        "role",
        "==",
        "doctor"
      )
    );

  return onSnapshot(
    q,

    (snapshot) => {
      const doctors =
        snapshot.docs.map(
          (item) => {
            const data =
              item.data();

            const image =
              data.image ||
              data.photoUrl ||
              "";

            console.log(
              "Doctor photo:",
              data.name,
              image
            );

            return {
              id:
                item.id,

              uid:
                data.uid ||
                item.id,

              name:
                data.name ||
                "",

              email:
                data.email ||
                "",

              phone:
                data.phone ||
                "",

              gender:
                data.gender ||
                "",

              dateOfBirth:
                data.dateOfBirth ||
                "",

              role:
                data.role as Role,

              specialty:
                data.specialty ||
                "",

              experience:
                data.experience ||
                "",

              rating:
                data.rating ??
                0,

              bio:
                data.bio ||
                "",

              image,

              photoUrl:
                data.photoUrl ||
                data.image ||
                "",

              verificationStatus:
                data.verificationStatus ||
                "approved",
            };
          }
        );

      console.log(
        "Doctors loaded:",
        doctors.length
      );

      callback(
        doctors
      );
    },

    onError
  );
}

/* =====================================================
   PATIENT APPOINTMENTS
===================================================== */

export function subscribeAppointmentsForPatient(
  userId: string,

  callback: (
    appointments: Appointment[]
  ) => void,

  onError?: (
    error: Error
  ) => void
): Unsubscribe {
  if (!db) {
    return () => undefined;
  }

  const q =
    query(
      collection(
        db,
        "appointments"
      ),

      where(
        "patientId",
        "==",
        userId
      )
    );

  return onSnapshot(
    q,

    (snapshot) => {
      const appointments =
        snapshot.docs
          .map(
            (item) => ({
              id:
                item.id,

              ...(item.data() as Omit<
                Appointment,
                "id"
              >),
            })
          )
          .sort(
            sortAppointments
          );

      callback(
        appointments
      );
    },

    onError
  );
}

/* =====================================================
   DOCTOR APPOINTMENTS
   + PATIENT INFORMATION
===================================================== */

export function subscribeAppointmentsForDoctor(
  userId: string,

  callback: (
    appointments: Appointment[]
  ) => void,

  onError?: (
    error: Error
  ) => void
): Unsubscribe {
  if (!db) {
    return () => undefined;
  }

  const q =
    query(
      collection(
        db,
        "appointments"
      ),

      where(
        "doctorId",
        "==",
        userId
      )
    );

  return onSnapshot(
    q,

    async (snapshot) => {
      try {
        /*
         * Get appointments
         */

        const appointments =
          snapshot.docs.map(
            (item) => ({
              id:
                item.id,

              ...(item.data() as Omit<
                Appointment,
                "id"
              >),
            })
          );

        /*
         * Get unique patient IDs
         */

        const patientIds = [
          ...new Set(
            appointments
              .map(
                (appointment) =>
                  appointment.patientId
              )
              .filter(
                Boolean
              )
          ),
        ];

        /*
         * Load patient profiles
         */

        const patients =
          await getUsersByIds(
            patientIds
          );

        /*
         * Create patient lookup
         */

        const patientMap =
          new Map(
            patients.map(
              (patient) => [
                patient.uid,
                patient,
              ]
            )
          );

        /*
         * Attach patient information
         */

        const appointmentsWithPatients =
          appointments.map(
            (appointment) => {
              const patient =
                patientMap.get(
                  appointment.patientId
                );

              return {
                ...appointment,

                patientName:
                  patient?.name ||
                  appointment.patientName ||
                  "Unknown Patient",

                patientEmail:
                  patient?.email ||
                  "",

                patientPhone:
                  patient?.phone ||
                  "",

                patientGender:
                  patient?.gender ||
                  "",

                patientDateOfBirth:
                  patient?.dateOfBirth ||
                  "",
              };
            }
          );

        /*
         * Sort appointments
         */

        appointmentsWithPatients.sort(
          sortAppointments
        );

        console.log(
          "Doctor appointments loaded:",
          appointmentsWithPatients.length
        );

        console.log(
          "Patient information attached successfully."
        );

        callback(
          appointmentsWithPatients
        );
      } catch (error) {
        console.error(
          "Failed to load patient information:",
          error
        );

        if (onError) {
          onError(
            error instanceof Error
              ? error
              : new Error(
                  "Failed to load patient information."
                )
          );
        }
      }
    },

    onError
  );
}

/* =====================================================
   SORT APPOINTMENTS
===================================================== */

function sortAppointments(
  a: Appointment,
  b: Appointment
) {
  return `${a.date} ${a.time}`.localeCompare(
    `${b.date} ${b.time}`
  );
}

/* =====================================================
   GET USERS BY IDS
===================================================== */

export async function getUsersByIds(
  ids: string[]
) {
  if (
    !db ||
    !ids.length
  ) {
    return [] as UserProfile[];
  }

  const unique =
    [...new Set(ids)];

  const docs =
    await Promise.all(
      unique.map(
        (id) =>
          getDoc(
            doc(
              db!,
              "users",
              id
            )
          )
      )
    );

  return docs
    .filter(
      (snap) =>
        snap.exists()
    )
    .map(
      (snap) => {
        const data =
          snap.data();

        const image =
          data.image ||
          data.photoUrl ||
          "";

        return {
          id:
            snap.id,

          uid:
            data.uid ||
            snap.id,

          name:
            data.name ||
            "",

          email:
            data.email ||
            "",

          phone:
            data.phone ||
            "",

          gender:
            data.gender ||
            "",

          dateOfBirth:
            data.dateOfBirth ||
            "",

          role:
            data.role as Role,

          specialty:
            data.specialty ||
            "",

          experience:
            data.experience ||
            "",

          rating:
            data.rating ??
            0,

          bio:
            data.bio ||
            "",

          image,

          photoUrl:
            data.photoUrl ||
            data.image ||
            "",

          verificationStatus:
            data.verificationStatus ||
            "approved",
        } as UserProfile;
      }
    );
}