"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { createPublication, createPublicationFailure } from "@/lib/publicationsSlice"
import type { CardResponseDTO } from "@/types/card"
import type { CreatePublicationDTO } from "@/types/publication"
import { fetchCards } from "@/lib/cardsSlice"
import _ from "lodash"

export default function CreatePublicationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { cards, isLoading: isCardsLoading } = useAppSelector((state) => state.cards)
  const { isLoading: isPublicationLoading, error } = useAppSelector((state) => state.publications)
  const { currentUser } = useAppSelector((state) => state.user)

  // Form state
  const [name, setName] = useState("")
  const [valueMoney, setValueMoney] = useState(0)
  const [wantExchange, setWantExchange] = useState(false)
  const [selectedCardExchanges, setSelectedCardExchanges] = useState<string[]>([])
  const [formErrors, setFormErrors] = useState<{
    name?: string
    valueMoney?: string
  }>({})

  // Selected card details
  const [selectedCard, setSelectedCard] = useState<CardResponseDTO | null>(null)

  useEffect(() => {
    const cardId = searchParams.get("cardId")
    if (cardId) {
      const card = cards.find((card) => card.id === cardId)
      if (card) {
        setSelectedCard(card)
        if (!name) {
          setName(`${card.cardBase.Name} for trade/sale`)
        }
      }
    }
    if (_.size(cards) === 0) {
      dispatch(fetchCards())
    }
  }, [searchParams, dispatch, currentUser, cards ])

  const handleCardExchangeToggle = (cardBaseId: string) => {
    setSelectedCardExchanges((prev) => {
      if (prev.includes(cardBaseId)) {
        return prev.filter((id) => id !== cardBaseId)
      } else {
        return [...prev, cardBaseId]
      }
    })
  }

  const validateForm = () => {
    const errors: {
      name?: string
      valueMoney?: string
    } = {}
    if (!name || name.trim().length < 2) {
      errors.name = "Publication title must be at least 2 characters"
    }
    if (!selectedCard) {
      errors.name = "Please select a card to offer"
    }
    if (valueMoney < 0) {
      errors.valueMoney = "Price cannot be negative"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      dispatch(createPublicationFailure("You must be logged in to create a publication"))
      return
    }
    if (!validateForm()) {
      return
    }
    if (selectedCard)
    {
      const publicationData: CreatePublicationDTO = {
        cardId: selectedCard.id,
        ownerId: currentUser.id,
        cardExchangeIds: wantExchange ? selectedCardExchanges : [],
        valueMoney: valueMoney > 0 ? valueMoney : undefined,
      }
      dispatch(createPublication(publicationData))
      router.push("/publications")
    }
    else throw new Error("Select a card first.")
    
  }

  const isLoading = isCardsLoading || isPublicationLoading

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Publication</CardTitle>
          <CardDescription>Offer your card for trade or sale</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Publication Title
              </label>
              <Input
                id="name"
                placeholder="e.g., Rare Charizard for trade"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Give your publication a descriptive title</p>
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="cardId" className="text-sm font-medium">
                Card to Offer
              </label>
              <Select value={selectedCard?.id || ""} onValueChange={(value) => {
                const card = _.find(cards, ((card) => card.id === value))
                if (card) {
                  setSelectedCard(card)
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  { _.size(cards) > 0 ? (
                    _.map(cards, ((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.cardBase.Name} ({card.game.Name})
                      </SelectItem>
                    )))
                  ) : (
                    <SelectItem value="no-cards" disabled>
                      You don't have any cards yet
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>

            {selectedCard && (
              <div className="flex items-center gap-4 p-4 border rounded-md">
                <div className="w-16 h-24 overflow-hidden rounded-md">
                  <img
                    src={selectedCard.urlImage || "/placeholder.svg"}
                    alt={selectedCard.cardBase.Name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedCard.cardBase.Name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCard.game.Name}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="valueMoney" className="text-sm font-medium">
                Price (if selling)
              </label>
              <Input
                id="valueMoney"
                type="number"
                min={0}
                value={valueMoney}
                onChange={(e) => setValueMoney(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Set to 0 if you only want to trade</p>
              {formErrors.valueMoney && <p className="text-sm text-red-500">{formErrors.valueMoney}</p>}
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox
                id="wantExchange"
                checked={wantExchange}
                onCheckedChange={(checked) => setWantExchange(!!checked)}
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="wantExchange" className="text-sm font-medium">
                  I want to exchange for specific cards
                </label>
                <p className="text-xs text-muted-foreground">
                  Select this if you're looking for specific cards in return
                </p>
              </div>
            </div>

            {wantExchange && (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-sm font-medium">Cards I'm looking for:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Add your card bases here */}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isLoading}>
              {isLoading ? "Creating publication..." : "Create Publication"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
