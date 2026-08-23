import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import Button from '@/components/ui/Button'
import { useState } from 'react'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuthStore()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'
  const [serverErr, setServerErr] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerErr('')
    try {
      const res = await authApi.login(data)
      login(res)
      navigate(from, { replace: true })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setServerErr(msg ?? 'Login failed. Please try again.')
    }
  }

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-xs text-gray-500 mb-6">Sign in to your DevResume account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
              ${errors.email
                ? 'border-red-300 focus:border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-violet-400 bg-white'}`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-700">Password</label>
            <a href="#" className="text-xs text-violet-600 hover:text-violet-700">
              Forgot password?
            </a>
          </div>
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
              ${errors.password
                ? 'border-red-300 focus:border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-violet-400 bg-white'}`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Server error */}
        {serverErr && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverErr}
          </div>
        )}

        <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-violet-600 font-medium hover:text-violet-700">
          Sign up free
        </Link>
      </p>
    </>
  )
}
