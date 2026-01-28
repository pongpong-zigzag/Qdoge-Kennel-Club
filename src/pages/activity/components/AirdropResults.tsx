import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchAirdropResults, fetchAirdropPreview, type AirdropResult } from "@/services/backend.service";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface AirdropResultsProps {
  epoch: number;
}

const AirdropResults: React.FC<AirdropResultsProps> = ({ epoch }) => {
  const [results, setResults] = useState<AirdropResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [totalAirdrop, setTotalAirdrop] = useState<string>("0");

  useEffect(() => {
    const getAirdropResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch stored results first
        try {
          const storedResults = await fetchAirdropResults(epoch);
          if (storedResults.length > 0) {
            setResults(storedResults);
            setIsPreview(false);
            return;
          }
        } catch (err) {
          // If no stored results, fall through to preview
          console.log("No stored results, fetching preview...");
        }
        
        // Fetch preview (real-time calculation)
        const previewData = await fetchAirdropPreview(epoch);
        setResults(previewData.results);
        setIsPreview(previewData.preview);
        setTotalAirdrop(previewData.total_airdrop);
      } catch (err) {
        console.error("Failed to fetch airdrop results:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch airdrop results");
      } finally {
        setIsLoading(false);
      }
    };
    
    getAirdropResults();
  }, [epoch]);

  // Format large numbers
  const formatAmount = (amount: string): string => {
    const num = Number(amount);
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xl font-bold">Airdrop Results</p>
          {isPreview && (
            <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-500">
              Live Preview
            </Badge>
          )}
        </div>
        {totalAirdrop !== "0" && (
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{formatAmount(totalAirdrop)}</span>
          </div>
        )}
      </div>

      {/* Table - Auto height based on content */}
      <div className="w-full border border-border/60 bg-card/70 p-2 shadow-inner shadow-black/5 dark:shadow-black/40">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading airdrop results...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No airdrop results available</p>
          </div>
        ) : (
          <div className="w-full">
            <Table className="table-auto [&_td]:whitespace-nowrap [&_td]:text-center [&_th]:text-center">
              <TableHeader className="text-xs border-b border-border/60 bg-card/90 [&_th]:bg-card/90 [&_th]:text-card-foreground">
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Wallet ID</TableHead>
                  <TableHead>Buy Amount</TableHead>
                  <TableHead>Airdrop Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/40 text-muted-foreground text-xs">
                {results.map((result) => (
                  <TableRow key={result.rank}>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {result.rank === 1 && <span className="text-yellow-500 mr-1">🥇</span>}
                        {result.rank === 2 && <span className="text-gray-400 mr-1">🥈</span>}
                        {result.rank === 3 && <span className="text-orange-600 mr-1">🥉</span>}
                        <span className="font-semibold">{result.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/entity/${result.wallet_id}`}
                        className="text-primary hover:text-primary/70"
                      >
                        {result.wallet_id.slice(0, 5)}...{result.wallet_id.slice(-5)}
                      </Link>
                    </TableCell>
                    <TableCell className="!text-right text-green-500 font-medium">
                      {formatAmount(result.buy_amount)}
                    </TableCell>
                    <TableCell className="!text-right text-primary font-semibold">
                      {formatAmount(result.airdrop_amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirdropResults;
