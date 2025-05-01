"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchUserOffers, fetchReceivedOffers } from "@/lib/offersSlice"
import { OfferStatus } from "@/types/offer"
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"

export default function MyOffersPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userOffers, receivedOffers, isLoading, error } = useAppSelector((state) => state.offers)
  const { currentUser } = useAppSelector((state) => state.user)

  const [mainTab, setMainTab] = useState("sent")
  const [sentStatusTab, setSentStatusTab] = useState("all")
  const [receivedStatusTab, setReceivedStatusTab] = useState("all")

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
    dispatch(fetchUserOffers(currentUser.id))
    dispatch(fetchReceivedOffers(currentUser.id))
  }, [dispatch, currentUser, router])

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

  // handleAcceptOffer and handleRejectOffer would dispatch a thunk to update offer status

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
                  {filteredSentOffers.map((offer) => (
                    <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Publication {offer.publicationId}</CardTitle>
                          <Badge className="flex items-center gap-1">
                            {getStatusIcon(offer.statusOffer)}
                            {offer.statusOffer}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <p className="text-sm mb-1">Publication ID: {offer.publicationId}</p>
                        <p className="text-xs text-muted-foreground">Owner: {offer.userName}</p>
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
                  ))}
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
                  {filteredReceivedOffers.map((offer) => (
                    <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">Publication {offer.publicationId}</CardTitle>
                          <Badge className="flex items-center gap-1">
                            {getStatusIcon(offer.statusOffer)}
                            {offer.statusOffer}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <p className="text-sm mb-1">Publication ID: {offer.publicationId}</p>
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
                  ))}
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
