"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchOffers } from "@/lib/offersSlice"
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import _ from "lodash";

export default function ReceivedOffersPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { receivedOffers, isLoading, error } = useAppSelector((state) => state.offers)
  const { currentUser } = useAppSelector((state) => state.user)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
    dispatch(fetchOffers(currentUser.id))
  }, [dispatch, currentUser, router])

  const filteredOffers = receivedOffers.filter((offer) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return offer.status === "pending"
    if (activeTab === "accepted") return offer.status === "accepted"
    if (activeTab === "rejected") return offer.status === "rejected"
    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
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
          ) : _.size(filteredOffers) > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {_.map(filteredOffers, (offer: any) => (
                <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Publication {offer.publicationId}</CardTitle>
                      <Badge className="flex items-center gap-1">
                        {getStatusIcon(offer.status)}
                        {offer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <p className="text-sm mb-1">Publication ID: {offer.publicationId}</p>
                    <p className="text-xs text-muted-foreground">From: {offer.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      Offered: {new Date(offer.createdAt).toISOString().slice(0, 10)}
                    </p>
                    <div className="mt-3 p-2 border rounded-md">
                      <h4 className="text-xs font-medium mb-1">Offer Details:</h4>
                      {offer.moneyOffer !== undefined && (
                        <div className="flex items-center text-sm font-medium">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {offer.moneyOffer}
                        </div>
                      )}
                      {_.size(offer.cardExchangeIds) > 0 && (
                        <p className="text-xs">Cards offered: {_.size(offer.cardExchangeIds)}</p>
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
