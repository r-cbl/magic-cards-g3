"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import {
  fetchReceivedOffersStart,
  fetchReceivedOffersSuccess,
  fetchReceivedOffersFailure,
  updateOfferStatusSuccess,
} from "@/lib/redux/slices/offersSlice"
import type { OfferResponseDTO, OfferStatus } from "@/types/offer"
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

export default function ReceivedOffersPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { receivedOffers, isLoading, error } = useAppSelector((state) => state.offers)
  const { currentUser } = useAppSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      router.push("/login")
      return
    }

    dispatch(fetchReceivedOffersStart())

    // Simulate API call
    setTimeout(() => {
      try {
        // Mock data for received offers
        const mockReceivedOffers: OfferResponseDTO[] = [
          {
            id: "offer1",
            publicationId: "1",
            userId: "user-456",
            userName: "Gary Oak",
            cardExchangeIds: [],
            moneyOffer: 20,
            statusOffer: OfferStatus.PENDING,
            createdAt: new Date(),
          },
          {
            id: "offer2",
            publicationId: "1",
            userId: "user-789",
            userName: "Misty",
            cardExchangeIds: ["2"],
            moneyOffer: undefined,
            statusOffer: OfferStatus.PENDING,
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
          },
          {
            id: "offer3",
            publicationId: "3",
            userId: "user-101",
            userName: "Brock",
            cardExchangeIds: ["4"],
            moneyOffer: 15,
            statusOffer: OfferStatus.ACCEPTED,
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
          },
        ]

        dispatch(fetchReceivedOffersSuccess(mockReceivedOffers))
      } catch (error) {
        dispatch(fetchReceivedOffersFailure("Failed to load received offers"))
      }
    }, 500)
  }, [dispatch, currentUser, router])

  const filteredOffers = receivedOffers.filter((offer) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return offer.statusOffer === OfferStatus.PENDING
    if (activeTab === "accepted") return offer.statusOffer === OfferStatus.ACCEPTED
    if (activeTab === "rejected") return offer.statusOffer === OfferStatus.REJECTED
    return true
  })

  const getStatusIcon = (status: OfferStatus) => {
    switch (status) {
      case OfferStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />
      case OfferStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case OfferStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const handleAcceptOffer = (offerId: string) => {
    // In a real app, this would be an API call
    dispatch(updateOfferStatusSuccess({ id: offerId, status: OfferStatus.ACCEPTED }))
  }

  const handleRejectOffer = (offerId: string) => {
    // In a real app, this would be an API call
    dispatch(updateOfferStatusSuccess({ id: offerId, status: OfferStatus.REJECTED }))
  }

  // Mock publication data - in a real app, this would come from the API
  const mockPublicationsData = {
    "1": {
      name: "Pikachu for trade",
      cardName: "Pikachu",
    },
    "3": {
      name: "Bulbasaur - looking for Squirtle",
      cardName: "Bulbasaur",
    },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Received Offers</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading received offers...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOffers.map((offer) => {
                const publication = mockPublicationsData[offer.publicationId as keyof typeof mockPublicationsData]
                return (
                  <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{publication?.cardName || "Unknown Card"}</CardTitle>
                        <Badge className="flex items-center gap-1">
                          {getStatusIcon(offer.statusOffer)}
                          {offer.statusOffer}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-sm mb-1">{publication?.name || "Unknown Publication"}</p>
                      <p className="text-xs text-muted-foreground">From: {offer.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        Offered: {new Date(offer.createdAt).toLocaleDateString()}
                      </p>

                      <div className="mt-3 p-2 border rounded-md">
                        <h4 className="text-xs font-medium mb-1">Offer Details:</h4>
                        {offer.moneyOffer !== undefined && (
                          <div className="flex items-center text-sm font-medium">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {offer.moneyOffer}
                          </div>
                        )}
                        {offer.cardExchangeIds.length > 0 && (
                          <p className="text-xs">Cards offered: {offer.cardExchangeIds.length}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-2">
                      {offer.statusOffer === OfferStatus.PENDING ? (
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAcceptOffer(offer.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleRejectOffer(offer.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => router.push(`/publications/${offer.publicationId}`)}
                        >
                          View Publication
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No {activeTab !== "all" ? activeTab : ""} offers received.</p>
              <Button
                onClick={() => router.push("/my-publications")}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                View My Publications
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
