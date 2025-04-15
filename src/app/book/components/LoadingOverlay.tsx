import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export const LoadingOverlay = ({ isLoading, message = "Caricamento in corso..." }: LoadingOverlayProps) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">Attendere prego, non chiudere questa pagina.</p>
      </div>
    </div>
  )
}
