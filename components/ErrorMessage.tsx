import React from 'react'
import { AlertCircle } from 'lucide-react'

const ErrorMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-red-100 p-4">
      <img src="/api/placeholder/200/200" alt="Gato triste" className="mb-4 h-32 w-32" />
      <div className="text-center">
        <h2 className="mb-2 text-base font-bold text-red-800">¡Ups! Lo he estropeado todo</h2>
        <p className="text-red-600">Por favor, inténtalo de nuevo más tarde.</p>
      </div>
      <AlertCircle className="mt-4 text-red-500" size={24} />
    </div>
  )
}

export default ErrorMessage
