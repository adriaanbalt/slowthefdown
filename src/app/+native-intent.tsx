import { routableSystemPath } from "@/services/deepLinks";

export function redirectSystemPath({ path }: { path: string; initial: boolean }): string | null {
	return routableSystemPath(path);
}
