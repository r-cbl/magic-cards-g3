"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CardResponseDTO } from "@/types/card"
import { ArrowLeft, Share2, Heart } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchCardById } from "@/lib/cardsSlice"

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedCard: card, isLoading } = useAppSelector((state) => state.cards)
  const [isOwner, setIsOwner] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    // Unwrap the params
    params.then((unwrapped) => setUnwrappedParams(unwrapped))
  }, [params])

  useEffect(() => {
    if (unwrappedParams) {
      // Fetch card from API
      dispatch(fetchCardById(unwrappedParams.id))
    }
  }, [dispatch, unwrappedParams])

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (user && card) {
      setIsOwner(user.id === card.owner.ownerId)
    }
  }, [user, card])

  const handleCreatePublication = () => {
    router.push(`/publications/create?cardId=${card?.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>Loading card details...</p>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Card Not Found</h2>
        <p className="text-muted-foreground mb-6">The card you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/cards")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cards
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/cards")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cards
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <Card className="w-full max-w-[300px] overflow-hidden">
            <div className="aspect-[2/3] relative">
              <img
                src={card.urlImage || "/placeholder.svg"}
                alt={card.cardBase.Name}
                className="object-cover w-full h-full"
              />
            </div>
          </Card>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{card.cardBase.Name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{card.game.Name}</Badge>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Card Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{card.owner.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added on:</span>
                  <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            {isOwner && (
              <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleCreatePublication}>
                Create Publication
              </Button>
            )}
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
