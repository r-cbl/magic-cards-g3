"use client"

import { AlertDescription } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchUserPublicationsStart,
  fetchUserPublicationsSuccess,
  fetchUserPublicationsFailure,
} from "@/lib/publicationsSlice"
import type { PublicationResponseDTO } from "@/types/publication"
import type { OfferResponseDTO } from "@/types/offer"
import type { RootState } from "@/lib/store"
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

export default function MyPublicationsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userPublications, isLoading, error } = useAppSelector(
    (state: RootState) => state.publications
  )
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      router.push("/login")
      return
    }

    dispatch(fetchUserPublicationsStart())

    // Simulate API call
    setTimeout(() => {
      try {
        // Mock data for user publications
        const mockUserPublications: PublicationResponseDTO[] = [
          {
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
              ownerId: "user-123",
              ownerName: "Test User",
            },
            offers: [
              {
                id: "offer-abc",
                publicationId: "1",
                userId: "user-other-1",
                userName: "Offer Maker 1",
                moneyOffer: 20,
                statusOffer: "PENDING",
                cardExchangeIds: [],
                createdAt: new Date(Date.now() - 86400000),
              },
              {
                id: "offer-def",
                publicationId: "1",
                userId: "user-other-2",
                userName: "Offer Maker 2",
                moneyOffer: undefined,
                statusOffer: "PENDING",
                cardExchangeIds: ["2"],
                createdAt: new Date(Date.now() - 172800000),
              },
            ],
            createdAt: new Date(),
          },
          {
            id: "3",
            name: "Bulbasaur - looking for Squirtle",
            cardId: "3",
            valueMoney: 0,
            cardExchangeIds: ["cb4"],
            cardBase: {
              Id: "cb3",
              Name: "Bulbasaur",
            },
            imageUrl: "https://assets.pokemon.com/assets/cms2/img/cards/web/SV02/SV02_EN_1.png",
            game: {
              Id: "1",
              Name: "Pokemon Red/Blue",
            },
            owner: {
              ownerId: "user-123",
              ownerName: "Test User",
            },
            offers: [],
            createdAt: new Date(),
          },
        ]

        dispatch(fetchUserPublicationsSuccess(mockUserPublications))
      } catch (error) {
        dispatch(fetchUserPublicationsFailure("Failed to load your publications"))
      }
    }, 500)
  }, [dispatch, currentUser, router])

  const filteredPublications = userPublications.filter((pub: PublicationResponseDTO) => {
    if (activeTab === "all") return true
    if (activeTab === "with-offers") return pub.offers.length > 0
    if (activeTab === "no-offers") return pub.offers.length === 0
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Publications</h1>
        <Button
          onClick={() => router.push("/publications/create")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          Create Publication
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="with-offers">With Offers</TabsTrigger>
          <TabsTrigger value="no-offers">No Offers</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading your publications...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredPublications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPublications.map((publication: PublicationResponseDTO) => (
                <Card key={publication.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{publication.name}</CardTitle>
                      {publication.valueMoney > 0 && (
                        <div className="flex items-center text-sm font-medium">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {publication.valueMoney}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{publication.game.Name}</Badge>
                      <Badge variant="outline">{publication.cardBase.Name}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Posted: {new Date(publication.createdAt).toLocaleDateString()}
                    </p>

                    {publication.offers.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Offers:</h4>
                        <div className="space-y-2">
                          {publication.offers.map((offer: OfferResponseDTO) => {
                            const offeredCardNames = offer.cardExchangeIds
                              .map((id) => {
                                return `Card ID: ${id}`
                              })
                              .join(", ")

                            return (
                              <div
                                key={offer.id}
                                className="border rounded-md p-2 flex justify-between items-center"
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(offer.statusOffer)}
                                  <span className="text-xs">{offer.statusOffer} by {offer.userName}</span>
                                </div>
                                <div className="text-xs">
                                  {offer.moneyOffer ? (
                                    <span className="font-medium">${offer.moneyOffer}</span>
                                  ) : offeredCardNames ? (
                                    <span>Offered: {offeredCardNames}</span>
                                  ) : (
                                    <span>No specific cards offered</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/publications/${publication.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No publications found.</p>
              <Button
                onClick={() => router.push("/publications/create")}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Create Your First Publication
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
