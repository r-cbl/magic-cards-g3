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
import { fetchPublicationById } from "@/lib/publicationsSlice"
import _ from "lodash"

interface CardDetailsProps {
  cardId: string
}

function CardDetails({ cardId }: CardDetailsProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedCard: card, isLoading } = useAppSelector((state) => state.cards)

  useEffect(() => {
    dispatch(fetchCardById(cardId))
  }, [dispatch, cardId])

  if (isLoading) {
    return <div className="text-sm">Loading card details...</div>
  }

  if (!card) {
    return <div className="text-sm text-red-500">Card not found</div>
  }

  return (
    <div 
      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
      onClick={() => router.push(`/cards/${cardId}`)}
    >
      <img 
        src={card.urlImage || "/placeholder.svg"} 
        alt={card.cardBase?.Name || "Card"} 
        className="w-12 h-12 object-cover rounded"
      />
      <div>
        <p className="text-sm font-medium">{card.cardBase?.Name}</p>
        <p className="text-xs text-muted-foreground">Click to view details</p>
      </div>
    </div>
  )
}

interface PublicationDetailsProps {
  publicationId: string
}

function PublicationDetails({ publicationId }: PublicationDetailsProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedPublication: publication, isLoading } = useAppSelector((state) => state.publications)

  useEffect(() => {
    dispatch(fetchPublicationById(publicationId))
  }, [dispatch, publicationId])

  if (isLoading) {
    return <div className="text-sm">Loading publication details...</div>
  }

  if (!publication) {
    return <div className="text-sm text-red-500">Publication not found</div>
  }

  return (
    <div 
      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer transition-colors"
      onClick={() => router.push(`/publications/${publicationId}`)}
    >
      <img 
        src={publication.card?.urlImage || "/placeholder.svg"} 
        alt={publication.cardBase?.Name || "Card"} 
        className="w-12 h-12 object-cover rounded"
      />
      <div>
        <p className="text-sm font-medium">{publication.cardBase?.Name}</p>
        <p className="text-xs text-muted-foreground">Click to view publication</p>
      </div>
    </div>
  )
}

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
        <Button onClick={() => router.push("/my-offers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Offers
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/my-offers")}>
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
            <div>
              <span className="text-muted-foreground">Publication:</span>
              <div className="mt-2">
                <PublicationDetails publicationId={offer.publicationId} />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offered by:</span>
              <span className="font-medium">{offer.userName}</span>
            </div>

            {_.size(offer.cardExchangeIds) > 0 && (
              <div>
                <span className="text-muted-foreground">Cards Offered:</span>
                <div className="mt-2 space-y-2">
                  {_.map(offer.cardExchangeIds, (cardId: string) => (
                    <CardDetails key={cardId} cardId={cardId} />
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
