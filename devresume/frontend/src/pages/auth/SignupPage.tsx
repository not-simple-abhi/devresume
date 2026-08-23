import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import Button from '@/components/ui/Button'
import { useState } from 'react'

const schema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  email:           z.string().email('Enter a valid email'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const { login } = useAuthStore()
  const navigate  = useNavigate()
  const [serverErr, setServerErr] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerErr('')
    try {
      await authApi.signup({ name: data.name, email: data.email, password: data.password })
      const res = await authApi.login({ email: data.email, password: data.password })
      login(res)
      navigate('/', { replace: true })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setServerErr(msg ?? 'Sign up failed. Please try again.')
    }
  }

  const Field = ({
    label, name, type = 'text', placeholder, error,
  }: {
    label: string
    name: keyof FormData
    type?: string
    placeholder: string
    error?: string
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
          ${error
            ? 'border-red-300 focus:border-red-400 bg-red-50'
            : 'border-gray-200 focus:border-violet-400 bg-white'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )

  return (
    <>
      <h1 className="text-lg font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-xs text-gray-500 mb-6">Start analyzing your resume for free</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full name"        name="name"            placeholder="John Doe"          error={errors.name?.message} />
        <Field label="Email"            name="email"           type="email" placeholder="you@example.com" error={errors.email?.message} />
        <Field label="Password"         name="password"        type="password" placeholder="Min. 8 characters" error={errors.password?.message} />
        <Field label="Confirm password" name="confirmPassword" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} />

        {serverErr && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverErr}
          </div>
        )}

        <Button type="submit" fullWidth loading={isSubmitting} className="mt-2">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-600 font-medium hover:text-violet-700">
          Sign in
        </Link>
      </p>
    </>
  )
}
