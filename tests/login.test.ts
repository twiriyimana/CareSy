jest.mock("../lib/firebase", () => ({
  auth: { uid: "mock-auth" },
  db: {},
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  serverTimestamp: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  where: jest.fn(),
}));

import { signInWithEmailAndPassword } from "firebase/auth";
import { loginUser } from "../lib/firebaseServices";

describe("login flow", () => {
  it("sanitizes the email before signing in and returns the auth credential", async () => {
    const mockCredential = { user: { uid: "user-123" } };
    const mockedSignIn = jest.mocked(signInWithEmailAndPassword);

    mockedSignIn.mockResolvedValue(mockCredential as any);

    await expect(
      loginUser("  User@Test.com  ", "SecurePass123!")
    ).resolves.toEqual(mockCredential);

    expect(mockedSignIn).toHaveBeenCalledWith(
      expect.objectContaining({ uid: "mock-auth" }),
      "user@test.com",
      "SecurePass123!"
    );
  });
});
