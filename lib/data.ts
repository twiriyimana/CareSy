
/* =====================================================
   USER ROLES
===================================================== */

export type Role =
  | "patient"
  | "doctor";

/* =====================================================
   APPOINTMENT STATUS
===================================================== */

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled";

/* =====================================================
   USER PROFILE
===================================================== */

export type UserProfile = {
  /* Firebase user ID */
  uid: string;

  /* Firestore document ID */
  id: string;

  /* Basic information */
  name: string;
  email: string;

  /* Account role */
  role: Role;

  /* Doctor information */
  specialty?: string;
  experience?: string;
  rating?: number;
  bio?: string;

//gender, date of birth, phone number

  phone?: string;
gender?: string;
dateOfBirth?: string;

  /*
   * Doctor profile image.
   *
   * It can be an empty string when
   * Firebase Storage is not being used.
   */
  image?: string;

  photoUrl: string;

  /* Doctor verification */
  verificationStatus?:
    | "pending"
    | "approved";
};

/* =====================================================
   APPOINTMENT
===================================================== */

export type Appointment = {
  /* Firestore appointment ID */
  id: string;

  /* Users */
  patientId: string;
  doctorId: string;

  /* Display names */
  patientName: string;
  doctorName: string;

  /* Doctor specialty */
  specialty: string;

  /* Appointment schedule */
  date: string;
  time: string;

  /* Bed selected by the patient */
  bedName?: string;

  /* Current appointment state */
  status: AppointmentStatus;

  /* Firestore timestamp */
  createdAt?: unknown;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  type: "Hospital" | "Clinic";
  image: string;
};