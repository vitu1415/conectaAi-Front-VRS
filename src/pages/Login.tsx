import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useApp } from '@/contexts/AppContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login()
    navigate('/events', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold">
              <span className="gradient-text">ConectaAí</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              A Rede Social Oficial dos Eventos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={<Mail className="w-4 h-4" />}
              placeholder="Seu e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={<Lock className="w-4 h-4" />}
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-50 px-3 text-gray-400">ou</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="outline" fullWidth icon={<Mail className="w-4 h-4" />}>
              Entrar com Google
            </Button>
            <Button variant="outline" fullWidth>
              Criar conta
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Ao entrar você aceita nossos Termos de Uso e Política de Privacidade
          </p>
        </motion.div>
      </div>
    </div>
  )
}
