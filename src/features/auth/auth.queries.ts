import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/features/auth/auth.api";

export const meQuery = () =>
  queryOptions({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    staleTime: Infinity,
    retry: false,
  });

export function useMe() {
  return useQuery(meQuery());
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], {
        user_id: data.user_id,
      });
      navigate({ to: "/rooms" });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], { user_id: data.user_id });
      navigate({ to: "/rooms" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      navigate({ to: "/login" });
    },
  });
}
