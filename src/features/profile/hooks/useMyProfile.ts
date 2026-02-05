import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/index";
import { profileKeys } from "./keys";
import { useAuth } from "@/app/providers/AuthProvider";

export function useMyProfile() {
  const { isHydrated, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: () => profileApi.getMyProfile(),
    enabled: isHydrated && isAuthenticated,
  });
}
