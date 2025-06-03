"use client";

import { SessionProvider, useSession } from "next-auth/react";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

interface UserAdmin {
	email: string;
	name: string;
	admin: boolean;
	superAdmin: boolean;
}

interface UserContextProps {
	user: UserAdmin | null;
	isAdmin: boolean;
	isSuperAdmin: boolean;
	profileFetched: boolean;
	status: "authenticated" | "unauthenticated" | "loading";
	error: string | null;
}

interface AppProviderProps {
	children: ReactNode;
}

const UserContext = createContext<UserContextProps | null>(null);

export function useUser(): UserContextProps {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within an AppProvider");
	}
	return context;
}

function UserProvider({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession();
	const [user, setUser] = useState<UserAdmin | null>(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);
	const [profileFetched, setProfileFetched] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (status === "authenticated" && session?.user) {
			const profile: UserAdmin = {
				email: session.user.email || "",
				name: session.user.name || "",
				admin: session.user.admin || false,
				superAdmin: session.user.superAdmin || false,
			};
			setUser(profile);
			setIsAdmin(profile.admin);
			setIsSuperAdmin(profile.superAdmin);
			setProfileFetched(true);
			setError(null);
		} else {
			setUser(null);
			setIsAdmin(false);
			setIsSuperAdmin(false);
			setProfileFetched(false);
			setError(null);
		}
	}, [status, session]);

	return (
		<UserContext.Provider
			value={{ user, isAdmin, isSuperAdmin, profileFetched, status, error }}
		>
			{children}
		</UserContext.Provider>
	);
}

export function AppProvider({ children }: AppProviderProps) {
	return (
		<SessionProvider>
			<UserProvider>{children}</UserProvider>
		</SessionProvider>
	);
}
