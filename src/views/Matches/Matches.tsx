import { useCallback, useState } from 'react'
import useSWR from 'swr'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import { useApiFetcher } from '@/lib/api'
import { Match } from '@/lib/api-types'

export interface MatchesProps {
  onLogoutRequest?: () => void
}

export function Matches(props: MatchesProps) {
  const { onLogoutRequest, ...otherProps } = props
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const fetcher = useApiFetcher()
  const query = useSWR(
    { page, size },
    async ({
      page,
      size,
    }: {
      page: number
      size: number
    }): Promise<{ matches: Match[]; total: number }> => {
      const res = await fetcher('GET /v1/matches', { page, size })

      if (!res.ok) {
        throw new Error(res.data.message)
      }

      const totalCount = res.headers.get('total')
      const total = totalCount ? Number.parseInt(totalCount) : res.data.length
      return { matches: res.data, total }
    },
    { keepPreviousData: true, suspense: true }
  )
  const matches: Match[] = query.data.matches
  const total: number = query.data.total

  const fetchAllMatches = useCallback(async (): Promise<Match[]> => {
    const batchSize = 10 // API limit is 10 matches per request
    const totalMatches = []
    let currentPage = 0
    let hasMoreMatches = true

    try {
      while (hasMoreMatches) {
        const res = await fetcher('GET /v1/matches', {
          page: currentPage,
          size: batchSize,
        })

        if (!res.ok) {
          throw new Error(res.data.message)
        }

        const fetchedMatches = res.data
        totalMatches.push(...fetchedMatches)

        if (fetchedMatches.length < batchSize) {
          hasMoreMatches = false
        } else {
          currentPage++
        }
      }

      return totalMatches
    } catch (error) {
      console.error('Error fetching matches:', error)
      throw error
    }
  }, [fetcher])

  const convertMatchesToCSV = useCallback((matches: Match[]): string => {
    const headers = [
      'Match ID',
      'Venue ID',
      'Court ID',
      'Sport',
      'Start Date',
      'End Date',
      'Team 1 Players',
      'Team 2 Players',
    ].join(',')

    const rows = matches.map(match => {
      const team1Players = match.teams[0]?.players.map(p => p.displayName).join('; ') || ''
      const team2Players = match.teams[1]?.players.map(p => p.displayName).join('; ') || ''

      return [
        match.matchId,
        match.venueId,
        match.courtId,
        match.sport,
        match.startDate,
        match.endDate,
        `"${team1Players}"`,
        `"${team2Players}"`,
      ].join(',')
    })

    return [headers, ...rows].join('\n')
  }, [])

  const createAndTriggerDownload = useCallback((csv: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    const filename = `playtomic-matches-${new Date().toISOString().split('T')[0]}.csv`
    link.setAttribute('href', url)
    link.setAttribute('download', filename)

    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
  }, [])

  const downloadMatches = useCallback(async () => {
    try {
      setIsDownloading(true)

      const allMatches = await fetchAllMatches()

      const csv = convertMatchesToCSV(allMatches)

      createAndTriggerDownload(csv)

      setIsDownloading(false)
    } catch (error) {
      console.error('Error downloading matches:', error)
      setIsDownloading(false)
      alert('Failed to download matches. Please try again.')
    }
  }, [fetchAllMatches, convertMatchesToCSV, createAndTriggerDownload])

  const handleDownloadClick = useCallback(() => {
    downloadMatches().catch(error => {
      console.error('Error in downloadMatches:', error)
    })
  }, [downloadMatches])

  return (
    <Stack {...otherProps}>
      <Stack direction="row" marginBottom={2} justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Matches</Typography>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadClick}
            disabled={isDownloading}
            startIcon={isDownloading ? <CircularProgress size={20} /> : null}
          >
            {isDownloading ? 'Downloading...' : 'Download All Matches'}
          </Button>
          <Button size="small" onClick={onLogoutRequest}>
            Logout
          </Button>
        </Stack>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Matches">
          <TableHead>
            <TableRow>
              <TableCell>Sport</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Players</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map(match => {
              // Remember, match dates look like: 2024-01-04T09:00Z
              const startDate = match.startDate.substring(0, 10)
              const startTime = match.startDate.substring(11, 16)
              const endTime = match.endDate.substring(11, 16)

              return (
                <TableRow key={match.matchId}>
                  <TableCell>
                    <Chip size="small" label={match.sport} />
                  </TableCell>
                  <TableCell>{startDate}</TableCell>
                  <TableCell>{startTime}</TableCell>
                  <TableCell>{endTime}</TableCell>
                  <TableCell align="left">
                    <AvatarGroup max={4} sx={{ flexDirection: 'row' }}>
                      {match.teams
                        .flatMap(team => team.players)
                        .map(player => (
                          <Avatar
                            key={player.userId}
                            sx={{ width: 28, height: 28 }}
                            alt={player.displayName}
                            src={player.pictureURL ?? undefined}
                          />
                        ))}
                    </AvatarGroup>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={size}
        onPageChange={(_, page) => {
          setPage(page)
        }}
        onRowsPerPageChange={ev => {
          setSize(parseInt(ev.target.value, 10))
          setPage(0)
        }}
      />
    </Stack>
  )
}
