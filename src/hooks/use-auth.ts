import { authClient } from '@/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface LogoutProps {
  onSuccess?: (navigate: ReturnType<typeof useNavigate>) => void
  onError?: (error: Error) => void
}

export const useAuth = () => {
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()

  const logout = async ({ onSuccess, onError }: LogoutProps) => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged out successfully')
            onSuccess?.(navigate)
          },
          onError: ({ error }) => {
            toast.error(error.message || 'Logout failed')
            onError?.(error)
          },
        },
      })
    })
  }

  return { isPending, logout }
}
