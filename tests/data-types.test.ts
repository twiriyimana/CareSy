import type { Appointment, AppointmentStatus, Role } from "../lib/data";

describe("shared data types", () => {
  it("supports a complete appointment record", () => {
    const appointment: Appointment = {
      id: "appointment-1",
      patientId: "patient-1",
      doctorId: "doctor-1",
      patientName: "Amina Hassan",
      doctorName: "Dr. Omar Ali",
      specialty: "Cardiology",
      date: "2026-09-10",
      time: "10:00 AM",
      bedName: "Bed 4",
      status: "confirmed",
    };

    expect(appointment.status).toBe("confirmed");
    expect(appointment.bedName).toBe("Bed 4");
  });

  it("keeps roles and appointment statuses within the supported values", () => {
    const roles: Role[] = ["patient", "doctor"];
    const statuses: AppointmentStatus[] = [
      "pending",
      "confirmed",
      "rejected",
      "cancelled",
    ];

    expect(roles).toHaveLength(2);
    expect(statuses).toHaveLength(4);
  });
});