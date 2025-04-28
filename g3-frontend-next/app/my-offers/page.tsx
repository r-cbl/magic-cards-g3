"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchUserOffersStart,
  fetchUserOffersSuccess,
  fetchUserOffersFailure,
  fetchReceivedOffersStart,
  fetchReceivedOffersSuccess,
  fetchReceivedOffersFailure,
  updateOfferStatusSuccess,
} from "@/lib/offersSlice"
import { OfferStatus, type OfferResponseDTO } from "@/types/offer"
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

export default function MyOffersPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userOffers, receivedOffers, isLoading, error } = useAppSelector((state) => state.offers)
  const { currentUser } = useAppSelector((state) => state.user)

  // Use React's useState instead of trying to get state from Redux
  const [mainTab, setMainTab] = useState("sent")
  const [sentStatusTab, setSentStatusTab] = useState("all")
  const [receivedStatusTab, setReceivedStatusTab] = useState("all")

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Fetch both sent and received offers
    dispatch(fetchUserOffersStart())
    dispatch(fetchReceivedOffersStart())

    // Simulate API calls
    setTimeout(() => {
      try {
        // Mock data for sent offers
        const mockSentOffers: OfferResponseDTO[] = [
          {
            id: "offer1",
            publicationId: "2",
            userId: "user-123",
            userName: "Test User",
            cardExchangeIds: [],
            moneyOffer: 45,
            statusOffer: OfferStatus.PENDING,
            createdAt: new Date(),
          },
          {
            id: "offer2",
            publicationId: "1",
            userId: "user-123",
            userName: "Test User",
            cardExchangeIds: ["1"],
            moneyOffer: undefined,
            statusOffer: OfferStatus.ACCEPTED,
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
          },
          {
            id: "offer3",
            publicationId: "3",
            userId: "user-123",
            userName: "Test User",
            cardExchangeIds: ["2"],
            moneyOffer: 20,
            statusOffer: OfferStatus.ACCEPTED,
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
          },
        ]
        dispatch(fetchUserOffersSuccess(mockSentOffers))

        // Mock data for received offers
        const mockReceivedOffers: OfferResponseDTO[] = [
          {
            id: "offer4",
            publicationId: "1",
            userId: "user-456",
            userName: "Gary Oak",
            cardExchangeIds: [],
            moneyOffer: 20,
            statusOffer: OfferStatus.PENDING,
            createdAt: new Date(),
          },
          {
            id: "offer5",
            publicationId: "1",
            userId: "user-789",
            userName: "Misty",
            cardExchangeIds: ["2"],
            moneyOffer: undefined,
            statusOffer: OfferStatus.PENDING,
            createdAt: new Date(Date.now() - 86400000),
          },
          {
            id: "offer6",
            publicationId: "3",
            userId: "user-101",
            userName: "Brock",
            cardExchangeIds: ["4"],
            moneyOffer: 15,
            statusOffer: OfferStatus.ACCEPTED,
            createdAt: new Date(Date.now() - 172800000),
          },
        ]
        dispatch(fetchReceivedOffersSuccess(mockReceivedOffers))
      } catch (err) {
        dispatch(fetchUserOffersFailure("Failed to load offers"))
        dispatch(fetchReceivedOffersFailure("Failed to load received offers"))
      }
    }, 500)
  }, [dispatch, currentUser, router])

  // Filter offers based on selected status tab
  const filteredSentOffers = userOffers.filter((offer) => {
    if (sentStatusTab === "all") return true
    return offer.statusOffer.toLowerCase() === sentStatusTab.toLowerCase()
  })

  const filteredReceivedOffers = receivedOffers.filter((offer) => {
    if (receivedStatusTab === "all") return true
    return offer.statusOffer.toLowerCase() === receivedStatusTab.toLowerCase()
  })

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
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

  const handleAcceptOffer = (offerId: string) => {
    // In a real app, this would be an API call
    dispatch(updateOfferStatusSuccess({ id: offerId, status: "ACCEPTED" }))
  }

  const handleRejectOffer = (offerId: string) => {
    // In a real app, this would be an API call
    dispatch(updateOfferStatusSuccess({ id: offerId, status: "REJECTED" }))
  }

  // Mock publications data - in a real app, this would come from the API
  const mockPublicationsData = {
    "1": {
      name: "Pikachu for trade",
      cardName: "Pikachu",
      ownerName: "Test User",
    },
    "2": {
      name: "Charizard for sale",
      cardName: "Charizard",
      ownerName: "Gary Oak",
    },
    "3": {
      name: "Mewtwo - looking for Lugia",
      cardName: "Mewtwo",
      ownerName: "Professor Oak",
    },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Offers</h1>

      <Tabs defaultValue="sent" value={mainTab} onValueChange={setMainTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sent">Sent Offers</TabsTrigger>
          <TabsTrigger value="received">Received Offers</TabsTrigger>
        </TabsList>

        {/* SENT OFFERS TAB */}
        <TabsContent value="sent" className="space-y-6">
          <Tabs defaultValue="all" value={sentStatusTab} onValueChange={setSentStatusTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={sentStatusTab} className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading your offers...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : filteredSentOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSentOffers.map((offer) => {
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
                          <p className="text-xs text-muted-foreground">Owner: {publication?.ownerName}</p>
                          <p className="text-xs text-muted-foreground">
                            Offered: {new Date(offer.createdAt).toLocaleDateString()}
                          </p>
                          {offer.moneyOffer !== undefined && (
                            <div className="mt-2 flex items-center text-sm font-medium">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {offer.moneyOffer}
                            </div>
                          )}
                          {offer.cardExchangeIds.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-muted-foreground">
                                Cards offered: {offer.cardExchangeIds.length}
                              </span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/publications/${offer.publicationId}`)}
                          >
                            View Publication
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No {sentStatusTab !== "all" ? sentStatusTab : ""} offers found.
                  </p>
                  <Button
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => router.push("/publications")}
                  >
                    Browse Publications
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* RECEIVED OFFERS TAB */}
        <TabsContent value="received" className="space-y-6">
          <Tabs defaultValue="all" value={receivedStatusTab} onValueChange={setReceivedStatusTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value={receivedStatusTab} className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading received offers...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : filteredReceivedOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredReceivedOffers.map((offer) => {
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
                          {offer.statusOffer.toUpperCase() === "PENDING" ? (
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
                  <p className="text-muted-foreground">
                    No {receivedStatusTab !== "all" ? receivedStatusTab : ""} offers received.
                  </p>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
