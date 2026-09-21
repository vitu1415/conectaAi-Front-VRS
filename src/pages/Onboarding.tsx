import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Users, MessageCircle, Megaphone,
  ChevronRight, ChevronLeft, Rocket,
} from 'lucide-react'
import { Button } from '@/components/ui'
import logo from '../assets/logo.png'

const steps = [
  {
    icon: <CalendarDays className="w-10 h-10 text-white" />,
    title: 'Bem-vindo ao ConectaAí!',
    description:
      'A rede social oficial dos eventos. Aqui você encontra eventos, conecta-se com participantes e acompanha tudo que acontece ao vivo.',
    gradient: 'from-cyan-400 via-cyan-500 to-tertiary-500',
  },
  {
    icon: <CalendarDays className="w-10 h-10 text-white" />,
    title: 'Descubra Eventos',
    description:
      'Navegue pela lista de eventos, pesquise por nome ou cidade e entre na comunidade de cada evento para participar do que acontece.',
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-white" />,
    title: 'Feed do Evento',
    description:
      'Cada evento tem seu próprio feed. Publique textos, fotos e vídeos, curta e comente os posts de outros participantes.',
    gradient: 'from-purple-400 via-purple-500 to-pink-500',
  },
  {
    icon: <Users className="w-10 h-10 text-white" />,
    title: 'Conecte-se com Pessoas',
    description:
      'Veja quem está no evento, envie solicitações de conexão e construa sua rede de contatos profissionais e amigáveis.',
    gradient: 'from-orange-400 via-orange-500 to-red-500',
  },
  {
    icon: <Megaphone className="w-10 h-10 text-white" />,
    title: 'Avisos e Agenda',
    description:
      'Fique por dentro dos avisos oficiais dos organizadores e acompanhe a programação completa do evento na aba Agenda.',
    gradient: 'from-green-400 via-green-500 to-emerald-500',
  },
  {
    icon: <Rocket className="w-10 h-10 text-white" />,
    title: 'Pronto para Começar!',
    description:
      'Agora você está pronto para explorar tudo. Selecione um evento e comece a interagir. Bem-vindo à comunidade ConectaAí!',
    gradient: 'from-cyan-500 via-tertiary-500 to-cyan-600',
  },
]

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const isLast = currentStep === steps.length - 1
  const isFirst = currentStep === 0

  const handleNext = () => {
    if (isLast) {
      localStorage.removeItem('newUser')
      navigate('/app/events', { replace: true })
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((prev) => prev - 1)
  }

  const handleSkip = () => {
    localStorage.removeItem('newUser')
    navigate('/app/events', { replace: true })
  }

  const step = steps[currentStep]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <img src={logo} alt="ConectaAí" className="w-16 h-16 mx-auto" />
      </motion.div>

      {/* Card do step */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Header com gradiente e ícone */}
            <div className={`bg-gradient-to-br ${step.gradient} p-8 flex flex-col items-center text-center`}>
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h1 className="text-xl font-bold text-white">{step.title}</h1>
            </div>

            {/* Conteúdo */}
            <div className="p-6 text-center">
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 pb-6">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? 'w-6 bg-cyan-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para passo ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botões */}
        <div className="mt-6 space-y-3">
          <div className="flex gap-3">
            {!isFirst && (
              <Button
                variant="outline"
                onClick={handlePrev}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Voltar
              </Button>
            )}
            <Button
              fullWidth
              onClick={handleNext}
              icon={isLast ? <Rocket className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            >
              {isLast ? 'Começar' : 'Próximo'}
            </Button>
          </div>

          {!isLast && (
            <button
              onClick={handleSkip}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
            >
              Pular tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  )
}