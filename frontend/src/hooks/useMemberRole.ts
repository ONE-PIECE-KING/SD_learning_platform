import { useState } from "react";

export type MemberRole = "student" | "teacher";

// Mock hook for member role - will be replaced with actual auth logic later
export function useMemberRole() {
  const [role, setRole] = useState<MemberRole>("student");

  const toggleRole = () => {
    setRole((prev) => (prev === "student" ? "teacher" : "student"));
  };

  const isStudent = role === "student";
  const isTeacher = role === "teacher";

  return {
    role,
    setRole,
    toggleRole,
    isStudent,
    isTeacher,
  };
}
