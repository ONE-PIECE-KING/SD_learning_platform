import { createContext, useContext, useState, ReactNode } from "react";

export type MemberRole = "student" | "teacher";

interface MemberRoleContextType {
  role: MemberRole;
  setRole: (role: MemberRole) => void;
  toggleRole: () => void;
  isStudent: boolean;
  isTeacher: boolean;
}

const MemberRoleContext = createContext<MemberRoleContextType | undefined>(undefined);

export function MemberRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<MemberRole>("student");

  const toggleRole = () => {
    setRole((prev) => (prev === "student" ? "teacher" : "student"));
  };

  const isStudent = role === "student";
  const isTeacher = role === "teacher";

  return (
    <MemberRoleContext.Provider value={{ role, setRole, toggleRole, isStudent, isTeacher }}>
      {children}
    </MemberRoleContext.Provider>
  );
}

export function useMemberRole() {
  const context = useContext(MemberRoleContext);
  if (context === undefined) {
    throw new Error("useMemberRole must be used within a MemberRoleProvider");
  }
  return context;
}
