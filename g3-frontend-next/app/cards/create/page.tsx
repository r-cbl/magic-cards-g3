"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { createCardStart, createCardSuccess, createCardFailure, createCard } from "@/lib/cardsSlice"
import { createGame} from "@/lib/gameSlice"
import { CreateGameDTO } from "@/types/game"
import type { CreateCardBaseDTO, CreateCardDTO, CardResponseDTO } from "@/types/card"
import { Plus } from "lucide-react"
import { createCardBase } from "@/lib/cardBaseSlice"
import _ from "lodash"


export default function CreateCardPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { cards, isLoading, error } = useAppSelector((state) => state.cards)
  const { currentUser } = useAppSelector((state) => state.user)

  // State for games
  const {games} = useAppSelector((state) => state.game)
  const [gameSelectionMode, setGameSelectionMode] = useState<"existing" | "new">("existing")
  const [selectedGameId, setSelectedGameId] = useState<string>("")
  const [newGameName, setNewGameName] = useState<string>("")

  // State for card bases
  const {cardBases} = useAppSelector((state) => state.baseCards)
  const [filteredCardBases, setFilteredCardBases] = useState(cardBases)
  const [cardBaseSelectionMode, setCardBaseSelectionMode] = useState<"existing" | "new">("existing")
  const [selectedCardBaseId, setSelectedCardBaseId] = useState<string>("")
  const [newCardBaseName, setNewCardBaseName] = useState<string>("")

  // Form state for card details
  const [statusCard, setStatusCard] = useState<number>(5)
  const [urlImage, setUrlImage] = useState<string>("")
  const [formErrors, setFormErrors] = useState<{
    cardBase?: string
    statusCard?: string
    urlImage?: string
    game?: string
  }>({})

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }
    if (selectedGameId) {
      setFilteredCardBases(_.filter(cardBases, (cb) => cb.game.id === selectedGameId))
    } else {
      setFilteredCardBases([])
    }
  }, [currentUser, cardBases])

  // Handle creating a new game
  const handleCreateGame = async () => {
    if (!newGameName.trim()) {
      setFormErrors((prev) => ({ ...prev, game: "Game name is required" }))
      return
    }
  
    // No hace falta llamar a createGameStart si el thunk ya lo despacha internamente
    try {
      const newGameData: CreateGameDTO = {
        name: newGameName,
      }
  
      // Ejecutás el thunk y obtenés el juego recién creado
      const newGame = await dispatch(createGame(newGameData))
  
      // Actualizás el estado local solo si lo necesitás para el comportamiento inmediato del form
      setSelectedGameId(newGame.id)
      setNewGameName("")
      setGameSelectionMode("existing")
      setFormErrors((prev) => ({ ...prev, game: undefined }))
    } catch (err) {
      // Ya se despachó el createGameFailure en el thunk, pero esto es por si querés manejar algo visual localmente
      dispatch(createCardFailure("Failed to create game. Please try again."))
    }
  }


  // Handle creating a new card base
  const handleCreateCardBase = async () => {
    if (!selectedGameId) {
      setFormErrors((prev) => ({ ...prev, cardBase: "Please select or create a game first" }))
      return
    }
  
    if (!newCardBaseName.trim()) {
      setFormErrors((prev) => ({ ...prev, cardBase: "Card name is required" }))
      return
    }
  
    try {
      const cardBaseData: CreateCardBaseDTO = {
        gameId: selectedGameId,
        nameCard: newCardBaseName,
      }
  
      const newCardBase = await dispatch(createCardBase(cardBaseData))
  
      setSelectedCardBaseId(newCardBase.id)
      setNewCardBaseName(newCardBase.nameCard)
      setCardBaseSelectionMode("existing")
      setFormErrors((prev) => ({ ...prev, cardBase: undefined }))
    } catch (err) {
      dispatch(createCardFailure("Failed to create card base. Please try again."))
    }
  }

  const validateForm = () => {
    const errors: {
      cardBase?: string
      statusCard?: string
      urlImage?: string
      game?: string
    } = {}

    // Check if we have a card base selected or created
    if (cardBaseSelectionMode === "existing" && !selectedCardBaseId) {
      errors.cardBase = "Please select a card"
    }

    if (cardBaseSelectionMode === "new" && !newCardBaseName) {
      errors.cardBase = "Please enter a card name"
    }

    if (!statusCard || statusCard < 1 || statusCard > 10) {
      errors.statusCard = "Status must be between 1 and 10"
    }

    if (!urlImage || !urlImage.startsWith("http")) {
      errors.urlImage = "Please enter a valid URL for the image"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }



  // Handle form submission to create a new card
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      dispatch(createCardFailure("You must be logged in to create a card"))
      return
    }

    if (!validateForm()) {
      return
    }

    dispatch(createCardStart())

    try {
      // If we're creating a new card base, do that first
      let cardBaseId = selectedCardBaseId

      if (cardBaseSelectionMode === "new") {
        // Create the card base first
        await handleCreateCardBase()
        // Get the ID of the newly created card base
        const newCardBase = cardBases.find((cb) => cb.nameCard === newCardBaseName && cb.game.id === selectedGameId)
        if (newCardBase) {
          cardBaseId = newCardBase.id
        }
      }

      // Use the service to create the card
      const cardData: CreateCardDTO = {
        cardBaseId: cardBaseId!,
        statusCard,
        urlImage,
        ownerId: currentUser.id,
      }
      dispatch(createCard(cardData))
      router.push("/cards")
    } catch (err) {
      dispatch(createCardFailure("Failed to create card. Please try again."))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add a New Card</CardTitle>
          <CardDescription>Add a new Pokemon card to your collection</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Selection Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Step 1: Select or Create a Game</h3>

              <Tabs
                value={gameSelectionMode}
                onValueChange={(value) => setGameSelectionMode(value as "existing" | "new")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existing">Select Existing Game</TabsTrigger>
                  <TabsTrigger value="new">Create New Game</TabsTrigger>
                </TabsList>

                <TabsContent value="existing" className="space-y-4">
                  <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a game" />
                    </SelectTrigger>
                    <SelectContent>
                      {_.map(games, (game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>

                <TabsContent value="new" className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newGameName}
                      onChange={(e) => setNewGameName(e.target.value)}
                      placeholder="Enter new game name"
                    />
                    <Button
                      type="button"
                      onClick={handleCreateGame}
                      disabled={isLoading || !newGameName.trim()}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                  </div>
                  {formErrors.game && <p className="text-sm text-red-500">{formErrors.game}</p>}
                </TabsContent>
              </Tabs>
            </div>

            {/* Card Base Selection Section - Only show if a game is selected */}
            {selectedGameId && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 2: Select or Create a Card</h3>

                <Tabs
                  value={cardBaseSelectionMode}
                  onValueChange={(value) => setCardBaseSelectionMode(value as "existing" | "new")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Select Existing Card</TabsTrigger>
                    <TabsTrigger value="new">Create New Card</TabsTrigger>
                  </TabsList>

                  <TabsContent value="existing" className="space-y-4">
                    <Select value={selectedCardBaseId} onValueChange={setSelectedCardBaseId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a card" />
                      </SelectTrigger>
                      <SelectContent>
                        { _.size(filteredCardBases) > 0 ? (
                          filteredCardBases.map((cardBase) => (
                            <SelectItem key={cardBase.id} value={cardBase.id}>
                              {cardBase.nameCard}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-cards" disabled>
                            No cards available for this game
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </TabsContent>

                  <TabsContent value="new" className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newCardBaseName}
                        onChange={(e) => setNewCardBaseName(e.target.value)}
                        placeholder="Enter new card name"
                      />
                      <Button
                        type="button"
                        onClick={handleCreateCardBase}
                        disabled={isLoading || !newCardBaseName.trim()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                {formErrors.cardBase && <p className="text-sm text-red-500">{formErrors.cardBase}</p>}
              </div>
            )}

            {/* Card Details Form - Only show if a game is selected */}
            {selectedGameId && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 3: Card Details</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="statusCard" className="text-sm font-medium">
                      Card Condition (1-10)
                    </label>
                    <Input
                      id="statusCard"
                      type="number"
                      min={1}
                      max={10}
                      value={statusCard}
                      onChange={(e) => setStatusCard(Number.parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Rate the condition of your card from 1 (poor) to 10 (mint)
                    </p>
                    {formErrors.statusCard && <p className="text-sm text-red-500">{formErrors.statusCard}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="urlImage" className="text-sm font-medium">
                      Card Image URL
                    </label>
                    <Input
                      id="urlImage"
                      placeholder="https://example.com/image.jpg"
                      value={urlImage}
                      onChange={(e) => setUrlImage(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Provide a URL to an image of your card</p>
                    {formErrors.urlImage && <p className="text-sm text-red-500">{formErrors.urlImage}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating card..." : "Add Card"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
