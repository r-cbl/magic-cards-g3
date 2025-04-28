"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  fetchPublicationsStart,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
} from "@/lib/publicationsSlice"
import type { PublicationResponseDTO } from "@/types/publication"
import type { GameResponseDTO } from "@/types/game"
import { Search, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import { OfferStatus } from "@/types/offer"

// Mock data
const mockGames: GameResponseDTO[] = [
  { id: "1", name: "Pokemon Red/Blue", createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Pokemon Gold/Silver", createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Pokemon Ruby/Sapphire", createdAt: new Date(), updatedAt: new Date() },
]

export default function PublicationsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { publications, isLoading, error } = useAppSelector((state) => state.publications)
  const { currentUser } = useAppSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState<string>("")

  useEffect(() => {
    dispatch(fetchPublicationsStart())

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, this would be an API call
        const mockPublications: PublicationResponseDTO[] = [
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
            imageUrl: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM10/SM10_EN_194.png",
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
          {
            id: "2",
            name: "Charizard for sale",
            cardId: "2",
            valueMoney: 50,
            cardExchangeIds: [],
            cardBase: {
              Id: "cb2",
              Name: "Charizard",
            },
            imageUrl: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM10/SM10_EN_194.png",
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
                id: "offer6",
                publicationId: "3",
                userId: "user-101",
                userName: "Brock",
                cardExchangeIds: ["4"],
                moneyOffer: 15,
                statusOffer: OfferStatus.ACCEPTED,
                createdAt: new Date(Date.now() - 172800000),
              },
            ],
            createdAt: new Date(),
          },
          {
            id: "3",
            name: "Mewtwo - looking for Lugia",
            cardId: "5",
            valueMoney: 0,
            cardExchangeIds: ["cb6"],
            cardBase: {
              Id: "cb5",
              Name: "Mewtwo",
            },
            imageUrl: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM11/SM11_EN_71.png",
            game: {
              Id: "2",
              Name: "Pokemon Gold/Silver",
            },
            owner: {
              ownerId: "user4",
              ownerName: "Professor Oak",
            },
            offers: [],
            createdAt: new Date(),
          },
        ]
        dispatch(fetchPublicationsSuccess(mockPublications))
      } catch (error) {
        dispatch(fetchPublicationsFailure("Failed to load publications"))
      }
    }, 500)
  }, [dispatch])

  const filteredPublications = publications.filter((pub) => {
    let matchesSearch = true
    let matchesGame = true

    if (searchTerm) {
      matchesSearch =
        pub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.cardBase.Name.toLowerCase().includes(searchTerm.toLowerCase())
    }

    if (selectedGame && selectedGame !== "all") {
      matchesGame = pub.game.Id === selectedGame
    }

    return matchesSearch && matchesGame
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Publications</h1>
        {currentUser && (
          <Button
            onClick={() => router.push("/publications/create")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Publication
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search publications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedGame} onValueChange={setSelectedGame}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Games" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Games</SelectItem>
            {mockGames.map((game) => (
              <SelectItem key={game.id} value={game.id}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading publications...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map((publication) => (
              <Card key={publication.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-muted">
                  <Link href={`/publications/${publication.id}`}>
                    <img
                      src={publication.imageUrl}
                      alt={publication.name}
                      className="rounded-lg object-cover group-hover:opacity-50 transition-opacity"
                      height="200"
                      width="300"
                    />
                  </Link>
                  {publication.valueMoney > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-md flex items-center text-sm font-medium">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {publication.valueMoney}
                    </div>
                  )}
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{publication.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{publication.game.Name}</Badge>
                    <Badge variant="outline">{publication.cardBase.Name}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Owner: {publication.owner.ownerName}</p>
                  <p className="text-xs text-muted-foreground">
                    Posted: {new Date(publication.createdAt).toLocaleDateString()}
                  </p>
                  {publication.offers.length > 0 && (
                    <p className="text-xs font-medium mt-2">{publication.offers.length} offer(s)</p>
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

          {filteredPublications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No publications found. Try adjusting your filters.</p>
              {currentUser && (
                <Button
                  onClick={() => router.push("/publications/create")}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Create Publication
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
