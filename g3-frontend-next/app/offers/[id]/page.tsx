"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OfferResponseDTO } from "@/types/offer"
import { ArrowLeft } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { acceptOffer, fetchOfferById, rejectOffer } from "@/lib/offersSlice"
import { fetchCardById } from "@/lib/cardsSlice"

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedOffer: offer, isLoading } = useAppSelector((state) => state.offers)
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null)

  // Desempaquetar params
  useEffect(() => {
    params.then(setUnwrappedParams)
  }, [params])

  // Fetch offer al montar
  useEffect(() => {
    if (unwrappedParams) {
      dispatch(fetchOfferById(unwrappedParams.id))
    }
  }, [dispatch, unwrappedParams])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading offer details...</p>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Offer Not Found</h2>
        <p className="text-muted-foreground mb-6">The offer you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/offers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Offers
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/offers")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Offers
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Offer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offer ID:</span>
              <span className="font-medium">{offer.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Publication ID:</span>
              <span className="font-medium">{offer.publicationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offered by:{offer.userId}</span>
              <span className="font-medium">{offer.userName}</span>
            </div>

            {offer.cardExchangeIds && offer.cardExchangeIds.length > 0 && (
              <div>
                <span className="text-muted-foreground">Card Exchange IDs:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {offer.cardExchangeIds.map((cid) => (
                    <Badge key={cid} variant="outline">
                      {cid}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {offer.moneyOffer != null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Money Offer:</span>
                <span className="font-medium">${offer.moneyOffer}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={offer.status === "PENDING" ? "secondary" : "outline"}>
                {offer.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created At:</span>
              <span>{new Date(offer.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción según estado */}
      {offer.status === "pending" && (
        <div className="flex gap-4">
          <Button onClick={() => {dispatch(acceptOffer(offer.id, offer.userId, offer.publicationId))
            router.push(`/my-offers`)
          }}>
            Accept
          </Button>
          <Button variant="destructive" onClick={() => {dispatch(rejectOffer(offer.id ,offer.userId, offer.publicationId))
            router.push(`/my-offers`)
          }}>
            Reject
          </Button>
        </div>
      )}
    </div>
  )
}
