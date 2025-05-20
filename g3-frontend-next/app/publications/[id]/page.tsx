"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { CardResponseDTO } from "@/types/card"
import { ArrowLeft, DollarSign, AlertCircle } from "lucide-react"
import { CreateOfferDTO, OfferStatus } from "@/types/offer"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchPublicationById } from "@/lib/publicationsSlice"
import { createOffer } from "@/lib/offersSlice"
import { fetchCards, fetchCardById } from "@/lib/cardsSlice"
import _ from "lodash"

interface CardDetailsProps {
  cardId: string
}

function CardDetails({ cardId }: CardDetailsProps) {
  const dispatch = useAppDispatch()
  const { selectedCard: card, isLoading } = useAppSelector((state) => state.cards)

  useEffect(() => {
    dispatch(fetchCardById(cardId))
  }, [dispatch, cardId])

  if (isLoading) {
    return <Badge variant="secondary" className="text-xs">Loading...</Badge>
  }

  if (!card) {
    return <Badge variant="secondary" className="text-xs">Card not found</Badge>
  }

  return (
    <div className="flex items-center gap-2">
      <img 
        src={card.urlImage || "/placeholder.svg"} 
        alt={card.cardBase?.Name || "Card"} 
        className="w-8 h-8 object-cover rounded"
      />
      <Badge variant="secondary" className="text-xs">
        {card.cardBase?.Name}
      </Badge>
    </div>
  )
}

export default function PublicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { cards } = useAppSelector((state) => state.cards)
  const { selectedPublication: publication, isLoading } = useAppSelector((state) => state.publications)
  const { currentUser } = useAppSelector((state) => state.user)
  const cardBases = useAppSelector((state) => state.baseCards)
  const [isOwner, setIsOwner] = useState(false)
  const [selectedCardExchanges, setSelectedCardExchanges] = useState<string[]>([])
  const [moneyOffer, setMoneyOffer] = useState<number>(0)
  const [offerDialogOpen, setOfferDialogOpen] = useState(false)
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  
  useEffect(() => {
    if (params.id === "create") {
      router.push("/publications/create")
      return
    }
    dispatch(fetchPublicationById(params.id))
    dispatch(fetchCards())
  }, [dispatch, params, router])

  useEffect(() => {
    if (currentUser && publication) {
      setIsOwner(currentUser.id === publication.owner.ownerId)
    }
  }, [currentUser, publication])

  const handleCardExchangeToggle = (cardId: string) => {
    setSelectedCardExchanges((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId)
      } else {
        return [...prev, cardId]
      }
    })
  }

  const handleSubmitOffer = () => {
    if (!currentUser || !publication) return
    setIsSubmittingOffer(true)
    const offerData: CreateOfferDTO = {
      publicationId: publication.id,
      userId: currentUser.id,
      cardExchangeIds: selectedCardExchanges,
      moneyOffer: moneyOffer > 0 ? moneyOffer : undefined,
    }

    Promise.resolve(dispatch(createOffer(offerData)))
      .then(() => {
        setOfferDialogOpen(false)
        setSelectedCardExchanges([])
        setMoneyOffer(0)
        router.push("/my-offers")
      })
      .finally(() => {
        setIsSubmittingOffer(false)
      })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading publication details...</p>
      </div>
    )
  }

  if (!publication) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Publication Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The publication you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/publications")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Publications
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/publications")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Publications
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center h-[450px]">
          <Card className="w-full max-w-[300px] overflow-hidden">
            <div className="aspect-[2/3] relative">
              <img
                src={publication.card.urlImage || "/placeholder.svg"}
                alt={publication.cardBase.Name}
                className="object-cover w-full h-full"
                style={{ aspectRatio: '2/3' }}
              />
              {publication.valueMoney > 0 && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-md flex items-center text-sm font-medium">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {publication.valueMoney}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{publication.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{publication.game.Name}</Badge>
            <Badge variant="outline">{publication.cardBase.Name}</Badge>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Publication Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{publication.owner.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posted on:</span>
                  <span>{new Date(publication.createdAt).toISOString().slice(0, 10)}</span>
                </div>
                {publication.valueMoney > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${publication.valueMoney}</span>
                  </div>
                )}
                { _.size(publication.cardExchangeIds) > 0 && (
                  <div>
                    <span className="text-muted-foreground">Looking for:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {_.map(publication.cardExchangeIds, (cardId) => {
                        const cardBase = cardBases.cardBases.find((cb) => cb.id === cardId)
                        return cardBase ? (
                          <Badge key={cardId} variant="secondary">
                            {cardBase.nameCard}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          { _.size(publication.offers) > 0 && isOwner && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Offers ({_.size(publication.offers)})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  { _.map(publication.offers, ((offer) => (
                    <div 
                      key={offer.offerId} 
                      className="border rounded-md p-3 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => router.push(`/offers/${offer.offerId}`)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <Badge>{offer.statusOffer}</Badge>
                        {offer.moneyOffer && <span className="font-medium">${offer.moneyOffer}</span>}
                      </div>
                      { _.size(offer.cardExchangeIds) > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Cards offered:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {_.map(offer.cardExchangeIds, (cardId) => (
                              <CardDetails key={cardId} cardId={cardId} />
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">Click to view offer details</p>
                    </div>
                  )))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            {!isOwner && currentUser && publication.status === "Open" && (
              <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">Make an Offer</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Make an Offer</DialogTitle>
                    <DialogDescription>Create your offer for {publication.cardBase.Name}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {publication.valueMoney > 0 && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="moneyOffer" className="text-right">
                          Your Price
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="moneyOffer"
                            type="number"
                            min={0}
                            value={moneyOffer}
                            onChange={(e) => setMoneyOffer(Number(e.target.value))}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label>Cards to offer:</Label>
                      <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                        { _.size(cards) > 0 ? (
                          _.map(cards, (card: any) => (
                            <div key={card.id} className="flex items-center space-x-2 py-1">
                              <Checkbox
                                id={card.id}
                                checked={selectedCardExchanges.includes(card.id)}
                                onCheckedChange={() => handleCardExchangeToggle(card.id)}
                              />
                              <label
                                htmlFor={card.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {card.cardBase.Name}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center py-4 text-muted-foreground">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            You don't have any cards to offer
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSubmitOffer}
                      disabled={isSubmittingOffer || (moneyOffer === 0 && _.size(selectedCardExchanges) === 0)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      {isSubmittingOffer ? "Submitting..." : "Submit Offer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
