"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchPublications } from "@/lib/publicationsSlice"
import { Search, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import _ from "lodash"
import RequireAuth from '@/components/ui/requireauth'

export default function PublicationsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { publications, isLoading, error } = useAppSelector((state) => state.publications)
  const { currentUser } = useAppSelector((state) => state.user)
  const games = useAppSelector((state) => state.game)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGame, setSelectedGame] = useState<string>("")
  const [hasFetched, setHasFetched] = useState(false)
  const [page, setPage] = useState(0)
  const limit = 9

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    dispatch(
      fetchPublications({
        data: {
          ...(searchTerm && { search: searchTerm }),
          ...(selectedGame && selectedGame !== "all" && { gamesIds: [selectedGame] }),
        },
        limit,
        offset: page * limit,
      })
    ).then(() => setHasFetched(true));
  }, [dispatch, page, searchTerm, selectedGame]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }

  const handleGameChange = (value: string) => {
    setSelectedGame(value)
    setPage(0)
  }

  return (
    <RequireAuth>
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
              onChange={handleSearchChange}
            />
          </div>
          <Select value={selectedGame} onValueChange={handleGameChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Games" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              {_.map(games.games, (game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!hasFetched ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading publications...</p>
          </div>
        ) : (
          <>
              {_.size(publications) > 0 && 
                _.map(publications, (publication) => (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card key={publication.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative bg-muted">
                    <Link href={`/publications/${publication.id}`}>
                      <img
                        src={publication.card.urlImage}
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
                      Posted: {new Date(publication.createdAt).toISOString().slice(0, 10)}
                    </p>
                    {_.size(publication.offers) > 0 && (
                      <p className="text-xs font-medium mt-2">{_.size(publication.offers)} offer(s)</p>
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
                <div className="flex justify-center mt-6">
                  <Button onClick={() => setPage((prev) => prev + 1)}>Load More</Button>
                </div>
              </div>
              ))}

            {_.size(publications) === 0 && (
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
    </RequireAuth>
  )
}
