import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Modal } from './Modal'
import { Button } from './Button'

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedFile: File, previewUrl: string) => void
}

function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = new Image()
  image.crossOrigin = 'anonymous'

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Não foi possível criar o contexto do canvas'))
        return
      }

      ctx.beginPath()
      ctx.arc(
        pixelCrop.width / 2,
        pixelCrop.height / 2,
        pixelCrop.width / 2,
        0,
        2 * Math.PI,
      )
      ctx.clip()

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      )

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao criar o blob da imagem'))
            return
          }
          const file = new File([blob], 'profile-crop.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(file)
        },
        'image/jpeg',
        0.95,
      )
    }

    image.onerror = () => {
      reject(new Error('Falha ao carregar a imagem'))
    }

    image.src = imageSrc
  })
}

export function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropChange = useCallback((c: { x: number; y: number }) => {
    setCrop(c)
  }, [])

  const onZoomChange = useCallback((z: number) => {
    setZoom(z)
  }, [])

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    [],
  )

  const handleConfirm = async () => {
    if (!croppedAreaPixels || !imageSrc) return

    setProcessing(true)
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
      const previewUrl = URL.createObjectURL(croppedFile)
      onCropComplete(croppedFile, previewUrl)
      onClose()
    } catch (err) {
      console.error('Erro ao processar imagem:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleClose = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajustar foto">
      <div className="space-y-4">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Zoom
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={handleClose}
            disabled={processing}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            onClick={handleConfirm}
            loading={processing}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  )
}