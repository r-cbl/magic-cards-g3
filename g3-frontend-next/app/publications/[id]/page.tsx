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
import type { PublicationResponseDTO } from "@/types/publication"
import type { CardResponseDTO } from "@/types/card"
import { ArrowLeft, DollarSign, AlertCircle } from "lucide-react"
import { CreateOfferDTO, OfferStatus } from "@/types/offer"

// Mock data
const mockPublications: Record<string, PublicationResponseDTO> = {
  "1": {
    id: "1",
    name: "Pikachu for trade",
    cardId: "1",
    valueMoney: 0,
    cardExchangeIds: ["cb2", "cb3"],
    cardBase: {
      Id: "cb1",
      Name: "Pikachu",
    },
    imageUrl: "https://assets.pokemon.com/assets/cms2/img/cards/web/SV01/SV01_EN_63.png",
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user1",
      ownerName: "Ash Ketchum",
    },
    offers: [],
    createdAt: new Date(),
  },
  "2": {
    id: "2",
    name: "Charizard for sale",
    cardId: "2",
    valueMoney: 50,
    cardExchangeIds: [],
    cardBase: {
      Id: "cb2",
      Name: "Charizard",
    },
    imageUrl: "https://assets.pokemon.com/assets/cms2/img/cards/web/SV03/SV03_EN_223.png",
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user2",
      ownerName: "Gary Oak",
    },
    offers: [
      {
        id: "offer1",
        moneyOffer: 45,
        statusOffer: OfferStatus.PENDING,
        publicationId: "2",
        userId: "1",
        userName: "raulito",
        createdAt: new Date(),
        cardExchangeIds: [],
      },
    ],
    createdAt: new Date(),
  },
}

const mockCards: CardResponseDTO[] = [
  {
    id: "1",
    urlImage: "https://assets.pokemon.com/assets/cms2/img/cards/web/SV01/SV01_EN_63.png",
    cardBase: {
      Id: "cb1",
      Name: "Pikachu",
    },
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user1",
      ownerName: "Ash Ketchum",
    },
    createdAt: new Date(),
  },
  {
    id: "2",
    urlImage: "https://assets.pokemon.com/assets/cms2/img/cards/web/SV03/SV03_EN_223.png",
    cardBase: {
      Id: "cb2",
      Name: "Charizard",
    },
    game: {
      Id: "1",
      Name: "Pokemon Red/Blue",
    },
    owner: {
      ownerId: "user2",
      ownerName: "Gary Oak",
    },
    createdAt: new Date(),
  },
]

const mockCardBases = [
  { id: "cb1", name: "Pikachu", gameId: "1" },
  { id: "cb2", name: "Charizard", gameId: "1" },
  { id: "cb3", name: "Bulbasaur", gameId: "1" },
  { id: "cb4", name: "Squirtle", gameId: "1" },
  { id: "cb5", name: "Mewtwo", gameId: "2" },
  { id: "cb6", name: "Lugia", gameId: "2" },
]

export default function PublicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [publication, setPublication] = useState<PublicationResponseDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userCards, setUserCards] = useState<CardResponseDTO[]>([])
  const [selectedCardExchanges, setSelectedCardExchanges] = useState<string[]>([])
  const [moneyOffer, setMoneyOffer] = useState<number>(0)
  const [offerDialogOpen, setOfferDialogOpen] = useState(false)
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)

  // Add a check to prevent "create" from being treated as an ID.  This needs to be done before the useEffect hook.
  if (params.id === "create") {
    router.push("/publications/create")
    return null
  }

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Fetch publication data
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const publicationData = mockPublications[params.id]
      if (publicationData) {
        setPublication(publicationData)

        // Check if user is owner
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setIsOwner(parsedUser.id === publicationData.owner.ownerId)
        }
      }
      setIsLoading(false)
    }, 500)

    // Fetch user's cards for making offers
    // This would be replaced with actual API call
    setUserCards(mockCards)
  }, [params.id])

  const handleCardExchangeToggle = (cardId: string) => {
    setSelectedCardExchanges((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId)
      } else {
        return [...prev, cardId]
      }
    })
  }

  const handleSubmitOffer = async () => {
    if (!user || !publication) return

    setIsSubmittingOffer(true)

    try {
      // This would be replaced with actual API call
      const offerData: CreateOfferDTO = {
        publicationId: publication.id,
        userId: user.id,
        cardExchangeIds: selectedCardExchanges,
        moneyOffer: moneyOffer > 0 ? moneyOffer : undefined,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Close dialog and reset form
      setOfferDialogOpen(false)
      setSelectedCardExchanges([])
      setMoneyOffer(0)

      // Redirect to my offers page
      router.push("/my-offers")
    } catch (err) {
      console.error("Failed to submit offer", err)
    } finally {
      setIsSubmittingOffer(false)
    }
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
        <div className="flex justify-center">
          <Card className="w-full max-w-[300px] overflow-hidden">
            <div className="aspect-[2/3] relative">
              <img
                src={publication.imageUrl || "/placeholder.svg"}
                alt={publication.cardBase.Name}
                className="object-cover w-full h-full"
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
                  <span>{new Date(publication.createdAt).toLocaleDateString()}</span>
                </div>
                {publication.valueMoney > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${publication.valueMoney}</span>
                  </div>
                )}
                {publication.cardExchangeIds.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Looking for:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {publication.cardExchangeIds.map((cardId) => {
                        const cardBase = mockCardBases.find((cb) => cb.id === cardId)
                        return cardBase ? (
                          <Badge key={cardId} variant="secondary">
                            {cardBase.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {publication.offers.length > 0 && isOwner && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Offers ({publication.offers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publication.offers.map((offer) => (
                    <div key={offer.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <Badge>{offer.statusOffer}</Badge>
                        {offer.moneyOffer && <span className="font-medium">${offer.moneyOffer}</span>}
                      </div>
                      {offer.cardExchangeIds.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Cards offered:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {offer.cardExchangeIds.map((cardId) => {
                              const cardBase = mockCardBases.find((cb) => cb.id === cardId)
                              return cardBase ? (
                                <Badge key={cardId} variant="secondary" className="text-xs">
                                  {cardBase.name}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}
                      {offer.statusOffer === "PENDING" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            {!isOwner && user && (
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
                        {userCards.length > 0 ? (
                          userCards.map((card) => (
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
                      disabled={isSubmittingOffer || (moneyOffer === 0 && selectedCardExchanges.length === 0)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      {isSubmittingOffer ? "Submitting..." : "Submit Offer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {isOwner && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/publications/edit/${publication.id}`)}
              >
                Edit Publication
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
